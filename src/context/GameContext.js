import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLevels } from "../data/puzzles";
import { todayKey, isYesterday } from "../utils/streak";
import { isBackendConfigured } from "../api/config";
import {
  authLogin,
  authRegister,
  fetchMe,
  patchProfile,
  getProgress,
  putProgress,
  completeLevelRemote,
  completeDailyChallengeRemote,
  checkHealth,
} from "../api/client";
import { getToken, setToken, clearToken } from "../utils/authStorage";
import {
  startBgMusic,
  stopBgMusic,
  playWinSound,
  playLoseSound,
  playWordFoundSound,
  playTapSound,
  playCoinSound,
} from "../utils/soundService";

const STORAGE_KEY = "word_connect_state_v2";
const LEVEL_REWARD_COINS = 50;
const LEVEL_REWARD_DIAMONDS = 5;
const STAGE_REWARD_COINS = 10;

export const DAILY_REWARDS_LADDER = [
  { day: 1, coins: 50, diamonds: 2, hints: 0, title: "Day 1 Reward" },
  { day: 2, coins: 75, diamonds: 3, hints: 0, title: "Day 2 Reward" },
  { day: 3, coins: 100, diamonds: 4, hints: 1, title: "Day 3 Reward" },
  { day: 4, coins: 150, diamonds: 5, hints: 1, title: "Day 4 Reward" },
  { day: 5, coins: 200, diamonds: 6, hints: 2, title: "Day 5 Reward" },
  { day: 6, coins: 250, diamonds: 8, hints: 2, title: "Day 6 Reward" },
  { day: 7, coins: 500, diamonds: 15, hints: 3, title: "Day 7 Jackpot" },
];

