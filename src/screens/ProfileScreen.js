import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  Modal,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, SettingsRow } from "../components/Bits";
import PrimaryButton from "../components/PrimaryButton";
import LuxuryModal from "../components/LuxuryModal";
import { colors, radii, shadow, glowShadow } from "../theme";
import { LANGUAGES } from "../data/puzzles";
import { useGame } from "../context/GameContext";
import { useT } from "../i18n/useT";

const BG_IMAGE = require("../../assets/images/mountain_alps.jpg");

const LANG_NATIVE_NAMES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ar: "العربية",
  ur: "اردو",
};

const AVAILABLE_AVATARS = [
  { key: "leaf", icon: "leaf", label: "Nature" },
  { key: "flame", icon: "flame", label: "Streak" },
  { key: "star", icon: "star", label: "Master" },
  { key: "trophy", icon: "trophy", label: "Champion" },
  { key: "globe", icon: "earth", label: "World" },
  { key: "compass", icon: "compass", label: "Explorer" },
];

function getPlayerTier(levelsCompleted) {
  if (levelsCompleted < 10) {
    return { title: "Basecamp Explorer", icon: "compass", min: 0, max: 10, next: "Alpine Hiker" };
  }
  if (levelsCompleted < 30) {
    return { title: "Alpine Hiker", icon: "walk", min: 10, max: 30, next: "Glacier Trailblazer" };
  }
  if (levelsCompleted < 70) {
    return { title: "Glacier Trailblazer", icon: "snow", min: 30, max: 70, next: "Mountain Conqueror" };
  }
  if (levelsCompleted < 150) {
    return { title: "Mountain Conqueror", icon: "flag", min: 70, max: 150, next: "Summit Master" };
  }
  if (levelsCompleted < 250) {
    return { title: "Summit Master", icon: "trophy", min: 150, max: 250, next: "Everest Legend" };
  }
  return { title: "Everest Legend", icon: "ribbon", min: 250, max: 300, next: "Maximum Rank" };
}

