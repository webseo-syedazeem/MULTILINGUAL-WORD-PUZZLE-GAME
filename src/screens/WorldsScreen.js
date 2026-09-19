import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CoinBadge } from "../components/Bits";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";
import { useT } from "../i18n/useT";
import { WORLDS } from "../data/puzzles";
import { getBackgroundForWorld } from "../data/backgrounds";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 14;
const CARD_WIDTH = (SCREEN_WIDTH - 22 * 2 - CARD_GAP) / 2;

// Accent colors per world for visual variety
const WORLD_ACCENTS = {
  1: { bg: "rgba(30, 107, 69, 0.18)", border: colors.forest },
  2: { bg: "rgba(100, 149, 237, 0.18)", border: "#6495ED" },
  3: { bg: "rgba(245, 196, 81, 0.18)", border: colors.gold },
  4: { bg: "rgba(173, 216, 230, 0.18)", border: "#ADD8E6" },
  5: { bg: "rgba(0, 105, 148, 0.18)", border: "#006994" },
  6: { bg: "rgba(255, 140, 66, 0.18)", border: "#FF8C42" },
};

// Icons per world
const WORLD_ICONS = {
  1: "leaf",
  2: "water",
  3: "sunny",
  4: "diamond",
  5: "globe",
  6: "moon",
};

