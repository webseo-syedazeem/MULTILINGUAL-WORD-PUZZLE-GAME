import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, CoinBadge, IconCircleButton } from "../components/Bits";
import PrimaryButton from "../components/PrimaryButton";
import WordCircle from "../components/WordCircle";
import LuxuryModal from "../components/LuxuryModal";
import { colors, radii, shadow, glowShadow } from "../theme";
import { getDailyChallenge, LANGUAGES } from "../data/puzzles";
import { useGame } from "../context/GameContext";
import { getWeekStreak, todayKey } from "../utils/streak";
import { useT } from "../i18n/useT";

const BG_IMAGE = require("../../assets/images/mountain_alps.jpg");
const DAILY_HINT_COST = 25;

export default function DailyChallengeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { state, completeDailyChallenge, spendCoins } = useGame();
  const { t } = useT();
  const challenge = useMemo(() => getDailyChallenge(state.language), [state.language]);
  const isRTL = useMemo(() => !!LANGUAGES.find((l) => l.code === state.language)?.isRTL, [state.language]);
  const alreadyClaimedToday = state.dailyChallenge.lastCompletedDate === todayKey();
  const weekStreak = useMemo(() => getWeekStreak(state.streakDays), [state.streakDays]);
  const dayLabels = [0, 1, 2, 3, 4, 5, 6].map((i) => t(`daily.day${i}`));

  const [started, setStarted] = useState(false);
  const [found, setFound] = useState([]);
  const [letters, setLetters] = useState(challenge.letters);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimitSeconds);
  const [message, setMessage] = useState("");
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultType, setResultType] = useState(null); // "won" | "timeout"
  const [coinAlertVisible, setCoinAlertVisible] = useState(false);

  const timerRef = useRef(null);
  const rewardedRef = useRef(false);

  // Automatically hide bottom tab bar while playing the challenge so it NEVER overlaps
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: started ? "none" : "flex" },
    });
    return () => {
      navigation.setOptions({
        tabBarStyle: { display: "flex" },
      });
    };
  }, [navigation, started]);

  // Reset when challenge changes
  useEffect(() => {
    setStarted(false);
    setFound([]);
    setLetters(challenge.letters);
    setTimeLeft(challenge.timeLimitSeconds);
    setMessage("");
    setResultModalVisible(false);
    setResultType(null);
    rewardedRef.current = false;
  }, [challenge]);

  // Timer tick
  useEffect(() => {
    if (started && timeLeft > 0 && !resultModalVisible) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (started && timeLeft === 0 && !resultModalVisible) {
      // Time is up!
      setResultType("timeout");
      setResultModalVisible(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [started, timeLeft, resultModalVisible]);

  // Victory check
  useEffect(() => {
    if (found.length === challenge.words.length && started && !rewardedRef.current) {
      rewardedRef.current = true;
      completeDailyChallenge(challenge.rewardCoins);
      setResultType("won");
      setResultModalVisible(true);
    }
  }, [found, started, challenge.words.length, challenge.rewardCoins, completeDailyChallenge]);

  const onSubmitWord = (word) => {
    const upper = word.toUpperCase();
    if (challenge.words.includes(upper) && !found.includes(upper)) {
      setFound((prev) => [...prev, upper]);
      setMessage(t("daily.foundWord", { word: upper }));
    } else if (upper.length > 1) {
      setMessage(t("game.notInList"));
    }
  };

  const shuffle = () => {
    const arr = [...letters];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setLetters(arr);
  };

  const useHint = () => {
    const remaining = challenge.words.filter((w) => !found.includes(w));
    if (remaining.length === 0) return;

    if (spendCoins(DAILY_HINT_COST)) {
      const hintedWord = remaining[0];
      setFound((prev) => [...prev, hintedWord]);
      setMessage(t("game.hintRevealed", { word: hintedWord }));
    } else {
      setCoinAlertVisible(true);
    }
  };

  const startOrRestartChallenge = () => {
    setTimeLeft(challenge.timeLimitSeconds);
    setFound([]);
    setLetters(challenge.letters);
    setMessage("");
    setResultModalVisible(false);
    setResultType(null);
    rewardedRef.current = false;
    setStarted(true);
  };

  const exitChallenge = () => {
    setResultModalVisible(false);
    setResultType(null);
    setStarted(false);
    navigation.navigate("Home");
  };

  // ----------------------------------------------------
  // 1. PREVIEW / INTRO OVERVIEW STATE
  // ----------------------------------------------------
  if (!started) {
    return (
      <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          {/* Top Header */}
          <View style={styles.header}>
            <BackButton onPress={() => (navigation.canGoBack && navigation.canGoBack() ? navigation.goBack() : navigation.navigate("MainTabs", { screen: "Home" }))} />
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>{t("daily.title")}</Text>
            </View>
            <CoinBadge coins={state.coins} onAdd={() => navigation.navigate("Shop")} />
          </View>

          {/* Scrollable Information Hub */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Card */}
            <View style={styles.mainCard}>
              <View style={styles.trophyWrap}>
                <Ionicons name="trophy" size={48} color={colors.gold} />
              </View>

              <Text style={styles.cardHeadline}>{t("daily.todaysChallenge")}</Text>
              <Text style={styles.cardSubtitle}>
                {t("daily.findWords", {
                  count: challenge.words.length,
                  minutes: Math.max(1, Math.round(challenge.timeLimitSeconds / 60)),
                })}
              </Text>

              {/* 3-Column Objective Metrics Pill */}
              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Ionicons name="time-outline" size={16} color={colors.gold} />
                  <Text style={styles.metricLabel}>
                    {Math.floor(challenge.timeLimitSeconds / 60)}:00
                  </Text>
                  <Text style={styles.metricSub}>Time</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Ionicons name="grid-outline" size={16} color={colors.gold} />
                  <Text style={styles.metricLabel}>{challenge.words.length} Words</Text>
                  <Text style={styles.metricSub}>Goal</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Ionicons name="disc" size={16} color={colors.gold} />
                  <Text style={styles.metricLabel}>+{challenge.rewardCoins}</Text>
                  <Text style={styles.metricSub}>Bounty</Text>
                </View>
              </View>

              {/* Status Badge */}
              {alreadyClaimedToday ? (
                <View style={styles.claimedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.forestMint} />
                  <Text style={styles.claimedText}>{t("daily.alreadyClaimed")}</Text>
                </View>
              ) : (
                <View style={styles.activeBountyBadge}>
                  <Ionicons name="sparkles" size={14} color={colors.gold} />
                  <Text style={styles.activeBountyText}>Reward Ready to Claim</Text>
                </View>
              )}
            </View>

            {/* 7-Day Streak Tracker */}
            <View style={styles.streakCard}>
              <View style={styles.streakHeaderRow}>
                <Ionicons name="flame" size={20} color="#FF7B25" />
                <Text style={styles.streakTitle}>
                  {t("daily.streak", { count: state.streakDays })}
                </Text>
              </View>

              <View style={styles.streakDaysRow}>
                {weekStreak.map((d, idx) => (
                  <View key={idx} style={styles.dayCol}>
                    <View
                      style={[
                        styles.dayCircle,
                        d.done && styles.dayCircleDone,
                        d.isToday && !d.done && styles.dayCircleToday,
                      ]}
                    >
                      {d.done ? (
                        <Ionicons name="checkmark" size={14} color={colors.forestDark} />
                      ) : (
                        <View style={styles.dayDot} />
                      )}
                    </View>
                    <Text style={styles.dayLabel}>{dayLabels[idx]}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* How It Works Guide Card */}
            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>{t("daily.rulesTitle")}</Text>

              <View style={styles.guideRow}>
                <View style={styles.guideIconWrap}>
                  <Ionicons name="stopwatch-outline" size={16} color={colors.gold} />
                </View>
                <Text style={styles.guideText}>{t("daily.rule1")}</Text>
              </View>

              <View style={styles.guideRow}>
                <View style={styles.guideIconWrap}>
                  <Ionicons name="bulb-outline" size={16} color={colors.gold} />
                </View>
                <Text style={styles.guideText}>{t("daily.rule2")}</Text>
              </View>

              <View style={styles.guideRow}>
                <View style={styles.guideIconWrap}>
                  <Ionicons name="calendar-outline" size={16} color={colors.gold} />
                </View>
                <Text style={styles.guideText}>{t("daily.rule3")}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom CTA Dock (cleanly above tab bar) */}
          <View style={[styles.bottomDock, { paddingBottom: 115 }]}>
            <PrimaryButton
              title={alreadyClaimedToday ? t("daily.playAgain") : t("daily.startChallenge")}
              iconRight="flash"
              variant="gold"
              onPress={() => setStarted(true)}
              style={styles.startBtn}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // ----------------------------------------------------
  // 2. ACTIVE GAMEPLAY STATE
  // ----------------------------------------------------
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const isUrgent = timeLeft <= 30;

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Play Header */}
        <View style={styles.header}>
          <BackButton onPress={() => setStarted(false)} />
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>{t("daily.title")}</Text>
          </View>
          <CoinBadge coins={state.coins} onAdd={() => navigation.navigate("Shop")} />
        </View>

        {/* Live Status Bar */}
        <View style={styles.gameTop}>
          <View style={[styles.timerPill, isUrgent && styles.timerPillUrgent]}>
            <Ionicons
              name={isUrgent ? "alert-circle" : "time-outline"}
              size={17}
              color={isUrgent ? "#FF4D4D" : colors.white}
            />
            <Text style={[styles.timerText, isUrgent && styles.timerTextUrgent]}>
              {mins}:{secs}
            </Text>
          </View>

          <View style={styles.foundBadge}>
            <Ionicons name="checkmark-done" size={16} color={colors.forestMint} style={{ marginRight: 6 }} />
            <Text style={styles.foundCount}>
              {t("daily.found", { found: found.length, total: challenge.words.length })}
            </Text>
          </View>
        </View>

        {/* Word Targets Chips */}
        <View style={styles.wordList}>
          {challenge.words.map((w) => {
            const isFound = found.includes(w);
            return (
              <View key={w} style={[styles.wordChip, isFound && styles.wordChipDone]}>
                <Text style={[styles.wordChipText, isFound && styles.wordChipTextDone]}>
                  {isFound ? `${w} ✓` : "• ".repeat(w.length).trim()}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Notification Banner */}
        {!!message && (
          <View style={styles.messageWrap}>
            <Text style={styles.message}>{message}</Text>
          </View>
        )}

        {/* Bottom Wheel with Boosters */}
        <View style={[styles.gameBottomArea, { paddingBottom: Math.max(insets.bottom, 20) + 16 }]}>
          <View style={styles.gameControlsRow}>
            {/* Left Booster: Shuffle */}
            <View style={styles.gameSideBtn}>
              <IconCircleButton name="shuffle" onPress={shuffle} size={22} />
              <Text style={styles.sideBtnLabel}>{t("game.shuffle")}</Text>
            </View>

            {/* Center: Word Wheel */}
            <WordCircle letters={letters} onSubmitWord={onSubmitWord} isRTL={isRTL} />

            {/* Right Booster: Hint */}
            <View style={styles.gameSideBtn}>
              <IconCircleButton
                name="bulb"
                onPress={useHint}
                size={22}
                iconColor={colors.gold}
              />
              <Text style={styles.sideBtnLabel}>
                {t("game.hint")} • {DAILY_HINT_COST}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ----------------------------------------------------
          3. FULL-SCREEN RESULT MODAL (VICTORY & TIME'S UP)
          ---------------------------------------------------- */}
      <Modal
        visible={resultModalVisible}
        transparent
        animationType="fade"
        onRequestClose={exitChallenge}
      >
        <View style={styles.modalOverlay}>
          {resultType === "won" ? (
            /* Victory Celebration Card */
            <View style={styles.modalCard}>
              <View style={styles.victoryTrophyWrap}>
                <Ionicons name="trophy" size={44} color={colors.gold} />
              </View>

              <Text style={styles.modalTitle}>{t("daily.challengeComplete")}</Text>

              {/* Reward Badge */}
              <View style={styles.rewardPill}>
                <Ionicons name="disc" size={20} color={colors.gold} />
                <Text style={styles.rewardPillText}>+{challenge.rewardCoins} Coins Earned</Text>
              </View>

              {/* Streak Badge */}
              <View style={styles.streakBadge}>
                <Ionicons name="flame" size={18} color="#FF7B25" />
                <Text style={styles.streakBadgeText}>
                  {t("daily.streak", { count: state.streakDays })}
                </Text>
              </View>

              <View style={styles.modalActions}>
                <PrimaryButton
                  title={t("daily.backHome")}
                  onPress={exitChallenge}
                  variant="gold"
                  style={{ width: "100%" }}
                />
              </View>
            </View>
          ) : (
            /* Time's Up Timeout Card */
            <View style={styles.modalCard}>
              <View style={styles.timeoutIconWrap}>
                <Ionicons name="time" size={42} color="#FFB830" />
              </View>

              <Text style={styles.modalTitle}>{t("daily.timeUp")}</Text>
              <Text style={styles.modalSubtitle}>
                {t("daily.almostThere", { found: found.length, total: challenge.words.length })}
              </Text>

              <View style={styles.modalActions}>
                <PrimaryButton
                  title={t("daily.tryAgain")}
                  onPress={startOrRestartChallenge}
                  variant="gold"
                  iconRight="refresh"
                  style={{ width: "100%", marginBottom: 10 }}
                />

                <Pressable style={styles.secondaryBtn} onPress={exitChallenge}>
                  <Text style={styles.secondaryBtnText}>{t("daily.backHome")}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Not Enough Coins Luxury Modal */}
      <LuxuryModal
        visible={coinAlertVisible}
        onClose={() => setCoinAlertVisible(false)}
        title={t("game.notEnoughCoinsTitle") || "Need More Coins"}
        message={
          t("game.notEnoughCoinsMsg") ||
          "You do not have enough coins for this daily challenge hint. Visit the Shop to grab bonus coins!"
        }
        icon="wallet-outline"
        iconColor={colors.gold}
        buttons={[
          {
            text: t("game.cancel") || "Cancel",
            style: "cancel",
            onPress: () => setCoinAlertVisible(false),
          },
          {
            text: t("game.shop") || "Go to Shop",
            style: "gold",
            onPress: () => {
              setCoinAlertVisible(false);
              navigation.navigate("Shop");
            },
          },
        ]}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.forestDark,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 36, 23, 0.42)",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerTitleWrap: {
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 190,
  },
  mainCard: {
    backgroundColor: "rgba(10, 41, 26, 0.85)",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    marginBottom: 16,
    ...shadow,
  },
  trophyWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(245, 196, 81, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.gold,
    ...glowShadow,
  },
  cardHeadline: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.cream,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    marginBottom: 14,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  metricSub: {
    color: colors.cream,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  claimedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(111, 174, 89, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.forestLight,
  },
  claimedText: {
    color: colors.forestMint,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },
  activeBountyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  activeBountyText: {
    color: colors.goldLight,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },
  streakCard: {
    backgroundColor: "rgba(10, 41, 26, 0.85)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.18)",
    marginBottom: 14,
    ...shadow,
  },
  streakHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  streakTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 6,
  },
  streakDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayCol: {
    alignItems: "center",
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  dayCircleDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
    ...glowShadow,
  },
  dayCircleToday: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  dayLabel: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: "700",
  },
  guideCard: {
    backgroundColor: "rgba(10, 41, 26, 0.75)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  guideTitle: {
    color: colors.goldLight,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 12,
  },
  guideRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  guideIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  guideText: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  bottomDock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  startBtn: {
    width: "100%",
  },

  /* Active Play Styles */
  gameTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.8)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  timerPillUrgent: {
    backgroundColor: "rgba(140, 20, 20, 0.85)",
    borderColor: "#FF4D4D",
    ...glowShadow,
  },
  timerText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 6,
    letterSpacing: 1,
  },
  timerTextUrgent: {
    color: "#FF4D4D",
  },
  foundBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.8)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
  },
  foundCount: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },
  wordList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 8,
  },
  wordChip: {
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  wordChipDone: {
    backgroundColor: colors.forest,
    borderColor: colors.gold,
    ...glowShadow,
  },
  wordChipText: {
    color: colors.cream,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  wordChipTextDone: {
    color: colors.white,
    fontWeight: "900",
  },
  messageWrap: {
    alignSelf: "center",
    backgroundColor: "rgba(10, 41, 26, 0.88)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    marginTop: 8,
  },
  message: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 13,
  },
  gameBottomArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gameControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  gameSideBtn: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  sideBtnLabel: {
    color: colors.white,
    fontSize: 10,
    marginTop: 4,
    fontWeight: "800",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8, 24, 18, 0.72)",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(251, 247, 236, 0.98)",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    padding: 24,
    alignItems: "center",
    ...shadow,
  },
  victoryTrophyWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.forestDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.gold,
    ...glowShadow,
  },
  timeoutIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255, 184, 48, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#FFB830",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.forestDark,
    marginBottom: 6,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.forestMuted,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  rewardPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.22)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    marginBottom: 10,
  },
  rewardPillText: {
    color: colors.forestDark,
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 6,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    marginBottom: 20,
  },
  streakBadgeText: {
    color: colors.forest,
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 6,
  },
  modalActions: {
    width: "100%",
  },
  secondaryBtn: {
    backgroundColor: "rgba(10, 41, 26, 0.08)",
    paddingVertical: 13,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: colors.forestDark,
    fontSize: 14,
    fontWeight: "700",
  },
});
