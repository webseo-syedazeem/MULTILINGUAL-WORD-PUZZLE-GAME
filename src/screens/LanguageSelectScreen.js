import React, { useState } from "react";
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
import { BackButton } from "../components/Bits";
import PrimaryButton from "../components/PrimaryButton";
import { colors, radii, shadow, glowShadow } from "../theme";
import { LANGUAGES } from "../data/puzzles";
import { useGame } from "../context/GameContext";

const BG_IMAGE = require("../../assets/images/clean_nature_bg.jpg");

const LANG_DETAILS = {
  en: { flag: "🇬🇧", native: "English", sub: "English" },
  es: { flag: "🇪🇸", native: "Español", sub: "Spanish" },
  fr: { flag: "🇫🇷", native: "Français", sub: "French" },
  de: { flag: "🇩🇪", native: "Deutsch", sub: "German" },
  ar: { flag: "🇸🇦", native: "العربية", sub: "Arabic" },
  ur: { flag: "🇵🇰", native: "اردو", sub: "Urdu" },
};

export default function LanguageSelectScreen({ navigation, route }) {
  const { setLanguage, state } = useGame();
  const fromHome = route?.params?.fromHome;
  const [choice, setChoice] = useState(state.language || "en");

  const confirm = () => {
    setLanguage(choice);
    if (fromHome) navigation.goBack();
    else navigation.replace("Login");
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerBrand}>
            <Ionicons name="leaf" size={14} color={colors.gold} style={{ marginRight: 6 }} />
            <Text style={styles.headerBrandText}>WORD CONNECT</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Choose{"\n"}Your Language</Text>
            <Text style={styles.subtitle}>
              Select your preferred language to continue.
            </Text>
          </View>

          {/* Language Cards */}
          <View style={styles.cardsContainer}>
            {LANGUAGES.map((lang) => {
              const meta = LANG_DETAILS[lang.code] || { flag: "🌐", native: lang.name, sub: lang.name };
              const isSelected = choice === lang.code;

              return (
                <Pressable
                  key={lang.code}
                  onPress={() => setChoice(lang.code)}
                  style={({ pressed }) => [
                    styles.langCard,
                    isSelected && styles.langCardSelected,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
                  ]}
                >
                  <View style={styles.flagWrap}>
                    <Text style={styles.flagText}>{meta.flag}</Text>
                  </View>
                  <View style={styles.langNameWrap}>
                    <Text style={[styles.langNativeName, isSelected && styles.langNativeNameSelected]}>
                      {meta.native}
                    </Text>
                    <Text style={styles.langSubName}>{meta.sub}</Text>
                  </View>

                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={14} color={colors.white} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomArea}>
          <PrimaryButton
            title="Continue"
            iconRight="arrow-forward"
            variant="green"
            onPress={confirm}
            style={styles.continueBtn}
          />
          <View style={styles.dotsRow}>
            <View style={styles.inactiveDot} />
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>
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
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.65)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBorderGold,
  },
  headerBrandText: {
    color: colors.gold,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    lineHeight: 38,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.cream,
    textAlign: "center",
    marginTop: 8,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardsContainer: {
    gap: 12,
  },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 236, 0.94)",
    borderRadius: radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
    ...shadow,
  },
  langCardSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.gold,
    borderWidth: 2,
    ...glowShadow,
  },
  flagWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(15, 58, 38, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  flagText: {
    fontSize: 24,
  },
  langNameWrap: {
    flex: 1,
  },
  langNativeName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.forestDark,
  },
  langNativeNameSelected: {
    color: colors.forest,
  },
  langSubName: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#C5D4CB",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    backgroundColor: colors.forest,
    borderColor: colors.forest,
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  continueBtn: {
    width: "100%",
    marginBottom: 14,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    marginHorizontal: 4,
  },
});

