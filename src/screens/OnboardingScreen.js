import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../components/PrimaryButton";
import { colors, radii, shadow, glowShadow } from "../theme";

const { width } = Dimensions.get("window");
const BG_IMAGE = require("../../assets/images/scenic_window_bg.jpg");

const SLIDES = [
  {
    key: "discover",
    title: "Discover New Words",
    subtitle: "Expand your vocabulary in multiple languages while having fun.",
    badge: "GLOBAL VOCABULARY",
    highlights: [
      { flag: "🇬🇧", word: "Hello", lang: "English" },
      { flag: "🇪🇸", word: "Hola", lang: "Español" },
      { flag: "🇫🇷", word: "Bonjour", lang: "Français" },
      { flag: "🇩🇪", word: "Hallo", lang: "Deutsch" },
      { flag: "🇸🇦", word: "مرحبا", lang: "Arabic" },
      { flag: "🇵🇰", word: "اردو", lang: "Urdu" },
    ],
  },
  {
    key: "train",
    title: "Train Your Mind",
    subtitle: "Sharpen memory, improve focus, and enjoy calm daily word challenges.",
    badge: "BRAIN TRAINING",
    features: [
      { icon: "bulb-outline", label: "Sharper Focus" },
      { icon: "flash-outline", label: "Fast Recall" },
      { icon: "leaf-outline", label: "Calm Mind" },
      { icon: "trending-up-outline", label: "Daily Growth" },
    ],
    pills: ["FOCUS", "LEARN", "GROW", "CONNECT"],
  },
  {
    key: "grow",
    title: "Play, Learn & Grow",
    subtitle: "Explore languages, unlock levels, and build a brighter word journey every day.",
    badge: "ENDLESS ADVENTURE",
    steps: [
      { icon: "game-controller-outline", title: "Fun Word Puzzles", desc: "Hundreds of handcrafted levels" },
      { icon: "trophy-outline", title: "Daily Rewards", desc: "Coins, hints and streak bonuses" },
      { icon: "globe-outline", title: "6 Rich Languages", desc: "English, Spanish, French, German, Arabic, Urdu" },
    ],
  },
];

export default function OnboardingScreen({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      const next = index + 1;
      scrollRef.current?.scrollTo({ x: width * next, animated: true });
      setIndex(next);
    } else {
      navigation.replace("LanguageSelect");
    }
  };

  const skip = () => {
    navigation.replace("LanguageSelect");
  };

  const onMomentumScrollEnd = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.brandGroup}>
            <View style={styles.leafIconWrap}>
              <Ionicons name="leaf" size={16} color={colors.gold} />
            </View>
            <View>
              <Text style={styles.brandTitle}>WORD CONNECT</Text>
              <Text style={styles.brandSubtitle}>MULTILINGUAL</Text>
            </View>
          </View>
          <Pressable onPress={skip} style={styles.skipBtn} hitSlop={10}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          style={styles.carousel}
        >
          {SLIDES.map((slide, i) => (
            <View key={slide.key} style={[styles.slideWrap, { width }]}>
              {/* Badge */}
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{slide.badge}</Text>
              </View>

              {/* Title & Subtitle */}
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>

              {/* Slide 0: Languages Grid Showcase */}
              {i === 0 && (
                <View style={styles.cardGrid}>
                  {slide.highlights.map((item) => (
                    <View key={item.lang} style={styles.langMiniCard}>
                      <Text style={styles.langFlag}>{item.flag}</Text>
                      <Text style={styles.langWord}>{item.word}</Text>
                      <Text style={styles.langName}>{item.lang}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Slide 1: Brain Training Showcase */}
              {i === 1 && (
                <View style={styles.brainCard}>
                  <View style={styles.brainCenterGlow}>
                    <Ionicons name="sparkles" size={32} color={colors.gold} />
                    <Text style={styles.brainCenterText}>TRAIN DAILY</Text>
                  </View>
                  <View style={styles.featurePillsRow}>
                    {slide.features.map((feat) => (
                      <View key={feat.label} style={styles.featurePill}>
                        <Ionicons name={feat.icon} size={16} color={colors.gold} />
                        <Text style={styles.featurePillText}>{feat.label}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.wordTilesRow}>
                    {slide.pills.map((w) => (
                      <View key={w} style={styles.wordTileMini}>
                        <Text style={styles.wordTileMiniText}>{w}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Slide 2: Progress & Journey Showcase */}
              {i === 2 && (
                <View style={styles.journeyCard}>
                  {slide.steps.map((step, idx) => (
                    <View key={step.title} style={[styles.journeyStep, idx < slide.steps.length - 1 && styles.journeyBorder]}>
                      <View style={styles.journeyIconWrap}>
                        <Ionicons name={step.icon} size={20} color={colors.gold} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.journeyStepTitle}>{step.title}</Text>
                        <Text style={styles.journeyStepDesc}>{step.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomArea}>
          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          {/* Action Button */}
          <PrimaryButton
            title={index === SLIDES.length - 1 ? "Get Started" : "Next"}
            iconRight="arrow-forward"
            onPress={goNext}
            variant="gold"
            style={styles.actionBtn}
          />

          <Text style={styles.mottoText}>PLAY • LEARN • CONNECT</Text>
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
    backgroundColor: "rgba(10, 36, 23, 0.42)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  leafIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(15, 58, 38, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.cardBorderGold,
  },
  brandTitle: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 9,
    letterSpacing: 2,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  skipText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },
  carousel: {
    flex: 1,
  },
  slideWrap: {
    paddingHorizontal: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  badgePill: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 12,
  },
  badgeText: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1.2,
  },
  slideTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  slideSubtitle: {
    fontSize: 15,
    color: colors.cream,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 26,
    paddingHorizontal: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  langMiniCard: {
    width: "31%",
    backgroundColor: "rgba(251, 247, 236, 0.94)",
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: "rgba(245, 196, 81, 0.5)",
    ...shadow,
  },
  langFlag: { fontSize: 24, marginBottom: 4 },
  langWord: { fontSize: 16, fontWeight: "800", color: colors.forestDark },
  langName: { fontSize: 10, fontWeight: "600", color: colors.textMuted, marginTop: 2 },

  brainCard: {
    width: "100%",
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    alignItems: "center",
    ...shadow,
  },
  brainCenterGlow: {
    alignItems: "center",
    paddingVertical: 10,
  },
  brainCenterText: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 2,
    marginTop: 4,
  },
  featurePillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  featurePill: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  featurePillText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 6,
  },
  wordTilesRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  wordTileMini: {
    backgroundColor: colors.cream,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  wordTileMiniText: {
    color: colors.forestDark,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.5,
  },

  journeyCard: {
    width: "100%",
    backgroundColor: "rgba(251, 247, 236, 0.94)",
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  journeyStep: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  journeyBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15, 58, 38, 0.12)",
  },
  journeyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forestDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  journeyStepTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.forestDark,
  },
  journeyStepDesc: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },

  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.gold,
    ...glowShadow,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  actionBtn: {
    width: "100%",
    marginBottom: 14,
  },
  mottoText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "700",
  },
});

