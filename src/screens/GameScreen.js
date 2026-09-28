import React, { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Modal, Animated, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ScreenBG from "../components/ScreenBG";
import { BackButton, CoinBadge, DiamondBadge, IconCircleButton } from "../components/Bits";
import WordCircle from "../components/WordCircle";
import LuxuryModal from "../components/LuxuryModal";
import { colors, radii, shadow, glowShadow } from "../theme";
import { getLevels, LANGUAGES, getWorldForLevel, TOTAL_LEVELS } from "../data/puzzles";
import { getBackgroundForLevel } from "../data/backgrounds";
import { isValidDictionaryWord } from "../data/dictionary.js";
import { useGame } from "../context/GameContext";
import { useT } from "../i18n/useT";
import { SUB_CONTINENT_LANG_CODES, LANG_DETAILS } from "./LanguageSelectScreen";

const LETTER_HINT_COIN_COST = 25;
const LETTER_HINT_DIAMOND_COST = 2;

const WORD_HINT_COIN_COST = 50;
const WORD_HINT_DIAMOND_COST = 4;

const WAND_HINT_COIN_COST = 80;
const WAND_HINT_DIAMOND_COST = 6;

function CrosswordTile({ letter, isFound, isLetterRevealed, size = 40, fontSize = 20, margin = 2 }) {
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
        {
          width: size,
          height: size,
          margin,
          borderRadius: Math.max(6, Math.round(size * 0.22)),
        },
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
          { fontSize },
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

          {/* Double Rewards: Coins + Diamonds */}
          <View style={styles.rewardsRow}>
            <View style={styles.rewardBanner}>
              <Ionicons name="disc" size={18} color={colors.gold} />
              <Text style={styles.rewardBannerText}>+50 Coins</Text>
            </View>
            <View style={[styles.rewardBanner, styles.diamondRewardBanner]}>
              <Ionicons name="diamond" size={17} color={colors.diamond} />
              <Text style={[styles.rewardBannerText, { color: colors.diamond }]}>+5 Diamonds</Text>
            </View>
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
  const {
    state,
    spendCoins,
    spendDiamonds,
    completeLevel,
    addCoins,
    awardStageCoins,
    setLanguage,
    playWinSound,
    playLoseSound,
    playWordFoundSound,
    playTapSound,
    playCoinSound,
  } = useGame();
  const { t } = useT();

  const levels = getLevels(state.language);
  const level = levels.find((l) => l.id === levelId) || levels[0];
  const lang = LANGUAGES.find((l) => l.code === state.language);
  const isRTL = !!lang?.isRTL;
  const world = getWorldForLevel(level.id);
  const mountainBg = getBackgroundForLevel(level.id);

  const layout = useMemo(
    () => level.layout || { placements: [], cells: {}, gridWidth: 0, gridHeight: 0 },
    [level]
  );
  const sortedWords = useMemo(() => [...level.words].sort((a, b) => a.length - b.length), [level]);

  const [foundWords, setFoundWords] = useState([]);
  const [bonusWordsFound, setBonusWordsFound] = useState([]);
  const [revealedCells, setRevealedCells] = useState({}); // { [cellKey]: true }
  const [letters, setLetters] = useState(level.letters);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const [completionVisible, setCompletionVisible] = useState(false);
  const [insufficientModalVisible, setInsufficientModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [hintModalConfig, setHintModalConfig] = useState(null); // { type, coinCost, diamondCost, title, icon }
  const completionHandled = useRef(false);

  useEffect(() => {
    setFoundWords([]);
    setBonusWordsFound([]);
    setRevealedCells({});
    setLetters(level.letters);
    setMessage("");
    setFinished(false);
    setCompletionVisible(false);
    completionHandled.current = false;
  }, [level.id, level.letters, state.language]);

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

  const checkAndCompleteWords = (updatedRevealed, currentFound) => {
    const cells = layout.cells || {};
    const remaining = sortedWords.filter((w) => !currentFound.includes(w));
    const newlyCompleted = [];

    for (const w of remaining) {
      const wordCellKeys = Object.keys(cells).filter((k) => cells[k].words.includes(w));
      const allRevealed =
        wordCellKeys.length > 0 &&
        wordCellKeys.every(
          (k) =>
            updatedRevealed[k] ||
            cells[k].words.some((other) => other !== w && currentFound.includes(other))
        );
      if (allRevealed) {
        newlyCompleted.push(w);
      }
    }

    if (newlyCompleted.length > 0) {
      const nextFound = [...currentFound, ...newlyCompleted];
      setFoundWords(nextFound);
      newlyCompleted.forEach(() => awardStageCoins(10));
      if (nextFound.length === sortedWords.length) {
        finishLevel();
      }
    }
  };

  const onSubmitWord = (word) => {
    const upper = isRTL ? word.trim() : word.toUpperCase().trim();
    if (sortedWords.includes(upper) && !foundWords.includes(upper)) {
      const next = [...foundWords, upper];
      setFoundWords(next);

      // Her stage complete hone par coins award: +10 coins!
      awardStageCoins(10);
      playWordFoundSound();
      setMessage(`${t("game.wordFound", { word: upper })} (+10 Coins)`);

      if (next.length === sortedWords.length) {
        finishLevel();
      }
    } else if (foundWords.includes(upper)) {
      playLoseSound();
      setMessage(`"${upper}" already solved!`);
    } else if (isValidDictionaryWord(upper, state.language)) {
      if (!bonusWordsFound.includes(upper)) {
        setBonusWordsFound((prev) => [...prev, upper]);
        addCoins(5);
        playCoinSound();
        setMessage(t("game.bonusWord", { word: upper }));
      } else {
        playLoseSound();
        setMessage(t("game.bonusWordAlreadyFound", { word: upper }));
      }
    } else if (upper.length > 1) {
      playLoseSound();
      setMessage(t("game.notInList"));
    }
  };

  // Booster 1: Shuffle letters on wheel (Free)
  const shuffle = () => {
    playTapSound();
    const arr = [...letters];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setLetters(arr);
  };

  // Execute Letter Hint
  const executeLetterHint = () => {
    const remainingWords = sortedWords.filter((w) => !foundWords.includes(w));
    if (remainingWords.length === 0) {
      finishLevel();
      return;
    }

    const cells = layout.cells || {};
    const unrevealedKeys = Object.keys(cells).filter((key) => {
      const cell = cells[key];
      const isAlreadyFound = cell.words.some((w) => foundWords.includes(w));
      return !isAlreadyFound && !revealedCells[key];
    });

    if (unrevealedKeys.length === 0) {
      finishLevel();
      return;
    }

    const pickKey = unrevealedKeys[Math.floor(Math.random() * unrevealedKeys.length)];
    const newRevealed = { ...revealedCells, [pickKey]: true };
    setRevealedCells(newRevealed);
    playTapSound();
    setMessage(t("game.letterRevealed", { letter: cells[pickKey].letter }));

    checkAndCompleteWords(newRevealed, foundWords);
  };

  // Execute Word Hint
  const executeWordHint = () => {
    const remaining = sortedWords.filter((w) => !foundWords.includes(w));
    if (remaining.length === 0) {
      finishLevel();
      return;
    }
    const hintedWord = remaining[0];
    const nextFound = [...foundWords, hintedWord];
    setFoundWords(nextFound);

    const cells = layout.cells || {};
    const newRevealed = { ...revealedCells };
    Object.keys(cells).forEach((key) => {
      if (cells[key].words.includes(hintedWord)) {
        newRevealed[key] = true;
      }
    });
    setRevealedCells(newRevealed);

    playWordFoundSound();
    awardStageCoins(10);
    setMessage(t("game.hintRevealed", { word: hintedWord }));
    if (nextFound.length === sortedWords.length) {
      finishLevel();
    }
  };

  // Execute Magic Wand Blast
  const executeMagicWand = () => {
    const remainingWords = sortedWords.filter((w) => !foundWords.includes(w));
    if (remainingWords.length === 0) {
      finishLevel();
      return;
    }

    const cells = layout.cells || {};
    const unrevealedKeys = Object.keys(cells).filter((key) => {
      const cell = cells[key];
      const isAlreadyFound = cell.words.some((w) => foundWords.includes(w));
      return !isAlreadyFound && !revealedCells[key];
    });

    if (unrevealedKeys.length === 0) {
      finishLevel();
      return;
    }

    const shuffled = [...unrevealedKeys].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 3);

    const newRevealed = { ...revealedCells };
    chosen.forEach((key) => {
      newRevealed[key] = true;
    });
    setRevealedCells(newRevealed);
    playCoinSound();
    setMessage(t("game.wandRevealed"));

    checkAndCompleteWords(newRevealed, foundWords);
  };

  // Open Hint Purchase Dialog
  const openHintPurchase = (type) => {
    if (type === "letter") {
      setHintModalConfig({
        type: "letter",
        title: "Single Letter Hint",
        desc: "Reveals one random letter on the crossword board",
        coinCost: LETTER_HINT_COIN_COST,
        diamondCost: LETTER_HINT_DIAMOND_COST,
        icon: "search",
      });
    } else if (type === "word") {
      setHintModalConfig({
        type: "word",
        title: "Full Word Solve",
        desc: "Instantly solves an entire unsolved crossword word",
        coinCost: WORD_HINT_COIN_COST,
        diamondCost: WORD_HINT_DIAMOND_COST,
        icon: "bulb",
      });
    } else if (type === "wand") {
      setHintModalConfig({
        type: "wand",
        title: "Magic Wand Blast",
        desc: "Magically blasts and uncovers 3 random letters",
        coinCost: WAND_HINT_COIN_COST,
        diamondCost: WAND_HINT_DIAMOND_COST,
        icon: "sparkles",
      });
    }
  };

  const handleBuyWithCoins = () => {
    if (!hintModalConfig) return;
    const { type, coinCost } = hintModalConfig;
    if (spendCoins(coinCost)) {
      setHintModalConfig(null);
      if (type === "letter") executeLetterHint();
      else if (type === "word") executeWordHint();
      else if (type === "wand") executeMagicWand();
    } else {
      setHintModalConfig(null);
      setInsufficientModalVisible(true);
    }
  };

  const handleBuyWithDiamonds = () => {
    if (!hintModalConfig) return;
    const { type, diamondCost } = hintModalConfig;
    if (spendDiamonds(diamondCost)) {
      setHintModalConfig(null);
      if (type === "letter") executeLetterHint();
      else if (type === "word") executeWordHint();
      else if (type === "wand") executeMagicWand();
    } else {
      setHintModalConfig(null);
      setInsufficientModalVisible(true);
    }
  };

  const nextLevelId = level.id < TOTAL_LEVELS ? level.id + 1 : 1;
  const nextMountain = getBackgroundForLevel(nextLevelId);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const maxBoardWidth = windowWidth - 32;
  const maxBoardHeight = Math.min(windowHeight * 0.35, 260);

  const gridW = layout.gridWidth || 1;
  const gridH = layout.gridHeight || 1;
  const sizeFromWidth = Math.floor((maxBoardWidth - (gridW - 1) * 5) / gridW);
  const sizeFromHeight = Math.floor((maxBoardHeight - (gridH - 1) * 5) / gridH);
  const tileSize = Math.min(46, Math.max(26, Math.min(sizeFromWidth, sizeFromHeight)));
  const tileMargin = tileSize < 34 ? 1.5 : 2.5;
  const fontSize = Math.round(tileSize * 0.54);

  return (
    <ScreenBG source={mountainBg} dim={0.28}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={handleBack} />

          {/* In-Game Language Switcher Button */}
          <Pressable
            style={styles.gameLangBtn}
            hitSlop={8}
            onPress={() => setLangModalVisible(true)}
          >
            <Ionicons name="globe-outline" size={16} color={colors.goldLight} style={{ marginRight: 4 }} />
            <Text style={styles.gameLangBtnText}>
              {LANG_DETAILS[state.language]?.flag || "🌐"} {state.language.toUpperCase()}
            </Text>
          </Pressable>

          <View style={styles.levelBadge}>
            <Text style={styles.levelTitle}>{t("game.level", { n: level.id })}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CoinBadge
              coins={state.coins}
              onAdd={() => navigation.navigate("Shop")}
              style={{ marginRight: 6 }}
            />
            <DiamondBadge
              diamonds={state.diamonds || 0}
              onAdd={() => navigation.navigate("Shop")}
            />
          </View>
        </View>

        {/* Category Pill */}
        <View style={styles.categoryPill}>
          <Ionicons name="leaf" size={13} color={colors.gold} style={{ marginRight: 6 }} />
          <Text style={styles.categoryText}>{t(`categories.${level.category}`)}</Text>
          <Text style={styles.worldNameText}>· {t(`worldNames.${world.id}`)}</Text>
        </View>

        {/* Intersecting Crossword Grid Board */}
        <View style={styles.answersArea}>
          <View style={styles.crosswordGrid}>
            {Array.from({ length: gridH }).map((_, r) => (
              <View
                key={`row-${r}`}
                style={[
                  styles.crosswordRow,
                  isRTL && { flexDirection: "row-reverse" },
                ]}
              >
                {Array.from({ length: gridW }).map((_, c) => {
                  const cellKey = `${r},${c}`;
                  const cell = layout.cells?.[cellKey];
                  if (!cell) {
                    return (
                      <View
                        key={`empty-${cellKey}`}
                        style={{
                          width: tileSize,
                          height: tileSize,
                          margin: tileMargin,
                        }}
                      />
                    );
                  }
                  const isFound = cell.words.some((w) => foundWords.includes(w));
                  const isLetterRevealed = isFound || !!revealedCells[cellKey];
                  return (
                    <CrosswordTile
                      key={cellKey}
                      letter={cell.letter}
                      isFound={isFound}
                      isLetterRevealed={isLetterRevealed}
                      size={tileSize}
                      fontSize={fontSize}
                      margin={tileMargin}
                    />
                  );
                })}
              </View>
            ))}
          </View>
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
                  onPress={() => openHintPurchase("letter")}
                  size={20}
                  iconColor={colors.goldLight}
                />
                <Text style={styles.sideBtnLabel}>
                  Letter • {LETTER_HINT_COIN_COST}🪙 / {LETTER_HINT_DIAMOND_COST}💎
                </Text>
              </View>
            </View>

            <WordCircle letters={letters} onSubmitWord={onSubmitWord} isRTL={isRTL} />

            {/* Right Boosters: Word Hint & Magic Wand */}
            <View style={styles.sideBtnCol}>
              <View style={styles.sideBtnWrap}>
                <IconCircleButton
                  name="bulb"
                  onPress={() => openHintPurchase("word")}
                  size={20}
                  iconColor={colors.gold}
                />
                <Text style={styles.sideBtnLabel}>
                  Word • {WORD_HINT_COIN_COST}🪙 / {WORD_HINT_DIAMOND_COST}💎
                </Text>
              </View>

              <View style={[styles.sideBtnWrap, styles.sideBtnSpaced]}>
                <IconCircleButton
                  name="sparkles"
                  onPress={() => openHintPurchase("wand")}
                  size={20}
                  iconColor={colors.diamond}
                />
                <Text style={styles.sideBtnLabel}>
                  Wand • {WAND_HINT_COIN_COST}🪙 / {WAND_HINT_DIAMOND_COST}💎
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Victory Modal with Coins & Diamonds */}
      <LevelVictoryModal
        visible={completionVisible}
        onNext={goToNextLevel}
        onMap={goToMap}
        wordsCount={sortedWords.length}
        nextMountain={nextMountain}
        t={t}
      />

      {/* Buy Hint with Coins OR Diamonds Modal */}
      {hintModalConfig && (
        <Modal
          visible={!!hintModalConfig}
          transparent
          animationType="fade"
          onRequestClose={() => setHintModalConfig(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.hintModalCard}>
              <View style={styles.hintModalIconBox}>
                <Ionicons name={hintModalConfig.icon} size={30} color={colors.gold} />
              </View>
              <Text style={styles.hintModalTitle}>{hintModalConfig.title}</Text>
              <Text style={styles.hintModalDesc}>{hintModalConfig.desc}</Text>

              <Text style={styles.hintModalSelectLabel}>Choose payment method:</Text>

              {/* Option 1: Coins */}
              <Pressable
                onPress={handleBuyWithCoins}
                style={({ pressed }) => [
                  styles.hintChoiceBtn,
                  state.coins < hintModalConfig.coinCost && styles.hintChoiceBtnDisabled,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={styles.hintChoiceIconBox}>
                  <Ionicons name="disc" size={20} color={colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hintChoiceTitle}>Pay with Coins</Text>
                  <Text style={styles.hintChoiceSub}>
                    Cost: {hintModalConfig.coinCost} Coins (Balance: {state.coins})
                  </Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={24} color={colors.gold} />
              </Pressable>

              {/* Option 2: Diamonds */}
              <Pressable
                onPress={handleBuyWithDiamonds}
                style={({ pressed }) => [
                  styles.hintChoiceBtn,
                  styles.hintChoiceBtnDiamond,
                  (state.diamonds || 0) < hintModalConfig.diamondCost && styles.hintChoiceBtnDisabled,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={[styles.hintChoiceIconBox, { backgroundColor: "rgba(0,229,255,0.15)" }]}>
                  <Ionicons name="diamond" size={18} color={colors.diamond} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.hintChoiceTitle, { color: colors.diamond }]}>Pay with Diamonds</Text>
                  <Text style={styles.hintChoiceSub}>
                    Cost: {hintModalConfig.diamondCost} Diamonds (Balance: {state.diamonds || 0})
                  </Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={24} color={colors.diamond} />
              </Pressable>

              <Pressable
                onPress={() => setHintModalConfig(null)}
                style={styles.cancelHintBtn}
              >
                <Text style={styles.cancelHintBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* In-Game Language Selector Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.inGameLangOverlay}>
          <View style={styles.inGameLangSheet}>
            <View style={styles.inGameLangHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="globe" size={20} color={colors.gold} style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.inGameLangTitle}>Change Game Language</Text>
                  <Text style={styles.inGameLangSub}>زبان تبدیل کریں / भाषा बदलें</Text>
                </View>
              </View>
              <Pressable onPress={() => setLangModalVisible(false)} hitSlop={10} style={styles.closeLangBtn}>
                <Ionicons name="close" size={20} color={colors.white} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              <Text style={styles.inGameLangGroupHeader}>URDU, HINDI, ENGLISH & INDIAN LANGUAGES</Text>
              {SUB_CONTINENT_LANG_CODES.map((code) => {
                const meta = LANG_DETAILS[code] || {};
                const isSelected = state.language === code;
                return (
                  <Pressable
                    key={code}
                    onPress={() => {
                      setLanguage(code);
                      setLangModalVisible(false);
                    }}
                    style={[styles.inGameLangRow, isSelected && styles.inGameLangRowSelected]}
                  >
                    <Text style={{ fontSize: 20, marginRight: 10 }}>{meta.flag || "🌐"}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inGameLangRowTitle, isSelected && styles.inGameLangRowTitleSelected]}>
                        {meta.native || code}
                      </Text>
                      <Text style={styles.inGameLangRowSub}>{meta.sub || code}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.gold} />}
                  </Pressable>
                );
              })}

              <Text style={[styles.inGameLangGroupHeader, { marginTop: 14 }]}>ALL INTERNATIONAL</Text>
              {LANGUAGES.filter((l) => !SUB_CONTINENT_LANG_CODES.includes(l.code)).map((lang) => {
                const meta = LANG_DETAILS[lang.code] || {};
                const isSelected = state.language === lang.code;
                return (
                  <Pressable
                    key={lang.code}
                    onPress={() => {
                      setLanguage(lang.code);
                      setLangModalVisible(false);
                    }}
                    style={[styles.inGameLangRow, isSelected && styles.inGameLangRowSelected]}
                  >
                    <Text style={{ fontSize: 20, marginRight: 10 }}>{meta.flag || "🌐"}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inGameLangRowTitle, isSelected && styles.inGameLangRowTitleSelected]}>
                        {meta.native || lang.name}
                      </Text>
                      <Text style={styles.inGameLangRowSub}>{meta.sub || lang.name}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.gold} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Insufficient Funds Luxury Modal */}
      <LuxuryModal
        visible={insufficientModalVisible}
        onClose={() => setInsufficientModalVisible(false)}
        title="Need More Coins or Diamonds"
        message="You do not have enough coins or diamonds for this booster. Complete more levels or visit the Shop to replenish!"
        icon="wallet-outline"
        iconColor={colors.gold}
        buttons={[
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setInsufficientModalVisible(false),
          },
          {
            text: "Go to Shop",
            style: "gold",
            onPress: () => {
              setInsufficientModalVisible(false);
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  gameLangBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.78)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: "rgba(245, 196, 81, 0.5)",
    ...shadow,
  },
  gameLangBtnText: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 11,
  },
  levelBadge: {
    backgroundColor: "rgba(10, 41, 26, 0.72)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  levelTitle: {
    color: colors.white,
    fontSize: 15,
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
    paddingVertical: 5,
    marginTop: 8,
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
    marginTop: 10,
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "rgba(10, 41, 26, 0.62)",
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: "rgba(245, 196, 81, 0.35)",
    minHeight: 120,
    ...shadow,
  },
  crosswordGrid: {
    alignItems: "center",
    justifyContent: "center",
  },
  crosswordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tile: {
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  tileEmpty: {
    backgroundColor: "rgba(251, 247, 236, 0.92)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  tileRevealed: {
    backgroundColor: "rgba(245, 196, 81, 0.35)",
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
    fontSize: 22,
    fontWeight: "900",
    color: colors.forestDark,
    includeFontPadding: false,
    textAlign: "center",
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
    marginTop: 6,
  },
  message: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 13,
  },
  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  circleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  sideBtnCol: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  sideBtnSpaced: {
    marginTop: 14,
  },
  sideBtnWrap: {
    alignItems: "center",
  },
  sideBtnLabel: {
    color: colors.white,
    fontSize: 9,
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
    backgroundColor: "rgba(8, 24, 18, 0.72)",
    paddingHorizontal: 22,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(251, 247, 236, 0.98)",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    padding: 22,
    alignItems: "center",
    ...shadow,
  },
  trophyWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.forestDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.gold,
    ...glowShadow,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.forestDark,
    marginBottom: 4,
    textAlign: "center",
  },
  modalText: {
    fontSize: 13,
    color: colors.forestMuted,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 14,
  },
  modalStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  rewardsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 8,
  },
  rewardBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.22)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  diamondRewardBanner: {
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    borderColor: colors.diamond,
  },
  rewardBannerText: {
    color: colors.forestDark,
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 6,
  },
  nextSceneryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: radii.pill,
    marginBottom: 14,
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
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: colors.gold,
    paddingVertical: 13,
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
    paddingVertical: 12,
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

  /* Hint Choice Modal */
  hintModalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#0D2C1E",
    borderRadius: radii.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    alignItems: "center",
    ...shadow,
  },
  hintModalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  hintModalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
  },
  hintModalDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
  hintModalSelectLabel: {
    color: colors.goldLight,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  hintChoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    width: "100%",
    padding: 12,
    borderRadius: radii.lg,
    borderWidth: 1.2,
    borderColor: "rgba(245, 196, 81, 0.4)",
    marginBottom: 10,
  },
  hintChoiceBtnDiamond: {
    borderColor: "rgba(0, 229, 255, 0.5)",
  },
  hintChoiceBtnDisabled: {
    opacity: 0.5,
  },
  hintChoiceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  hintChoiceTitle: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 14,
  },
  hintChoiceSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    marginTop: 2,
  },
  cancelHintBtn: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelHintBtnText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "700",
  },

  /* In-Game Language Modal */
  inGameLangOverlay: {
    flex: 1,
    backgroundColor: "rgba(5, 20, 14, 0.8)",
    justifyContent: "flex-end",
  },
  inGameLangSheet: {
    backgroundColor: "#0D2C1E",
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    padding: 20,
    maxHeight: "80%",
  },
  inGameLangHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    marginBottom: 12,
  },
  inGameLangTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
  inGameLangSub: {
    color: colors.goldLight,
    fontSize: 12,
    fontWeight: "700",
  },
  closeLangBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  inGameLangGroupHeader: {
    color: colors.goldLight,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  inGameLangRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  inGameLangRowSelected: {
    backgroundColor: "rgba(30, 107, 69, 0.9)",
    borderColor: colors.gold,
    borderWidth: 1.5,
  },
  inGameLangRowTitle: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 15,
  },
  inGameLangRowTitleSelected: {
    color: colors.goldLight,
  },
  inGameLangRowSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    marginTop: 1,
  },
});
