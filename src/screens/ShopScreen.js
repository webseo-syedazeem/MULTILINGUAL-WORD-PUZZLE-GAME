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
import { BackButton, CoinBadge, DiamondBadge } from "../components/Bits";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";
import { useT } from "../i18n/useT";
import { todayKey } from "../utils/streak";
import CardPaymentModal, { BENEFICIARY_DETAILS } from "../components/CardPaymentModal";

const BG_IMAGE = require("../../assets/images/mountain_alps.jpg");

export default function ShopScreen({ navigation }) {
  const {
    state,
    addCoins,
    addDiamonds,
    recordPayment,
    buyHintsWithCoins,
    buyHintsWithDiamonds,
    claimDailyReward,
    DAILY_REWARDS_LADDER,
    playWinSound,
    playLoseSound,
    playWordFoundSound,
    playTapSound,
    playCoinSound,
  } = useGame();
  const { t } = useT();

  const [activeTab, setActiveTab] = useState("Coins"); // Default to Coins store
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMeta, setToastMeta] = useState({ title: "", message: "", amount: 0 });

  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);

  const TABS = [
    { key: "Coins", label: "🪙 Coins" },
    { key: "Diamonds", label: "💎 Diamonds" },
    { key: "Hints", label: "💡 Hints" },
    { key: "Boosters", label: "⚡ Boosters" },
    { key: "Receipts", label: "📜 Receipts" },
  ];

  // In-Game Currency Hint Packs (Buy with Coins OR Diamonds)
  const HINT_STORE_ITEMS = [
    {
      id: "hint_5",
      hintsCount: 5,
      title: "Starter Hint Bundle",
      desc: "5 Instant In-Game Hints for any level",
      coinCost: 100,
      diamondCost: 10,
      icon: "bulb-outline",
      badge: "Standard",
    },
    {
      id: "hint_15",
      hintsCount: 15,
      title: "Popular Hint Bundle",
      desc: "15 Instant In-Game Hints for tricky puzzles",
      coinCost: 250,
      diamondCost: 25,
      icon: "bulb",
      badge: "Most Popular",
    },
    {
      id: "hint_40",
      hintsCount: 40,
      title: "Master Hint Vault",
      desc: "40 Instant In-Game Hints + Magic Wand Power",
      coinCost: 600,
      diamondCost: 55,
      icon: "sparkles",
      badge: "Best Value",
    },
  ];

  const COIN_PACKS = [
    { id: "c1", icon: "disc", title: "Handful of Coins", desc: "500 Gold Coins", price: "$2.99", coins: 500 },
    { id: "c2", icon: "albums", title: "Sack of Gold", desc: "1,200 Gold Coins", price: "$5.99", badge: "Popular", coins: 1200 },
    { id: "c3", icon: "wallet", title: "Treasure Chest", desc: "2,500 Gold Coins", price: "$9.99", badge: "Best Value", coins: 2500 },
    { id: "c4", icon: "cash", title: "Vault of Wealth", desc: "6,000 Gold Coins + VIP", price: "$19.99", badge: "Mega Value", coins: 6000 },
  ];

  const DIAMOND_PACKS = [
    { id: "d1", icon: "diamond", title: "Handful of Diamonds", desc: "30 Pure Cut Diamonds", price: "$1.99", diamonds: 30 },
    { id: "d2", icon: "diamond", title: "Diamond Pouch", desc: "80 Pure Cut Diamonds", price: "$4.99", badge: "Hot", diamonds: 80 },
    { id: "d3", icon: "diamond", title: "Mountain Treasure", desc: "200 Pure Cut Diamonds", price: "$9.99", badge: "Best Value", diamonds: 200 },
    { id: "d4", icon: "diamond", title: "Royal Diamond Vault", desc: "500 Pure Cut Diamonds", price: "$19.99", badge: "Ultimate", diamonds: 500 },
  ];

  const BOOSTER_PACKS = [
    { id: "b1", icon: "flash", title: t("shop.superShuffle") || "Super Shuffle", desc: t("shop.shufflesDesc", { count: 10 }) || "10 Instant Letter Reshuffles", price: "$0.99", coins: 100 },
    { id: "b2", icon: "ban-outline", iconColor: "#FF5E5E", title: t("shop.removeAds") || "Remove All Ads", desc: t("shop.removeAdsDesc") || "Permanent Ad-Free Experience", price: "$4.99", coins: 800 },
  ];

  // Daily Reward State
  const dailyRewardState = state.dailyReward || { lastClaimDate: null, streak: 0 };
  const dailyRewardClaimedToday = dailyRewardState.lastClaimDate === todayKey();
  const currentStreakDay = dailyRewardClaimedToday
    ? ((dailyRewardState.streak - 1) % 7) + 1
    : (dailyRewardState.streak % 7) + 1;
  const todayLadderReward = (DAILY_REWARDS_LADDER && DAILY_REWARDS_LADDER[currentStreakDay - 1]) || {
    coins: 50,
    diamonds: 2,
    hints: 0,
  };

  const handleClaimDaily = () => {
    const res = claimDailyReward();
    if (res.alreadyClaimed) {
      playTapSound();
      setToastMeta({
        title: "Already Claimed Today",
        message: "You have already collected today's reward! Come back tomorrow for the next streak gift.",
        amount: 0,
      });
      setToastVisible(true);
      return;
    }
    playWinSound();
    const r = res.reward;
    setToastMeta({
      title: `🎉 Day ${res.newStreak} Daily Reward!`,
      message: `Credited +${r.coins} Coins and +${r.diamonds} Diamonds${r.hints ? ` and +${r.hints} Hints` : ""} to your balance!`,
      amount: r.coins,
    });
    setToastVisible(true);
  };

  const handleBuyWithCoins = (pack) => {
    if (buyHintsWithCoins(pack.hintsCount, pack.coinCost)) {
      playCoinSound();
      setToastMeta({
        title: "🎉 Hints Added!",
        message: `Successfully bought ${pack.hintsCount} Hints for ${pack.coinCost} Coins. Total hints now: ${(state.hints || 0) + pack.hintsCount}`,
        amount: pack.hintsCount,
      });
      setToastVisible(true);
    } else {
      playLoseSound();
      setToastMeta({
        title: "Not Enough Coins",
        message: `You need ${pack.coinCost} coins to buy this pack. Solve words in any stage to earn +10 coins each!`,
        amount: 0,
      });
      setToastVisible(true);
    }
  };

  const handleBuyWithDiamonds = (pack) => {
    if (buyHintsWithDiamonds(pack.hintsCount, pack.diamondCost)) {
      playCoinSound();
      setToastMeta({
        title: "💎 Hints Added!",
        message: `Successfully bought ${pack.hintsCount} Hints for ${pack.diamondCost} Diamonds. Total hints now: ${(state.hints || 0) + pack.hintsCount}`,
        amount: pack.hintsCount,
      });
      setToastVisible(true);
    } else {
      playLoseSound();
      setToastMeta({
        title: "Not Enough Diamonds",
        message: `You need ${pack.diamondCost} diamonds to buy this pack. Complete levels to earn +5 diamonds each!`,
        amount: 0,
      });
      setToastVisible(true);
    }
  };

  const handleCardPurchase = (pack) => {
    playTapSound();
    setSelectedPack(pack);
    setCardModalVisible(true);
  };

  const onCardPaymentSuccess = (receipt) => {
    recordPayment(receipt);
    playWinSound();
    const creditDesc = receipt.diamonds
      ? `+${receipt.diamonds.toLocaleString()} Diamonds`
      : `+${receipt.coins.toLocaleString()} Coins`;
    setToastMeta({
      title: "🎉 Payment Confirmed",
      message: `Card debit authorized. ${creditDesc} credited to your balance and settled to ${receipt.beneficiary} at ${receipt.bank} (Acc: ${receipt.account}).`,
      amount: receipt.coins || receipt.diamonds || 0,
    });
    setToastVisible(true);
  };

  const paymentHistory = state.paymentHistory || [];

  const renderSettlementAccountCard = () => (
    <View style={styles.settlementBanner}>
      <View style={styles.settlementTopRow}>
        <View style={styles.settlementIconCircle}>
          <Ionicons name="shield-checkmark" size={20} color={colors.gold} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.settlementTitle}>OFFICIAL SETTLEMENT ACCOUNT</Text>
            <View style={styles.cardOnlyPill}>
              <Ionicons name="card" size={10} color="#00E676" style={{ marginRight: 3 }} />
              <Text style={styles.cardOnlyPillText}>Card Payment Only</Text>
            </View>
          </View>
          <Text style={styles.settlementSub}>Direct merchant settlement via Meezan Bank Pakistan</Text>
        </View>
      </View>

      <View style={styles.settlementDetailsGrid}>
        <View style={styles.settlementDetailItem}>
          <Text style={styles.settlementLabel}>Beneficiary Name:</Text>
          <Text style={styles.settlementValue}>{BENEFICIARY_DETAILS.name}</Text>
        </View>
        <View style={styles.settlementDivider} />
        <View style={styles.settlementDetailItem}>
          <Text style={styles.settlementLabel}>Bank Name:</Text>
          <Text style={styles.settlementValue}>{BENEFICIARY_DETAILS.bankName}</Text>
        </View>
        <View style={styles.settlementDivider} />
        <View style={styles.settlementDetailItem}>
          <Text style={styles.settlementLabel}>Acc Number #:</Text>
          <Text style={[styles.settlementValue, styles.monoText]}>{BENEFICIARY_DETAILS.accountNumber}</Text>
        </View>
        <View style={styles.settlementDivider} />
        <View style={styles.settlementDetailItem}>
          <Text style={styles.settlementLabel}>IBAN:</Text>
          <Text style={[styles.settlementValue, styles.monoText, { fontSize: 11 }]}>{BENEFICIARY_DETAILS.iban}</Text>
        </View>
      </View>

      <View style={styles.settlementFooterBadge}>
        <Ionicons name="lock-closed" size={12} color="#00E676" style={{ marginRight: 5 }} />
        <Text style={styles.settlementFooterText}>
          PCI-DSS Compliant 256-Bit SSL • Instant In-Game Delivery
        </Text>
      </View>
    </View>
  );

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.navigate("Home")} />

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>GAME STORE</Text>
            <Text style={styles.headerSubtitle}>Coins, Diamonds & Rewards</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CoinBadge coins={state.coins} style={{ marginRight: 6 }} />
            <DiamondBadge diamonds={state.diamonds || 0} />
          </View>
        </View>

        {/* Daily Base Free Reward Banner */}
        <Pressable
          onPress={handleClaimDaily}
          style={({ pressed }) => [
            styles.rewardCard,
            dailyRewardClaimedToday && styles.rewardCardClaimed,
            pressed && { opacity: 0.95, transform: [{ scale: 0.985 }] },
          ]}
        >
          <View style={styles.rewardIconCircle}>
            <Ionicons name="gift" size={28} color={colors.gold} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.rewardTitle}>
                Daily Base Reward • Day {currentStreakDay}/7
              </Text>
              {dailyRewardClaimedToday && (
                <View style={styles.claimedPill}>
                  <Ionicons name="checkmark-circle" size={11} color="#00E676" style={{ marginRight: 2 }} />
                  <Text style={styles.claimedPillText}>Claimed</Text>
                </View>
              )}
            </View>
            <Text style={styles.rewardSubtitle}>
              {dailyRewardClaimedToday
                ? "Collected for today! Next gift ready tomorrow."
                : `Claim free: +${todayLadderReward.coins} Coins, +${todayLadderReward.diamonds} Diamonds`}
            </Text>
          </View>
          <View style={[styles.claimBtn, dailyRewardClaimedToday && styles.claimBtnDone]}>
            <Text style={styles.claimBtnText}>
              {dailyRewardClaimedToday ? "Claimed" : "Claim"}
            </Text>
          </View>
        </Pressable>

        {/* Filter Tabs (Horizontally scrollable with solid dark pill background) */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => {
                    playTapSound();
                    setActiveTab(tab.key);
                  }}
                  style={({ pressed }) => [
                    styles.tabBtn,
                    isActive && styles.tabBtnActive,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                  ]}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hints Tab: Buy Hints with Coins OR Diamonds */}
          {activeTab === "Hints" && (
            <View style={styles.section}>
              <View style={styles.currentInventoryCard}>
                <Ionicons name="bulb" size={22} color={colors.gold} style={{ marginRight: 8 }} />
                <Text style={styles.currentInventoryText}>
                  Your Available Hints: <Text style={{ fontWeight: "900", color: colors.goldLight }}>{state.hints || 0}</Text>
                </Text>
              </View>

              {HINT_STORE_ITEMS.map((item) => (
                <View key={item.id} style={styles.hintPackCard}>
                  {item.badge && (
                    <View style={styles.badgeWrap}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <View style={styles.hintPackTopRow}>
                    <View style={styles.packIconCircle}>
                      <Ionicons name={item.icon} size={28} color={colors.gold} />
                    </View>
                    <View style={styles.packDetails}>
                      <Text style={styles.packTitle}>{item.title}</Text>
                      <Text style={styles.packDesc}>{item.desc}</Text>
                    </View>
                  </View>

                  <View style={styles.hintBuyButtonsRow}>
                    {/* Buy with Coins Button */}
                    <Pressable
                      onPress={() => handleBuyWithCoins(item)}
                      style={({ pressed }) => [
                        styles.currencyBuyBtn,
                        state.coins < item.coinCost && styles.currencyBuyBtnDisabled,
                        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
                      ]}
                    >
                      <Ionicons name="disc" size={15} color={colors.gold} style={{ marginRight: 4 }} />
                      <Text style={styles.currencyBuyBtnText}>{item.coinCost} Coins</Text>
                    </Pressable>

                    {/* Buy with Diamonds Button */}
                    <Pressable
                      onPress={() => handleBuyWithDiamonds(item)}
                      style={({ pressed }) => [
                        styles.currencyBuyBtn,
                        styles.diamondBuyBtn,
                        (state.diamonds || 0) < item.diamondCost && styles.currencyBuyBtnDisabled,
                        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
                      ]}
                    >
                      <Ionicons name="diamond" size={14} color={colors.diamond} style={{ marginRight: 4 }} />
                      <Text style={[styles.currencyBuyBtnText, { color: colors.diamond }]}>
                        {item.diamondCost} Diamonds
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Diamonds Tab */}
          {activeTab === "Diamonds" && (
            <View style={styles.section}>
              <View style={[styles.storeCategoryBanner, { borderColor: "rgba(0,229,255,0.4)" }]}>
                <Ionicons name="diamond" size={18} color={colors.diamond} style={{ marginRight: 6 }} />
                <Text style={[styles.storeCategoryTitle, { color: colors.diamond }]}>
                  Pure Cut Diamonds • Card Payment Only
                </Text>
                <View style={[styles.cardOnlyMiniBadge, { backgroundColor: colors.diamond }]}>
                  <Ionicons name="card" size={10} color={colors.forestDark} style={{ marginRight: 2 }} />
                  <Text style={styles.cardOnlyMiniText}>Card Only</Text>
                </View>
              </View>

              <View style={[styles.currentInventoryCard, { borderColor: "rgba(0,229,255,0.4)" }]}>
                <Ionicons name="diamond" size={20} color={colors.diamond} style={{ marginRight: 8 }} />
                <Text style={styles.currentInventoryText}>
                  Your Diamonds: <Text style={{ fontWeight: "900", color: colors.diamond }}>{state.diamonds || 0}</Text>
                </Text>
              </View>

              {renderSettlementAccountCard()}

              {DIAMOND_PACKS.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleCardPurchase(item)}
                  style={({ pressed }) => [
                    styles.packCard,
                    pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
                  ]}
                >
                  {item.badge && (
                    <View style={[styles.badgeWrap, { backgroundColor: colors.diamondDark }]}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <View style={[styles.packIconCircle, { backgroundColor: "rgba(0,229,255,0.15)" }]}>
                    <Ionicons name="diamond" size={26} color={colors.diamond} />
                  </View>
                  <View style={styles.packDetails}>
                    <Text style={styles.packTitle}>{item.title}</Text>
                    <Text style={styles.packDesc}>{item.desc}</Text>
                  </View>
                  <View style={[styles.priceBtn, { backgroundColor: colors.diamond }]}>
                    <Ionicons name="card-outline" size={13} color={colors.forestDark} style={{ marginRight: 4 }} />
                    <Text style={[styles.priceBtnText, { color: colors.forestDark }]}>{item.price}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Coins Tab */}
          {activeTab === "Coins" && (
            <View style={styles.section}>
              <View style={styles.storeCategoryBanner}>
                <Ionicons name="disc" size={18} color={colors.gold} style={{ marginRight: 6 }} />
                <Text style={styles.storeCategoryTitle}>
                  Gold Coins Store • Card Payment Only
                </Text>
                <View style={styles.cardOnlyMiniBadge}>
                  <Ionicons name="card" size={10} color={colors.forestDark} style={{ marginRight: 2 }} />
                  <Text style={styles.cardOnlyMiniText}>Card Only</Text>
                </View>
              </View>

              <View style={styles.currentInventoryCard}>
                <Ionicons name="disc" size={20} color={colors.gold} style={{ marginRight: 8 }} />
                <Text style={styles.currentInventoryText}>
                  Your Coins: <Text style={{ fontWeight: "900", color: colors.goldLight }}>{state.coins}</Text>
                </Text>
              </View>

              {renderSettlementAccountCard()}

              {COIN_PACKS.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleCardPurchase(item)}
                  style={({ pressed }) => [
                    styles.packCard,
                    pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
                  ]}
                >
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
                  <View style={styles.priceBtn}>
                    <Ionicons name="card-outline" size={13} color={colors.forestDark} style={{ marginRight: 4 }} />
                    <Text style={styles.priceBtnText}>{item.price}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Boosters Tab */}
          {activeTab === "Boosters" && (
            <View style={styles.section}>
              {BOOSTER_PACKS.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleCardPurchase(item)}
                  style={({ pressed }) => [
                    styles.packCard,
                    pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
                  ]}
                >
                  <View style={styles.packIconCircle}>
                    <Ionicons name={item.icon} size={28} color={item.iconColor || colors.gold} />
                  </View>
                  <View style={styles.packDetails}>
                    <Text style={styles.packTitle}>{item.title}</Text>
                    <Text style={styles.packDesc}>{item.desc}</Text>
                  </View>
                  <View style={styles.priceBtn}>
                    <Ionicons name="card-outline" size={13} color={colors.forestDark} style={{ marginRight: 4 }} />
                    <Text style={styles.priceBtnText}>{item.price}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Receipts / History Tab */}
          {activeTab === "Receipts" && (
            <View style={styles.section}>
              {renderSettlementAccountCard()}
              {paymentHistory.length === 0 ? (
                <View style={styles.emptyReceiptsCard}>
                  <Ionicons name="receipt-outline" size={44} color="rgba(255,255,255,0.3)" />
                  <Text style={styles.emptyReceiptsTitle}>No Transactions Yet</Text>
                  <Text style={styles.emptyReceiptsSub}>
                    Card payment transactions settled to Meezan Bank will appear here with full audit receipts.
                  </Text>
                </View>
              ) : (
                paymentHistory.map((rec, idx) => (
                  <View key={rec.txnId || idx} style={styles.receiptHistoryCard}>
                    <View style={styles.recHistHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recHistTxn}>{rec.txnId}</Text>
                        <Text style={styles.recHistDate}>{rec.date}</Text>
                      </View>
                      <View style={styles.recHistAmountPill}>
                        <Text style={styles.recHistAmountText}>{rec.price}</Text>
                      </View>
                    </View>

                    <View style={styles.recHistDivider} />

                    <View style={styles.recHistRow}>
                      <Text style={styles.recHistLabel}>Package:</Text>
                      <Text style={styles.recHistVal}>{rec.itemTitle}</Text>
                    </View>

                    <View style={styles.recHistRow}>
                      <Text style={styles.recHistLabel}>Credit Added:</Text>
                      <Text style={[styles.recHistVal, { color: rec.diamonds ? colors.diamond : colors.goldLight, fontWeight: "900" }]}>
                        {rec.diamonds ? `+${rec.diamonds.toLocaleString()} Diamonds` : `+${(rec.coins || 0).toLocaleString()} Coins`}
                      </Text>
                    </View>

                    <View style={styles.recHistRow}>
                      <Text style={styles.recHistLabel}>Method:</Text>
                      <Text style={styles.recHistVal}>Card Payment Only ({rec.brand || "CARD"} •••• {rec.cardLast4 || "••••"})</Text>
                    </View>

                    <View style={styles.recHistRow}>
                      <Text style={styles.recHistLabel}>Beneficiary:</Text>
                      <Text style={styles.recHistVal}>{rec.beneficiary || BENEFICIARY_DETAILS.name}</Text>
                    </View>

                    <View style={styles.recHistRow}>
                      <Text style={styles.recHistLabel}>Bank Name:</Text>
                      <Text style={styles.recHistVal}>{rec.bank || BENEFICIARY_DETAILS.bankName}</Text>
                    </View>

                    <View style={styles.recHistRow}>
                      <Text style={styles.recHistLabel}>Acc Number #:</Text>
                      <Text style={[styles.recHistVal, styles.monoText]}>{rec.account || BENEFICIARY_DETAILS.accountNumber}</Text>
                    </View>

                    <View style={styles.recHistRow}>
                      <Text style={styles.recHistLabel}>IBAN:</Text>
                      <Text style={[styles.recHistVal, styles.monoText, { fontSize: 10 }]}>{rec.iban || BENEFICIARY_DETAILS.iban}</Text>
                    </View>

                    <View style={styles.recHistStatusRow}>
                      <Ionicons name="checkmark-circle" size={14} color="#00E676" style={{ marginRight: 4 }} />
                      <Text style={styles.recHistStatusText}>Settled & Verified • Meezan Bank Protocol</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Credit/Debit Card Checkout Modal */}
      <CardPaymentModal
        visible={cardModalVisible}
        item={selectedPack}
        onClose={() => setCardModalVisible(false)}
        onSuccess={onCardPaymentSuccess}
      />

      {/* Toast Notification Modal */}
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
                <Ionicons name="checkmark-circle" size={26} color="#00E676" />
              </View>
              <Text style={styles.toastTitle}>{toastMeta.title}</Text>
            </View>

            <Text style={styles.toastBody}>{toastMeta.message}</Text>

            <View style={styles.toastFooter}>
              <Pressable onPress={() => setToastVisible(false)} style={styles.toastButton}>
                <Text style={styles.toastButtonText}>Awesome</Text>
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
    backgroundColor: "rgba(9, 26, 17, 0.88)",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTitleWrap: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.goldLight,
    fontWeight: "600",
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...glowShadow,
  },
  rewardCardClaimed: {
    backgroundColor: "rgba(240, 248, 244, 0.88)",
    borderColor: "rgba(30, 107, 69, 0.3)",
  },
  rewardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.forestDark,
  },
  rewardSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  claimedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 230, 118, 0.15)",
    borderRadius: radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  claimedPillText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#00C853",
  },
  claimBtn: {
    backgroundColor: colors.forest,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  claimBtnDone: {
    backgroundColor: "rgba(10, 41, 26, 0.4)",
    borderColor: "transparent",
  },
  claimBtnText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 12,
  },
  tabsContainer: {
    marginBottom: 12,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tabBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: radii.pill,
    backgroundColor: "#062214", // Solid deep green - 100% opaque against white snow!
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.45)",
    ...shadow,
  },
  tabBtnActive: {
    backgroundColor: colors.goldLight, // #F6D365
    borderColor: colors.white,
    ...glowShadow,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.white, // Crisp bright white!
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: "#082114",
    fontWeight: "900",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  section: {
    gap: 12,
  },
  currentInventoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    borderRadius: radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.4)",
    marginBottom: 4,
  },
  currentInventoryText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  hintPackCard: {
    backgroundColor: "rgba(18, 54, 38, 0.85)",
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.15)",
    position: "relative",
    ...shadow,
  },
  hintPackTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  hintBuyButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  currencyBuyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(245, 196, 81, 0.18)",
    borderRadius: radii.pill,
    paddingVertical: 10,
    borderWidth: 1.2,
    borderColor: colors.gold,
  },
  diamondBuyBtn: {
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    borderColor: colors.diamond,
  },
  currencyBuyBtnDisabled: {
    opacity: 0.45,
  },
  currencyBuyBtnText: {
    color: colors.goldLight,
    fontWeight: "900",
    fontSize: 13,
  },
  packCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 54, 38, 0.85)",
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.15)",
    position: "relative",
    ...shadow,
  },
  badgeWrap: {
    position: "absolute",
    top: -8,
    right: 14,
    backgroundColor: colors.forest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  packIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  packDetails: {
    flex: 1,
  },
  packTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
  packDesc: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 11,
    marginTop: 2,
  },
  priceBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  priceBtnText: {
    color: colors.forestDark,
    fontSize: 13,
    fontWeight: "900",
  },
  emptyReceiptsCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyReceiptsTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
  },
  emptyReceiptsSub: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
  },
  receiptHistoryCard: {
    backgroundColor: "rgba(10, 41, 26, 0.8)",
    borderRadius: radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 8,
  },
  recHistHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recHistTxn: {
    color: colors.goldLight,
    fontWeight: "900",
    fontSize: 13,
  },
  recHistDate: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    marginTop: 2,
  },
  recHistAmountPill: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  recHistAmountText: {
    color: colors.goldLight,
    fontWeight: "900",
    fontSize: 12,
  },
  recHistDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 8,
  },
  recHistRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  recHistLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
  },
  recHistVal: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  recHistStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  recHistStatusText: {
    color: "#00E676",
    fontSize: 10,
    fontWeight: "800",
  },
  toastOverlay: {
    flex: 1,
    backgroundColor: "rgba(5, 20, 14, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  toastCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#0D2C1E",
    borderRadius: radii.xl,
    padding: 22,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  toastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  toastIconWrap: {
    marginRight: 10,
  },
  toastTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
  toastBody: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  toastFooter: {
    alignItems: "flex-end",
  },
  toastButton: {
    backgroundColor: colors.gold,
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
  },
  toastButtonText: {
    color: colors.forestDark,
    fontSize: 13,
    fontWeight: "900",
  },
  settlementBanner: {
    backgroundColor: "#071F13",
    marginBottom: 14,
    padding: 14,
    borderRadius: radii.lg,
    borderWidth: 1.8,
    borderColor: "rgba(246, 211, 101, 0.7)",
    ...shadow,
  },
  settlementTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  settlementIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.4)",
  },
  settlementTitle: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  settlementSub: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10.5,
    marginTop: 2,
  },
  cardOnlyPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 230, 118, 0.18)",
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(0, 230, 118, 0.5)",
  },
  cardOnlyPillText: {
    color: "#00E676",
    fontSize: 9.5,
    fontWeight: "900",
  },
  settlementDetailsGrid: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  settlementDetailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  settlementDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 4,
  },
  settlementLabel: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 12,
    fontWeight: "700",
    width: 120,
  },
  settlementValue: {
    color: colors.white,
    fontSize: 12.5,
    fontWeight: "800",
    flex: 1,
    textAlign: "right",
  },
  monoText: {
    fontFamily: "monospace",
    letterSpacing: 0.6,
    color: colors.goldLight,
    fontWeight: "900",
  },
  settlementFooterBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 230, 118, 0.12)",
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(0, 230, 118, 0.35)",
  },
  settlementFooterText: {
    color: "#00E676",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  storeCategoryBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(10, 41, 26, 0.75)",
    borderRadius: radii.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.4)",
    marginBottom: 4,
  },
  storeCategoryTitle: {
    flex: 1,
    color: colors.goldLight,
    fontWeight: "800",
    fontSize: 12,
  },
  cardOnlyMiniBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  cardOnlyMiniText: {
    color: colors.forestDark,
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
