import React from "react";
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
import { colors, radii, shadow } from "../theme";
import { useGame } from "../context/GameContext";

const BG_IMAGE = require("../../assets/images/clean_nature_bg.jpg");

export default function HomeScreen({ navigation }) {
  const { state } = useGame();
  const unlocked = state.unlockedLevel[state.language] || 1;

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={styles.menuBtn}
            hitSlop={8}
          >
            <Ionicons name="menu" size={22} color={colors.forestDark} />
          </Pressable>

          {/* Center Brand Crest */}
          <View style={styles.brandCrest}>
            <Ionicons name="leaf" size={13} color={colors.gold} style={{ marginRight: 5 }} />
            <View>
              <Text style={styles.brandCrestTitle}>WORD CONNECT</Text>
              <Text style={styles.brandCrestSubtitle}>MULTILINGUAL</Text>
            </View>
          </View>

          {/* Right Streak & Profile Group */}
          <View style={styles.topRightGroup}>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={16} color="#FF7A00" />
              <View style={{ marginLeft: 4 }}>
                <Text style={styles.streakCount}>12</Text>
                <Text style={styles.streakLabel}>Streak</Text>
              </View>
            </View>

            <Pressable
              onPress={() => navigation.navigate("Profile")}
              style={styles.avatarWrap}
              hitSlop={8}
            >
              <View style={styles.avatarInner}>
                <Ionicons name="person" size={16} color={colors.white} />
              </View>
              <View style={styles.onlineDot} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingTitle}>Hello, Explorer!</Text>
            <Text style={styles.greetingSubtitle}>
              Let's learn something new today.
            </Text>
          </View>

          {/* Hero Banner: Today's Challenge */}
          <Pressable
            onPress={() => navigation.navigate("Daily")}
            style={({ pressed }) => [
              styles.heroCard,
              pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
            ]}
          >
            <View style={styles.heroLeftIcon}>
              <Ionicons name="leaf" size={22} color={colors.forest} />
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Today's Challenge</Text>
              <Text style={styles.heroDesc}>Find 8 hidden words in 2 minutes!</Text>
              {/* Progress bar */}
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: "45%" }]} />
                </View>
                <Text style={styles.progressCount}>0/8 words</Text>
              </View>
            </View>
            <View style={styles.heroArrowBtn}>
              <Ionicons name="chevron-forward" size={18} color={colors.white} />
            </View>
          </Pressable>

          {/* 2x2 Feature Grid */}
          <View style={styles.featureGrid}>
            {/* Card 1: Daily Challenge */}
            <Pressable
              onPress={() => navigation.navigate("Daily")}
              style={({ pressed }) => [
                styles.gridCard,
                pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.cardIconWrap}>
                <Ionicons name="book-outline" size={24} color={colors.forest} />
              </View>
              <Text style={styles.cardTitle}>Daily Challenge</Text>
              <Text style={styles.cardSubtitle}>New puzzles every day</Text>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={14} color={colors.forest} />
              </View>
            </Pressable>

            {/* Card 2: Play Now */}
            <Pressable
              onPress={() => navigation.navigate("Play")}
              style={({ pressed }) => [
                styles.gridCard,
                pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.cardIconWrap}>
                <Ionicons name="game-controller-outline" size={24} color={colors.forest} />
              </View>
              <Text style={styles.cardTitle}>Play Now</Text>
              <Text style={styles.cardSubtitle}>Choose your level</Text>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={14} color={colors.forest} />
              </View>
            </Pressable>

            {/* Card 3: Brain Training */}
            <Pressable
              onPress={() => navigation.navigate("Play")}
              style={({ pressed }) => [
                styles.gridCard,
                pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.cardIconWrap}>
                <Ionicons name="sparkles-outline" size={24} color={colors.forest} />
              </View>
              <Text style={styles.cardTitle}>Brain Training</Text>
              <Text style={styles.cardSubtitle}>Sharpen your mind</Text>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={14} color={colors.forest} />
              </View>
            </Pressable>

            {/* Card 4: Multiple Languages */}
            <Pressable
              onPress={() => navigation.navigate("LanguageSelectFromHome")}
              style={({ pressed }) => [
                styles.gridCard,
                pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.cardIconWrap}>
                <Ionicons name="globe-outline" size={24} color={colors.forest} />
              </View>
              <Text style={styles.cardTitle}>Multiple Languages</Text>
              <Text style={styles.cardSubtitle}>Explore new words</Text>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={14} color={colors.forest} />
              </View>
            </Pressable>
          </View>

          {/* Progress Card */}
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={({ pressed }) => [
              styles.progressCard,
              pressed && { opacity: 0.95 },
            ]}
          >
            <View style={styles.progressHeader}>
              <View style={styles.progressStarWrap}>
                <Ionicons name="star" size={16} color={colors.forest} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.progressHeaderTitle}>Your Progress</Text>
                <Text style={styles.progressHeaderSubtitle}>
                  Keep going. You're doing great!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="bar-chart-outline" size={18} color={colors.forest} />
                <Text style={styles.statValue}>{Math.max(unlocked, 12)}</Text>
                <Text style={styles.statLabel}>Levels</Text>
              </View>
              <View style={styles.statSeparator} />

              <View style={styles.statItem}>
                <Ionicons name="book-outline" size={18} color={colors.forest} />
                <Text style={styles.statValue}>{unlocked * 3}</Text>
                <Text style={styles.statLabel}>Words</Text>
              </View>
              <View style={styles.statSeparator} />

              <View style={styles.statItem}>
                <Ionicons name="trophy-outline" size={18} color={colors.forest} />
                <Text style={styles.statValue}>6</Text>
                <Text style={styles.statLabel}>Puzzles</Text>
              </View>
              <View style={styles.statSeparator} />

              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color={colors.forest} />
                <Text style={styles.statValue}>2h</Text>
                <Text style={styles.statLabel}>Learning</Text>
              </View>
            </View>
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
    backgroundColor: "rgba(10, 36, 23, 0.32)",
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(251, 247, 236, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  brandCrest: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
  },
  brandCrestTitle: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1.5,
  },
  brandCrestSubtitle: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 7.5,
    letterSpacing: 1.5,
  },
  topRightGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 236, 0.95)",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    marginRight: 8,
    ...shadow,
  },
  streakCount: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.forestDark,
    lineHeight: 13,
  },
  streakLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: colors.textMuted,
    lineHeight: 9,
  },
  avatarWrap: {
    position: "relative",
  },
  avatarInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forest,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#2ECC71",
    borderWidth: 2,
    borderColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  greetingSection: {
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.white,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: colors.cream,
    marginTop: 2,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 236, 0.95)",
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
    ...shadow,
  },
  heroLeftIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(30, 107, 69, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.forestDark,
  },
  heroDesc: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: "rgba(30, 107, 69, 0.15)",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.forest,
    borderRadius: 4,
  },
  progressCount: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.forestDark,
  },
  heroArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridCard: {
    width: "48%",
    backgroundColor: "rgba(251, 247, 236, 0.95)",
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.7)",
    marginBottom: 14,
    position: "relative",
    ...shadow,
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(30, 107, 69, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.forestDark,
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
    marginTop: 4,
  },
  cardArrow: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(30, 107, 69, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressCard: {
    backgroundColor: "rgba(251, 247, 236, 0.95)",
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
    ...shadow,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressStarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(30, 107, 69, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.forestDark,
  },
  progressHeaderSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  statsDivider: {
    height: 1,
    backgroundColor: "rgba(15, 58, 38, 0.1)",
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.forestDark,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    marginTop: 2,
  },
  statSeparator: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(15, 58, 38, 0.12)",
  },
});