export default function WorldsScreen({ navigation }) {
  const { state } = useGame();
  const { t, isRTL } = useT();
  const unlocked = state.unlockedLevel[state.language] || 1;

  const worldStats = useMemo(() => {
    const langStars = state.levelStars[state.language] || {};
    return WORLDS.map((world) => {
      const totalLevels = world.endLevel - world.startLevel + 1;
      let completed = 0;
      let totalStars = 0;
      for (let lvl = world.startLevel; lvl <= world.endLevel; lvl++) {
        const s = langStars[lvl] || 0;
        if (s > 0) completed++;
        totalStars += s;
      }
      const isUnlocked = unlocked >= world.startLevel;
      const isCurrent =
        unlocked >= world.startLevel && unlocked <= world.endLevel;
      const isCompleted = unlocked > world.endLevel;
      return {
        ...world,
        totalLevels,
        completed,
        totalStars,
        maxStars: totalLevels * 3,
        isUnlocked,
        isCurrent,
        isCompleted,
        progress: totalLevels > 0 ? completed / totalLevels : 0,
      };
    });
  }, [state.levelStars, state.language, unlocked]);

  const onWorldPress = (world) => {
    if (!world.isUnlocked) return;
    navigation.navigate("WorldMap", { worldId: world.id });
  };

  const worldBg = getBackgroundForWorld(1);

  return (
    <ImageBackground
      source={worldBg.source}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBrand}>
            <Ionicons
              name="earth"
              size={16}
              color={colors.gold}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.headerBrandText}>{t("worlds.title")}</Text>
          </View>
          <CoinBadge
            coins={state.coins}
            onAdd={() => navigation.navigate("Shop")}
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t("worlds.title")}</Text>
          <Text style={styles.subtitle}>{t("worlds.subtitle")}</Text>
        </View>

        {/* World Cards Grid */}
        <ScrollView
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.grid, isRTL && { flexDirection: "row-reverse" }]}>
            {worldStats.map((world) => {
              const accent = WORLD_ACCENTS[world.id] || WORLD_ACCENTS[1];
              const worldIcon = WORLD_ICONS[world.id] || "leaf";
              const bg = getBackgroundForWorld(world.id);

              return (
                <Pressable
                  key={world.id}
                  onPress={() => onWorldPress(world)}
                  disabled={!world.isUnlocked}
                  style={({ pressed }) => [
                    styles.worldCard,
                    world.isCurrent && styles.worldCardCurrent,
                    !world.isUnlocked && styles.worldCardLocked,
                    pressed &&
                      world.isUnlocked && {
                        opacity: 0.92,
                        transform: [{ scale: 0.97 }],
                      },
                  ]}
                >
                  {/* Background Thumbnail */}
                  <ImageBackground
                    source={bg.source}
                    style={styles.cardBgImage}
                    resizeMode="cover"
                  >
                    <View
                      style={[
                        styles.cardBgOverlay,
                        !world.isUnlocked && styles.cardBgOverlayLocked,
                      ]}
                    />

                    {/* World Icon Badge */}
                    <View
                      style={[
                        styles.worldIconBadge,
                        { backgroundColor: accent.border },
                      ]}
                    >
                      <Ionicons name={worldIcon} size={16} color={colors.white} />
                    </View>

                    {/* Status Badge */}
                    {world.isCurrent && (
                      <View style={styles.currentBadge}>
                        <Ionicons
                          name="play"
                          size={9}
                          color={colors.forestDark}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.currentBadgeText}>
                          {t("worlds.current")}
                        </Text>
                      </View>
                    )}
                    {world.isCompleted && (
                      <View style={styles.completedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={10}
                          color={colors.white}
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.completedBadgeText}>
                          {t("worlds.completed")}
                        </Text>
                      </View>
                    )}
                    {!world.isUnlocked && (
                      <View style={styles.lockOverlay}>
                        <View style={styles.lockCircle}>
                          <Ionicons
                            name="lock-closed"
                            size={22}
                            color="rgba(255,255,255,0.85)"
                          />
                        </View>
                        <Text style={styles.lockedText}>
                          {t("worlds.locked")}
                        </Text>
                      </View>
                    )}
                  </ImageBackground>

                  {/* Card Info */}
                  <View style={styles.cardInfo}>
                    <Text
                      style={[
                        styles.worldNumber,
                        !world.isUnlocked && styles.textDimmed,
                      ]}
                    >
                      {t("worldmap.world", { n: world.id })}
                    </Text>
                    <Text
                      style={[
                        styles.worldName,
                        !world.isUnlocked && styles.textDimmed,
                      ]}
                      numberOfLines={1}
                    >
                      {t(`worldNames.${world.id}`)}
                    </Text>

                    {/* Level Range */}
                    <View style={styles.levelRangeRow}>
                      <Ionicons
                        name="layers-outline"
                        size={11}
                        color={
                          world.isUnlocked
                            ? colors.textLightMuted
                            : "rgba(255,255,255,0.35)"
                        }
                      />
                      <Text
                        style={[
                          styles.levelRangeText,
                          !world.isUnlocked && styles.textDimmed,
                        ]}
                      >
                        {t("worlds.levels")} {world.startLevel}–{world.endLevel}
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    {world.isUnlocked && (
                      <View style={styles.progressSection}>
                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${Math.min(100, world.progress * 100)}%`,
                                backgroundColor: accent.border,
                              },
                            ]}
                          />
                        </View>
                        <View style={styles.progressStats}>
                          <View style={styles.statPill}>
                            <Ionicons
                              name="star"
                              size={10}
                              color={colors.gold}
                            />
                            <Text style={styles.statPillText}>
                              {world.totalStars}
                            </Text>
                          </View>
                          <Text style={styles.progressPercent}>
                            {Math.round(world.progress * 100)}%
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Bottom Stats Banner */}
          <View style={styles.bottomBanner}>
            <View style={styles.compassWrap}>
              <Ionicons name="compass" size={22} color={colors.gold} />
            </View>
            <View style={styles.bannerDivider} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{t("worldmap.travel")}</Text>
              <Text style={styles.bannerSubtitle}>
                {t("worldmap.levelsOf", {
                  start: 1,
                  end: WORLDS[WORLDS.length - 1].endLevel,
                  total: WORLDS[WORLDS.length - 1].endLevel,
                })}
              </Text>
            </View>
          </View>
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
    backgroundColor: "rgba(10, 36, 23, 0.65)",
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
  titleSection: {
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.cream,
    textAlign: "center",
    marginTop: 6,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  gridContainer: {
    paddingHorizontal: 22,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  worldCard: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: radii.lg,
    overflow: "hidden",
    marginBottom: CARD_GAP,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    ...shadow,
  },
  worldCardCurrent: {
    borderColor: colors.gold,
    borderWidth: 2,
    ...glowShadow,
  },
  worldCardLocked: {
    opacity: 0.7,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  cardBgImage: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
  },
  cardBgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 36, 23, 0.25)",
  },
  cardBgOverlayLocked: {
    backgroundColor: "rgba(10, 36, 23, 0.6)",
  },
  worldIconBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    ...shadow,
  },
  currentBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    ...glowShadow,
  },
  currentBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    color: colors.forestDark,
    letterSpacing: 0.5,
  },
  completedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.forest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  completedBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.5,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 36, 23, 0.45)",
  },
  lockCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },
  lockedText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  cardInfo: {
    padding: 12,
  },
  worldNumber: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  worldName: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 4,
  },
  textDimmed: {
    color: "rgba(255,255,255,0.45)",
  },
  levelRangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  levelRangeText: {
    color: colors.textLightMuted,
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  progressSection: {
    marginTop: 2,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  progressStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  statPillText: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 3,
  },
  progressPercent: {
    color: colors.textLightMuted,
    fontSize: 10,
    fontWeight: "700",
  },
  bottomBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.85)",
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    marginTop: 6,
    ...shadow,
  },
  compassWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerDivider: {
    width: 1,
    height: 22,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    marginHorizontal: 12,
  },
  bannerTitle: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 13,
  },
  bannerSubtitle: {
    color: colors.cream,
    fontWeight: "600",
    fontSize: 11,
  },
});
