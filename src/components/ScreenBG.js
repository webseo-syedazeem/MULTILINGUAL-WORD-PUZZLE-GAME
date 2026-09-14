import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { colors } from "../theme";

const DEFAULT_BG = require("../../assets/images/clean_nature_bg.jpg");

export default function ScreenBG({ source = DEFAULT_BG, children, dim = 0, overlayColor = "rgba(10, 41, 26, ", style }) {
  return (
    <ImageBackground source={source || DEFAULT_BG} style={[styles.bg, style]} resizeMode="cover">
      {dim > 0 && (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: `${overlayColor}${dim})` }]}
        />
      )}
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: colors.forestDark,
  },
});