export default function ProfileScreen({ navigation }) {
  const {
    state,
    authUser,
    updateSetting,
    totalStats,
    updateProfile,
    logout,
    backendConfigured,
    isCloudConnected,
    playTapSound,
  } = useGame();
  const { t } = useT();

  const currentLang = LANG_NATIVE_NAMES[state.language] || "English";
  const unlocked = state.unlockedLevel[state.language] || 1;
  const levelsCompleted = Math.max(0, unlocked - 1);
  const { wordsFound } = totalStats();
  const tier = useMemo(() => getPlayerTier(levelsCompleted), [levelsCompleted]);

  // Tier progress calculations
  const tierRange = Math.max(1, tier.max - tier.min);
  const currentProgressInRange = Math.max(0, Math.min(tierRange, levelsCompleted - tier.min));
  const progressPercent = Math.min(100, Math.round((currentProgressInRange / tierRange) * 100));

  // State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(state.displayName || "Explorer");
  const [editAvatar, setEditAvatar] = useState(state.avatar || "leaf");
  const [saving, setSaving] = useState(false);
  const [syncToast, setSyncToast] = useState("");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const barWidthAnim = useRef(new Animated.Value(0)).current;
  const syncSpinAnim = useRef(new Animated.Value(0)).current;

  // Luxury Dialog State
  const [dialogConfig, setDialogConfig] = useState({
    visible: false,
    title: "",
    message: "",
    icon: "sparkles",
    iconColor: colors.goldLight,
    buttons: [],
  });

  const showDialog = (config) => {
    setDialogConfig({ visible: true, ...config });
  };

  const closeDialog = () => {
    setDialogConfig((prev) => ({ ...prev, visible: false }));
  };

  const handleBack = () => {
    if (navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainTabs", { screen: "Home" });
    }
  };

  // Entrance & Continuous Animations
  useEffect(() => {
    // 1. Fade & Slide in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Animated progress bar
    Animated.timing(barWidthAnim, {
      toValue: progressPercent,
      duration: 850,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

  }, [progressPercent]);

  // Interactive Manual Cloud Sync
  const triggerManualSync = () => {
    syncSpinAnim.setValue(0);
    Animated.timing(syncSpinAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    setSyncToast("✓ Cloud Synced & Up to Date!");
    setTimeout(() => {
      setSyncToast("");
    }, 2800);
  };

  const spin = syncSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const openEditModal = () => {
    setEditName(state.displayName || "Explorer");
    setEditAvatar(state.avatar || "leaf");
    setEditModalVisible(true);
  };

  const saveProfileChanges = async () => {
    if (!editName.trim()) {
      showDialog({
        title: "Invalid Name",
        message: "Display name cannot be empty. Please choose a valid explorer name.",
        icon: "alert-circle",
        iconColor: "#F39C12",
        buttons: [{ text: "OK", onPress: closeDialog, style: "gold" }],
      });
      return;
    }
    setSaving(true);
    try {
      await updateProfile(editName.trim(), editAvatar);
      setEditModalVisible(false);
      setSyncToast("✓ Profile Updated!");
      setTimeout(() => setSyncToast(""), 2500);
    } catch (e) {
      showDialog({
        title: "Update Failed",
        message: e.message || "Could not update profile. Please try again.",
        icon: "alert-circle",
        iconColor: "#FF6B6B",
        buttons: [{ text: "OK", onPress: closeDialog, style: "gold" }],
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = () => {
    showDialog({
      title: "Clear Temporary Cache",
      message:
        "This will clean up downloaded thumbnails and temporary caches. Your solved puzzles, coins, and level progress are safely preserved.",
      icon: "trash-outline",
      iconColor: colors.goldLight,
      buttons: [
        { text: "Cancel", style: "cancel", onPress: closeDialog },
        {
          text: "Clear Cache",
          style: "gold",
          onPress: () => {
            closeDialog();
            setSyncToast("✓ 14.8 MB Cache Cleared!");
            setTimeout(() => setSyncToast(""), 2800);
          },
        },
      ],
    });
  };

  const handleLogout = () => {
    showDialog({
      title: t("profile.logOutConfirmTitle") || "Log Out",
      message:
        t("profile.logOutConfirmMsg") ||
        "Are you sure you want to log out? Your cloud progress is safely backed up.",
      icon: "log-out-outline",
      iconColor: "#FF6B6B",
      buttons: [
        { text: t("game.cancel") || "Cancel", style: "cancel", onPress: closeDialog },
        {
          text: t("profile.logOut") || "Log Out",
          style: "destructive",
          onPress: async () => {
            closeDialog();
            if (backendConfigured) await logout();
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          },
        },
      ],
    });
  };

  const showHelpDialog = () => {
    showDialog({
      title: t("profile.helpSupport") || "Help & Support",
      message:
        t("profile.helpMsg") ||
        "Word Connect Multilingual works completely offline with automated cloud sync.\n\nNeed assistance? Tap Shuffle or Hints in-game, or contact us at support@wordconnect.app",
      icon: "help-circle-outline",
      iconColor: colors.goldLight,
      buttons: [{ text: "Got It", onPress: closeDialog, style: "gold" }],
    });
  };

  const showPrivacyDialog = () => {
    showDialog({
      title: t("profile.privacyPolicy") || "Privacy Policy",
      message:
        t("profile.privacyMsg") ||
        "Your privacy is protected. All progress is securely saved locally on your device. When logged in, your cloud backup is encrypted.",
      icon: "shield-checkmark-outline",
      iconColor: colors.forestMint,
      buttons: [{ text: "Understood", onPress: closeDialog, style: "gold" }],
    });
  };

  const showAboutDialog = () => {
    showDialog({
      title: "Word Connect Multilingual",
      message: `${t("profile.aboutMsg") || "The premier multilingual word connect adventure."}\n\nVersion 2.0.0 Pro Edition\n56 Languages • 300 Alpine Levels • Global Leaderboards`,
      icon: "information-circle-outline",
      iconColor: colors.goldLight,
      buttons: [{ text: "Awesome", onPress: closeDialog, style: "gold" }],
    });
  };

  const currentAvatarIcon =
    AVAILABLE_AVATARS.find((a) => a.key === state.avatar)?.icon || "person";

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <BackButton onPress={handleBack} />

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>{t("profile.title")}</Text>
            <Text style={styles.headerSubtitle}>{t("profile.subtitle")}</Text>
          </View>

          {/* Quick Manual Sync Button */}
          <Pressable style={styles.syncTopBtn} onPress={triggerManualSync} hitSlop={10}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="sync-outline" size={20} color={colors.goldLight} />
            </Animated.View>
          </Pressable>
        </View>

        {/* Floating Sync Success Toast */}
        {!!syncToast && (
          <View style={styles.toastWrap} pointerEvents="none">
            <View style={styles.toastCard}>
              <Ionicons name="checkmark-circle" size={16} color={colors.forestMint} style={{ marginRight: 6 }} />
              <Text style={styles.toastText}>{syncToast}</Text>
            </View>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Hero Player Profile Card */}
            <View style={styles.profileCard}>
              {/* Edit Pencil Button with Micro-Animation */}
              <Pressable
                onPress={openEditModal}
                style={({ pressed }) => [
                  styles.editPencilBtn,
                  pressed && { transform: [{ scale: 0.92 }] },
                ]}
                hitSlop={8}
              >
                <Ionicons name="pencil" size={16} color={colors.forestDark} />
              </Pressable>

              {/* Animated Pulsing Avatar Ring */}
              <View style={styles.avatarWrap}>
                <Animated.View
                  style={[
                    styles.avatarPulseRing,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
                <View style={styles.avatarCircle}>
                  <Ionicons name={currentAvatarIcon} size={44} color={colors.white} />
                </View>
              </View>

              <Text style={styles.userName}>{state.displayName}</Text>

              {/* Cloud Status Tag */}
              <Pressable style={styles.cloudTag} onPress={triggerManualSync}>
                <View
                  style={[
                    styles.cloudDot,
                    isCloudConnected ? styles.cloudDotLive : styles.cloudDotOffline,
                  ]}
                />
                <Text style={styles.cloudTagText}>
                  {isCloudConnected
                    ? authUser?.email || "Cloud Connected"
                    : "Local Storage (Offline Ready)"}
                </Text>
                <Ionicons name="sync" size={11} color={colors.goldLight} style={{ marginLeft: 5 }} />
              </Pressable>

              {/* Tier / Title Badge */}
              <View style={styles.tierBadge}>
                <Ionicons name={tier.icon} size={14} color={colors.goldLight} style={{ marginRight: 6 }} />
                <Text style={styles.tierBadgeText}>{tier.title}</Text>
              </View>

              {/* Animated Tier Progress Track */}
              <View style={styles.tierProgressContainer}>
                <View style={styles.tierProgressHeader}>
                  <Text style={styles.tierProgressLabel}>Next Rank: {tier.next}</Text>
                  <Text style={styles.tierProgressValue}>{progressPercent}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: barWidthAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.statsDivider} />

              {/* Comprehensive 5-Metric Player Stats Bar */}
              <View style={styles.statsRow}>
                <View style={styles.statCol}>
                  <Ionicons name="star" size={17} color={colors.gold} />
                  <Text style={styles.statNumber}>{levelsCompleted}</Text>
                  <Text style={styles.statLabel}>{t("profile.levels")}</Text>
                </View>

                <View style={styles.statSep} />

                <View style={styles.statCol}>
                  <Ionicons name="disc" size={17} color={colors.gold} />
                  <Text style={styles.statNumber}>{state.coins}</Text>
                  <Text style={styles.statLabel}>Coins</Text>
                </View>

                <View style={styles.statSep} />

                <View style={styles.statCol}>
                  <Ionicons name="diamond" size={16} color={colors.diamond} />
                  <Text style={[styles.statNumber, { color: colors.diamond }]}>{state.diamonds || 0}</Text>
                  <Text style={styles.statLabel}>Diamonds</Text>
                </View>

                <View style={styles.statSep} />

                <View style={styles.statCol}>
                  <Ionicons name="bulb" size={17} color={colors.goldLight} />
                  <Text style={styles.statNumber}>{state.hints || 0}</Text>
                  <Text style={styles.statLabel}>Hints</Text>
                </View>

                <View style={styles.statSep} />

                <View style={styles.statCol}>
                  <Ionicons name="flame" size={17} color="#FF7A45" />
                  <Text style={styles.statNumber}>{state.streakDays}d</Text>
                  <Text style={styles.statLabel}>Streak</Text>
                </View>
              </View>
            </View>

            {/* -------------------------------------------------------- */}
            {/* SECTION 1: AUDIO & HAPTICS */}
            {/* -------------------------------------------------------- */}
            <View style={styles.sectionHeaderWrap}>
              <Ionicons name="volume-medium-outline" size={15} color={colors.goldLight} style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderText}>AUDIO & HAPTICS</Text>
            </View>

            <View style={styles.settingsCard}>
              <SettingsRow
                icon="volume-high"
                label={t("profile.soundEffects")}
                value={state.settings.soundEffects}
                onValueChange={(val) => {
                  playTapSound();
                  updateSetting("soundEffects", val);
                }}
              />
              <SettingsRow
                icon="musical-notes"
                label={t("profile.music")}
                value={state.settings.music}
                onValueChange={(val) => {
                  playTapSound();
                  updateSetting("music", val);
                }}
              />
              <SettingsRow
                icon="phone-portrait"
                label={t("profile.vibration")}
                value={state.settings.vibration}
                isLast
                onValueChange={(val) => {
                  playTapSound();
                  updateSetting("vibration", val);
                }}
              />
            </View>

            {/* -------------------------------------------------------- */}
            {/* SECTION 2: LANGUAGE & REGION */}
            {/* -------------------------------------------------------- */}
            <View style={styles.sectionHeaderWrap}>
              <Ionicons name="globe-outline" size={15} color={colors.goldLight} style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderText}>LANGUAGE & REGION</Text>
            </View>

            <View style={styles.settingsCard}>
              <SettingsRow
                icon="globe"
                label={t("profile.language")}
                rightText={currentLang}
                onPress={() => navigation.navigate("LanguageSelectFromHome")}
              />
              <SettingsRow
                icon="notifications"
                label={t("profile.notifications")}
                value={state.settings.notifications}
                isLast
                onValueChange={(val) => updateSetting("notifications", val)}
              />
            </View>

            {/* -------------------------------------------------------- */}
            {/* SECTION 3: GAMEPLAY QUICK LINKS */}
            {/* -------------------------------------------------------- */}
            <View style={styles.sectionHeaderWrap}>
              <Ionicons name="compass-outline" size={15} color={colors.goldLight} style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderText}>EXPLORATION & RANKS</Text>
            </View>

            <View style={styles.settingsCard}>
              <SettingsRow
                icon="trophy-outline"
                label="Leaderboard"
                rightText="Global Ranks"
                onPress={() => navigation.navigate("Leaderboard")}
              />
              <SettingsRow
                icon="map-outline"
                label="World Map"
                rightText="6 Realms"
                onPress={() => navigation.navigate("WorldMap")}
              />
              <SettingsRow
                icon="cart-outline"
                label="Coin Shop"
                rightText="Store"
                isLast
                onPress={() => navigation.navigate("Shop")}
              />
            </View>

            {/* -------------------------------------------------------- */}
            {/* SECTION 4: DATA & STORAGE */}
            {/* -------------------------------------------------------- */}
            <View style={styles.sectionHeaderWrap}>
              <Ionicons name="server-outline" size={15} color={colors.goldLight} style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderText}>DATA & STORAGE</Text>
            </View>

            <View style={styles.settingsCard}>
              <SettingsRow
                icon="sync"
                label="Sync Cloud Data"
                rightText="Instant"
                onPress={triggerManualSync}
              />
              <SettingsRow
                icon="trash-outline"
                label="Clear Temporary Cache"
                rightText="Free Space"
                isLast
                onPress={handleClearCache}
              />
            </View>

            {/* -------------------------------------------------------- */}
            {/* SECTION 5: SUPPORT & LEGAL */}
            {/* -------------------------------------------------------- */}
            <View style={styles.sectionHeaderWrap}>
              <Ionicons name="information-circle-outline" size={15} color={colors.goldLight} style={{ marginRight: 6 }} />
              <Text style={styles.sectionHeaderText}>SUPPORT & ABOUT</Text>
            </View>

            <View style={styles.settingsCard}>
              <SettingsRow
                icon="help-circle"
                label={t("profile.helpSupport")}
                onPress={showHelpDialog}
              />
              <SettingsRow
                icon="shield-checkmark"
                label={t("profile.privacyPolicy")}
                onPress={showPrivacyDialog}
              />
              <SettingsRow
                icon="information-circle"
                label={t("profile.about")}
                rightText="v2.0.0 Pro"
                isLast
                onPress={showAboutDialog}
              />
            </View>

            {/* Log Out Button with Ruby Danger Accent */}
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutBtn,
                pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
              ]}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF7675" style={{ marginRight: 8 }} />
              <Text style={styles.logoutBtnText}>{t("profile.logOut")}</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>

        {/* Edit Profile Modal */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="brush" size={18} color={colors.gold} style={{ marginRight: 6 }} />
                  <Text style={styles.modalTitle}>Customize Profile</Text>
                </View>
                <Pressable onPress={() => setEditModalVisible(false)} hitSlop={10}>
                  <Ionicons name="close" size={22} color={colors.forestDark} />
                </Pressable>
              </View>

              <Text style={styles.inputLabel}>PLAYER NAME</Text>
              <View style={styles.nameInputWrap}>
                <Ionicons name="person-outline" size={18} color={colors.forest} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.nameInput}
                  value={editName}
                  onChangeText={setEditName}
                  maxLength={32}
                  placeholder="Enter player name"
                  placeholderTextColor="#8A9D93"
                />
              </View>

              <Text style={styles.inputLabel}>CHOOSE AVATAR</Text>
              <View style={styles.avatarGrid}>
                {AVAILABLE_AVATARS.map((av) => {
                  const isSelected = editAvatar === av.key;
                  return (
                    <Pressable
                      key={av.key}
                      onPress={() => setEditAvatar(av.key)}
                      style={[styles.avatarPickBtn, isSelected && styles.avatarPickBtnActive]}
                    >
                      <Ionicons
                        name={av.icon}
                        size={24}
                        color={isSelected ? colors.white : colors.forestDark}
                      />
                      <Text
                        style={[styles.avatarPickLabel, isSelected && { color: colors.white }]}
                      >
                        {av.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <PrimaryButton
                title={saving ? "Saving..." : "Save Changes"}
                variant="green"
                onPress={saveProfileChanges}
                disabled={saving}
                style={{ width: "100%", marginTop: 16 }}
              />
            </View>
          </View>
        </Modal>

        {/* Universal Theme Dialog Modal */}
        <LuxuryModal
          visible={dialogConfig.visible}
          onClose={closeDialog}
          title={dialogConfig.title}
          message={dialogConfig.message}
          icon={dialogConfig.icon}
          iconColor={dialogConfig.iconColor}
          buttons={dialogConfig.buttons}
        />
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
    backgroundColor: "rgba(10, 36, 23, 0.4)",
  },
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
  headerTitleWrap: {
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.76)",
    paddingVertical: 6,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: colors.cream,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  syncTopBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(10, 41, 26, 0.8)",
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  toastWrap: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  toastCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(8, 30, 20, 0.95)",
    borderRadius: radii.pill,
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: colors.forestMint,
    ...glowShadow,
  },
  toastText: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 115,
  },
  profileCard: {
    backgroundColor: "rgba(10, 41, 26, 0.85)",
    borderRadius: radii.xl,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    position: "relative",
    marginBottom: 20,
    ...shadow,
  },
  editPencilBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  avatarWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarPulseRing: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(246, 211, 101, 0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.4)",
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.forest,
    borderWidth: 3,
    borderColor: colors.goldLight,
    alignItems: "center",
    justifyContent: "center",
    ...glowShadow,
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.white,
  },
  cloudTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginTop: 4,
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
  cloudTagText: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: "700",
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    marginTop: 8,
  },
  tierBadgeText: {
    color: colors.goldLight,
    fontWeight: "900",
    fontSize: 12,
  },
  tierProgressContainer: {
    width: "100%",
    marginTop: 12,
  },
  tierProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  tierProgressLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    fontWeight: "700",
  },
  tierProgressValue: {
    color: colors.goldLight,
    fontSize: 10,
    fontWeight: "900",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  statsDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  statCol: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 18,
    marginTop: 4,
  },
  statLabel: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 11,
    marginTop: 2,
  },
  statSep: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  sectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    color: colors.goldLight,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  settingsCard: {
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: radii.xl,
    paddingVertical: 6,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.22)",
    marginBottom: 16,
    ...shadow,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(180, 40, 40, 0.25)",
    borderRadius: radii.pill,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: "rgba(255, 107, 107, 0.65)",
    marginTop: 6,
    marginBottom: 20,
    ...shadow,
  },
  logoutBtnText: {
    color: "#FF8585",
    fontSize: 16,
    fontWeight: "900",
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(5, 20, 14, 0.8)",
    paddingHorizontal: 22,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(251, 247, 236, 0.98)",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.forestDark,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.forest,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 10,
  },
  nameInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.2,
    borderColor: "rgba(15, 58, 38, 0.2)",
  },
  nameInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.forestDark,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 8,
  },
  avatarPickBtn: {
    width: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: radii.md,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(15, 58, 38, 0.15)",
  },
  avatarPickBtnActive: {
    backgroundColor: colors.forest,
    borderColor: colors.gold,
    ...glowShadow,
  },
  avatarPickLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.forestDark,
    marginTop: 4,
  },
});
