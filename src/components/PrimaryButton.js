import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadow, glowShadow } from "../theme";

export default function PrimaryButton({
  title,
  onPress,
  variant = "gold", // "gold" | "green" | "outline" | "cream"
  icon,
  iconRight,
  disabled = false,
  style,
  textStyle,
}) {
  let bg = colors.gold;
  let textColor = colors.forestDark;
  let borderColor = "transparent";

  if (variant === "green") {
    bg = colors.forest;
    textColor = colors.white;
    borderColor = "rgba(245, 196, 81, 0.45)";
  } else if (variant === "emerald") {
    bg = colors.forestDark;
    textColor = colors.cream;
    borderColor = colors.cardBorderGold;
  } else if (variant === "cream") {
    bg = colors.creamCard;
    textColor = colors.forestDark;
    borderColor = "rgba(255, 255, 255, 0.6)";
  } else if (variant === "outline") {
    bg = "transparent";
    textColor = colors.white;
    borderColor = colors.white;
  } else {
    // gold
    bg = colors.gold;
    textColor = colors.forestDark;
    borderColor = "#FFF2AF";
  }

  const useGlow = variant === "gold";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        useGlow ? glowShadow : shadow,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? (
          <Ionicons name={icon} size={20} color={textColor} style={{ marginRight: 8 }} />
        ) : null}
        <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
        {iconRight ? (
          <Ionicons name={iconRight} size={20} color={textColor} style={{ marginLeft: 8 }} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  text: { fontSize: 17, fontWeight: "800", letterSpacing: 0.3 },
});

