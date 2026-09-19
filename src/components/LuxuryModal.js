import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadow, glowShadow } from "../theme";
import PrimaryButton from "./PrimaryButton";

export default function LuxuryModal({
  visible,
  onClose,
  icon = "sparkles",
  iconColor = colors.goldLight,
  title,
  message,
  buttons = [],
  children,
}) {
  const displayButtons =
    buttons && buttons.length > 0
      ? buttons
      : [{ text: "Got It", onPress: onClose, style: "gold" }];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Top Decorative Icon */}
          {icon ? (
            <View style={[styles.iconWrap, { borderColor: iconColor }]}>
              <Ionicons name={icon} size={28} color={iconColor} />
            </View>
          ) : null}

          {/* Title */}
          {title ? <Text style={styles.title}>{title}</Text> : null}

          {/* Message Body */}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          {/* Optional Children */}
          {children}

          {/* Button Row / Stack */}
          <View
            style={[
              styles.buttonContainer,
              displayButtons.length > 1 && styles.buttonContainerRow,
            ]}
          >
            {displayButtons.map((btn, idx) => {
              let variant = "gold";
              if (btn.style === "destructive" || btn.style === "danger") {
                variant = "danger";
              } else if (btn.style === "cancel" || btn.style === "glass") {
                variant = "glass";
              } else if (btn.style === "green") {
                variant = "green";
              }

              return (
                <PrimaryButton
                  key={idx}
                  title={btn.text}
                  onPress={() => {
                    if (btn.onPress) btn.onPress();
                    else if (onClose) onClose();
                  }}
                  variant={variant}
                  style={[
                    styles.btn,
                    displayButtons.length > 1 && { flex: 1, marginHorizontal: 4 },
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 20, 14, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#0D2C1E",
    borderRadius: radii.xl,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...glowShadow,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(10, 41, 26, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginBottom: 16,
    ...shadow,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.white,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 6,
  },
  buttonContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    paddingVertical: 13,
  },
});
