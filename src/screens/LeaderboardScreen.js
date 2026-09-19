import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, CoinBadge } from "../components/Bits";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";
import { fetchLeaderboard } from "../api/client";

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

export default function LeaderboardScreen({ navigation }) {
  const { state, authUser } = useGame();
  const [filter, setFilter] = useState("coins"); // "coins" | "streak"
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rows, setRows] = useState([]);

  const loadData = useCallback(async (currentFilter = filter) => {
    try {
      const res = await fetchLeaderboard(30, currentFilter);
      if (res && Array.isArray(res.leaderboard)) {
        setRows(res.leaderboard);
      }
    } catch (err) {
      console.warn("[leaderboard] fetch error:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    loadData(filter);
  }, [filter, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(filter);
  };

  const top1 = rows[0];
  const top2 = rows[1];
  const top3 = rows[2];
  const remaining = rows.slice(3);

  // Determine current player rank
  const myName = authUser?.displayName || state.displayName || "Explorer";
  const myCoins = state.coins;
  const myStreak = state.streakDays;
  const myIndex = rows.findIndex(
    (r) => r.displayName.toLowerCase() === myName.toLowerCase()
  );
  const myRank = myIndex >= 0 ? myIndex + 1 : ">" + rows.length;

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <BackButton onPress={() => (navigation.canGoBack && navigation.canGoBack() ? navigation.goBack() : navigation.navigate("MainTabs", { screen: "Home" }))} />

          <View style={styles.headerTitleWrap}>
            <Ionicons name="trophy" size={16} color={colors.gold} style={{ marginRight: 6 }} />
            <Text style={styles.headerTitle}>LEADERBOARD</Text>
          </View>

          <CoinBadge coins={state.coins} onAdd={() => navigation.navigate("Shop")} />
        </View>

        {/* Filter Toggle */}
        <View style={styles.filterWrap}>
          <Pressable
            onPress={() => setFilter("coins")}
            style={[styles.filterTab, filter === "coins" && styles.filterTabActive]}
          >
            <Ionicons
              name="disc"
              size={14}
              color={filter === "coins" ? colors.forestDark : colors.cream}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.filterText, filter === "coins" && styles.filterTextActive]}>
              Top Coins
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter("streak")}
            style={[styles.filterTab, filter === "streak" && styles.filterTabActive]}
          >
            <Ionicons
              name="flame"
              size={14}
              color={filter === "streak" ? colors.forestDark : colors.cream}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.filterText, filter === "streak" && styles.filterTextActive]}>
              Longest Streaks
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={styles.loadingText}>Fetching Top Explorers...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />
            }
          >
            {/* Top 3 Podium */}
            {rows.length >= 3 && (
              <View style={styles.podiumContainer}>
                {/* 2nd Place (Silver) */}
                <View style={[styles.podiumCol, { marginTop: 24 }]}>
                  <View style={[styles.podiumAvatarWrap, styles.silverBorder]}>
                    <Ionicons
                      name={AVATAR_ICONS[top2.avatar] || "star"}
                      size={24}
                      color="#E0E6ED"
                    />
                    <View style={[styles.podiumRankBadge, { backgroundColor: "#A0AAB5" }]}>
                      <Text style={styles.podiumRankText}>2</Text>
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{top2.displayName}</Text>
                  <View style={styles.podiumStatPill}>
                    <Ionicons
                      name={filter === "coins" ? "disc" : "flame"}
                      size={12}
                      color={colors.gold}
                    />
                    <Text style={styles.podiumStatText}>
                      {filter === "coins" ? top2.coins : `${top2.streakDays}d`}
                    </Text>
                  </View>
                </View>

                {/* 1st Place (Gold Champion) */}
                <View style={[styles.podiumCol, { zIndex: 2 }]}>
                  <View style={styles.crownWrap}>
                    <Ionicons name="ribbon" size={26} color={colors.gold} />
                  </View>
                  <View style={[styles.podiumAvatarWrap, styles.goldBorder, styles.goldGlow]}>
                    <Ionicons
                      name={AVATAR_ICONS[top1.avatar] || "trophy"}
                      size={32}
                      color={colors.gold}
                    />
                    <View style={[styles.podiumRankBadge, { backgroundColor: colors.gold }]}>
                      <Text style={[styles.podiumRankText, { color: colors.forestDark }]}>1</Text>
                    </View>
                  </View>
                  <Text style={[styles.podiumName, styles.goldChampionName]} numberOfLines={1}>
                    {top1.displayName}
                  </Text>
                  <View style={[styles.podiumStatPill, { borderColor: colors.gold }]}>
                    <Ionicons
                      name={filter === "coins" ? "disc" : "flame"}
                      size={12}
                      color={colors.gold}
                    />
                    <Text style={[styles.podiumStatText, { color: colors.goldLight }]}>
                      {filter === "coins" ? top1.coins : `${top1.streakDays}d`}
                    </Text>
                  </View>
                </View>

                {/* 3rd Place (Bronze) */}
                <View style={[styles.podiumCol, { marginTop: 32 }]}>
                  <View style={[styles.podiumAvatarWrap, styles.bronzeBorder]}>
                    <Ionicons
                      name={AVATAR_ICONS[top3.avatar] || "flame"}
                      size={22}
                      color="#CD7F32"
                    />
                    <View style={[styles.podiumRankBadge, { backgroundColor: "#CD7F32" }]}>
                      <Text style={styles.podiumRankText}>3</Text>
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{top3.displayName}</Text>
                  <View style={styles.podiumStatPill}>
                    <Ionicons
                      name={filter === "coins" ? "disc" : "flame"}
                      size={12}
                      color={colors.gold}
                    />
                    <Text style={styles.podiumStatText}>
                      {filter === "coins" ? top3.coins : `${top3.streakDays}d`}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* List of remaining ranks */}
            <View style={styles.listSection}>
              {remaining.map((player) => {
                const isMe =
                  player.displayName.toLowerCase() === myName.toLowerCase();

                return (
                  <View
                    key={player.id || player.rank}
                    style={[styles.playerRow, isMe && styles.playerRowHighlight]}
                  >
                    {/* Rank */}
                    <Text style={[styles.rankNumber, isMe && { color: colors.gold }]}>
                      #{player.rank}
                    </Text>

                    {/* Avatar Icon */}
                    <View style={[styles.rowAvatar, isMe && { borderColor: colors.gold }]}>
                      <Ionicons
                        name={AVATAR_ICONS[player.avatar] || "person"}
                        size={18}
                        color={isMe ? colors.gold : colors.white}
                      />
                    </View>

                    {/* Name & Details */}
                    <View style={styles.playerInfo}>
                      <Text style={[styles.rowPlayerName, isMe && { color: colors.goldLight }]} numberOfLines={1}>
                        {player.displayName} {isMe ? "(You)" : ""}
                      </Text>
                      <View style={styles.playerSubRow}>
                        <Ionicons name="flame" size={11} color="#FF7B25" />
                        <Text style={styles.playerSubText}>{player.streakDays} day streak</Text>
                        <Text style={styles.playerSubSep}>•</Text>
                        <Ionicons name="checkmark-circle-outline" size={11} color={colors.forestMint} />
                        <Text style={styles.playerSubText}>{player.levelsCompleted} levels</Text>
                      </View>
                    </View>

                    {/* Score / Coins */}
                    <View style={styles.scorePill}>
                      <Ionicons
                        name={filter === "coins" ? "disc" : "flame"}
                        size={14}
                        color={colors.gold}
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.scoreText}>
                        {filter === "coins" ? player.coins : `${player.streakDays}d`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* Floating "You" Banner pinned at bottom */}
        <View style={styles.myRankDock}>
          <View style={styles.myRankCard}>
            <View style={styles.myRankBadge}>
              <Text style={styles.myRankText}>#{myRank}</Text>
            </View>
            <View style={styles.myAvatarCircle}>
              <Ionicons
                name={AVATAR_ICONS[state.avatar] || "person"}
                size={20}
                color={colors.gold}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.myNameText} numberOfLines={1}>{myName} (You)</Text>
              <Text style={styles.mySubText}>
                {myStreak}d streak · {state.unlockedLevel[state.language] || 1} level
              </Text>
            </View>
            <View style={styles.myScorePill}>
              <Ionicons
                name={filter === "coins" ? "disc" : "flame"}
                size={14}
                color={colors.gold}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.myScoreText}>
                {filter === "coins" ? myCoins : `${myStreak}d`}
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
    backgroundColor: "rgba(10, 36, 23, 0.45)",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },
  filterWrap: {
    flexDirection: "row",
    backgroundColor: "rgba(10, 41, 26, 0.75)",
    marginHorizontal: 20,
    borderRadius: radii.pill,
    padding: 4,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  filterTabActive: {
    backgroundColor: colors.cream,
    ...shadow,
  },
  filterText: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "700",
  },
  filterTextActive: {
    color: colors.forestDark,
    fontWeight: "900",
  },
  loadingArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.cream,
    marginTop: 12,
    fontWeight: "700",
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 110,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    marginBottom: 16,
    ...shadow,
  },
  podiumCol: {
    alignItems: "center",
    flex: 1,
  },
  crownWrap: {
    marginBottom: -6,
    zIndex: 3,
  },
  podiumAvatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(15, 58, 38, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    position: "relative",
    ...shadow,
  },
  goldBorder: {
    borderColor: colors.gold,
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
  },
  silverBorder: {
    borderColor: "#E0E6ED",
  },
  bronzeBorder: {
    borderColor: "#CD7F32",
  },
  goldGlow: {
    ...glowShadow,
  },
  podiumRankBadge: {
    position: "absolute",
    bottom: -6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.white,
  },
  podiumRankText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
  },
  podiumName: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
    maxWidth: 90,
  },
  goldChampionName: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.goldLight,
  },
  podiumStatPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  podiumStatText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 4,
  },
  listSection: {
    gap: 10,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.78)",
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    ...shadow,
  },
  playerRowHighlight: {
    backgroundColor: "rgba(25, 78, 52, 0.92)",
    borderColor: colors.gold,
    borderWidth: 1.5,
    ...glowShadow,
  },
  rankNumber: {
    color: colors.cream,
    fontWeight: "900",
    fontSize: 14,
    width: 32,
  },
  rowAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  playerInfo: {
    flex: 1,
  },
  rowPlayerName: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  playerSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  playerSubText: {
    color: colors.cream,
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 3,
  },
  playerSubSep: {
    color: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 5,
    fontSize: 10,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.18)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  scoreText: {
    color: colors.goldLight,
    fontWeight: "900",
    fontSize: 13,
  },
  myRankDock: {
    position: "absolute",
    bottom: 12,
    left: 18,
    right: 18,
  },
  myRankCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.95)",
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...glowShadow,
  },
  myRankBadge: {
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  myRankText: {
    color: colors.forestDark,
    fontSize: 11,
    fontWeight: "900",
  },
  myAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  myNameText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 13,
  },
  mySubText: {
    color: colors.cream,
    fontSize: 10,
    fontWeight: "600",
  },
  myScorePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  myScoreText: {
    color: colors.goldLight,
    fontWeight: "900",
    fontSize: 13,
  },
});
