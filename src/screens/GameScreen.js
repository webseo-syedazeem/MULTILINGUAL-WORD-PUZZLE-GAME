import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ScreenBG from "../components/ScreenBG";
import { BackButton, CoinBadge, IconCircleButton } from "../components/Bits";
import WordCircle from "../components/WordCircle";
import { colors, radii, shadow, glowShadow } from "../theme";
import { getLevels, LANGUAGES } from "../data/puzzles";
import { useGame } from "../context/GameContext";

const BG_IMAGE = require("../../assets/images/scenic_game_bg.jpg");
const HINT_COST = 50;

export default function GameScreen({ route, navigation }) {
  const { levelId } = route.params;
  const { state, spendCoins, completeLevel } = useGame();
  const levels = getLevels(state.language);
  const level = levels.find((l) => l.id === levelId) || levels[0];
  const lang = LANGUAGES.find((l) => l.code === state.language);
  const isRTL = !!lang?.isRTL;

  const sortedWords = useMemo(() => [...level.words].sort((a, b) => a.length - b.length), [level]);

  const [foundWords, setFoundWords] = useState([]);
  const [letters, setLetters] = useState(level.letters);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  const onSubmitWord = (word) => {
    const upper = word.toUpperCase();
    if (sortedWords.includes(upper) && !foundWords.includes(upper)) {
      const next = [...foundWords, upper];
      setFoundWords(next);
      setMessage(`✨ "${upper}" found!`);
      if (next.length === sortedWords.length && !finished) {
        setFinished(true);
        completeLevel(state.language, level.id, 3);
        setTimeout(() => {
          Alert.alert("🎉 Level Complete!", `You found all ${sortedWords.length} words!`, [
            { text: "Next Level", onPress: () => {
                if (level.id < 10) navigation.replace("Game", { levelId: level.id + 1 });
                else navigation.goBack();
              }
            },
            { text: "Map", onPress: () => navigation.goBack() },
          ]);
        }, 300);
      }
    } else if (upper.length > 1) {
      setMessage("Not in the list — try again");
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
    const remaining = sortedWords.filter((w) => !foundWords.includes(w));
    if (remaining.length === 0) return;
    if (spendCoins(HINT_COST)) {
      setFoundWords((prev) => [...prev, remaining[0]]);
      setMessage(`💡 Hint revealed "${remaining[0]}"`);
    } else {
      Alert.alert("Not enough coins", "Visit the shop to buy more coins or hints.", [
        { text: "Shop", onPress: () => navigation.navigate("Shop") },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  return (
    <ScreenBG source={BG_IMAGE} dim={0.3}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />

          <View style={styles.levelBadge}>
            <Text style={styles.levelTitle}>Level {level.id}</Text>
          </View>

          <CoinBadge
            coins={state.coins}
            onAdd={() => navigation.navigate("Shop")}
          />
        </View>

        {/* Category Pill */}
        <View style={styles.categoryPill}>
          <Ionicons name="leaf" size={13} color={colors.gold} style={{ marginRight: 6 }} />
          <Text style={styles.categoryText}>{level.category}</Text>
        </View>

        {/* Crossword Answers Tiles */}
        <View style={styles.answersArea}>
          {sortedWords.map((word) => {
            const isFound = foundWords.includes(word);
            return (
              <View key={word} style={[styles.wordRow, isRTL && { flexDirection: "row-reverse" }]}>
                {word.split("").map((ch, i) => (
                  <View
                    key={i}
                    style={[
                      styles.tile,
                      isFound ? styles.tileFound : styles.tileEmpty,
                    ]}
                  >
                    <Text style={[styles.tileText, isFound && styles.tileTextFound]}>
                      {isFound ? ch : ""}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* Message Banner */}
        {!!message && (
          <View style={styles.messageWrap}>
            <Text style={styles.message}>{message}</Text>
          </View>
        )}

        {/* Word Wheel & Actions */}
        <View style={styles.bottomArea}>
          <View style={styles.circleRow}>
            <View style={styles.sideBtnWrap}>
              <IconCircleButton name="shuffle" onPress={shuffle} size={22} />
              <Text style={styles.sideBtnLabel}>Shuffle</Text>
            </View>

            <WordCircle letters={letters} onSubmitWord={onSubmitWord} isRTL={isRTL} />

            <View style={styles.sideBtnWrap}>
              <IconCircleButton name="bulb" onPress={useHint} size={22} iconColor={colors.gold} />
              <Text style={styles.sideBtnLabel}>Hint • {HINT_COST}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScreenBG>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  levelBadge: {
    backgroundColor: "rgba(10, 41, 26, 0.72)",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  levelTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  categoryPill: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.65)",
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 10,
  },
  categoryText: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 13,
  },
  answersArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "rgba(10, 41, 26, 0.55)",
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  wordRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  tile: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    ...shadow,
  },
  tileEmpty: {
    backgroundColor: "rgba(251, 247, 236, 0.9)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  tileFound: {
    backgroundColor: colors.forest,
    borderWidth: 2,
    borderColor: colors.gold,
    ...glowShadow,
  },
  tileText: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.forestDark,
  },
  tileTextFound: {
    color: colors.white,
  },
  messageWrap: {
    alignSelf: "center",
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    marginTop: 10,
  },
  message: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 13,
  },
  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 28,
  },
  circleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sideBtnWrap: {
    alignItems: "center",
    marginHorizontal: 14,
  },
  sideBtnLabel: {
    color: colors.white,
    fontSize: 11,
    marginTop: 6,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

