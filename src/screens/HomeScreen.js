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
    authUser,
    logout,
    backendConfigured,
  } = useGame();
  const { t } = useT();

  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const challenge = useMemo(() => getDailyChallenge(state.language), [state.language]);
  const claimedToday = state.dailyChallenge.lastCompletedDate === todayKey();
  const foundToday = claimedToday ? challenge.words.length : (state.dailyChallenge.foundToday || []).length;
  const { levelsPlayed, wordsFound } = totalStats();
  const learnedMinutes = levelsPlayed * 2 + Object.keys(state.levelStars[state.language] || {}).length;
  const learnedHours = Math.floor(learnedMinutes / 60);
  const learnedMinsRemainder = learnedMinutes % 60;

  const currentLangObj = useMemo(
    () => LANGUAGES.find((l) => l.code === state.language) || LANGUAGES[0],
    [state.language]
  );

  const GRID_ITEMS = [
    { key: "daily", icon: "book", title: t("home.grid.dailyTitle"), subtitle: t("home.grid.dailySub"), tab: "Daily" },
    { key: "play", icon: "game-controller", title: t("home.grid.playTitle"), subtitle: t("home.grid.playSub"), tab: "Worlds" },
    { key: "leaderboard", icon: "trophy", title: "Leaderboard", subtitle: "Global Top Ranks", tab: "Leaderboard" },
    { key: "languages", icon: "globe", title: t("home.grid.langTitle"), subtitle: t("home.grid.langSub"), tab: "LanguageSelectFromHome" },
  ];

  const goToTab = (tabName) => {
    if (tabName === "Leaderboard") {
      navigation.navigate("Leaderboard");
    } else if (tabName) {
      navigation.navigate(tabName);
    }
  };

  const handleLogout = () => {
    setLogoutDialogVisible(true);
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
              {/* Professional Frosted-Gold Hamburger Menu Button */}
              <Pressable
                style={styles.menuBtn}
                hitSlop={12}
                onPress={() => setMenuModalVisible(true)}
              >
                <Ionicons name="menu" size={24} color={colors.goldLight} />
              </Pressable>

              {/* Cloud Sync Status Indicator */}
              <View style={styles.cloudBadge}>
                <View style={[styles.cloudDot, isCloudConnected ? styles.cloudDotLive : styles.cloudDotOffline]} />
                <Text style={styles.cloudText}>
                  {isCloudConnected ? "Cloud Synced" : "Local Play"}
                </Text>
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
        {/* QUICK ACTION DRAWER / MODAL */}
        {/* ============================================================ */}
        <Modal
          visible={menuModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.menuSheet}>
              {/* Header */}
              <View style={styles.menuHeader}>
                <View style={styles.menuHeaderTitleWrap}>
                  <Ionicons name="compass" size={22} color={colors.goldLight} style={{ marginRight: 8 }} />
                  <Text style={styles.menuHeaderTitle}>Quick Menu</Text>
                </View>
                <Pressable
                  hitSlop={10}
                  onPress={() => setMenuModalVisible(false)}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close" size={20} color={colors.cream} />
                </Pressable>
              </View>

              {/* Player Profile Summary */}
              <View style={styles.menuUserCard}>
                <View style={styles.menuAvatarCircle}>
                  <Ionicons
                    name={AVATAR_ICONS[state.avatar] || "person"}
                    size={22}
                    color={colors.white}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.menuUserName}>{state.displayName || "Explorer"}</Text>
                  <Text style={styles.menuUserSub}>
                    Level {state.unlockedLevel[state.language] || 1} • {currentLangObj.name}
                  </Text>
                </View>
                <View style={styles.menuCoinPill}>
                  <Ionicons name="disc" size={14} color={colors.gold} style={{ marginRight: 4 }} />
                  <Text style={styles.menuCoinText}>{state.coins}</Text>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
                {/* Navigation Links */}
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>NAVIGATION</Text>

                  {/* Language */}
                  <Pressable
                    style={styles.menuRow}
                    onPress={() => {
                      setMenuModalVisible(false);
                      navigation.navigate("LanguageSelectFromHome");
                    }}
                  >
                    <View style={styles.menuRowIconWrap}>
                      <Ionicons name="globe-outline" size={18} color={colors.goldLight} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuRowLabel}>Language</Text>
                      <Text style={styles.menuRowSub}>{currentLangObj.name}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                  </Pressable>

                  {/* Leaderboard */}
                  <Pressable
                    style={styles.menuRow}
                    onPress={() => {
                      setMenuModalVisible(false);
                      navigation.navigate("Leaderboard");
                    }}
                  >
                    <View style={styles.menuRowIconWrap}>
                      <Ionicons name="trophy-outline" size={18} color={colors.goldLight} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuRowLabel}>Global Leaderboard</Text>
                      <Text style={styles.menuRowSub}>See top ranks worldwide</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                  </Pressable>

                  {/* World Map */}
                  <Pressable
                    style={styles.menuRow}
                    onPress={() => {
                      setMenuModalVisible(false);
                      navigation.navigate("WorldMap");
                    }}
                  >
                    <View style={styles.menuRowIconWrap}>
                      <Ionicons name="map-outline" size={18} color={colors.goldLight} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuRowLabel}>World Map</Text>
                      <Text style={styles.menuRowSub}>6 Alpine Realms & 300 Levels</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                  </Pressable>

                  {/* Profile & Customization */}
                  <Pressable
                    style={styles.menuRow}
                    onPress={() => {
                      setMenuModalVisible(false);
                      navigation.navigate("Profile");
                    }}
                  >
                    <View style={styles.menuRowIconWrap}>
                      <Ionicons name="person-outline" size={18} color={colors.goldLight} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuRowLabel}>Profile & Customization</Text>
                      <Text style={styles.menuRowSub}>Edit avatar, badges & stats</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                  </Pressable>
                </View>

                {/* Audio & Settings Section */}
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>AUDIO SETTINGS</Text>

                  <View style={styles.menuRow}>
                    <View style={styles.menuRowIconWrap}>
                      <Ionicons
                        name={state.settings?.soundEffects ? "volume-high-outline" : "volume-mute-outline"}
                        size={18}
                        color={colors.goldLight}
                      />
                    </View>
                    <Text style={[styles.menuRowLabel, { flex: 1 }]}>Sound Effects</Text>
                    <Switch
                      value={state.settings?.soundEffects ?? true}
                      onValueChange={(val) => updateSetting("soundEffects", val)}
                      trackColor={{ false: "rgba(255,255,255,0.2)", true: colors.gold }}
                      thumbColor={colors.white}
                    />
                  </View>

                  <View style={styles.menuRow}>
                    <View style={styles.menuRowIconWrap}>
                      <Ionicons
                        name={state.settings?.music ? "musical-notes-outline" : "musical-note-outline"}
                        size={18}
                        color={colors.goldLight}
                      />
                    </View>
                    <Text style={[styles.menuRowLabel, { flex: 1 }]}>Ambient Music</Text>
                    <Switch
                      value={state.settings?.music ?? true}
                      onValueChange={(val) => updateSetting("music", val)}
                      trackColor={{ false: "rgba(255,255,255,0.2)", true: colors.gold }}
                      thumbColor={colors.white}
                    />
                  </View>
                </View>

                {/* Guide & Rules */}
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>HELP & ABOUT</Text>

                  <Pressable
                    style={styles.menuRow}
                    onPress={() => {
                      setMenuModalVisible(false);
                      setGuideModalVisible(true);
                    }}
                  >
                    <View style={styles.menuRowIconWrap}>
                      <Ionicons name="help-circle-outline" size={18} color={colors.goldLight} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuRowLabel}>How to Play</Text>
                      <Text style={styles.menuRowSub}>Rules, hints & bonus words</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                  </Pressable>

                  {/* Auth Actions */}
                  {authUser ? (
                    <Pressable style={styles.menuRow} onPress={handleLogout}>
                      <View style={[styles.menuRowIconWrap, { backgroundColor: "rgba(235, 87, 87, 0.2)" }]}>
                        <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.menuRowLabel, { color: "#FF6B6B" }]}>Log Out</Text>
                        <Text style={styles.menuRowSub}>Signed in as {authUser.email || authUser.displayName}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.menuRow}
                      onPress={() => {
                        setMenuModalVisible(false);
                        navigation.navigate("Login");
                      }}
                    >
                      <View style={styles.menuRowIconWrap}>
                        <Ionicons name="cloud-upload-outline" size={18} color={colors.goldLight} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.menuRowLabel}>Sign In / Sync Account</Text>
                        <Text style={styles.menuRowSub}>Backup progress to cloud</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
                    </Pressable>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ============================================================ */}
        {/* HOW TO PLAY GUIDE MODAL */}
        {/* ============================================================ */}
        <Modal
          visible={guideModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setGuideModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.guideModalCard}>
              <View style={styles.guideHeader}>
                <Ionicons name="sparkles" size={24} color={colors.goldLight} style={{ marginRight: 8 }} />
                <Text style={styles.guideHeaderTitle}>How to Play Word Connect</Text>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.guideStepNum}>
                  <Text style={styles.guideStepNumText}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guideStepTitle}>Trace Letters</Text>
                  <Text style={styles.guideStepDesc}>
                    Swipe smoothly across letters on the wheel to spell words. Letters highlight in gold as you drag!
                  </Text>
                </View>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.guideStepNum}>
                  <Text style={styles.guideStepNumText}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guideStepTitle}>Fill the Crossword Grid</Text>
                  <Text style={styles.guideStepDesc}>
                    Valid puzzle words snap into the crossword slots. Extra valid words earn bonus gold coins!
                  </Text>
                </View>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.guideStepNum}>
                  <Text style={styles.guideStepNumText}>3</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guideStepTitle}>Use Free Shuffles & Hints</Text>
                  <Text style={styles.guideStepDesc}>
                    Shuffle letters to gain a fresh perspective, or use Letter Hints and Magic Wands when stuck.
                  </Text>
                </View>
              </View>

              <PrimaryButton
                title="Got It! Let's Play"
                onPress={() => setGuideModalVisible(false)}
                style={{ marginTop: 12 }}
              />
            </View>
          </View>
        </Modal>

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
                setMenuModalVisible(false);
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
  scrollContent: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 115 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    ...glowShadow,
  },
  cloudBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.cardBorderGold,
  },
  cloudDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  cloudDotLive: {
    backgroundColor: "#2ECC71",
  },
  cloudDotOffline: {
    backgroundColor: "#F39C12",
  },
  cloudText: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: "700",
  },
  rightGroup: { alignItems: "flex-end" },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#3FD16B",
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
    ...shadow,
  },
  streakText: { color: colors.forestDark, fontWeight: "800", fontSize: 11, marginLeft: 4 },
  brand: {
    fontSize: 30,
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
    marginBottom: 16,
  },
  brandPillText: { color: colors.white, fontWeight: "800", fontSize: 11, letterSpacing: 1.5 },
  greeting: { fontSize: 20, fontWeight: "900", color: colors.forestDark },
  subGreeting: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: 16 },
  challengeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    marginBottom: 16,
    ...shadow,
  },
  challengeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.forestMint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  challengeTitle: { fontSize: 15, fontWeight: "800", color: colors.forestDark },
  challengeSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: 8 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(15,58,38,0.12)",
    overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: colors.forest, borderRadius: 3 },
  progressLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    position: "relative",
    ...shadow,
  },
  gridIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.forestMint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  gridTitle: { fontSize: 14, fontWeight: "800", color: colors.forestDark },
  gridSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  gridChevronWrap: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.forestMint,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    ...shadow,
  },
  progressHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  progressIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.forestMint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  progressCardTitle: { fontSize: 15, fontWeight: "800", color: colors.forestDark },
  progressCardSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statCol: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 16, fontWeight: "900", color: colors.forestDark, marginTop: 4 },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2, fontWeight: "700" },

  /* Modal Sheets */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5, 20, 14, 0.76)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  menuSheet: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#0D2C1E",
    borderRadius: radii.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  menuHeaderTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuHeaderTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuUserCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.9)",
    borderRadius: radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(246, 211, 101, 0.3)",
    marginBottom: 16,
  },
  menuAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.goldLight,
  },
  menuUserName: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 15,
  },
  menuUserSub: {
    color: colors.goldLight,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  menuCoinPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.cardBorderGold,
  },
  menuCoinText: {
    color: colors.goldLight,
    fontWeight: "900",
    fontSize: 13,
  },
  menuSection: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    color: colors.goldLight,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  menuRowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(246, 211, 101, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  menuRowLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  menuRowSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 1,
  },

  /* Guide Modal */
  guideModalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#0D2C1E",
    borderRadius: radii.xl,
    padding: 22,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  guideHeaderTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
  guideStepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  guideStepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  guideStepNumText: {
    color: colors.forestDark,
    fontSize: 14,
    fontWeight: "900",
  },
  guideStepTitle: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 2,
  },
  guideStepDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 17,
  },
});
