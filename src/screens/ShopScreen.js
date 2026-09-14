import React, { useState } from "react";
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
import { BackButton, CoinBadge } from "../components/Bits";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";

const BG_IMAGE = require("../../assets/images/clean_nature_bg.jpg");

const TABS = ["Coins", "Hints", "Boosters"];

const COIN_PACKS = [
  { id: "c1", icon: "disc", iconColor: colors.gold, title: "Coin Pack", desc: "500 coins", price: "$2.99", coins: 500 },
  { id: "c2", icon: "albums", iconColor: colors.gold, title: "Coin Pack", desc: "1,200 coins", price: "$5.99", badge: "Popular", coins: 1200 },
  { id: "c3", icon: "wallet", iconColor: colors.gold, title: "Coin Pack", desc: "2,500 coins", price: "$9.99", badge: "Best Value", coins: 2500 },
];

const HINT_PACKS = [
  { id: "h1", icon: "bulb-outline", iconColor: colors.gold, title: "Hint Pack", desc: "5 hints", price: "$1.99", hints: 5 },
  { id: "h2", icon: "bulb", iconColor: colors.gold, title: "Hint Pack", desc: "15 hints", price: "$3.99", badge: "Popular", hints: 15 },
];

const BOOSTER_PACKS = [
  { id: "b1", icon: "flash", iconColor: colors.gold, title: "Super Shuffle", desc: "10 free shuffles", price: "$0.99" },
  { id: "b2", icon: "ban-outline", iconColor: "#FF5E5E", title: "Remove Ads", desc: "Enjoy ad-free play", price: "$4.99" },
];

export default function ShopScreen({ navigation }) {
  const { state, addCoins } = useGame();
  const [activeTab, setActiveTab] = useState("Coins");
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const buyCoins = (amount, price) => {
    addCoins(amount);
    Alert.alert("🎉 Purchase Successful", `${amount} coins added for ${price} (demo simulated purchase).`);
  };

  const buyOther = (title, price) => {
    Alert.alert("🎉 Item Activated", `${title} activated for ${price} (demo simulated purchase).`);
  };

  const claimDaily = () => {
    if (dailyClaimed) {
      Alert.alert("Already Claimed", "Come back tomorrow for your next reward!");
      return;
    }
    addCoins(50);
    setDailyClaimed(true);
    Alert.alert("🎁 Daily Reward Claimed", "+50 coins added to your balance!");
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Shop</Text>
            <Text style={styles.headerSubtitle}>Get hints & power-ups</Text>
          </View>

          <CoinBadge coins={state.coins} />
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsWrap}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Items according to active tab */}
          {(activeTab === "Coins" || activeTab === "Coins") && (
            <View style={styles.section}>
              {COIN_PACKS.map((item) => (
                <View key={item.id} style={styles.packCard}>
                  {item.badge && (
                    <View style={styles.badgeWrap}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <View style={styles.packIconCircle}>
                    <Ionicons name={item.icon} size={28} color={item.iconColor} />
                  </View>
                  <View style={styles.packDetails}>
                    <Text style={styles.packTitle}>{item.title}</Text>
                    <Text style={styles.packDesc}>{item.desc}</Text>
                  </View>
                  <Pressable
                    onPress={() => buyCoins(item.coins, item.price)}
                    style={({ pressed }) => [
                      styles.priceBtn,
                      pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                    ]}
                  >
                    <Text style={styles.priceBtnText}>{item.price}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {(activeTab === "Hints" || activeTab === "Coins") && (
            <View style={styles.section}>
              {HINT_PACKS.map((item) => (
                <View key={item.id} style={styles.packCard}>
                  {item.badge && (
                    <View style={styles.badgeWrap}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <View style={styles.packIconCircle}>
                    <Ionicons name={item.icon} size={28} color={item.iconColor} />
                  </View>
                  <View style={styles.packDetails}>
                    <Text style={styles.packTitle}>{item.title}</Text>
                    <Text style={styles.packDesc}>{item.desc}</Text>
                  </View>
                  <Pressable
                    onPress={() => buyOther(item.title, item.price)}
                    style={({ pressed }) => [
                      styles.priceBtn,
                      pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                    ]}
                  >
                    <Text style={styles.priceBtnText}>{item.price}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {(activeTab === "Boosters" || activeTab === "Coins") && (
            <View style={styles.section}>
              {BOOSTER_PACKS.map((item) => (
                <View key={item.id} style={styles.packCard}>
                  <View style={styles.packIconCircle}>
                    <Ionicons name={item.icon} size={28} color={item.iconColor} />
                  </View>
                  <View style={styles.packDetails}>
                    <Text style={styles.packTitle}>{item.title}</Text>
                    <Text style={styles.packDesc}>{item.desc}</Text>
                  </View>
                  <Pressable
                    onPress={() => buyOther(item.title, item.price)}
                    style={({ pressed }) => [
                      styles.priceBtn,
                      pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                    ]}
                  >
                    <Text style={styles.priceBtnText}>{item.price}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Daily Reward Banner */}
          <Pressable
            onPress={claimDaily}
            style={({ pressed }) => [
              styles.rewardCard,
              pressed && { opacity: 0.95, transform: [{ scale: 0.985 }] },
            ]}
          >
            <View style={styles.rewardIconCircle}>
              <Ionicons name="gift" size={32} color={colors.gold} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rewardTitle}>Daily Reward</Text>
              <Text style={styles.rewardSubtitle}>
                {dailyClaimed ? "Come back tomorrow!" : "Claim +50 free coins now!"}
              </Text>
            </View>
            <View style={[styles.claimBtn, dailyClaimed && styles.claimBtnDone]}>
              <Text style={styles.claimBtnText}>{dailyClaimed ? "Claimed" : "Claim"}</Text>
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
  tabsWrap: {
    flexDirection: "row",
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    marginHorizontal: 20,
    borderRadius: radii.pill,
    padding: 4,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  tabBtnActive: {
    backgroundColor: colors.cream,
    ...shadow,
  },
  tabText: {
    color: colors.cream,
    fontSize: 13,
    fontWeight: "700",
  },
  tabTextActive: {
    color: colors.forestDark,
    fontWeight: "900",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
  },
  section: {
    gap: 12,
    marginBottom: 8,
  },
  packCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.82)",
    borderRadius: radii.xl,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    position: "relative",
    ...shadow,
  },
  badgeWrap: {
    position: "absolute",
    right: 18,
    top: -9,
    backgroundColor: "#E74C3C",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    ...shadow,
  },
  badgeText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  packIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  packDetails: {
    flex: 1,
  },
  packTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
  },
  packDesc: {
    fontSize: 12,
    color: colors.cream,
    fontWeight: "600",
    marginTop: 2,
  },
  priceBtn: {
    backgroundColor: colors.forestLight,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  priceBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.88)",
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    marginTop: 8,
    ...glowShadow,
  },
  rewardIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(245, 196, 81, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.gold,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.gold,
  },
  rewardSubtitle: {
    fontSize: 12,
    color: colors.cream,
    fontWeight: "600",
    marginTop: 2,
  },
  claimBtn: {
    backgroundColor: colors.gold,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    ...glowShadow,
  },
  claimBtnDone: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  claimBtnText: {
    color: colors.forestDark,
    fontSize: 13,
    fontWeight: "900",
  },
});

