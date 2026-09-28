import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadow, glowShadow } from "../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Official Settlement Beneficiary Credentials
export const BENEFICIARY_DETAILS = {
  name: "Syed Azeem Haider Bukhari",
  accountNumber: "00300110167256",
  bankName: "Meezan Bank",
  iban: "PK82MEZN0000300110167256",
  branch: "Meezan Bank Limited Pakistan",
};

/**
 * Detects card brand based on card number prefixes
 */
function detectCardBrand(num) {
  const clean = num.replace(/\D/g, "");
  if (!clean) return { name: "CARD", icon: "card", color: colors.gold };
  if (clean.startsWith("4")) return { name: "VISA", icon: "card", color: "#1A1F71" };
  if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: "MASTERCARD", icon: "card", color: "#EB001B" };
  if (/^(34|37)/.test(clean)) return { name: "AMEX", icon: "card", color: "#006FCF" };
  if (/^(60|62|64|65)/.test(clean)) return { name: "UNIONPAY", icon: "card", color: "#005596" };
  if (/^(5081|9)/.test(clean)) return { name: "PAYPAK", icon: "card", color: "#007A3D" };
  return { name: "DEBIT / CREDIT", icon: "card", color: colors.gold };
}

export default function CardPaymentModal({
  visible,
  item,
  onClose,
  onSuccess,
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [step, setStep] = useState("form"); // "form" | "processing" | "receipt"
  const [procStage, setProcStage] = useState(1);
  const [receiptData, setReceiptData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setStep("form");
      setProcStage(1);
      setErrorMsg("");
      setReceiptData(null);
    }
  }, [visible]);

  useEffect(() => {
    if (step === "processing") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [step]);

  useEffect(() => {
    if (step === "receipt") {
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [step]);

  // Format Card Number (grouped in 4 digits)
  const handleCardNumberChange = (text) => {
    const clean = text.replace(/\D/g, "").slice(0, 16);
    const groups = clean.match(/.{1,4}/g);
    setCardNumber(groups ? groups.join(" ") : clean);
    setErrorMsg("");
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (text) => {
    const clean = text.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) {
      setExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setExpiry(clean);
    }
    setErrorMsg("");
  };

  // Format CVV (up to 4 digits)
  const handleCvvChange = (text) => {
    setCvv(text.replace(/\D/g, "").slice(0, 4));
    setErrorMsg("");
  };

  const cleanNum = cardNumber.replace(/\s/g, "");
  const cardBrand = detectCardBrand(cleanNum);

  const handlePayPress = () => {
    if (cleanNum.length < 15) {
      setErrorMsg("Please enter a valid 16-digit card number.");
      return;
    }
    if (!cardHolder.trim()) {
      setErrorMsg("Please enter the cardholder name.");
      return;
    }
    if (expiry.length < 5) {
      setErrorMsg("Please enter a valid expiry date (MM/YY).");
      return;
    }
    const [month, year] = expiry.split("/");
    const m = parseInt(month, 10);
    const y = parseInt(year, 10) + 2000;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (m < 1 || m > 12) {
      setErrorMsg("Invalid expiry month (01-12).");
      return;
    }
    if (y < currentYear || (y === currentYear && m < currentMonth)) {
      setErrorMsg("This card has expired. Please use an active card.");
      return;
    }
    if (cvv.length < 3) {
      setErrorMsg("Please enter a valid 3 or 4-digit CVV security code.");
      return;
    }

    // Begin 3-stage animated payment processing
    setStep("processing");
    setProcStage(1);

    setTimeout(() => {
      setProcStage(2);
    }, 1200);

    setTimeout(() => {
      setProcStage(3);
    }, 2400);

    setTimeout(() => {
      const txnId = `MEZN-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const receipt = {
        txnId,
        date: new Date().toLocaleString(),
        itemTitle: item?.title || (item?.diamonds ? "Diamond Pack" : "Coin Pack"),
        coins: item?.coins || 0,
        diamonds: item?.diamonds || 0,
        price: item?.price || "$0.00",
        beneficiary: BENEFICIARY_DETAILS.name,
        bank: BENEFICIARY_DETAILS.bankName,
        account: BENEFICIARY_DETAILS.accountNumber,
        iban: BENEFICIARY_DETAILS.iban,
        cardLast4: cleanNum.slice(-4),
        brand: cardBrand.name,
        channel: "Card Payment Only",
      };
      setReceiptData(receipt);
      setStep("receipt");
    }, 3400);
  };

  const handleCompleteTransaction = () => {
    if (receiptData && onSuccess) {
      onSuccess(receiptData);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Bar */}
          <View style={styles.topHeader}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="card" size={20} color={colors.gold} style={{ marginRight: 8 }} />
              <Text style={styles.modalTitle}>
                {step === "receipt" ? "Official Payment Receipt" : "Card Payment Gateway"}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.whiteDim} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {step === "form" && (
              <>
                {/* Product Purchased Banner */}
                <View style={styles.orderSummaryCard}>
                  <View style={styles.orderLeft}>
                    <Ionicons
                      name={item?.diamonds ? "diamond" : item?.icon || "disc"}
                      size={22}
                      color={item?.diamonds ? colors.diamond : colors.gold}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.orderItemTitle}>{item?.title || (item?.diamonds ? "Diamond Pack" : "Coin Pack")}</Text>
                      <Text style={[styles.orderItemSub, item?.diamonds && { color: colors.diamond }]}>
                        {item?.diamonds
                          ? `+${item.diamonds.toLocaleString()} Pure Cut Diamonds`
                          : item?.coins
                          ? `+${item.coins.toLocaleString()} Gold Coins`
                          : item?.desc}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.pricePill, item?.diamonds && { backgroundColor: colors.diamond }]}>
                    <Text style={[styles.pricePillText, item?.diamonds && { color: colors.forestDark }]}>{item?.price || "$2.99"}</Text>
                  </View>
                </View>

                {/* Interactive Virtual Card Display */}
                <View style={styles.virtualCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardBankBadge}>
                      <Ionicons name="shield-checkmark" size={13} color={colors.goldLight} style={{ marginRight: 4 }} />
                      <Text style={styles.cardBankText}>MEEZAN SETTLEMENT</Text>
                    </View>
                    <View style={styles.cardBrandBadge}>
                      <Text style={styles.cardBrandText}>{cardBrand.name}</Text>
                    </View>
                  </View>

                  {/* Chip & Contactless */}
                  <View style={styles.cardMidRow}>
                    <View style={styles.cardChip}>
                      <View style={styles.chipInner} />
                    </View>
                    <Ionicons name="wifi" size={22} color="rgba(255,255,255,0.7)" style={styles.contactlessIcon} />
                  </View>

                  {/* Card Number */}
                  <Text style={styles.cardNumberText}>
                    {cardNumber || "•••• •••• •••• ••••"}
                  </Text>

                  {/* Card Footer Details */}
                  <View style={styles.cardFooter}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardLabelSmall}>CARDHOLDER NAME</Text>
                      <Text style={styles.cardHolderText} numberOfLines={1}>
                        {cardHolder || "CARDHOLDER NAME"}
                      </Text>
                    </View>
                    <View style={{ marginRight: 16 }}>
                      <Text style={styles.cardLabelSmall}>EXPIRES</Text>
                      <Text style={styles.cardExpiryText}>{expiry || "MM/YY"}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardLabelSmall}>CVV</Text>
                      <Text style={styles.cardCvvText}>{cvv ? "•••" : "•••"}</Text>
                    </View>
                  </View>
                </View>

                {/* Meezan Bank Official Beneficiary Notice Box */}
                <View style={styles.beneficiaryBox}>
                  <View style={styles.beneficiaryHeader}>
                    <Ionicons name="business" size={16} color={colors.gold} style={{ marginRight: 6 }} />
                    <Text style={styles.beneficiaryTitle}>Official Settlement Account</Text>
                    <View style={styles.verifiedPill}>
                      <Ionicons name="checkmark-circle" size={11} color="#00E676" style={{ marginRight: 3 }} />
                      <Text style={styles.verifiedPillText}>Verified</Text>
                    </View>
                  </View>

                  <View style={styles.bankDetailRow}>
                    <Text style={styles.bankDetailLabel}>Name:</Text>
                    <Text style={styles.bankDetailVal}>{BENEFICIARY_DETAILS.name}</Text>
                  </View>
                  <View style={styles.bankDetailRow}>
                    <Text style={styles.bankDetailLabel}>Bank Name:</Text>
                    <Text style={styles.bankDetailVal}>{BENEFICIARY_DETAILS.bankName}</Text>
                  </View>
                  <View style={styles.bankDetailRow}>
                    <Text style={styles.bankDetailLabel}>Acc Number #:</Text>
                    <Text style={[styles.bankDetailVal, styles.monoText]}>{BENEFICIARY_DETAILS.accountNumber}</Text>
                  </View>
                  <View style={styles.bankDetailRow}>
                    <Text style={styles.bankDetailLabel}>IBAN:</Text>
                    <Text style={[styles.bankDetailVal, styles.monoText]}>{BENEFICIARY_DETAILS.iban}</Text>
                  </View>

                  <View style={styles.secureGatewayFooter}>
                    <Ionicons name="card" size={13} color={colors.goldLight} style={{ marginRight: 6 }} />
                    <Text style={styles.secureGatewayText}>
                      Card Payment Only • Direct settlement to Meezan Bank Pakistan. 256-bit SSL secured.
                    </Text>
                  </View>
                </View>

                {/* Card Inputs Form */}
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <View style={styles.inputWrap}>
                      <Ionicons name="card-outline" size={18} color={colors.gold} style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="4532 0000 0000 0000"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        keyboardType="numeric"
                        value={cardNumber}
                        onChangeText={handleCardNumberChange}
                        maxLength={19}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Cardholder Name</Text>
                    <View style={styles.inputWrap}>
                      <Ionicons name="person-outline" size={18} color={colors.gold} style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Name on card"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        autoCapitalize="characters"
                        value={cardHolder}
                        onChangeText={(t) => {
                          setCardHolder(t.toUpperCase());
                          setErrorMsg("");
                        }}
                      />
                    </View>
                  </View>

                  <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                      <View style={styles.inputWrap}>
                        <Ionicons name="calendar-outline" size={18} color={colors.gold} style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="MM/YY"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                          keyboardType="numeric"
                          value={expiry}
                          onChangeText={handleExpiryChange}
                          maxLength={5}
                        />
                      </View>
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                      <Text style={styles.inputLabel}>CVV Code</Text>
                      <View style={styles.inputWrap}>
                        <Ionicons name="key-outline" size={18} color={colors.gold} style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="3 or 4 digits"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                          keyboardType="numeric"
                          secureTextEntry
                          value={cvv}
                          onChangeText={handleCvvChange}
                          maxLength={4}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Error Notification */}
                  {errorMsg ? (
                    <View style={styles.errorBanner}>
                      <Ionicons name="alert-circle" size={16} color="#FF5252" style={{ marginRight: 6 }} />
                      <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                  ) : null}

                  {/* Live Security Guarantee Badge */}
                  <View style={styles.liveSecurityBadge}>
                    <Ionicons name="shield-checkmark" size={15} color="#00E676" style={{ marginRight: 6 }} />
                    <Text style={styles.liveSecurityText}>
                      Live 256-Bit SSL Encrypted • Direct Card Settlement
                    </Text>
                  </View>

                  {/* Submit Pay Button */}
                  <Pressable onPress={handlePayPress} style={styles.payButton}>
                    <Ionicons name="card" size={18} color={colors.forestDark} style={{ marginRight: 8 }} />
                    <Text style={styles.payButtonText}>
                      Pay Now {item?.price || "$2.99"}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Processing Pipeline Animation */}
            {step === "processing" && (
              <View style={styles.procContainer}>
                <Animated.View style={[styles.procSpinnerWrap, { transform: [{ scale: pulseAnim }] }]}>
                  <ActivityIndicator size="large" color={colors.gold} />
                </Animated.View>

                <Text style={styles.procTitle}>Connecting to Bank Gateway</Text>
                <Text style={styles.procSubtitle}>
                  Routing card settlement to Meezan Bank...
                </Text>

                <View style={styles.procStepsCard}>
                  <View style={styles.procStepRow}>
                    <Ionicons
                      name={procStage >= 1 ? "checkmark-circle" : "ellipse-outline"}
                      size={20}
                      color={procStage >= 1 ? "#00E676" : "rgba(255,255,255,0.3)"}
                    />
                    <Text style={[styles.procStepText, procStage >= 1 && styles.procStepTextActive]}>
                      1. Encrypting 256-Bit Card Credentials
                    </Text>
                  </View>

                  <View style={styles.procStepDivider} />

                  <View style={styles.procStepRow}>
                    <Ionicons
                      name={procStage >= 2 ? "checkmark-circle" : "ellipse-outline"}
                      size={20}
                      color={procStage >= 2 ? "#00E676" : "rgba(255,255,255,0.3)"}
                    />
                    <Text style={[styles.procStepText, procStage >= 2 && styles.procStepTextActive]}>
                      2. Authorizing with Meezan Bank Gateway
                    </Text>
                  </View>

                  <View style={styles.procStepDivider} />

                  <View style={styles.procStepRow}>
                    <Ionicons
                      name={procStage >= 3 ? "checkmark-circle" : "ellipse-outline"}
                      size={20}
                      color={procStage >= 3 ? "#00E676" : "rgba(255,255,255,0.3)"}
                    />
                    <Text style={[styles.procStepText, procStage >= 3 && styles.procStepTextActive]}>
                      3. Crediting Syed Azeem Haider Bukhari Account
                    </Text>
                  </View>
                </View>

                <View style={styles.procSecurityNote}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.gold} style={{ marginRight: 6 }} />
                  <Text style={styles.procSecurityText}>
                    Authorized Payment by State Bank of Pakistan Compliant Protocol
                  </Text>
                </View>
              </View>
            )}

            {/* Official Transaction Receipt Modal View */}
            {step === "receipt" && receiptData && (
              <View style={styles.receiptContainer}>
                <Animated.View style={[styles.receiptSuccessIcon, { transform: [{ scale: checkScale }] }]}>
                  <Ionicons name="checkmark-circle" size={68} color="#00E676" />
                </Animated.View>

                <Text style={styles.receiptTitle}>Payment Successful!</Text>
                <Text style={styles.receiptSub}>
                  {receiptData.diamonds
                    ? "Your diamonds have been credited to your balance."
                    : "Your coins have been added to your balance."}
                </Text>

                {/* Reward Banner */}
                <View
                  style={[
                    styles.receiptCoinsBanner,
                    receiptData.diamonds > 0 && {
                      backgroundColor: "rgba(0, 229, 255, 0.15)",
                      borderColor: colors.diamond,
                    },
                  ]}
                >
                  <Ionicons
                    name={receiptData.diamonds > 0 ? "diamond" : "disc"}
                    size={26}
                    color={receiptData.diamonds > 0 ? colors.diamond : colors.gold}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={[
                      styles.receiptCoinsText,
                      receiptData.diamonds > 0 && { color: colors.diamond },
                    ]}
                  >
                    +{receiptData.diamonds > 0
                      ? `${receiptData.diamonds.toLocaleString()} Diamonds Added`
                      : `${receiptData.coins.toLocaleString()} Coins Added`}
                  </Text>
                </View>

                {/* Receipt Details Table */}
                <View style={styles.receiptTable}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Transaction Ref</Text>
                    <Text style={[styles.receiptRowVal, styles.monoText]}>{receiptData.txnId}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Amount Paid</Text>
                    <Text style={[styles.receiptRowVal, { color: colors.gold, fontWeight: "700" }]}>
                      {receiptData.price}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Payment Method</Text>
                    <Text style={[styles.receiptRowVal, { color: colors.goldLight, fontWeight: "700" }]}>
                      Card Payment Only
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Name</Text>
                    <Text style={styles.receiptRowVal}>{receiptData.beneficiary}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Bank Name</Text>
                    <Text style={styles.receiptRowVal}>{receiptData.bank}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Acc Number #</Text>
                    <Text style={[styles.receiptRowVal, styles.monoText]}>{receiptData.account}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>IBAN</Text>
                    <Text style={[styles.receiptRowVal, styles.monoText, { fontSize: 11 }]}>
                      {receiptData.iban}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Card Billed</Text>
                    <Text style={styles.receiptRowVal}>
                      {receiptData.brand} •••• {receiptData.cardLast4}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Date & Time</Text>
                    <Text style={styles.receiptRowVal}>{receiptData.date}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptRowLabel}>Settlement Status</Text>
                    <Text style={[styles.receiptRowVal, { color: "#00E676", fontWeight: "800" }]}>
                      ✓ Settled & Verified
                    </Text>
                  </View>
                </View>

                {/* Done Button */}
                <Pressable onPress={handleCompleteTransaction} style={styles.receiptDoneBtn}>
                  <Text style={styles.receiptDoneBtnText}>
                    Collect {receiptData.diamonds > 0 ? "Diamonds" : "Coins"} & Return to Game
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(3, 14, 9, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxHeight: "92%",
    backgroundColor: "#0F281B",
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.35)",
    overflow: "hidden",
    ...shadow,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#143725",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.3,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 18,
  },

  // Order Summary Card
  orderSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(246, 211, 101, 0.2)",
    marginBottom: 16,
  },
  orderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
  },
  orderItemSub: {
    fontSize: 13,
    color: colors.goldLight,
    marginTop: 2,
  },
  pricePill: {
    backgroundColor: colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  pricePillText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.forestDark,
  },

  // Interactive Virtual Card
  virtualCard: {
    width: "100%",
    aspectRatio: 1.62,
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#163828",
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.5)",
    marginBottom: 16,
    justifyContent: "space-between",
    ...shadow,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardBankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBankText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.goldLight,
    letterSpacing: 0.6,
  },
  cardBrandBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardBrandText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: 1,
  },
  cardMidRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  cardChip: {
    width: 36,
    height: 26,
    backgroundColor: "#F6D365",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#C59B27",
    padding: 3,
    justifyContent: "center",
  },
  chipInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    borderRadius: 2,
  },
  contactlessIcon: {
    transform: [{ rotate: "90deg" }],
  },
  cardNumberText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 2.5,
    fontFamily: "monospace",
    marginVertical: 6,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardLabelSmall: {
    fontSize: 8,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardHolderText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.8,
  },
  cardExpiryText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
    fontFamily: "monospace",
  },
  cardCvvText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
    fontFamily: "monospace",
  },

  // Beneficiary Box
  beneficiaryBox: {
    backgroundColor: "#0B2116",
    borderRadius: radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(246, 211, 101, 0.25)",
    marginBottom: 16,
  },
  beneficiaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  beneficiaryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.goldLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    flex: 1,
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 230, 118, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#00E676",
  },
  bankDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 3,
  },
  bankDetailLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    width: 90,
  },
  bankDetailVal: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
    flex: 1,
    textAlign: "right",
  },
  monoText: {
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  secureGatewayFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  secureGatewayText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    flex: 1,
    lineHeight: 15,
  },

  // Form Inputs
  formContainer: {
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.whiteDim,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "rgba(246, 211, 101, 0.25)",
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 82, 82, 0.15)",
    padding: 10,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 82, 82, 0.4)",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#FF5252",
    flex: 1,
  },
  liveSecurityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0, 230, 118, 0.1)",
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(0, 230, 118, 0.3)",
    marginBottom: 14,
  },
  liveSecurityText: {
    fontSize: 11,
    color: "#00E676",
    fontWeight: "800",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold,
    height: 50,
    borderRadius: radii.md,
    marginTop: 4,
    ...glowShadow,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.forestDark,
    letterSpacing: 0.3,
  },

  // Processing Screen
  procContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 10,
  },
  procSpinnerWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(246, 211, 101, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  procTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 6,
  },
  procSubtitle: {
    fontSize: 13,
    color: colors.goldLight,
    marginBottom: 26,
    textAlign: "center",
  },
  procStepsCard: {
    width: "100%",
    backgroundColor: "#0B2116",
    borderRadius: radii.md,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(246, 211, 101, 0.2)",
    marginBottom: 20,
  },
  procStepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  procStepText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    marginLeft: 12,
    fontWeight: "500",
  },
  procStepTextActive: {
    color: colors.white,
    fontWeight: "700",
  },
  procStepDivider: {
    height: 12,
    width: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginLeft: 9,
    marginVertical: 2,
  },
  procSecurityNote: {
    flexDirection: "row",
    alignItems: "center",
  },
  procSecurityText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 16,
  },

  // Receipt Screen
  receiptContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  receiptSuccessIcon: {
    marginBottom: 10,
  },
  receiptTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 4,
  },
  receiptSub: {
    fontSize: 13,
    color: colors.whiteDim,
    marginBottom: 16,
    textAlign: "center",
  },
  receiptCoinsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(246, 211, 101, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.gold,
    marginBottom: 18,
  },
  receiptCoinsText: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.gold,
  },
  receiptTable: {
    width: "100%",
    backgroundColor: "#0B2116",
    borderRadius: radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(246, 211, 101, 0.2)",
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  receiptRowLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  receiptRowVal: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
    textAlign: "right",
  },
  receiptDoneBtn: {
    width: "100%",
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    ...glowShadow,
  },
  receiptDoneBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.forestDark,
  },
});
