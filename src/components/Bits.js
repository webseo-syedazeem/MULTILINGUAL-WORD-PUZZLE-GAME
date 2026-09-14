import React from "react";
import { View, Text, Pressable, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadow } from "../theme";

export function CoinBadge({ coins, onAdd, style }) {
  return (
    <View style={[styles.coinBadge, style]}>
      <View style={styles.coinIconCircle}>
        <Ionicons name="disc" size={16} color={colors.gold} />
      </View>
      <Text style={styles.coinText}>{coins}</Text>
      {onAdd ? (
        <Pressable onPress={onAdd} style={styles.addBtn} hitSlop={8}>
          <Ionicons name="add" size={15} color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function BackButton({ onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.backBtn, style, pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }]}
      hitSlop={8}
    >
      <Ionicons name="chevron-back" size={22} color={colors.white} />
    </Pressable>
  );
}

export function IconCircleButton({ name, onPress, size = 20, style, iconColor = colors.white }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.backBtn, style, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]}
      hitSlop={8}
    >
      <Ionicons name={name} size={size} color={iconColor} />
    </Pressable>
  );
}

export function SettingsRow({ icon, label, value, onValueChange, rightText, onPress, isLast }) {
  const content = (
    <View style={[styles.settingsRow, !isLast && styles.settingsRowBorder]}>
      <View style={styles.settingsIconWrap}>
        <Ionicons name={icon} size={18} color={colors.white} />
      </View>
      <Text style={styles.settingsLabel}>{label}</Text>
      {typeof value === "boolean" ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "rgba(255,255,255,0.25)", true: colors.forestLight }}
          thumbColor={colors.white}
          ios_backgroundColor="rgba(255,255,255,0.25)"
        />
      ) : rightText !== undefined ? (
        <View style={styles.rowRight}>
          <Text style={styles.rightText}>{rightText}</Text>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
      )}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.82 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 41, 26, 0.72)",
    borderRadius: radii.pill,
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: 10,
    borderWidth: 1.2,
    borderColor: colors.cardBorderGold,
    ...shadow,
  },
  coinIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  coinText: { color: colors.white, fontWeight: "800", fontSize: 14, marginRight: 6 },
  addBtn: {
    backgroundColor: colors.forestLight,
    borderRadius: radii.pill,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(10, 41, 26, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.3)",
    ...shadow,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  settingsIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingsLabel: { flex: 1, color: colors.white, fontSize: 15, fontWeight: "600" },
  rowRight: { flexDirection: "row", alignItems: "center" },
  rightText: { color: colors.cream, marginRight: 6, fontWeight: "600", fontSize: 14 },
});