const defaultState = {
  coins: 250,
  diamonds: 50,
  streakDays: 0,
  dailyReward: { lastClaimDate: null, streak: 0 },
  language: "en",
  displayName: "Explorer",
  avatar: "leaf", // "leaf" | "flame" | "star" | "trophy" | "globe" | "compass"
  settings: {
    soundEffects: true,
    music: true,
    vibration: true,
    notifications: true,
  },
  levelStars: {}, // { en: { 1: 3, 2: 2, ... } }
  unlockedLevel: {
    en: 1, es: 1, fr: 1, de: 1, ar: 1, ur: 1,
    pt: 1, it: 1, nl: 1, pl: 1, ro: 1, cs: 1, sv: 1, no: 1, da: 1, fi: 1,
    el: 1, hu: 1, tr: 1, uk: 1, ru: 1, bg: 1, hr: 1, sr: 1, sk: 1, ca: 1,
    zh: 1, "zh-TW": 1, ja: 1, ko: 1, hi: 1, bn: 1, ta: 1, te: 1, th: 1, vi: 1,
    id: 1, ms: 1, tl: 1, my: 1, km: 1, si: 1, ne: 1, mr: 1, gu: 1, pa: 1, kn: 1, ml: 1,
    sw: 1, he: 1, fa: 1, am: 1, ha: 1, yo: 1, zu: 1, af: 1,
  },
  dailyChallenge: { lastCompletedDate: null, foundToday: [] },
  hints: 3,
  paymentHistory: [],
};

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [authUser, setAuthUser] = useState(null); // { id, email, displayName, avatar } | null
  const [authToken, setAuthToken] = useState(null);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const syncTimer = useRef(null);

  // ---- initial load: local first (always works offline), then try cloud ----
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setState((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        // ignore corrupt storage, fall back to defaults
      } finally {
        setLoaded(true);
      }

      if (isBackendConfigured()) {
        let healthy = false;
        try {
          await checkHealth();
          healthy = true;
          setIsCloudConnected(true);
        } catch (e) {
          healthy = false;
          setIsCloudConnected(false);
        }

        if (healthy) {
          const token = await getToken();
          if (token) {
            setAuthToken(token);
            try {
              // Restore user identity
              const userRes = await fetchMe(token);
              if (userRes && userRes.user) {
                setAuthUser(userRes.user);
                setState((prev) => ({
                  ...prev,
                  displayName: userRes.user.displayName || prev.displayName,
                  avatar: userRes.user.avatar || prev.avatar,
                }));
              }

              // Restore cloud progress
              const remote = await getProgress(token);
              if (remote) {
                setState((prev) => ({ ...prev, ...remote }));
                setIsCloudConnected(true);
              }
            } catch (e) {
              // Silent fallback to local storage
            }
          }
        }
      }
    })();
  }, []);

  // ---- always persist locally so offline play keeps working ----
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  // ---- background music loop management ----
  useEffect(() => {
    if (loaded) {
      if (state.settings?.music) {
        startBgMusic(true);
      } else {
        stopBgMusic();
      }
    }
    return () => {
      stopBgMusic();
    };
  }, [loaded, state.settings?.music]);

  // ---- best-effort debounced cloud sync when logged in ----
  useEffect(() => {
    if (!loaded || !authToken || !isBackendConfigured() || !isCloudConnected) return;
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      putProgress(authToken, state)
        .then(() => setIsCloudConnected(true))
        .catch(() => {
          setIsCloudConnected(false);
        });
    }, 2000);
    return () => clearTimeout(syncTimer.current);
  }, [state, authToken, loaded, isCloudConnected]);

  const addCoins = useCallback((amount) => {
    setState((prev) => ({ ...prev, coins: Math.max(0, prev.coins + amount) }));
  }, []);

  const addDiamonds = useCallback((amount) => {
    setState((prev) => ({ ...prev, diamonds: Math.max(0, (prev.diamonds || 0) + amount) }));
  }, []);

  const recordPayment = useCallback((transaction) => {
    playCoinSound(true);
    setState((prev) => ({
      ...prev,
      coins: prev.coins + (transaction.coins || 0),
      diamonds: (prev.diamonds || 0) + (transaction.diamonds || 0),
      paymentHistory: [transaction, ...(prev.paymentHistory || [])],
    }));
  }, []);

  const spendCoins = useCallback((amount) => {
    let ok = false;
    setState((prev) => {
      if (prev.coins >= amount) {
        ok = true;
        return { ...prev, coins: prev.coins - amount };
      }
      return prev;
    });
    return ok;
  }, []);

  const spendDiamonds = useCallback((amount) => {
    let ok = false;
    setState((prev) => {
      const current = prev.diamonds || 0;
      if (current >= amount) {
        ok = true;
        return { ...prev, diamonds: current - amount };
      }
      return prev;
    });
    return ok;
  }, []);

  const addHints = useCallback((amount) => {
    setState((prev) => ({ ...prev, hints: Math.max(0, (prev.hints || 0) + amount) }));
  }, []);

  const buyHintsWithCoins = useCallback((hintsCount, coinCost) => {
    let ok = false;
    setState((prev) => {
      if (prev.coins >= coinCost) {
        ok = true;
        return {
          ...prev,
          coins: prev.coins - coinCost,
          hints: (prev.hints || 0) + hintsCount,
        };
      }
      return prev;
    });
    return ok;
  }, []);

  const buyHintsWithDiamonds = useCallback((hintsCount, diamondCost) => {
    let ok = false;
    setState((prev) => {
      const current = prev.diamonds || 0;
      if (current >= diamondCost) {
        ok = true;
        return {
          ...prev,
          diamonds: current - diamondCost,
          hints: (prev.hints || 0) + hintsCount,
        };
      }
      return prev;
    });
    return ok;
  }, []);

  const claimDailyReward = useCallback(() => {
    let result = { alreadyClaimed: false, reward: null, newStreak: 0 };
    setState((prev) => {
      const today = todayKey();
      const dr = prev.dailyReward || { lastClaimDate: null, streak: 0 };
      if (dr.lastClaimDate === today) {
        const streakIdx = Math.max(0, (dr.streak - 1) % 7);
        result = {
          alreadyClaimed: true,
          reward: DAILY_REWARDS_LADDER[streakIdx],
          newStreak: dr.streak,
        };
        return prev;
      }

      const continues = dr.lastClaimDate && isYesterday(dr.lastClaimDate);
      const nextStreak = continues ? dr.streak + 1 : 1;
      const rewardIdx = (nextStreak - 1) % 7;
      const todayReward = DAILY_REWARDS_LADDER[rewardIdx];

      result = {
        alreadyClaimed: false,
        reward: todayReward,
        newStreak: nextStreak,
      };

      return {
        ...prev,
        coins: prev.coins + todayReward.coins,
        diamonds: (prev.diamonds || 0) + todayReward.diamonds,
        hints: (prev.hints || 0) + todayReward.hints,
        dailyReward: {
          lastClaimDate: today,
          streak: nextStreak,
        },
      };
    });
    return result;
  }, []);

  const setLanguage = useCallback((code) => {
    setState((prev) => ({ ...prev, language: code }));
  }, []);

  const awardStageCoins = useCallback((amount = STAGE_REWARD_COINS) => {
    playCoinSound(state.settings?.soundEffects);
    setState((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, [state.settings?.soundEffects]);

  const updateSetting = useCallback((key, value) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
    if (key === "music") {
      if (value) startBgMusic(true);
      else stopBgMusic();
    }
  }, []);

  // Complete level: advances progress AND grants +50 coins and +5 diamonds
  const completeLevel = useCallback(
    (langCode, levelId, stars) => {
      playWinSound(state.settings?.soundEffects);
      setState((prev) => {
        const levels = getLevels(langCode);
        const currentUnlocked = prev.unlockedLevel[langCode] || 1;
        const nextUnlocked = Math.max(currentUnlocked, Math.min(levelId + 1, levels.length));
        const prevStars = prev.levelStars[langCode] || {};
        const bestStars = Math.max(prevStars[levelId] || 0, stars);
        return {
          ...prev,
          coins: prev.coins + LEVEL_REWARD_COINS, // Award +50 coins
          diamonds: (prev.diamonds || 0) + LEVEL_REWARD_DIAMONDS, // Award +5 diamonds
          unlockedLevel: { ...prev.unlockedLevel, [langCode]: nextUnlocked },
          levelStars: {
            ...prev.levelStars,
            [langCode]: { ...prevStars, [levelId]: bestStars },
          },
        };
      });

      if (authToken && isBackendConfigured()) {
        completeLevelRemote(authToken, langCode, levelId, stars).catch(() => {});
      }
    },
    [authToken, state.settings?.soundEffects]
  );

  const completeDailyChallenge = useCallback(
    (rewardCoins) => {
      let result = { alreadyClaimedToday: false, newStreak: 0 };
      setState((prev) => {
        const today = todayKey();
        const last = prev.dailyChallenge.lastCompletedDate;
        if (last === today) {
          result = { alreadyClaimedToday: true, newStreak: prev.streakDays };
          return prev;
        }
        const continuesStreak = last && isYesterday(last);
        const newStreak = continuesStreak ? prev.streakDays + 1 : 1;
        result = { alreadyClaimedToday: false, newStreak };
        return {
          ...prev,
          coins: Math.max(0, prev.coins + (rewardCoins || 0)),
          streakDays: newStreak,
          dailyChallenge: { ...prev.dailyChallenge, lastCompletedDate: today, foundToday: [] },
        };
      });
      if (authToken && isBackendConfigured()) {
        completeDailyChallengeRemote(authToken, rewardCoins).catch(() => {});
      }
      return result;
    },
    [authToken]
  );

  const totalStats = useCallback(() => {
    let levelsPlayed = 0;
    let wordsFound = 0;
    Object.values(state.levelStars).forEach((langStars) => {
      Object.values(langStars).forEach((stars) => {
        if (stars > 0) levelsPlayed += 1;
      });
    });
    Object.entries(state.levelStars).forEach(([lang, langStars]) => {
      const levels = getLevels(lang);
      Object.keys(langStars).forEach((levelId) => {
        const lvl = levels.find((l) => String(l.id) === String(levelId));
        if (lvl) wordsFound += lvl.words.length;
      });
    });
    return { levelsPlayed, wordsFound };
  }, [state.levelStars]);

  // Update profile name and avatar
  const updateProfile = useCallback(
    async (displayName, avatar) => {
      setState((prev) => ({
        ...prev,
        displayName: displayName || prev.displayName,
        avatar: avatar || prev.avatar,
      }));
      if (authUser) {
        setAuthUser((prev) => ({
          ...prev,
          displayName: displayName || prev.displayName,
          avatar: avatar || prev.avatar,
        }));
      }
      if (authToken && isBackendConfigured()) {
        try {
          const res = await patchProfile(authToken, { displayName, avatar });
          if (res && res.user) {
            setAuthUser(res.user);
          }
        } catch (e) {
          console.warn("[profile] could not sync profile to backend:", e.message);
        }
      }
    },
    [authToken, authUser]
  );

  const register = useCallback(async (email, password, displayName, avatar) => {
    const { token, user } = await authRegister(email, password, displayName, avatar);
    await setToken(token);
    setAuthToken(token);
    setAuthUser(user);
    setIsCloudConnected(true);
    setState((prev) => ({
      ...prev,
      displayName: user.displayName || displayName || prev.displayName,
      avatar: user.avatar || avatar || prev.avatar,
    }));
    return user;
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await authLogin(email, password);
    await setToken(token);
    setAuthToken(token);
    setAuthUser(user);
    setIsCloudConnected(true);
    try {
      const remote = await getProgress(token);
      setState((prev) => ({
        ...prev,
        ...remote,
        displayName: user.displayName || prev.displayName,
        avatar: user.avatar || prev.avatar,
      }));
    } catch (e) {
      // keep local state if fetch fails
    }
    return user;
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setAuthToken(null);
    setAuthUser(null);
    setIsCloudConnected(false);
  }, []);

  const value = {
    state,
    loaded,
    authUser,
    authToken,
    isSignedIn: !!authToken,
    isCloudConnected,
    backendConfigured: isBackendConfigured(),
    addCoins,
    addDiamonds,
    recordPayment,
    spendCoins,
    spendDiamonds,
    addHints,
    awardStageCoins,
    buyHintsWithCoins,
    buyHintsWithDiamonds,
    claimDailyReward,
    DAILY_REWARDS_LADDER,
    setLanguage,
    updateSetting,
    completeLevel,
    completeDailyChallenge,
    totalStats,
    updateProfile,
    register,
    login,
    logout,
    setDisplayName: (name) => updateProfile(name, state.avatar),
    playWinSound: () => playWinSound(state.settings?.soundEffects),
    playLoseSound: () => playLoseSound(state.settings?.soundEffects),
    playWordFoundSound: () => playWordFoundSound(state.settings?.soundEffects),
    playTapSound: () => playTapSound(state.settings?.soundEffects),
    playCoinSound: () => playCoinSound(state.settings?.soundEffects),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
