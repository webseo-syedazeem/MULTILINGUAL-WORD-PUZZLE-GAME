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

const BG_IMAGE = require("../../assets/images/clean_nature_bg.jpg");

const LANG_DETAILS = {
  en: { flag: "🇬🇧", native: "English", sub: "English" },
  es: { flag: "🇪🇸", native: "Español", sub: "Spanish" },
  fr: { flag: "🇫🇷", native: "Français", sub: "French" },
  de: { flag: "🇩🇪", native: "Deutsch", sub: "German" },
  ar: { flag: "🇸🇦", native: "العربية", sub: "Arabic" },
  ur: { flag: "🇵🇰", native: "اردو", sub: "Urdu" },
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
  hi: { flag: "🇮🇳", native: "हिन्दी", sub: "Hindi" },
  bn: { flag: "🇧🇩", native: "বাংলা", sub: "Bengali" },
  ta: { flag: "🇮🇳", native: "தமிழ்", sub: "Tamil" },
  te: { flag: "🇮🇳", native: "తెలుగు", sub: "Telugu" },
  th: { flag: "🇹🇭", native: "ไทย", sub: "Thai" },
  vi: { flag: "🇻🇳", native: "Tiếng Việt", sub: "Vietnamese" },
  id: { flag: "🇮🇩", native: "Bahasa Indonesia", sub: "Indonesian" },
  ms: { flag: "🇲🇾", native: "Bahasa Melayu", sub: "Malay" },
  tl: { flag: "🇵🇭", native: "Filipino", sub: "Filipino" },
  my: { flag: "🇲🇲", native: "မြန်မာ", sub: "Burmese" },
  km: { flag: "🇰🇭", native: "ខ្មែរ", sub: "Khmer" },
  si: { flag: "🇱🇰", native: "සිංහල", sub: "Sinhala" },
  ne: { flag: "🇳🇵", native: "नेपाली", sub: "Nepali" },
  mr: { flag: "🇮🇳", native: "मराठी", sub: "Marathi" },
  gu: { flag: "🇮🇳", native: "ગુજરાતી", sub: "Gujarati" },
  pa: { flag: "🇮🇳", native: "ਪੰਜਾਬੀ", sub: "Punjabi" },
  kn: { flag: "🇮🇳", native: "ಕನ್ನಡ", sub: "Kannada" },
  ml: { flag: "🇮🇳", native: "മലയാളം", sub: "Malayalam" },
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
  const [choice, setChoice] = useState(state.language || "en");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return LANGUAGES;
    const q = searchQuery.toLowerCase().trim();
    return LANGUAGES.filter((lang) => {
      const meta = LANG_DETAILS[lang.code] || {};
      return (
        lang.name.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        (meta.native && meta.native.toLowerCase().includes(q)) ||
        (meta.sub && meta.sub.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const handleBack = () => {
    if (fromHome) {
      if (navigation.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("MainTabs", { screen: "Home" });
      }
    } else {
      if (navigation.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace("Onboarding");
      }
    }
  };

  const confirm = () => {
    setLanguage(choice);
    if (fromHome) handleBack();
    else navigation.replace("Login");
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={handleBack} />
          <View style={styles.headerBrand}>
            <Ionicons name="leaf" size={14} color={colors.gold} style={{ marginRight: 6 }} />
            <Text style={styles.headerBrandText}>{t("languageSelect.brand")}</Text>
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
            <Text style={styles.title}>{t("languageSelect.title")}</Text>
            <Text style={styles.subtitle}>{t("languageSelect.subtitle")}</Text>
          </View>

          {/* Search Input Filter */}
          <View style={styles.searchBarWrap}>
            <Ionicons name="search" size={18} color={colors.forest} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search from 56 languages..."
              placeholderTextColor="#8A9D93"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {!!searchQuery && (
              <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#8A9D93" />
              </Pressable>
            )}
          </View>

          {/* Language Cards */}
          <View style={styles.cardsContainer}>
            {filteredLanguages.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="search-outline" size={36} color={colors.cream} />
                <Text style={styles.emptyText}>No languages found matching "{searchQuery}"</Text>
              </View>
            ) : (
              filteredLanguages.map((lang) => {
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
              })
            )}
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomArea}>
          <PrimaryButton
            title={t("languageSelect.continue")}
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
    marginBottom: 16,
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
  searchBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 236, 0.95)",
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.6)",
    ...shadow,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.forestDark,
  },
  cardsContainer: {
    gap: 10,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
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
    backgroundColor: "rgba(251, 247, 236, 0.94)",
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 58, 38, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  flagText: {
    fontSize: 22,
  },
  langNameWrap: {
    flex: 1,
  },
  langNativeName: {
    fontSize: 17,
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
    width: 24,
    height: 24,
    borderRadius: 12,
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
