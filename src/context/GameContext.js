import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLevels } from "../data/puzzles";

const STORAGE_KEY = "word_connect_state_v1";

const defaultState = {
  coins: 250,
  streakDays: 7,
  streakChecked: { S: true, M: true, T: true, W: false, T2: false, F: false, S2: false },
  language: "en",
  displayName: "Explorer",
  settings: {
    soundEffects: true,
    music: true,
    vibration: true,
    notifications: true,
  },
  levelStars: {}, // { en: { 1: 3, 2: 2, ... } }
  unlockedLevel: { en: 1, es: 1, fr: 1, de: 1, ar: 1, ur: 1 },
  dailyChallenge: { lastCompletedDate: null, foundToday: [] },
  hints: 3,
};

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);

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
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  const addCoins = useCallback((amount) => {
    setState((prev) => ({ ...prev, coins: Math.max(0, prev.coins + amount) }));
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

  const setLanguage = useCallback((code) => {
    setState((prev) => ({ ...prev, language: code }));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
  }, []);

  const completeLevel = useCallback((langCode, levelId, stars) => {
    setState((prev) => {
      const levels = getLevels(langCode);
      const currentUnlocked = prev.unlockedLevel[langCode] || 1;
      const nextUnlocked = Math.max(currentUnlocked, Math.min(levelId + 1, levels.length));
      const prevStars = prev.levelStars[langCode] || {};
      const bestStars = Math.max(prevStars[levelId] || 0, stars);
      return {
        ...prev,
        unlockedLevel: { ...prev.unlockedLevel, [langCode]: nextUnlocked },
        levelStars: {
          ...prev.levelStars,
          [langCode]: { ...prevStars, [levelId]: bestStars },
        },
      };
    });
  }, []);

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

  const value = {
    state,
    loaded,
    addCoins,
    spendCoins,
    setLanguage,
    updateSetting,
    completeLevel,
    totalStats,
    setDisplayName: (name) => setState((prev) => ({ ...prev, displayName: name })),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
