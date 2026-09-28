import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Switch,
  Animated,
  Easing,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";
import { getDailyChallenge, LANGUAGES } from "../data/puzzles";
import { todayKey } from "../utils/streak";
import { useT } from "../i18n/useT";
import ScreenBG from "../components/ScreenBG";
import PrimaryButton from "../components/PrimaryButton";
import LuxuryModal from "../components/LuxuryModal";
import { CoinBadge, DiamondBadge } from "../components/Bits";
import { SUB_CONTINENT_LANG_CODES, LANG_DETAILS } from "./LanguageSelectScreen";

const { width } = Dimensions.get("window");
const BG_IMAGE = require("../../assets/images/mountain_alps.jpg");

const AVATAR_ICONS = {
  leaf: "leaf",
  flame: "flame",
  star: "star",
  trophy: "trophy",
  globe: "earth",
  compass: "compass",
  person: "person",
};

export default function HomeScreen({ navigation }) {
  const {
    state,
    totalStats,
    isCloudConnected,
    updateSetting,
    setLanguage,
    claimDailyReward,
    DAILY_REWARDS_LADDER,
    authUser,
    logout,
    backendConfigured,
    playWinSound,
    playTapSound,
  } = useGame();
  const { t } = useT();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [rewardClaimModalVisible, setRewardClaimModalVisible] = useState(false);
  const [claimedRewardData, setClaimedRewardData] = useState(null);

  const entranceAnim = useRef(new Animated.Value(0)).current;
  const sidebarAnim = useRef(new Animated.Value(-width * 0.85)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -width * 0.88,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false);
    });
  };

  const challenge = useMemo(() => getDailyChallenge(state.language), [state.language]);
  const challengeClaimedToday = state.dailyChallenge.lastCompletedDate === todayKey();
  const foundToday = challengeClaimedToday ? challenge.words.length : (state.dailyChallenge.foundToday || []).length;
  const { levelsPlayed, wordsFound } = totalStats();
  const learnedMinutes = levelsPlayed * 2 + Object.keys(state.levelStars[state.language] || {}).length;
  const learnedHours = Math.floor(learnedMinutes / 60);
  const learnedMinsRemainder = learnedMinutes % 60;

  const currentLangObj = useMemo(
    () => LANGUAGES.find((l) => l.code === state.language) || LANGUAGES[0],
    [state.language]
  );

  // Daily reward state
  const dailyRewardState = state.dailyReward || { lastClaimDate: null, streak: 0 };
  const dailyRewardClaimedToday = dailyRewardState.lastClaimDate === todayKey();
  const currentStreakDay = dailyRewardClaimedToday
    ? ((dailyRewardState.streak - 1) % 7) + 1
    : (dailyRewardState.streak % 7) + 1;
  const todayLadderReward = (DAILY_REWARDS_LADDER && DAILY_REWARDS_LADDER[currentStreakDay - 1]) || {
    coins: 50,
    diamonds: 2,
    hints: 0,
    title: "Daily Gift",
  };

  const onClaimDailyRewardPress = () => {
    const res = claimDailyReward();
    if (res.reward) {
      playWinSound();
      setClaimedRewardData(res.reward);
      setRewardClaimModalVisible(true);
    } else {
      playTapSound();
    }
  };

  // Subcontinent & other languages for sidebar
  const subcontinentLangs = useMemo(() => {
    return SUB_CONTINENT_LANG_CODES.map((code) => {
      const found = LANGUAGES.find((l) => l.code === code);
      return found || { code, name: code, isRTL: code === "ur" };
    });
  }, []);

  const otherLangs = useMemo(() => {
    return LANGUAGES.filter((l) => !SUB_CONTINENT_LANG_CODES.includes(l.code));
  }, []);

  const filteredSubcontinentLangs = useMemo(() => {
    if (!langSearch.trim()) return subcontinentLangs;
    const q = langSearch.toLowerCase().trim();
    return subcontinentLangs.filter((lang) => {
      const meta = LANG_DETAILS[lang.code] || {};
      return (
        lang.name.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        (meta.native && meta.native.toLowerCase().includes(q)) ||
        (meta.sub && meta.sub.toLowerCase().includes(q))
      );
    });
  }, [langSearch, subcontinentLangs]);

  const filteredOtherLangs = useMemo(() => {
    if (!langSearch.trim()) return otherLangs;
    const q = langSearch.toLowerCase().trim();
    return otherLangs.filter((lang) => {
      const meta = LANG_DETAILS[lang.code] || {};
      return (
        lang.name.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        (meta.native && meta.native.toLowerCase().includes(q)) ||
        (meta.sub && meta.sub.toLowerCase().includes(q))
      );
    });
  }, [langSearch, otherLangs]);

  const GRID_ITEMS = [
    { key: "play", icon: "game-controller", title: t("home.grid.playTitle"), subtitle: t("home.grid.playSub"), tab: "Worlds" },
    { key: "daily", icon: "book", title: t("home.grid.dailyTitle"), subtitle: t("home.grid.dailySub"), tab: "Daily" },
    { key: "leaderboard", icon: "trophy", title: "Leaderboard", subtitle: "Global Top Ranks", tab: "Leaderboard" },
    { key: "languages", icon: "globe", title: t("home.grid.langTitle"), subtitle: currentLangObj.name, tab: "LanguageSelectFromHome" },
  ];

  const goToTab = (tabName) => {
    if (tabName === "Leaderboard") {
      navigation.navigate("Leaderboard");
    } else if (tabName) {
      navigation.navigate(tabName);
    }
  };

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
  };

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  const renderSidebarLangItem = (lang, isSubcontinent = false) => {
    const meta = LANG_DETAILS[lang.code] || { flag: "🌐", native: lang.name, sub: lang.name };
    const isSelected = state.language === lang.code;

    return (
      <Pressable
        key={lang.code}
        onPress={() => handleSelectLanguage(lang.code)}
        style={({ pressed }) => [
          styles.sidebarLangCard,
          isSelected && styles.sidebarLangCardSelected,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
      >
        <Text style={styles.sidebarFlag}>{meta.flag}</Text>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.sidebarLangNative, isSelected && styles.sidebarLangNativeSelected]}>
              {meta.native}
            </Text>
            {isSubcontinent && (
              <View style={styles.subcontinentTinyTag}>
                <Text style={styles.subcontinentTinyTagText}>★</Text>
              </View>
            )}
          </View>
          <Text style={[styles.sidebarLangSub, isSelected && styles.sidebarLangSubSelected]}>
            {meta.sub}
          </Text>
        </View>

        <View style={[styles.sidebarRadio, isSelected && styles.sidebarRadioSelected]}>
          {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenBG source={BG_IMAGE} dim={0.24} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: entranceAnim,
              transform: [
                {
                  translateY: entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            }}
          >
            {/* Top Bar */}
            <View style={styles.topBar}>
              {/* Hamburger Button on Left */}
              <Pressable
                style={styles.menuBtn}
                hitSlop={12}
                onPress={openSidebar}
              >
                <Ionicons name="menu" size={24} color={colors.goldLight} />
              </Pressable>

              {/* Coins & Diamonds Badges */}
              <View style={styles.currencyHeaderRow}>
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

              <View style={styles.rightGroup}>
                <Pressable onPress={() => navigation.navigate("Profile")}>
                  <View style={styles.avatarWrap}>
                    <Ionicons
                      name={AVATAR_ICONS[state.avatar] || "person"}
                      size={20}
                      color={colors.white}
                    />
                    <View style={styles.avatarDot} />
                  </View>
                </Pressable>
                <View style={styles.streakBadge}>
                  <Ionicons name="flame" size={14} color="#FF7A45" />
                  <Text style={styles.streakText}>{t("home.streak", { count: state.streakDays })}</Text>
                </View>
              </View>
            </View>

            {/* Brand + Greeting */}
            <Text style={styles.brand}>WORD CONNECT</Text>
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>MULTILINGUAL</Text>
            </View>

            <Text style={styles.greeting}>{t("home.greeting", { name: state.displayName })}</Text>
            <Text style={styles.subGreeting}>{t("home.subGreeting")}</Text>

            {/* Daily Reward Banner */}
            <Pressable
              onPress={dailyRewardClaimedToday ? null : onClaimDailyRewardPress}
              style={({ pressed }) => [
                styles.dailyRewardCard,
                dailyRewardClaimedToday && styles.dailyRewardCardClaimed,
                pressed && !dailyRewardClaimedToday && { opacity: 0.94, transform: [{ scale: 0.985 }] },
              ]}
            >
              <View style={styles.dailyRewardIconBox}>
                <Ionicons
                  name={dailyRewardClaimedToday ? "gift-outline" : "gift"}
                  size={26}
                  color={colors.gold}
                />
              </View>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.dailyRewardCardTitle}>
                    Daily Base Reward • Day {currentStreakDay}/7
                  </Text>
                  {dailyRewardClaimedToday && (
                    <View style={styles.claimedTickPill}>
                      <Ionicons name="checkmark-circle" size={12} color="#00E676" style={{ marginRight: 3 }} />
                      <Text style={styles.claimedTickText}>Claimed</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.dailyRewardCardSub}>
                  {dailyRewardClaimedToday
                    ? "Reward collected! Next gift unlocks tomorrow."
                    : `Claim today: +${todayLadderReward.coins} Coins & +${todayLadderReward.diamonds} Diamonds`}
                </Text>
              </View>

              {!dailyRewardClaimedToday ? (
                <View style={styles.claimNowBtn}>
                  <Text style={styles.claimNowBtnText}>Claim</Text>
                </View>
              ) : (
                <Ionicons name="time-outline" size={20} color="rgba(15,58,38,0.5)" />
              )}
            </Pressable>

            {/* Today's Challenge */}
            <Pressable
              onPress={() => navigation.navigate("Daily")}
              style={({ pressed }) => [styles.challengeCard, pressed && { opacity: 0.94 }]}
            >
              <View style={styles.challengeIconWrap}>
                <Ionicons name="leaf" size={22} color={colors.forest} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.challengeTitle}>{t("home.todaysChallenge")}</Text>
                <Text style={styles.challengeSubtitle}>
                  {t("home.findWords", { count: challenge.words.length, minutes: Math.round(challenge.timeLimitSeconds / 60) })}
                </Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, (foundToday / challenge.words.length) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressLabel}>{t("home.wordsProgress", { found: foundToday, total: challenge.words.length })}</Text>
              </View>
              <Ionicons name="chevron-forward-circle" size={26} color={colors.forest} />
            </Pressable>

            {/* 2x2 Grid */}
            <View style={styles.grid}>
              {GRID_ITEMS.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => goToTab(item.tab)}
                  style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }]}
                >
                  <View style={styles.gridIconCircle}>
                    <Ionicons name={item.icon} size={22} color={colors.forest} />
                  </View>
                  <Text style={styles.gridTitle}>{item.title}</Text>
                  <Text style={styles.gridSubtitle}>{item.subtitle}</Text>
                  <View style={styles.gridChevronWrap}>
                    <Ionicons name="chevron-forward" size={14} color={colors.forest} />
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Progress Card */}
            <Pressable
              onPress={() => navigation.navigate("Profile")}
              style={({ pressed }) => [styles.progressCard, pressed && { opacity: 0.94 }]}
            >
              <View style={styles.progressHeaderRow}>
                <View style={styles.progressIconCircle}>
                  <Ionicons name="star" size={18} color={colors.forest} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progressCardTitle}>{t("home.progressTitle")}</Text>
                  <Text style={styles.progressCardSubtitle}>{t("home.progressSubtitle")}</Text>
                </View>
                <Ionicons name="chevron-forward-circle" size={26} color={colors.forest} />
              </View>

              <View style={styles.statsRow}>
                <StatCol icon="trending-up" value={Math.max(0, (state.unlockedLevel[state.language] || 1) - 1)} label={t("home.stats.levels")} />
                <StatCol icon="book" value={wordsFound} label={t("home.stats.words")} />
                <StatCol icon="trophy" value={levelsPlayed} label={t("home.stats.puzzles")} />
                <StatCol icon="time" value={`${learnedHours}h ${learnedMinsRemainder}m`} label={t("home.stats.learning")} small />
              </View>
            </Pressable>
          </Animated.View>
        </ScrollView>

        {/* ============================================================ */}
        {/* ANIMATED LEFT SLIDE-IN LANGUAGE SIDEBAR */}
        {/* ============================================================ */}
        {sidebarVisible && (
          <Modal
            transparent
            visible={sidebarVisible}
            animationType="none"
            onRequestClose={closeSidebar}
          >
            <View style={styles.sidebarBackdrop}>
              <Pressable style={styles.sidebarBackdropTouch} onPress={closeSidebar} />

              <Animated.View
                style={[
                  styles.sidebarDrawer,
                  {
                    transform: [{ translateX: sidebarAnim }],
                  },
                ]}
              >
                <SafeAreaView style={{ flex: 1 }}>
                  {/* Sidebar Header */}
                  <View style={styles.sidebarHeader}>
                    <View style={styles.sidebarHeaderTitleWrap}>
                      <Ionicons name="globe" size={20} color={colors.goldLight} style={{ marginRight: 8 }} />
                      <View>
                        <Text style={styles.sidebarHeaderTitle}>Choose Language</Text>
                        <Text style={styles.sidebarHeaderSub}>اپنی زبان منتخب کریں</Text>
                      </View>
                    </View>
                    <Pressable onPress={closeSidebar} hitSlop={10} style={styles.closeSidebarBtn}>
                      <Ionicons name="close" size={20} color={colors.cream} />
                    </Pressable>
                  </View>

                  {/* Active Selected Lang Indicator */}
                  <View style={styles.activeLangPillWrap}>
                    <Text style={styles.activeLangLabel}>Currently Playing In:</Text>
                    <View style={styles.activeLangPill}>
                      <Text style={styles.activeLangPillFlag}>{LANG_DETAILS[state.language]?.flag || "🌐"}</Text>
                      <Text style={styles.activeLangPillText}>
                        {LANG_DETAILS[state.language]?.native || currentLangObj.name}
                      </Text>
                    </View>
                  </View>

                  {/* Search Input Filter */}
                  <View style={styles.sidebarSearchWrap}>
                    <Ionicons name="search" size={16} color={colors.gold} style={{ marginRight: 6 }} />
                    <TextInput
                      style={styles.sidebarSearchInput}
                      placeholder="Search Urdu, Hindi, English..."
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={langSearch}
                      onChangeText={setLangSearch}
                      autoCapitalize="none"
                    />
                    {!!langSearch && (
                      <Pressable onPress={() => setLangSearch("")} hitSlop={6}>
                        <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.7)" />
                      </Pressable>
                    )}
                  </View>

                  {/* Language List */}
                  <ScrollView
                    style={styles.sidebarScroll}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {/* Featured: Urdu, Hindi, English & Indian Regional */}
                    {filteredSubcontinentLangs.length > 0 && (
                      <View style={styles.sidebarSection}>
                        <View style={styles.sidebarSectionTitleRow}>
                          <Ionicons name="star" size={13} color={colors.gold} style={{ marginRight: 4 }} />
                          <Text style={styles.sidebarSectionTitle}>URDU, HINDI, ENGLISH & REGIONAL</Text>
                        </View>
                        {filteredSubcontinentLangs.map((lang) => renderSidebarLangItem(lang, true))}
                      </View>
                    )}

                    {/* All Other Languages */}
                    {filteredOtherLangs.length > 0 && (
                      <View style={[styles.sidebarSection, { marginTop: 14 }]}>
                        <View style={styles.sidebarSectionTitleRow}>
                          <Ionicons name="earth" size={13} color={colors.goldLight} style={{ marginRight: 4 }} />
                          <Text style={styles.sidebarSectionTitle}>GLOBAL LANGUAGES</Text>
                        </View>
                        {filteredOtherLangs.map((lang) => renderSidebarLangItem(lang, false))}
                      </View>
                    )}

                    {/* Extra Quick Links */}
                    <View style={styles.sidebarExtraLinks}>
                      <Text style={styles.sidebarSectionTitle}>QUICK SETTINGS</Text>
                      <View style={styles.sidebarSettingRow}>
                        <Ionicons name="volume-high-outline" size={16} color={colors.goldLight} style={{ marginRight: 8 }} />
                        <Text style={styles.sidebarSettingLabel}>Sound</Text>
                        <Switch
                          value={state.settings?.soundEffects ?? true}
                          onValueChange={(val) => updateSetting("soundEffects", val)}
                          trackColor={{ false: "rgba(255,255,255,0.2)", true: colors.gold }}
                          thumbColor={colors.white}
                        />
                      </View>
                      <View style={styles.sidebarSettingRow}>
                        <Ionicons name="musical-notes-outline" size={16} color={colors.goldLight} style={{ marginRight: 8 }} />
                        <Text style={styles.sidebarSettingLabel}>Music</Text>
                        <Switch
                          value={state.settings?.music ?? true}
                          onValueChange={(val) => updateSetting("music", val)}
                          trackColor={{ false: "rgba(255,255,255,0.2)", true: colors.gold }}
                          thumbColor={colors.white}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </SafeAreaView>
              </Animated.View>
            </View>
          </Modal>
        )}

        {/* Daily Reward Celebration Modal */}
        <LuxuryModal
          visible={rewardClaimModalVisible}
          onClose={() => setRewardClaimModalVisible(false)}
          title="Daily Reward Claimed!"
          message={`Awesome! You claimed Day ${currentStreakDay} rewards: +${claimedRewardData?.coins || 0} Coins, +${claimedRewardData?.diamonds || 0} Diamonds${claimedRewardData?.hints ? ` and +${claimedRewardData.hints} Hints` : ""}!`}
          icon="gift"
          iconColor={colors.gold}
          buttons={[
            {
              text: "Collect & Continue",
              style: "default",
              onPress: () => setRewardClaimModalVisible(false),
            },
          ]}
        />

        {/* Luxury Logout Confirmation Modal */}
        <LuxuryModal
          visible={logoutDialogVisible}
          onClose={() => setLogoutDialogVisible(false)}
          title={t("profile.logOutConfirmTitle") || "Log Out"}
          message={
            t("profile.logOutConfirmMsg") ||
            "Are you sure you want to log out? Your cloud and local progress are safely preserved."
          }
          icon="log-out-outline"
          iconColor="#FF6B6B"
          buttons={[
            {
              text: t("game.cancel") || "Cancel",
              style: "cancel",
              onPress: () => setLogoutDialogVisible(false),
            },
            {
              text: t("profile.logOut") || "Log Out",
              style: "destructive",
              onPress: async () => {
                setLogoutDialogVisible(false);
                closeSidebar();
                if (backendConfigured) await logout();
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
              },
            },
          ]}
        />
      </SafeAreaView>
    </ScreenBG>
  );
}

