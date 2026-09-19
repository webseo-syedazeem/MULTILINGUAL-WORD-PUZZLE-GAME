import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackButton, CoinBadge } from "../components/Bits";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";
import { useT } from "../i18n/useT";

const BG_IMAGE = require("../../assets/images/mountain_alps.jpg");

export default function ShopScreen({ navigation }) {
  const { state, addCoins } = useGame();
  const { t } = useT();
  const [activeTab, setActiveTab] = useState("Coins");
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMeta, setToastMeta] = useState({ title: "", message: "", amount: 0 });

  const TABS = [
    { key: "Coins", label: t("shop.tabs.coins") },
    { key: "Hints", label: t("shop.tabs.hints") },
    { key: "Boosters", label: t("shop.tabs.boosters") },
  ];

  const COIN_PACKS = [
    { id: "c1", icon: "disc", title: t("shop.coinPack"), desc: t("shop.coinsDesc", { count: 500 }), price: "$2.99", coins: 500 },
    { id: "c2", icon: "albums", title: t("shop.coinPack"), desc: t("shop.coinsDesc", { count: 1200 }), price: "$5.99", badge: t("shop.popular"), coins: 1200 },
    { id: "c3", icon: "wallet", title: t("shop.coinPack"), desc: t("shop.coinsDesc", { count: 2500 }), price: "$9.99", badge: t("shop.bestValue"), coins: 2500 },
  ];

  const HINT_PACKS = [
    { id: "h1", icon: "bulb-outline", title: t("shop.hintPack"), desc: t("shop.hintsDesc", { count: 5 }), price: "$1.99" },
    { id: "h2", icon: "bulb", title: t("shop.hintPack"), desc: t("shop.hintsDesc", { count: 15 }), price: "$3.99", badge: t("shop.popular") },
  ];

  const BOOSTER_PACKS = [
    { id: "b1", icon: "flash", title: t("shop.superShuffle"), desc: t("shop.shufflesDesc", { count: 10 }), price: "$0.99" },
    { id: "b2", icon: "ban-outline", iconColor: "#FF5E5E", title: t("shop.removeAds"), desc: t("shop.removeAdsDesc"), price: "$4.99" },
  ];

  const buyCoins = (amount, price) => {
    addCoins(amount);
    setToastMeta({
      title: t("shop.purchaseSuccessTitle"),
      message: t("shop.purchaseSuccessMsg", { amount, price }),
      amount,
    });
    setToastVisible(true);
  };

  const buyOther = (title, price) => {
    setToastMeta({
      title: t("shop.itemActivatedTitle"),
      message: t("shop.itemActivatedMsg", { title, price }),
      amount: 0,
    });
    setToastVisible(true);
  };

  const claimDaily = () => {
    if (dailyClaimed) {
      setToastMeta({
        title: t("shop.alreadyClaimedTitle"),
        message: t("shop.alreadyClaimedMsg"),
        amount: 0,
      });
      setToastVisible(true);
      return;
    }
    addCoins(50);
    setDailyClaimed(true);
    setToastMeta({
      title: t("shop.dailyClaimedTitle"),
      message: t("shop.dailyClaimedMsg"),
      amount: 50,
    });
    setToastVisible(true);
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <BackButton onPress={() => (navigation.canGoBack && navigation.canGoBack() ? navigation.goBack() : navigation.navigate("MainTabs", { screen: "Home" }))} />

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>{t("shop.title")}</Text>
            <Text style={styles.headerSubtitle}>{t("shop.subtitle")}</Text>
          </View>

          <CoinBadge coins={state.coins} />
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsWrap}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Only render active category */}
          {activeTab === "Coins" && (
            <View style={styles.section}>
              {COIN_PACKS.map((item) => (
                <View key={item.id} style={styles.packCard}>
                  {item.badge && (
                    <View style={styles.badgeWrap}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <View style={styles.packIconCircle}>
                    <Ionicons name={item.icon} size={28} color={item.iconColor || colors.gold} />
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

          {activeTab === "Hints" && (
            <View style={styles.section}>
              {HINT_PACKS.map((item) => (
                <View key={item.id} style={styles.packCard}>
                  {item.badge && (
                    <View style={styles.badgeWrap}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <View style={styles.packIconCircle}>
                    <Ionicons name={item.icon} size={28} color={item.iconColor || colors.gold} />
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

          {activeTab === "Boosters" && (
            <View style={styles.section}>
              {BOOSTER_PACKS.map((item) => (
                <View key={item.id} style={styles.packCard}>
                  <View style={styles.packIconCircle}>
                    <Ionicons name={item.icon} size={28} color={item.iconColor || colors.gold} />
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
              <Text style={styles.rewardTitle}>{t("shop.dailyReward")}</Text>
              <Text style={styles.rewardSubtitle}>
                {dailyClaimed ? t("shop.comeBackTomorrow") : t("shop.claimNow")}
              </Text>
            </View>
            <View style={[styles.claimBtn, dailyClaimed && styles.claimBtnDone]}>
              <Text style={styles.claimBtnText}>{dailyClaimed ? t("shop.claimed") : t("shop.claim")}</Text>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={toastVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setToastVisible(false)}
      >
        <Pressable style={styles.toastOverlay} onPress={() => setToastVisible(false)}>
          <Pressable style={styles.toastCard} onPress={() => {}}>
            <View style={styles.toastHeader}>
              <View style={styles.toastIconWrap}>
                <Ionicons name="gift" size={22} color={colors.goldLight} />
              </View>
              <Text style={styles.toastTitle}>{toastMeta.title}</Text>
            </View>

            <Text style={styles.toastBody}>{toastMeta.message}</Text>

            <View style={styles.toastFooter}>
              {toastMeta.amount > 0 ? (
                <Text style={styles.toastAmount}>+{toastMeta.amount} coins</Text>
              ) : (
                <Text style={styles.toastAmount}>Confirmed</Text>
              )}
              <Pressable onPress={() => setToastVisible(false)} style={styles.toastButton}>
                <Text style={styles.toastButtonText}>OK</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    paddingBottom: 115,
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
  toastOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  toastCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(251, 247, 236, 0.96)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(15, 58, 38, 0.12)",
    ...shadow,
  },
  toastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  toastIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(245, 196, 81, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  toastTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
    flex: 1,
  },
  toastBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    fontWeight: "600",
  },
  toastFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  toastAmount: {
    color: colors.forestDark,
    fontSize: 14,
    fontWeight: "900",
  },
  toastButton: {
    backgroundColor: colors.forestLight,
    borderRadius: radii.pill,
    paddingVertical: 9,
    paddingHorizontal: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  toastButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },
});
