import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackButton } from "../components/Bits";
import PrimaryButton from "../components/PrimaryButton";
import LuxuryModal from "../components/LuxuryModal";
import { colors, radii, shadow, glowShadow } from "../theme";
import { useGame } from "../context/GameContext";
import { useT } from "../i18n/useT";

const BG_IMAGE = require("../../assets/images/scenic_window_bg.jpg");

function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 8) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "#E74C3C" };
  if (score === 2) return { score: 2, label: "Fair", color: "#E67E22" };
  if (score === 3) return { score: 3, label: "Good", color: colors.gold };
  return { score: 4, label: "Strong", color: "#2ECC71" };
}

export default function LoginScreen({ navigation }) {
  const { login, register, backendConfigured } = useGame();
  const { t } = useT();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // 'name' | 'email' | 'password' | null

  // Screen entrance animation (one-shot, hardware-accelerated)
  const entranceAnim = useRef(new Animated.Value(0)).current;

  // Theme-styled luxury dialog state
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    icon: "alert-circle",
    iconColor: colors.goldLight,
  });

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const switchMode = (signUp) => {
    setIsSignUp(signUp);
  };

  const showAlert = (title, message, icon = "alert-circle", iconColor = colors.goldLight) => {
    setAlertConfig({ visible: true, title, message, icon, iconColor });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const goHome = () => navigation.replace("MainTabs");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const pwdStrength = getPasswordStrength(password);

  const submit = async () => {
    if (!backendConfigured) {
      goHome();
      return;
    }
    if (!email || !password) {
      showAlert(
        t("login.missingInfoTitle") || "Incomplete Details",
        t("login.missingInfoMsg") || "Please enter your email and password to proceed.",
        "warning-outline",
        "#F39C12"
      );
      return;
    }
    if (isSignUp && !displayName.trim()) {
      showAlert(
        "Player Name Needed",
        "Please provide your explorer name to personalize your adventure!",
        "person-outline",
        colors.goldLight
      );
      return;
    }

    setSubmitting(true);
    try {
      if (isSignUp) {
        await register(email.trim(), password, displayName.trim());
      } else {
        await login(email.trim(), password);
      }
      goHome();
    } catch (err) {
      showAlert(
        isSignUp
          ? t("login.signUpFailTitle") || "Registration Failed"
          : t("login.logInFailTitle") || "Login Failed",
        err.message || "An unexpected error occurred. Please try again.",
        "alert-circle",
        "#FF6B6B"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {/* Top Bar with High-Contrast Header Pill */}
          <View style={styles.topBar}>
            <BackButton
              onPress={() =>
                navigation.canGoBack && navigation.canGoBack()
                  ? navigation.goBack()
                  : navigation.replace("MainTabs")
              }
            />

            {/* Mode Switch Header Button */}
            <Pressable
              onPress={() => switchMode(!isSignUp)}
              style={styles.toggleModeBtn}
              hitSlop={8}
            >
              <Text style={styles.toggleModePrompt}>
                {isSignUp ? "Have an account?" : "New explorer?"}{" "}
                <Text style={styles.toggleModeLink}>
                  {isSignUp ? "Log In" : "Sign Up"}
                </Text>
              </Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{
                opacity: entranceAnim,
                transform: [
                  {
                    translateY: entranceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                ],
              }}
            >
              {/* Brand Logo & Title */}
              <View style={styles.brandSection}>
                <View style={styles.logoStack}>
                  <View style={styles.logoHalo} />
                  <View style={styles.leafIconWrap}>
                    <Ionicons name="leaf" size={26} color={colors.gold} />
                  </View>
                </View>

                <Text style={styles.brandTitle}>{t("login.brandTitle")}</Text>
                <Text style={styles.brandSubtitle}>{t("login.brandSubtitle")}</Text>

                <Text style={styles.headline}>
                  {isSignUp ? "Create Explorer Account" : t("login.headline")}
                </Text>
                <Text style={styles.subHeadline}>
                  {isSignUp
                    ? "Save your puzzle progress, sync seamlessly across devices & climb leaderboards!"
                    : t("login.subHeadline")}
                </Text>

                {/* Segmented Tab Switcher - Instant, Zero Lag, Crisp Contrast */}
                <View style={styles.segmentWrap}>
                  <Pressable
                    style={[
                      styles.segmentBtn,
                      !isSignUp && styles.segmentBtnActive,
                    ]}
                    onPress={() => setIsSignUp(false)}
                  >
                    <Ionicons
                      name="log-in-outline"
                      size={18}
                      color={!isSignUp ? colors.forestDark : colors.white}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.segmentBtnText,
                        !isSignUp && styles.segmentBtnTextActive,
                      ]}
                    >
                      {t("login.logIn") || "Log In"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.segmentBtn,
                      isSignUp && styles.segmentBtnActive,
                    ]}
                    onPress={() => setIsSignUp(true)}
                  >
                    <Ionicons
                      name="sparkles"
                      size={16}
                      color={isSignUp ? colors.forestDark : colors.white}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.segmentBtnText,
                        isSignUp && styles.segmentBtnTextActive,
                      ]}
                    >
                      {t("login.signUp") || "Sign Up"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Luxury Frosted Glass Form Card */}
              <View style={styles.cardConsole}>
                {/* Display Name (Only in Sign Up mode) */}
                {isSignUp && (
                  <View
                    style={[
                      styles.inputWrap,
                      focusedField === "name" && styles.inputWrapFocused,
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={focusedField === "name" ? colors.gold : colors.forestDark}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Your Player Name (e.g. WordMaster)"
                      placeholderTextColor="#7B8F84"
                      value={displayName}
                      onChangeText={setDisplayName}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      autoCapitalize="words"
                      maxLength={32}
                      style={styles.input}
                    />
                  </View>
                )}

                {/* Email / Username */}
                <View
                  style={[
                    styles.inputWrap,
                    focusedField === "email" && styles.inputWrapFocused,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={focusedField === "email" ? colors.gold : colors.forestDark}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder={t("login.emailPlaceholder")}
                    placeholderTextColor="#7B8F84"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                  {isEmailValid && (
                    <View style={styles.validCheck}>
                      <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
                    </View>
                  )}
                </View>

                {/* Password Input */}
                <View
                  style={[
                    styles.inputWrap,
                    focusedField === "password" && styles.inputWrapFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={focusedField === "password" ? colors.gold : colors.forestDark}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder={t("login.passwordPlaceholder")}
                    placeholderTextColor="#7B8F84"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPass}
                    style={styles.input}
                  />
                  <Pressable
                    onPress={() => setShowPass((s) => !s)}
                    style={styles.eyeBtn}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showPass ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.forestDark}
                    />
                  </Pressable>
                </View>

                {/* Live Password Strength Meter (Sign Up mode) */}
                {isSignUp && password.length > 0 && (
                  <View style={styles.strengthMeterContainer}>
                    <View style={styles.strengthBarsRow}>
                      {[1, 2, 3, 4].map((step) => (
                        <View
                          key={step}
                          style={[
                            styles.strengthBar,
                            {
                              backgroundColor:
                                pwdStrength.score >= step
                                  ? pwdStrength.color
                                  : "rgba(255,255,255,0.18)",
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <View style={styles.strengthInfoRow}>
                      <Text style={styles.strengthHint}>Security Level</Text>
                      <Text style={[styles.strengthLabel, { color: pwdStrength.color }]}>
                        {pwdStrength.label}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Options Row (Remember Me / Forgot Password - Log In mode) */}
                {!isSignUp && (
                  <View style={styles.optionsRow}>
                    <Pressable
                      onPress={() => setRememberMe((v) => !v)}
                      style={styles.checkboxRow}
                      hitSlop={8}
                    >
                      <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                        {rememberMe && <Ionicons name="checkmark" size={13} color={colors.white} />}
                      </View>
                      <Text style={styles.checkboxLabel}>{t("login.rememberMe")}</Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        showAlert(
                          "Password Assistance",
                          "To recover your password, ensure your backend account is configured or reach out to support.",
                          "help-circle-outline",
                          colors.goldLight
                        )
                      }
                      hitSlop={8}
                    >
                      <Text style={styles.forgotPassLink}>{t("login.forgotPassword")}</Text>
                    </Pressable>
                  </View>
                )}

                {/* Main Submit Button */}
                <PrimaryButton
                  title={
                    submitting
                      ? (t("login.pleaseWait") || "Please wait...")
                      : isSignUp
                      ? (t("login.createAccount") || "Create Free Account")
                      : (t("login.logIn") || "Log In")
                  }
                  iconRight={isSignUp ? "sparkles" : "arrow-forward"}
                  variant={isSignUp ? "gold" : "green"}
                  disabled={submitting}
                  onPress={submit}
                  style={styles.submitBtn}
                />

                {/* Quick Switch Helper */}
                <Pressable
                  onPress={() => setIsSignUp(!isSignUp)}
                  style={styles.bottomSwitchBtn}
                  hitSlop={8}
                >
                  <Text style={styles.bottomSwitchText}>
                    {isSignUp
                      ? (t("login.haveAccount") || "Already have an account?")
                      : (t("login.noAccount") || "Don't have an account?")}{" "}
                    <Text style={styles.bottomSwitchHighlight}>
                      {isSignUp ? (t("login.logInLink") || "Log In here") : (t("login.signUp") || "Sign Up free")}
                    </Text>
                  </Text>
                </Pressable>

                {/* Elegant Golden Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>{t("login.or")}</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Guest / Offline Access Button */}
                <Pressable
                  onPress={goHome}
                  style={({ pressed }) => [
                    styles.guestBtn,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
                  ]}
                >
                  <Ionicons name="game-controller-outline" size={20} color={colors.forestDark} />
                  <Text style={styles.guestBtnText}>Play as Guest (Offline Mode)</Text>
                </Pressable>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Luxury Alert Modal */}
        <LuxuryModal
          visible={alertConfig.visible}
          onClose={closeAlert}
          title={alertConfig.title}
          message={alertConfig.message}
          icon={alertConfig.icon}
          iconColor={alertConfig.iconColor}
          buttons={[{ text: "OK", onPress: closeAlert, style: "gold" }]}
        />
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
    backgroundColor: "rgba(10, 36, 23, 0.62)",
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  toggleModeBtn: {
    backgroundColor: "rgba(10, 38, 24, 0.92)",
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.75)",
    ...glowShadow,
  },
  toggleModePrompt: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  toggleModeLink: {
    color: colors.goldLight,
    fontWeight: "900",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
  },

  /* Brand Section */
  brandSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoStack: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    width: 68,
    height: 68,
  },
  logoHalo: {
    position: "absolute",
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(246, 211, 101, 0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.4)",
  },
  leafIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(15, 58, 38, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.cardBorderGold,
    ...glowShadow,
  },
  brandTitle: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 20,
    letterSpacing: 2.2,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 4,
  },
  brandSubtitle: {
    color: colors.cream,
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 10,
  },
  headline: {
    fontSize: 23,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 4,
  },
  subHeadline: {
    fontSize: 13,
    color: colors.cream,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* Segmented Slider Tab Bar */
  segmentWrap: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgba(6, 26, 16, 0.9)",
    borderRadius: radii.pill,
    padding: 4,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: radii.pill,
  },
  segmentBtnActive: {
    backgroundColor: colors.gold,
    ...glowShadow,
  },
  segmentBtnText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  segmentBtnTextActive: {
    color: colors.forestDark,
    fontWeight: "900",
  },

  /* Form Glassmorphism Console Card */
  cardConsole: {
    backgroundColor: "rgba(10, 39, 25, 0.85)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(246, 211, 101, 0.35)",
    ...shadow,
  },
  animatedFieldWrap: {
    width: "100%",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 236, 0.96)",
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    marginBottom: 14,
    height: 52,
    borderWidth: 1.8,
    borderColor: "rgba(246, 211, 101, 0.4)",
    ...shadow,
  },
  inputWrapFocused: {
    borderColor: colors.gold,
    backgroundColor: colors.white,
    ...glowShadow,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.forestDark,
    fontWeight: "700",
  },
  validCheck: {
    paddingLeft: 6,
  },
  eyeBtn: {
    padding: 6,
  },

  /* Password Strength Meter */
  strengthMeterContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  strengthBarsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  strengthHint: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: "700",
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "900",
  },

  /* Options Row */
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: "rgba(10, 41, 26, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.forest,
  },
  checkboxLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  forgotPassLink: {
    color: colors.goldLight,
    fontSize: 13,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  submitBtn: {
    marginTop: 4,
    marginBottom: 14,
  },
  bottomSwitchBtn: {
    alignItems: "center",
    paddingVertical: 6,
    marginBottom: 16,
  },
  bottomSwitchText: {
    color: colors.cream,
    fontSize: 13,
    fontWeight: "700",
  },
  bottomSwitchHighlight: {
    color: colors.goldLight,
    fontWeight: "900",
    textDecorationLine: "underline",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  dividerText: {
    color: colors.goldLight,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: 12,
  },

  guestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(251, 247, 236, 0.94)",
    borderRadius: radii.pill,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  guestBtnText: {
    color: colors.forestDark,
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
  },
});
