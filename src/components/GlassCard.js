import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { colors, radii, shadow } from "../theme";

export default function GlassCard({
  children,
  style,
  variant = "cream", // "cream" | "emerald" | "light" | "gold"
  onPress,
}) {
  let bg = colors.creamCard;
  let border = colors.cardBorder;

  if (variant === "emerald") {
    bg = colors.cardGlass;
    border = "rgba(255,255,255,0.22)";
  } else if (variant === "gold") {
    bg = "rgba(251, 247, 236, 0.96)";
    border = colors.cardBorderGold;
  } else if (variant === "light") {
    bg = "rgba(255, 255, 255, 0.88)";
    border = "rgba(255,255,255,0.6)";
  }

  const cardStyle = [
    styles.card,
    { backgroundColor: bg, borderColor: border },
    variant === "gold" && styles.goldBorder,
    shadow,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1.2,
    padding: 16,
  },
  goldBorder: {
    borderWidth: 1.8,
    borderColor: colors.gold,
  },
});

