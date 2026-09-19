import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../theme";

const DEFAULT_BG = require("../../assets/images/clean_nature_bg.jpg");

export default function ArtworkBackground({
  source = DEFAULT_BG,
  children,
  opacity = 0.25,
  tint = colors.forestDark,
}) {
  const imageOpacity = Math.max(opacity, 0.65);
  const tintOpacity = tint === colors.cream ? 0.45 : 0.35;

  return (
    <View style={styles.root}>
      <Image source={source || DEFAULT_BG} style={[styles.image, { opacity: imageOpacity }]} resizeMode="cover" />
      <View pointerEvents="none" style={[styles.tint, { backgroundColor: tint, opacity: tintOpacity }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.forestDark },
  image: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  tint: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1 },
});
