import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
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
import { useT } from "../i18n/useT";

const BG_IMAGE = require("../../assets/images/mountain_alps.jpg");

export const SUB_CONTINENT_LANG_CODES = [
  "ur", // Urdu
  "en", // English
  "hi", // Hindi
  "bn", // Bengali
  "pa", // Punjabi
  "ta", // Tamil
  "te", // Telugu
  "mr", // Marathi
  "gu", // Gujarati
  "kn", // Kannada
  "ml", // Malayalam
];

export const LANG_DETAILS = {
  ur: { flag: "🇵🇰", native: "اردو", sub: "Urdu", region: "Pakistan / India" },
  en: { flag: "🇬🇧", native: "English", sub: "English", region: "Global" },
  hi: { flag: "🇮🇳", native: "हिन्दी", sub: "Hindi", region: "India" },
  bn: { flag: "🇧🇩", native: "বাংলা", sub: "Bengali", region: "Bangladesh / India" },
  pa: { flag: "🇮🇳", native: "ਪੰਜਾਬੀ", sub: "Punjabi", region: "Punjab" },
  ta: { flag: "🇮🇳", native: "தமிழ்", sub: "Tamil", region: "Tamil Nadu" },
  te: { flag: "🇮🇳", native: "తెలుగు", sub: "Telugu", region: "Andhra / Telangana" },
  mr: { flag: "🇮🇳", native: "मराठी", sub: "Marathi", region: "Maharashtra" },
  gu: { flag: "🇮🇳", native: "ગુજરાતી", sub: "Gujarati", region: "Gujarat" },
  kn: { flag: "🇮🇳", native: "ಕನ್ನಡ", sub: "Kannada", region: "Karnataka" },
  ml: { flag: "🇮🇳", native: "മലയാളം", sub: "Malayalam", region: "Kerala" },

  es: { flag: "🇪🇸", native: "Español", sub: "Spanish" },
  fr: { flag: "🇫🇷", native: "Français", sub: "French" },
  de: { flag: "🇩🇪", native: "Deutsch", sub: "German" },
  ar: { flag: "🇸🇦", native: "العربية", sub: "Arabic" },
  pt: { flag: "🇧🇷", native: "Português", sub: "Portuguese" },
  it: { flag: "🇮🇹", native: "Italiano", sub: "Italian" },
  nl: { flag: "🇳🇱", native: "Nederlands", sub: "Dutch" },
  pl: { flag: "🇵🇱", native: "Polski", sub: "Polish" },
  ro: { flag: "🇷🇴", native: "Română", sub: "Romanian" },
  cs: { flag: "🇨🇿", native: "Čeština", sub: "Czech" },
  sv: { flag: "🇸🇪", native: "Svenska", sub: "Swedish" },
  no: { flag: "🇳🇴", native: "Norsk", sub: "Norwegian" },
  da: { flag: "🇩🇰", native: "Dansk", sub: "Danish" },
  fi: { flag: "🇫🇮", native: "Suomi", sub: "Finnish" },
  el: { flag: "🇬🇷", native: "Ελληνικά", sub: "Greek" },
  hu: { flag: "🇭🇺", native: "Magyar", sub: "Hungarian" },
  tr: { flag: "🇹🇷", native: "Türkçe", sub: "Turkish" },
  uk: { flag: "🇺🇦", native: "Українська", sub: "Ukrainian" },
  ru: { flag: "🇷🇺", native: "Русский", sub: "Russian" },
  bg: { flag: "🇧🇬", native: "Български", sub: "Bulgarian" },
  hr: { flag: "🇭🇷", native: "Hrvatski", sub: "Croatian" },
  sr: { flag: "🇷🇸", native: "Српски", sub: "Serbian" },
  sk: { flag: "🇸🇰", native: "Slovenčina", sub: "Slovak" },
  ca: { flag: "🏴", native: "Català", sub: "Catalan" },
  zh: { flag: "🇨🇳", native: "简体中文", sub: "Chinese (Simplified)" },
  "zh-TW": { flag: "🇹🇼", native: "繁體中文", sub: "Chinese (Traditional)" },
  ja: { flag: "🇯🇵", native: "日本語", sub: "Japanese" },
  ko: { flag: "🇰🇷", native: "한국어", sub: "Korean" },
  th: { flag: "🇹🇭", native: "ไทย", sub: "Thai" },
  vi: { flag: "🇻🇳", native: "Tiếng Việt", sub: "Vietnamese" },
  id: { flag: "🇮🇩", native: "Bahasa Indonesia", sub: "Indonesian" },
  ms: { flag: "🇲🇾", native: "Bahasa Melayu", sub: "Malay" },
  tl: { flag: "🇵🇭", native: "Filipino", sub: "Filipino" },
  my: { flag: "🇲🇲", native: "မြန်မာ", sub: "Burmese" },
  km: { flag: "ខ្មែរ", native: "Khmer", sub: "Khmer" },
  si: { flag: "🇱🇰", native: "සිංහල", sub: "Sinhala" },
  ne: { flag: "🇳🇵", native: "नेपाली", sub: "Nepali" },
  sw: { flag: "🇰🇪", native: "Kiswahili", sub: "Swahili" },
  he: { flag: "🇮🇱", native: "עברית", sub: "Hebrew" },
  fa: { flag: "🇮🇷", native: "فارسی", sub: "Persian" },
  am: { flag: "🇪🇹", native: "አማርኛ", sub: "Amharic" },
  ha: { flag: "🇳🇬", native: "Hausa", sub: "Hausa" },
  yo: { flag: "🇳🇬", native: "Yorùbá", sub: "Yoruba" },
  zu: { flag: "🇿🇦", native: "isiZulu", sub: "Zulu" },
  af: { flag: "🇿🇦", native: "Afrikaans", sub: "Afrikaans" },
};

