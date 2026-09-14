import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, IconCircleButton } from "../components/Bits";
import PrimaryButton from "../components/PrimaryButton";
import WordCircle from "../components/WordCircle";
import { colors, radii, shadow, glowShadow } from "../theme";
import { DAILY_CHALLENGE } from "../data/puzzles";
import { useGame } from "../context/GameContext";

const BG_IMAGE = require("../../assets/images/clean_nature_bg.jpg");

const STREAK_DAYS = [
  { day: "S", done: true },
  { day: "M", done: true },
  { day: "T", done: true },
  { day: "W", done: false },
  { day: "T", done: false },
  { day: "F", done: false },
  { day: "S", done: false },
];

export default function DailyChallengeScreen({ navigation }) {
  const { addCoins } = useGame();
  const [started, setStarted] = useState(false);
  const [found, setFound] = useState([]);
  const [timeLeft, setTimeLeft] = useState(DAILY_CHALLENGE.timeLimitSeconds);
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);
  const rewardedRef = useRef(false);

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [started, timeLeft]);

  useEffect(() => {
    if (found.length === DAILY_CHALLENGE.words.length && started && !rewardedRef.current) {
      rewardedRef.current = true;
      addCoins(DAILY_CHALLENGE.rewardCoins);
      setMessage(`🎉 Challenge complete! +${DAILY_CHALLENGE.rewardCoins} coins`);
    }
  }, [found, started]);

  const onSubmitWord = (word) => {
    const upper = word.toUpperCase();
    if (DAILY_CHALLENGE.words.includes(upper) && !found.includes(upper)) {
      setFound((prev) => [...prev, upper]);
      setMessage(`✨ Found "${upper}"!`);
    }
  };

  // Preview / Intro State
  if (!started) {
    return (
      <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <BackButton onPress={() => navigation.goBack()} />
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Daily Challenge</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Main Challenge Card */}
            <View style={styles.mainCard}>
              {/* Trophy Icon */}
              <View style={styles.trophyWrap}>
                <Ionicons name="trophy" size={54} color={colors.gold} />
              </View>

              <Text style={styles.cardHeadline}>Today's Challenge</Text>
              <Text style={styles.cardSubtitle}>Find 8 hidden words in 2 minutes!</Text>

              {/* Word Count Goal Pill */}
              <View style={styles.goalPill}>
                <Text style={styles.goalPillText}>0/8 words</Text>
              </View>

              {/* Treasure Chest Reward Box */}
              <View style={styles.chestBox}>
                <View style={styles.chestIconCircle}>
                  <Ionicons name="gift" size={32} color={colors.gold} />
                </View>
                <View style={styles.rewardRow}>
                  <Text style={styles.winLabel}>Win</Text>
                  <Ionicons name="disc" size={18} color={colors.gold} style={{ marginHorizontal: 6 }} />
                  <Text style={styles.coinsAmount}>100 Coins</Text>
                </View>
              </View>
            </View>

            {/* 7-Day Streak Card */}
            <View style={styles.streakCard}>
              <Text style={styles.streakTitle}>7 Day Streak</Text>
              <View style={styles.streakDaysRow}>
                {STREAK_DAYS.map((d, idx) => (
                  <View key={idx} style={styles.dayCol}>
                    <View style={[styles.dayCircle, d.done && styles.dayCircleDone]}>
                      {d.done ? (
                        <Ionicons name="checkmark" size={14} color={colors.forestDark} />
                      ) : (
                        <View style={styles.dayDot} />
                      )}
                    </View>
                    <Text style={styles.dayLabel}>{d.day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Start Challenge CTA */}
          <View style={styles.bottomArea}>
            <PrimaryButton
              title="Start Challenge"
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

  // Active Play Mode
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Daily Challenge</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.gameTop}>
          <View style={styles.timerPill}>
            <Ionicons name="time-outline" size={16} color={colors.white} />
            <Text style={styles.timerText}>{mins}:{secs}</Text>
          </View>
          <View style={styles.foundBadge}>
            <Text style={styles.foundCount}>
              {found.length}/{DAILY_CHALLENGE.words.length} found
            </Text>
          </View>
        </View>

        {/* Crossword / Words Found List */}
        <View style={styles.wordList}>
          {DAILY_CHALLENGE.words.map((w) => {
            const isFound = found.includes(w);
            return (
              <View key={w} style={[styles.wordChip, isFound && styles.wordChipDone]}>
                <Text style={[styles.wordChipText, isFound && styles.wordChipTextDone]}>
                  {isFound ? w : "• ".repeat(w.length).trim()}
                </Text>
              </View>
            );
          })}
        </View>

        {!!message && (
          <View style={styles.messageWrap}>
            <Text style={styles.message}>{message}</Text>
          </View>
        )}

        <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 28 }}>
          {timeLeft > 0 && found.length < DAILY_CHALLENGE.words.length ? (
            <WordCircle letters={DAILY_CHALLENGE.letters} onSubmitWord={onSubmitWord} />
          ) : (
            <View style={styles.doneCard}>
              <Text style={styles.doneText}>
                {found.length === DAILY_CHALLENGE.words.length ? "🎉 Challenge Complete!" : "⏱ Time's up!"}
              </Text>
              <PrimaryButton
                title="Back to Home"
                onPress={() => navigation.navigate("Home")}
                variant="gold"
                style={{ marginTop: 14 }}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
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
    backgroundColor: "rgba(10, 36, 23, 0.38)",
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
    backgroundColor: "rgba(10, 41, 26, 0.72)",
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
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
  },
  mainCard: {
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: radii.xl,
    padding: 22,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    marginBottom: 16,
    ...shadow,
  },
  trophyWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.gold,
    ...glowShadow,
  },
  cardHeadline: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.cream,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 14,
  },
  goalPill: {
    backgroundColor: "rgba(30, 107, 69, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginBottom: 16,
  },
  goalPillText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  chestBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.lg,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.3)",
  },
  chestIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  winLabel: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 16,
  },
  coinsAmount: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 18,
  },
  streakCard: {
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: radii.xl,
    padding: 18,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    ...shadow,
  },
  streakTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
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
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  dayCircleDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
    ...glowShadow,
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  dayLabel: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "700",
  },
  bottomArea: {
    paddingHorizontal: 22,
    paddingBottom: 16,
  },
  startBtn: {
    width: "100%",
  },

  gameTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 14,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  timerText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 6,
  },
  foundBadge: {
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  foundCount: {
    color: colors.gold,
    fontWeight: "800",
    fontSize: 14,
  },
  wordList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 8,
  },
  wordChip: {
    backgroundColor: "rgba(10, 41, 26, 0.65)",
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  wordChipDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
    ...glowShadow,
  },
  wordChipText: {
    color: colors.white,
    fontWeight: "800",
    letterSpacing: 2,
    fontSize: 14,
  },
  wordChipTextDone: {
    color: colors.forestDark,
  },
  messageWrap: {
    alignSelf: "center",
    backgroundColor: "rgba(10, 41, 26, 0.8)",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    marginTop: 12,
  },
  message: {
    color: colors.gold,
    fontWeight: "800",
    fontSize: 13,
  },
  doneCard: {
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.9)",
    marginHorizontal: 24,
    padding: 20,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.gold,
    ...glowShadow,
  },
  doneText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
  },
});

