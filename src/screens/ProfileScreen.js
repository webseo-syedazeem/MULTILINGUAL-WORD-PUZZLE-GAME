import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, SettingsRow } from "../components/Bits";
import { colors, radii, shadow, glowShadow } from "../theme";
import { LANGUAGES } from "../data/puzzles";
import { useGame } from "../context/GameContext";

const BG_IMAGE = require("../../assets/images/clean_nature_bg.jpg");

export default function ProfileScreen({ navigation }) {
  const { state, updateSetting } = useGame();
  const currentLang = LANGUAGES.find((l) => l.code === state.language)?.name || "English";
  const unlocked = state.unlockedLevel[state.language] || 1;

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature is active. Name: Explorer");
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
      },
    ]);
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Profile & Settings</Text>
            <Text style={styles.headerSubtitle}>
              Your journey. Your words. A bigger world.
            </Text>
          </View>

          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <Pressable
              onPress={handleEditProfile}
              style={styles.editPencilBtn}
              hitSlop={8}
            >
              <Ionicons name="pencil" size={16} color={colors.forestDark} />
            </Pressable>

            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={44} color={colors.white} />
            </View>

            <Text style={styles.userName}>Explorer</Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>Word Learner</Text>
            </View>

            <View style={styles.statsDivider} />

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Ionicons name="star" size={18} color={colors.gold} />
                <Text style={styles.statNumber}>{Math.max(unlocked, 12)}</Text>
                <Text style={styles.statLabel}>Levels</Text>
              </View>

              <View style={styles.statSep} />

              <View style={styles.statCol}>
                <Ionicons name="trophy" size={18} color={colors.gold} />
                <Text style={styles.statNumber}>{unlocked * 3}</Text>
                <Text style={styles.statLabel}>Words</Text>
              </View>

              <View style={styles.statSep} />

              <View style={styles.statCol}>
                <Ionicons name="globe" size={18} color={colors.gold} />
                <Text style={styles.statNumber}>6</Text>
                <Text style={styles.statLabel}>Languages</Text>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsCard}>
            <SettingsRow
              icon="volume-high"
              label="Sound Effects"
              value={state.settings.soundEffects}
              onValueChange={(val) => updateSetting("soundEffects", val)}
            />
            <SettingsRow
              icon="musical-notes"
              label="Music"
              value={state.settings.music}
              onValueChange={(val) => updateSetting("music", val)}
            />
            <SettingsRow
              icon="phone-portrait"
              label="Vibration"
              value={state.settings.vibration}
              onValueChange={(val) => updateSetting("vibration", val)}
            />
            <SettingsRow
              icon="globe-outline"
              label="Language"
              rightText={currentLang}
              onPress={() => navigation.navigate("LanguageSelectFromHome")}
            />
            <SettingsRow
              icon="notifications"
              label="Notifications"
              value={state.settings.notifications}
              onValueChange={(val) => updateSetting("notifications", val)}
            />
            <SettingsRow
              icon="help-circle"
              label="Help & Support"
              onPress={() =>
                Alert.alert(
                  "Help & Support",
                  "Need help? Contact support@wordconnect.app for assistance."
                )
              }
            />
            <SettingsRow
              icon="shield-checkmark"
              label="Privacy Policy"
              onPress={() =>
                Alert.alert(
                  "Privacy Policy",
                  "All game progress and preferences are safely stored on your device."
                )
              }
            />
            <SettingsRow
              icon="information-circle"
              label="About"
              rightText="v1.0.0"
              isLast
              onPress={() =>
                Alert.alert("Word Connect Multilingual", "Version 1.0.0\nA multilingual word puzzle adventure.")
              }
            />
          </View>

          {/* Log Out Button */}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutBtn,
              pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </Pressable>
        </ScrollView>
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
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  headerTitleWrap: {
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.72)",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  profileCard: {
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: radii.xl,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    position: "relative",
    marginBottom: 16,
    ...shadow,
  },
  editPencilBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.forest,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...shadow,
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.white,
  },
  userBadge: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    marginTop: 4,
  },
  userBadgeText: {
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 12,
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
  settingsCard: {
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: radii.xl,
    paddingVertical: 6,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    marginBottom: 16,
    ...shadow,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
    borderRadius: radii.pill,
    paddingVertical: 15,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  logoutBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});