export default function LanguageSelectScreen({ navigation, route }) {
  const { setLanguage, state } = useGame();
  const { t } = useT();
  const fromHome = route?.params?.fromHome;
  const [choice, setChoice] = useState(state.language || "ur");
  const [searchQuery, setSearchQuery] = useState("");

  const subcontinentLanguages = useMemo(() => {
    return SUB_CONTINENT_LANG_CODES.map((code) => {
      const found = LANGUAGES.find((l) => l.code === code);
      return found || { code, name: code, isRTL: code === "ur" };
    });
  }, []);

  const otherLanguages = useMemo(() => {
    return LANGUAGES.filter((l) => !SUB_CONTINENT_LANG_CODES.includes(l.code));
  }, []);

  const filteredSubcontinent = useMemo(() => {
    if (!searchQuery.trim()) return subcontinentLanguages;
    const q = searchQuery.toLowerCase().trim();
    return subcontinentLanguages.filter((lang) => {
      const meta = LANG_DETAILS[lang.code] || {};
      return (
        lang.name.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        (meta.native && meta.native.toLowerCase().includes(q)) ||
        (meta.sub && meta.sub.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, subcontinentLanguages]);

  const filteredOther = useMemo(() => {
    if (!searchQuery.trim()) return otherLanguages;
    const q = searchQuery.toLowerCase().trim();
    return otherLanguages.filter((lang) => {
      const meta = LANG_DETAILS[lang.code] || {};
      return (
        lang.name.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        (meta.native && meta.native.toLowerCase().includes(q)) ||
        (meta.sub && meta.sub.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, otherLanguages]);

  const handleBack = () => {
    if (fromHome) {
      if (navigation.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("MainTabs", { screen: "Home" });
      }
    } else {
      // First open -> navigate to MainTabs
      navigation.replace("MainTabs");
    }
  };

  const confirm = () => {
    setLanguage(choice);
    if (fromHome) {
      handleBack();
    } else {
      navigation.replace("MainTabs");
    }
  };

  const renderLangCard = (lang, isFeatured = false) => {
    const meta = LANG_DETAILS[lang.code] || { flag: "🌐", native: lang.name, sub: lang.name };
    const isSelected = choice === lang.code;

    return (
      <Pressable
        key={lang.code}
        onPress={() => setChoice(lang.code)}
        style={({ pressed }) => [
          styles.langCard,
          isSelected && styles.langCardSelected,
          isFeatured && !isSelected && styles.featuredCard,
          pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
        ]}
      >
        <View style={[styles.flagWrap, isSelected && styles.flagWrapSelected]}>
          <Text style={styles.flagText}>{meta.flag}</Text>
        </View>

        <View style={styles.langNameWrap}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.langNativeName, isSelected && styles.langNativeNameSelected]}>
              {meta.native}
            </Text>
            {isFeatured && (
              <View style={styles.featuredPill}>
                <Text style={styles.featuredPillText}>Subcontinent</Text>
              </View>
            )}
          </View>
          <Text style={[styles.langSubName, isSelected && styles.langSubNameSelected]}>
            {meta.sub} {meta.region ? `• ${meta.region}` : ""}
          </Text>
        </View>

        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
          {isSelected ? (
            <Ionicons name="checkmark" size={16} color={colors.white} />
          ) : (
            <View style={styles.radioInnerUnselected} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {fromHome ? (
            <BackButton onPress={handleBack} />
          ) : (
            <View style={styles.headerLeafWrap}>
              <Ionicons name="earth" size={18} color={colors.gold} />
            </View>
          )}
          <View style={styles.headerBrand}>
            <Ionicons name="leaf" size={14} color={colors.gold} style={{ marginRight: 6 }} />
            <Text style={styles.headerBrandText}>WORD CONNECT</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Headline */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Select Your Language</Text>
            <Text style={styles.titleUrdu}>اپنی زبان منتخب کریں / अपनी भाषा चुनें</Text>
            <Text style={styles.subtitle}>
              Play the entire game in Urdu, English, Hindi, or your regional language
            </Text>
          </View>

          {/* Search Input Filter */}
          <View style={styles.searchBarWrap}>
            <Ionicons name="search" size={18} color={colors.gold} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Urdu, Hindi, English, Punjabi..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {!!searchQuery && (
              <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.8)" />
              </Pressable>
            )}
          </View>

          {/* Section 1: Featured Urdu, Hindi, English & Indian Languages */}
          {filteredSubcontinent.length > 0 && (
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Ionicons name="star" size={15} color={colors.gold} style={{ marginRight: 6 }} />
                <Text style={styles.sectionTitle}>
                  URDU, HINDI, ENGLISH & INDIAN LANGUAGES
                </Text>
              </View>
              <View style={styles.cardsContainer}>
                {filteredSubcontinent.map((lang) => renderLangCard(lang, true))}
              </View>
            </View>
          )}

          {/* Section 2: Global Languages */}
          {filteredOther.length > 0 && (
            <View style={[styles.sectionWrap, { marginTop: 24 }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="globe-outline" size={15} color={colors.goldLight} style={{ marginRight: 6 }} />
                <Text style={styles.sectionTitle}>ALL INTERNATIONAL LANGUAGES</Text>
              </View>
              <View style={styles.cardsContainer}>
                {filteredOther.map((lang) => renderLangCard(lang, false))}
              </View>
            </View>
          )}

          {filteredSubcontinent.length === 0 && filteredOther.length === 0 && (
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={40} color={colors.gold} />
              <Text style={styles.emptyText}>No languages found matching "{searchQuery}"</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomArea}>
          <PrimaryButton
            title="Continue to Game • کھیل شروع کریں"
            iconRight="arrow-forward"
            variant="gold"
            onPress={confirm}
            style={styles.continueBtn}
          />
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
    backgroundColor: "rgba(10, 38, 26, 0.72)",
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
    paddingBottom: 6,
  },
  headerLeafWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(10, 41, 26, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  headerBrandText: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleUrdu: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.goldLight,
    textAlign: "center",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  searchBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 54, 38, 0.85)",
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 1.2,
    borderColor: "rgba(245, 196, 81, 0.4)",
    ...shadow,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
  sectionWrap: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: colors.goldLight,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  cardsContainer: {
    gap: 10,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 54, 38, 0.82)",
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.16)",
    ...shadow,
  },
  featuredCard: {
    backgroundColor: "rgba(23, 66, 47, 0.9)",
    borderColor: "rgba(245, 196, 81, 0.25)",
  },
  langCardSelected: {
    backgroundColor: "rgba(27, 85, 59, 0.96)",
    borderColor: colors.gold,
    borderWidth: 2,
    ...glowShadow,
  },
  flagWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  flagWrapSelected: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderColor: colors.gold,
  },
  flagText: {
    fontSize: 24,
  },
  langNameWrap: {
    flex: 1,
  },
  langNativeName: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: 0.3,
  },
  langNativeNameSelected: {
    color: colors.goldLight,
  },
  featuredPill: {
    marginLeft: 8,
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.4)",
  },
  featuredPillText: {
    color: colors.goldLight,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  langSubName: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
    marginTop: 2,
  },
  langSubNameSelected: {
    color: colors.cream,
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.8,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInnerUnselected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  radioCircleSelected: {
    backgroundColor: colors.forest,
    borderColor: colors.gold,
    borderWidth: 2,
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    alignItems: "center",
    backgroundColor: "rgba(10, 38, 26, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  continueBtn: {
    width: "100%",
  },
});
