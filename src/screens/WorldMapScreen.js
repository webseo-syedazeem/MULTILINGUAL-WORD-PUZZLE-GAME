import React, { useMemo, useState, useEffect, useRef } from "react";
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
import { BackButton, CoinBadge } from "../components/Bits";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";
import { useT } from "../i18n/useT";
import { WORLDS, getWorldForLevel } from "../data/puzzles";
import { getBackgroundForWorld } from "../data/backgrounds";

const NODE_ROW_HEIGHT = 78;
const LEFT_PATTERN = [24, 56, 74, 46, 22, 52, 76, 45, 32, 65];

function buildNodeLayout(startLevel, endLevel) {
  const count = endLevel - startLevel + 1;
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const levelId = startLevel + i;
    // bottom-to-top zig-zag
    const top = (count - 1 - i) * NODE_ROW_HEIGHT + 60;
    const leftPct = LEFT_PATTERN[i % LEFT_PATTERN.length];
    nodes.push({ id: levelId, leftPct, top });
  }
  return { nodes, canvasHeight: count * NODE_ROW_HEIGHT + 140 };
}

export default function WorldMapScreen({ navigation, route }) {
  const { state } = useGame();
  const { t } = useT();
  const scrollRef = useRef(null);
  const unlocked = state.unlockedLevel[state.language] || 1;
  const paramWorldId = route?.params?.worldId;
  const initialWorld = paramWorldId
    ? (WORLDS.find((w) => w.id === paramWorldId) || getWorldForLevel(unlocked))
    : getWorldForLevel(unlocked);
  const [worldId, setWorldId] = useState(initialWorld.id);

  useEffect(() => {
    setWorldId(getWorldForLevel(unlocked).id);
  }, [state.language, unlocked]);

  const world = WORLDS.find((w) => w.id === worldId) || WORLDS[0];
  const { nodes, canvasHeight } = useMemo(
    () => buildNodeLayout(world.startLevel, world.endLevel),
    [world.startLevel, world.endLevel]
  );

  // Auto-scroll to current active level node so player doesn't have to scroll all the way down
  useEffect(() => {
    const currentNode = nodes.find((n) => n.id === unlocked);
    if (currentNode && scrollRef.current) {
      const scrollY = Math.max(0, currentNode.top - 240);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: scrollY, animated: true });
      }, 150);
    }
  }, [nodes, unlocked, worldId]);

  const goToWorld = (dir) => {
    const idx = WORLDS.findIndex((w) => w.id === worldId);
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= WORLDS.length) return;
    setWorldId(WORLDS[nextIdx].id);
  };

  const canGoPrev = worldId > WORLDS[0].id;
  const canGoNext = worldId < WORLDS[WORLDS.length - 1].id;
  const worldBg = getBackgroundForWorld(world.id);

  return (
    <ImageBackground source={worldBg.source} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <BackButton onPress={() => (navigation.canGoBack && navigation.canGoBack() ? navigation.goBack() : navigation.navigate("MainTabs", { screen: "Worlds" }))} />

          <View style={styles.worldSwitcher}>
            <Pressable
              onPress={() => goToWorld(-1)}
              disabled={!canGoPrev}
              hitSlop={10}
              style={[styles.worldArrow, !canGoPrev && styles.worldArrowDisabled]}
            >
              <Ionicons name="chevron-back" size={16} color={colors.white} />
            </Pressable>

            <View style={styles.titleCrest}>
              <Text style={styles.worldNumber}>{t("worldmap.world", { n: world.id })}</Text>
              <Text style={styles.worldSubtitle}>{t(`worldNames.${world.id}`)}</Text>
            </View>

            <Pressable
              onPress={() => goToWorld(1)}
              disabled={!canGoNext}
              hitSlop={10}
              style={[styles.worldArrow, !canGoNext && styles.worldArrowDisabled]}
            >
              <Ionicons name="chevron-forward" size={16} color={colors.white} />
            </Pressable>
          </View>

          <CoinBadge
            coins={state.coins}
            onAdd={() => navigation.navigate("Shop")}
          />
        </View>

        {/* Scrollable Map Area */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.mapCanvas, { height: canvasHeight }]}
          showsVerticalScrollIndicator={false}
        >
          {nodes.map((node) => {
            const isCompleted = node.id < unlocked;
            const isCurrent = node.id === unlocked;
            const isLocked = node.id > unlocked;
            const stars = (state.levelStars[state.language] || {})[node.id] || 0;

            return (
              <View
                key={node.id}
                style={[
                  styles.nodeWrap,
                  { left: `${node.leftPct}%`, top: node.top },
                ]}
              >
                <Pressable
                  disabled={isLocked}
                  onPress={() => navigation.navigate("Game", { levelId: node.id })}
                  style={({ pressed }) => [
                    styles.nodeCircle,
                    isCompleted && styles.nodeCompleted,
                    isCurrent && styles.nodeCurrent,
                    isLocked && styles.nodeLocked,
                    pressed && { transform: [{ scale: 0.94 }] },
                  ]}
                >
                  {isLocked ? (
                    <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.75)" />
                  ) : (
                    <Text
                      style={[
                        styles.nodeNum,
                        isCurrent && styles.nodeNumCurrent,
                      ]}
                    >
                      {node.id}
                    </Text>
                  )}
                </Pressable>

                {isCompleted && (
                  <View style={styles.starsRow}>
                    {[1, 2, 3].map((s) => (
                      <Ionicons
                        key={s}
                        name={stars >= s ? "star" : "star-outline"}
                        size={s === 2 ? 12 : 11}
                        color={colors.gold}
                        style={s === 2 ? { marginHorizontal: 1 } : undefined}
                      />
                    ))}
                  </View>
                )}

                {isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>{t("worldmap.play")}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Exploration Banner */}
        <View style={styles.bottomBannerWrap}>
          <View style={styles.bottomBanner}>
            <View style={styles.compassWrap}>
              <Ionicons name="compass" size={24} color={colors.gold} />
            </View>
            <View style={styles.bannerDivider} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{t("worldmap.travel")}</Text>
              <Text style={styles.bannerSubtitle}>
                {t("worldmap.levelsOf", {
                  start: world.startLevel,
                  end: world.endLevel,
                  total: WORLDS[WORLDS.length - 1].endLevel,
                })}
              </Text>
            </View>
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
    backgroundColor: "rgba(10, 36, 23, 0.22)",
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
    zIndex: 10,
  },
  worldSwitcher: {
    flexDirection: "row",
    alignItems: "center",
  },
  worldArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(10, 41, 26, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 6,
  },
  worldArrowDisabled: {
    opacity: 0.3,
  },
  titleCrest: {
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.72)",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    minWidth: 130,
    ...shadow,
  },
  worldNumber: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1.8,
  },
  worldSubtitle: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 1,
  },
  mapCanvas: {
    position: "relative",
  },
  nodeWrap: {
    position: "absolute",
    marginLeft: -28,
    alignItems: "center",
  },
  nodeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    ...shadow,
  },
  nodeCompleted: {
    backgroundColor: colors.forest,
    borderColor: colors.gold,
  },
  nodeCurrent: {
    backgroundColor: colors.forestDark,
    borderColor: colors.gold,
    borderWidth: 3.5,
    ...glowShadow,
  },
  nodeLocked: {
    backgroundColor: "rgba(35, 45, 40, 0.78)",
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  nodeNum: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.white,
  },
  nodeNumCurrent: {
    color: colors.gold,
    fontSize: 22,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    backgroundColor: "rgba(10, 41, 26, 0.75)",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radii.pill,
  },
  currentBadge: {
    marginTop: 3,
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
    ...glowShadow,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: colors.forestDark,
    letterSpacing: 1,
  },
  bottomBannerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 102,
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
    ...shadow,
  },
  compassWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerDivider: {
    width: 1,
    height: 24,
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
