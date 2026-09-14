import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BackButton } from "../components/Bits";
import PrimaryButton from "../components/PrimaryButton";
import { colors, radii, shadow, glowShadow } from "../theme";

const BG_IMAGE = require("../../assets/images/scenic_window_bg.jpg");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  const goHome = () => navigation.replace("MainTabs");

  return (
    <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <BackButton onPress={() => navigation.goBack()} />
            <Pressable
              onPress={() => setIsSignUp((v) => !v)}
              style={styles.toggleModeBtn}
            >
              <Text style={styles.toggleModePrompt}>
                {isSignUp ? "Have an account?" : "Don't have an account?"}{" "}
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
            {/* Logo & Headline */}
            <View style={styles.brandSection}>
              <View style={styles.logoGroup}>
                <View style={styles.leafIconWrap}>
                  <Ionicons name="leaf" size={18} color={colors.gold} />
                </View>
                <View>
                  <Text style={styles.brandTitle}>WORD CONNECT</Text>
                  <Text style={styles.brandSubtitle}>MULTILINGUAL</Text>
                </View>
              </View>

              <Text style={styles.headline}>Play. Learn. Connect.</Text>
              <Text style={styles.subHeadline}>
                A brighter you. A more connected world.
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Email / Username */}
              <View style={styles.inputWrap}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Email or Username"
                  placeholderTextColor="#8A9D93"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>

              {/* Password */}
              <View style={styles.inputWrap}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#8A9D93"
                  value={password}
                  onChangeText={setPassword}
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
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>

              {/* Remember & Forgot row */}
              <View style={styles.optionsRow}>
                <Pressable
                  onPress={() => setRememberMe((r) => !r)}
                  style={styles.rememberWrap}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxActive,
                    ]}
                  >
                    {rememberMe ? (
                      <Ionicons name="checkmark" size={13} color={colors.white} />
                    ) : null}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </Pressable>

                <Pressable onPress={goHome} hitSlop={8}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>
              </View>

              {/* Primary Action Button */}
              <PrimaryButton
                title={isSignUp ? "Create Account" : "Log In"}
                iconRight="arrow-forward"
                variant="green"
                onPress={goHome}
                style={styles.loginBtn}
              />

              {/* OR Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtons}>
                <Pressable
                  onPress={goHome}
                  style={({ pressed }) => [
                    styles.socialBtn,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
                  ]}
                >
                  <Ionicons name="logo-google" size={18} color="#EA4335" />
                  <Text style={styles.socialBtnText}>Continue with Google</Text>
                </Pressable>

                <Pressable
                  onPress={goHome}
                  style={({ pressed }) => [
                    styles.socialBtn,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
                  ]}
                >
                  <Ionicons name="logo-apple" size={20} color="#111" />
                  <Text style={styles.socialBtnText}>Continue with Apple</Text>
                </Pressable>

                <Pressable
                  onPress={goHome}
                  style={({ pressed }) => [
                    styles.socialBtn,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
                  ]}
                >
                  <Ionicons name="mail" size={18} color={colors.forest} />
                  <Text style={styles.socialBtnText}>Continue with Email</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: "rgba(10, 36, 23, 0.42)",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  toggleModePrompt: {
    color: colors.cream,
    fontSize: 13,
    fontWeight: "600",
  },
  toggleModeLink: {
    color: colors.gold,
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 32,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 26,
  },
  logoGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  leafIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(15, 58, 38, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
  },
  brandTitle: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    color: colors.cream,
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 2.2,
  },
  headline: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeadline: {
    fontSize: 13,
    color: colors.cream,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 236, 0.95)",
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    ...shadow,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.forestDark,
    fontSize: 15,
    fontWeight: "600",
  },
  eyeBtn: {
    padding: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  rememberWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.7)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: colors.forest,
    borderColor: colors.gold,
  },
  rememberText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  forgotText: {
    color: colors.goldLight,
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  loginBtn: {
    width: "100%",
    marginBottom: 20,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: colors.cream,
    fontWeight: "800",
    fontSize: 12,
    marginHorizontal: 14,
    letterSpacing: 1.5,
  },
  socialButtons: {
    gap: 10,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(251, 247, 236, 0.94)",
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.6)",
    ...shadow,
  },
  socialBtnText: {
    color: colors.forestDark,
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 10,
  },
});