function StatCol({ icon, value, label, small }) {
  return (
    <View style={styles.statCol}>
      <Ionicons name={icon} size={16} color={colors.forest} />
      <Text style={[styles.statValue, small && { fontSize: 13 }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.forestMint },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 115 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(10, 41, 26, 0.85)",
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    ...glowShadow,
  },
  currencyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightGroup: { alignItems: "flex-end" },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
    ...shadow,
  },
  avatarDot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3FD16B",
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
    ...shadow,
  },
  streakText: { color: colors.forestDark, fontWeight: "800", fontSize: 11, marginLeft: 4 },
  brand: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.forestDark,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  brandPill: {
    alignSelf: "center",
    backgroundColor: colors.forest,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 3,
    marginTop: 4,
    marginBottom: 14,
  },
  brandPillText: { color: colors.white, fontWeight: "800", fontSize: 11, letterSpacing: 1.5 },
  greeting: { fontSize: 20, fontWeight: "900", color: colors.forestDark },
  subGreeting: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: 14 },

  /* Daily Reward Card */
  dailyRewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...glowShadow,
  },
  dailyRewardCardClaimed: {
    backgroundColor: "rgba(240, 248, 244, 0.9)",
    borderColor: "rgba(30, 107, 69, 0.3)",
    elevation: 2,
  },
  dailyRewardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  dailyRewardCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.forestDark,
  },
  dailyRewardCardSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  claimNowBtn: {
    backgroundColor: colors.forest,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  claimNowBtnText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 12,
  },
  claimedTickPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 230, 118, 0.15)",
    borderRadius: radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  claimedTickText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#00C853",
  },

  /* Today's Challenge */
  challengeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    marginBottom: 14,
    ...shadow,
  },
  challengeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.forestMint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  challengeTitle: { fontSize: 14, fontWeight: "800", color: colors.forestDark },
  challengeSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 2, marginBottom: 8 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(15,58,38,0.12)",
    overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: colors.forest, borderRadius: 3 },
  progressLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4, fontWeight: "700" },

  /* 2x2 Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  gridCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    position: "relative",
    ...shadow,
  },
  gridIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.forestMint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  gridTitle: { fontSize: 14, fontWeight: "800", color: colors.forestDark },
  gridSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  gridChevronWrap: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.forestMint,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    ...shadow,
  },
  progressHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  progressIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.forestMint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  progressCardTitle: { fontSize: 15, fontWeight: "800", color: colors.forestDark },
  progressCardSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statCol: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 15, fontWeight: "900", color: colors.forestDark, marginTop: 4 },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2, fontWeight: "700" },

  /* ============================================================ */
  /* SIDEBAR STYLES */
  /* ============================================================ */
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: "rgba(5, 20, 14, 0.75)",
    flexDirection: "row",
  },
  sidebarBackdropTouch: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sidebarDrawer: {
    width: "84%",
    maxWidth: 340,
    height: "100%",
    backgroundColor: "#0D2C1E",
    borderRightWidth: 1.5,
    borderRightColor: colors.cardBorderGold,
    paddingHorizontal: 16,
    paddingTop: 10,
    ...shadow,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  sidebarHeaderTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  sidebarHeaderTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
  sidebarHeaderSub: {
    color: colors.goldLight,
    fontSize: 11,
    fontWeight: "700",
  },
  closeSidebarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeLangPillWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(10, 41, 26, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.md,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.3)",
  },
  activeLangLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "600",
  },
  activeLangPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  activeLangPillFlag: {
    fontSize: 14,
    marginRight: 4,
  },
  activeLangPillText: {
    color: colors.goldLight,
    fontSize: 12,
    fontWeight: "800",
  },
  sidebarSearchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.3)",
  },
  sidebarSearchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  sidebarScroll: {
    flex: 1,
  },
  sidebarSection: {
    marginTop: 4,
  },
  sidebarSectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  sidebarSectionTitle: {
    color: colors.goldLight,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  sidebarLangCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: radii.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sidebarLangCardSelected: {
    backgroundColor: "rgba(30, 107, 69, 0.85)",
    borderColor: colors.gold,
    borderWidth: 1.5,
    ...glowShadow,
  },
  sidebarFlag: {
    fontSize: 20,
  },
  sidebarLangNative: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.white,
  },
  sidebarLangNativeSelected: {
    color: colors.goldLight,
  },
  subcontinentTinyTag: {
    backgroundColor: "rgba(245, 196, 81, 0.25)",
    borderRadius: radii.pill,
    paddingHorizontal: 4,
    marginLeft: 6,
  },
  subcontinentTinyTagText: {
    color: colors.goldLight,
    fontSize: 9,
    fontWeight: "900",
  },
  sidebarLangSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    marginTop: 1,
  },
  sidebarLangSubSelected: {
    color: colors.cream,
  },
  sidebarRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarRadioSelected: {
    backgroundColor: colors.forest,
    borderColor: colors.gold,
  },
  sidebarExtraLinks: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  sidebarSettingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: radii.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  sidebarSettingLabel: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
});
