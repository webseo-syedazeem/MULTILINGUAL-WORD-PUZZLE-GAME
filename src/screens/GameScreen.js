import React, { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Modal, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ScreenBG from "../components/ScreenBG";
import { BackButton, CoinBadge, IconCircleButton } from "../components/Bits";
import WordCircle from "../components/WordCircle";
import LuxuryModal from "../components/LuxuryModal";
import { colors, radii, shadow, glowShadow } from "../theme";
import { getLevels, LANGUAGES, getWorldForLevel, TOTAL_LEVELS } from "../data/puzzles";
import { getBackgroundForLevel } from "../data/backgrounds";
import { useGame } from "../context/GameContext";
import { useT } from "../i18n/useT";

const LETTER_HINT_COST = 25;
const WORD_HINT_COST = 50;
const WAND_HINT_COST = 80;

function CrosswordTile({ letter, isFound, isLetterRevealed }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevRevealed = useRef(isLetterRevealed);

  useEffect(() => {
    if (isLetterRevealed && !prevRevealed.current) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.25,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.0,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevRevealed.current = isLetterRevealed;
  }, [isLetterRevealed]);

  return (
    <Animated.View
      style={[
        styles.tile,
        isFound
          ? styles.tileFound
          : isLetterRevealed
          ? styles.tileRevealed
          : styles.tileEmpty,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text
        style={[
          styles.tileText,
          isFound && styles.tileTextFound,
          !isFound && isLetterRevealed && styles.tileTextRevealed,
        ]}
      >
        {isLetterRevealed ? letter : ""}
      </Text>
    </Animated.View>
  );
}

function LevelVictoryModal({ visible, onNext, onMap, wordsCount, nextMountain, t }) {
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const trophyScale = useRef(new Animated.Value(0)).current;
  const star1Scale = useRef(new Animated.Value(0)).current;
  const star2Scale = useRef(new Animated.Value(0)).current;
  const star3Scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      cardScale.setValue(0.85);
      cardOpacity.setValue(0);
      trophyScale.setValue(0);
      star1Scale.setValue(0);
      star2Scale.setValue(0);
      star3Scale.setValue(0);

      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(100),
          Animated.spring(trophyScale, {
            toValue: 1,
            friction: 4,
            tension: 90,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(240),
          Animated.spring(star1Scale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(360),
          Animated.spring(star2Scale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(480),
          Animated.spring(star3Scale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onMap}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalCard,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <Animated.View style={[styles.trophyWrap, { transform: [{ scale: trophyScale }] }]}>
            <Ionicons name="trophy" size={36} color={colors.goldLight} />
          </Animated.View>

          <View style={styles.modalStarsRow}>
            <Animated.View style={{ transform: [{ scale: star1Scale }, { rotate: "-10deg" }] }}>
              <Ionicons name="star" size={24} color={colors.gold} />
            </Animated.View>
            <Animated.View
              style={{
                marginHorizontal: 8,
                transform: [{ scale: star2Scale }, { translateY: -4 }],
              }}
            >
              <Ionicons name="star" size={32} color={colors.gold} />
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: star3Scale }, { rotate: "10deg" }] }}>
              <Ionicons name="star" size={24} color={colors.gold} />
            </Animated.View>
          </View>

          <Text style={styles.modalTitle}>{t("game.levelCompleteTitle")}</Text>
          <Text style={styles.modalText}>{t("game.levelCompleteMsg", { count: wordsCount })}</Text>

          <View style={styles.rewardBanner}>
            <Ionicons name="disc" size={18} color={colors.gold} />
            <Text style={styles.rewardBannerText}>+50 Coins Earned</Text>
          </View>

          {nextMountain && (
            <View style={styles.nextSceneryBadge}>
              <Ionicons name="image-outline" size={14} color={colors.forest} />
              <Text style={styles.nextSceneryText} numberOfLines={1}>
                Next: {nextMountain.name}
              </Text>
            </View>
          )}

          <View style={styles.modalActions}>
            <Pressable style={[styles.primaryBtn, styles.btnShadow]} onPress={onNext}>
              <Text style={styles.primaryBtnText}>{t("game.nextLevel")}</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.forestDark} style={{ marginLeft: 6 }} />
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={onMap}>
              <Text style={styles.secondaryBtnText}>{t("game.map")}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function GameScreen({ route, navigation }) {
  const { levelId } = route.params;
  const { state, spendCoins, completeLevel } = useGame();
  const { t } = useT();
  const levels = getLevels(state.language);
  const level = levels.find((l) => l.id === levelId) || levels[0];
  const lang = LANGUAGES.find((l) => l.code === state.language);
  const isRTL = !!lang?.isRTL;
  const world = getWorldForLevel(level.id);
  const mountainBg = getBackgroundForLevel(level.id);

  const sortedWords = useMemo(() => [...level.words].sort((a, b) => a.length - b.length), [level]);

  const [foundWords, setFoundWords] = useState([]);
  const [revealedLetters, setRevealedLetters] = useState({}); // { [word]: { [index]: true } }
  const [letters, setLetters] = useState(level.letters);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const [completionVisible, setCompletionVisible] = useState(false);
  const [coinAlertVisible, setCoinAlertVisible] = useState(false);
  const completionHandled = useRef(false);

  useEffect(() => {
    setFoundWords([]);
    setRevealedLetters({});
    setLetters(level.letters);
    setMessage("");
    setFinished(false);
    setCompletionVisible(false);
    setCoinAlertVisible(false);
    completionHandled.current = false;
  }, [level.id, level.letters]);

  const handleBack = () => {
    if (navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainTabs", { screen: "Worlds" });
    }
  };

  const goToNextLevel = () => {
    setCompletionVisible(false);
    if (level.id < TOTAL_LEVELS) {
      navigation.replace("Game", { levelId: level.id + 1 });
    } else {
      handleBack();
    }
  };

  const goToMap = () => {
    setCompletionVisible(false);
    handleBack();
  };

  const finishLevel = () => {
    if (completionHandled.current || finished) return;
    completionHandled.current = true;
    setFinished(true);
    completeLevel(state.language, level.id, 3);
    setCompletionVisible(true);
  };

  const showNotEnoughCoinsAlert = () => {
    setCoinAlertVisible(true);
  };

  const onSubmitWord = (word) => {
    const upper = word.toUpperCase();
    if (sortedWords.includes(upper) && !foundWords.includes(upper)) {
      const next = [...foundWords, upper];
      setFoundWords(next);

      // Fully reveal this word's letters
      const fullMap = {};
      for (let i = 0; i < upper.length; i++) fullMap[i] = true;
      setRevealedLetters((prev) => ({ ...prev, [upper]: fullMap }));

      setMessage(t("game.wordFound", { word: upper }));
      if (next.length === sortedWords.length) {
        finishLevel();
      }
    } else if (upper.length > 1) {
      setMessage(t("game.notInList"));
    }
  };

  // Booster 1: Shuffle letters on wheel (Free)
  const shuffle = () => {
    const arr = [...letters];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setLetters(arr);
  };

  // Booster 2: Single Letter Reveal (25 Coins)
  const useLetterHint = () => {
    const remainingWords = sortedWords.filter((w) => !foundWords.includes(w));
    if (remainingWords.length === 0) {
      finishLevel();
      return;
    }

    // Collect all unrevealed slots across unsolved words
    const unrevealedSlots = [];
    remainingWords.forEach((w) => {
      const wordMap = revealedLetters[w] || {};
      for (let i = 0; i < w.length; i++) {
        if (!wordMap[i]) {
          unrevealedSlots.push({ word: w, index: i });
        }
      }
    });

    if (unrevealedSlots.length === 0) {
      finishLevel();
      return;
    }

    if (spendCoins(LETTER_HINT_COST)) {
      const pick = unrevealedSlots[Math.floor(Math.random() * unrevealedSlots.length)];
      const targetWord = pick.word;
      const updatedWordRevealed = { ...(revealedLetters[targetWord] || {}), [pick.index]: true };
      const updatedRevealed = { ...revealedLetters, [targetWord]: updatedWordRevealed };
      setRevealedLetters(updatedRevealed);
      setMessage(t("game.letterRevealed", { letter: targetWord[pick.index] }));

      // If all letters are now revealed, mark word as found
      if (Object.keys(updatedWordRevealed).length === targetWord.length) {
        const nextFound = [...foundWords, targetWord];
        setFoundWords(nextFound);
        if (nextFound.length === sortedWords.length) {
          finishLevel();
        }
      }
    } else {
      showNotEnoughCoinsAlert();
    }
  };

  // Booster 3: Solve Full Word (50 Coins)
  const useWordHint = () => {
    const remaining = sortedWords.filter((w) => !foundWords.includes(w));
    if (remaining.length === 0) {
      finishLevel();
      return;
    }
    if (spendCoins(WORD_HINT_COST)) {
      const hintedWord = remaining[0];
      const next = [...foundWords, hintedWord];
      setFoundWords(next);

      const fullMap = {};
      for (let i = 0; i < hintedWord.length; i++) fullMap[i] = true;
      setRevealedLetters((prev) => ({ ...prev, [hintedWord]: fullMap }));

      setMessage(t("game.hintRevealed", { word: hintedWord }));
      if (next.length === sortedWords.length) {
        finishLevel();
      }
    } else {
      showNotEnoughCoinsAlert();
    }
  };

  // Booster 4: Magic Wand Multi-Letter Blast (80 Coins)
  const useMagicWand = () => {
    const remainingWords = sortedWords.filter((w) => !foundWords.includes(w));
    if (remainingWords.length === 0) {
      finishLevel();
      return;
    }

    const unrevealedSlots = [];
    remainingWords.forEach((w) => {
      const wordMap = revealedLetters[w] || {};
      for (let i = 0; i < w.length; i++) {
        if (!wordMap[i]) {
          unrevealedSlots.push({ word: w, index: i });
        }
      }
    });

    if (unrevealedSlots.length === 0) {
      finishLevel();
      return;
    }

    if (spendCoins(WAND_HINT_COST)) {
      // Pick up to 3 random unrevealed letters
      const shuffled = [...unrevealedSlots].sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, 3);

      const updatedRevealed = { ...revealedLetters };
      chosen.forEach(({ word, index }) => {
        updatedRevealed[word] = { ...(updatedRevealed[word] || {}), [index]: true };
      });
      setRevealedLetters(updatedRevealed);
      setMessage(t("game.wandRevealed"));

      // Check which words became completely solved
      const newlyCompleted = [];
      remainingWords.forEach((w) => {
        const wordMap = updatedRevealed[w] || {};
        if (Object.keys(wordMap).length === w.length) {
          newlyCompleted.push(w);
        }
      });

      if (newlyCompleted.length > 0) {
        const nextFound = [...foundWords, ...newlyCompleted];
        setFoundWords(nextFound);
        if (nextFound.length === sortedWords.length) {
          finishLevel();
        }
      }
    } else {
      showNotEnoughCoinsAlert();
    }
  };

  const nextLevelId = level.id < TOTAL_LEVELS ? level.id + 1 : 1;
  const nextMountain = getBackgroundForLevel(nextLevelId);

  return (
    <ScreenBG source={mountainBg} dim={0.28}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={handleBack} />

          <View style={styles.levelBadge}>
            <Text style={styles.levelTitle}>{t("game.level", { n: level.id })}</Text>
          </View>

          <CoinBadge
            coins={state.coins}
            onAdd={() => navigation.navigate("Shop")}
          />
        </View>

        {/* Category Pill */}
        <View style={styles.categoryPill}>
          <Ionicons name="leaf" size={13} color={colors.gold} style={{ marginRight: 6 }} />
          <Text style={styles.categoryText}>{t(`categories.${level.category}`)}</Text>
          <Text style={styles.worldNameText}>· {t(`worldNames.${world.id}`)}</Text>
        </View>

        {/* Crossword Answers Tiles */}
        <View style={styles.answersArea}>
          {sortedWords.map((word) => {
            const isFound = foundWords.includes(word);
            const wordRevealed = revealedLetters[word] || {};
            return (
              <View key={word} style={[styles.wordRow, isRTL && { flexDirection: "row-reverse" }]}>
                {word.split("").map((ch, i) => {
                  const isLetterRevealed = isFound || !!wordRevealed[i];
                  return (
                    <CrosswordTile
                      key={i}
                      letter={ch}
                      isFound={isFound}
                      isLetterRevealed={isLetterRevealed}
                    />
                  );
                })}
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

        {/* Word Wheel & Booster Actions */}
        <View style={styles.bottomArea}>
          <View style={styles.circleRow}>
            {/* Left Boosters: Shuffle & Letter Reveal */}
            <View style={styles.sideBtnCol}>
              <View style={styles.sideBtnWrap}>
                <IconCircleButton name="shuffle" onPress={shuffle} size={20} />
                <Text style={styles.sideBtnLabel}>{t("game.shuffle")}</Text>
              </View>

              <View style={[styles.sideBtnWrap, styles.sideBtnSpaced]}>
                <IconCircleButton
                  name="search"
                  onPress={useLetterHint}
                  size={20}
                  iconColor={colors.goldLight}
                />
                <Text style={styles.sideBtnLabel}>
                  {t("game.letterHint")} • {LETTER_HINT_COST}
                </Text>
              </View>
            </View>

            <WordCircle letters={letters} onSubmitWord={onSubmitWord} isRTL={isRTL} />

            {/* Right Boosters: Word Hint & Magic Wand */}
            <View style={styles.sideBtnCol}>
              <View style={styles.sideBtnWrap}>
                <IconCircleButton
                  name="bulb"
                  onPress={useWordHint}
                  size={20}
                  iconColor={colors.gold}
                />
                <Text style={styles.sideBtnLabel}>
                  {t("game.hint")} • {WORD_HINT_COST}
                </Text>
              </View>

              <View style={[styles.sideBtnWrap, styles.sideBtnSpaced]}>
                <IconCircleButton
                  name="sparkles"
                  onPress={useMagicWand}
                  size={20}
                  iconColor="#7ED6DF"
                />
                <Text style={styles.sideBtnLabel}>
                  {t("game.wandHint")} • {WAND_HINT_COST}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <LevelVictoryModal
        visible={completionVisible}
        onNext={goToNextLevel}
        onMap={goToMap}
        wordsCount={sortedWords.length}
        nextMountain={nextMountain}
        t={t}
      />

      {/* Not Enough Coins Luxury Modal */}
      <LuxuryModal
        visible={coinAlertVisible}
        onClose={() => setCoinAlertVisible(false)}
        title={t("game.notEnoughCoinsTitle") || "Need More Coins"}
        message={
          t("game.notEnoughCoinsMsg") ||
          "You do not have enough coins for this booster. Complete more levels or visit the Coin Shop to replenish!"
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
  worldNameText: {
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
    fontSize: 12,
    marginLeft: 4,
  },
  answersArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    marginHorizontal: 16,
    paddingVertical: 12,
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
    width: 42,
    height: 42,
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
  tileRevealed: {
    backgroundColor: "rgba(245, 196, 81, 0.32)",
    borderWidth: 2,
    borderColor: colors.gold,
    ...glowShadow,
  },
  tileFound: {
    backgroundColor: colors.forest,
    borderWidth: 2,
    borderColor: colors.gold,
    ...glowShadow,
  },
  tileText: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.forestDark,
  },
  tileTextRevealed: {
    color: colors.goldLight,
    fontWeight: "900",
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
    marginTop: 8,
  },
  message: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 13,
  },
  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  circleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  sideBtnCol: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  sideBtnSpaced: {
    marginTop: 16,
  },
  sideBtnWrap: {
    alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8, 24, 18, 0.65)",
    paddingHorizontal: 26,
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
  trophyWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.forestDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.gold,
    ...glowShadow,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.forestDark,
    marginBottom: 6,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: colors.forestMuted,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  modalStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  rewardBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.22)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    marginBottom: 10,
  },
  rewardBannerText: {
    color: colors.forestDark,
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 6,
  },
  nextSceneryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    marginBottom: 16,
    maxWidth: "92%",
  },
  nextSceneryText: {
    color: colors.forest,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },
  modalActions: {
    width: "100%",
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: colors.gold,
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  primaryBtnText: {
    color: colors.forestDark,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.3,
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
  btnShadow: {
    ...shadow,
  },
});
