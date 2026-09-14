import React from "react";
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
import { BackButton, CoinBadge } from "../components/Bits";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";

const { width } = Dimensions.get("window");
const BG_IMAGE = require("../../assets/images/scenic_game_bg.jpg");

// 10 Level Nodes distributed along a winding path (from bottom level 1 to top level 10)
const LEVEL_NODES = [
  { id: 1, leftPct: 24, top: 670 },
  { id: 2, leftPct: 56, top: 660 },
  { id: 3, leftPct: 74, top: 580 },
  { id: 4, leftPct: 46, top: 530 },
  { id: 5, leftPct: 22, top: 460 },
  { id: 6, leftPct: 52, top: 400 },
  { id: 7, leftPct: 76, top: 325 },
  { id: 8, leftPct: 45, top: 275 },
  { id: 9, leftPct: 32, top: 185 },
  { id: 10, leftPct: 65, top: 110 },
];

export default function WorldMapScreen({ navigation }) {
  const { state } = useGame();
  const unlocked = state.unlockedLevel[state.language] || 1;

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <BackButton onPress={() => navigation.goBack()} />

          <View style={styles.titleCrest}>
            <Text style={styles.worldNumber}>WORLD 1</Text>
            <Text style={styles.worldSubtitle}>Green Horizons</Text>
          </View>

          <CoinBadge
            coins={state.coins}
            onAdd={() => navigation.navigate("Shop")}
          />
        </View>

        {/* Scrollable Map Area */}
        <ScrollView
          contentContainerStyle={styles.mapCanvas}
          showsVerticalScrollIndicator={false}
        >
          {/* Level Nodes */}
          {LEVEL_NODES.map((node) => {
            const isCompleted = node.id < unlocked;
            const isCurrent = node.id === unlocked;
            const isLocked = node.id > unlocked;

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

                {/* Stars for completed levels */}
                {isCompleted && (
                  <View style={styles.starsRow}>
                    <Ionicons name="star" size={11} color={colors.gold} />
                    <Ionicons name="star" size={12} color={colors.gold} style={{ marginHorizontal: 1 }} />
                    <Ionicons name="star" size={11} color={colors.gold} />
                  </View>
                )}

                {/* Active pulse beacon */}
                {isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>PLAY</Text>
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
              <Text style={styles.bannerTitle}>Travel through words.</Text>
              <Text style={styles.bannerSubtitle}>Explore the world.</Text>
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
  titleCrest: {
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.72)",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
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
    height: 770,
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
    paddingBottom: 14,
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

