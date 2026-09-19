import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { colors } from "../theme";

const DEFAULT_BG = require("../../assets/images/mountain_alps.jpg");

export default function ScreenBG({
  source = DEFAULT_BG,
  children,
  dim = 0,
  overlayColor = "rgba(10, 41, 26, ",
  style,
}) {
  const [loadFailed, setLoadFailed] = useState(false);

  // Track source identifier so loadFailed resets whenever the level/source changes
  const sourceKey =
    source && typeof source === "object"
      ? `${source.uri || ""}_${source.levelId || ""}_${source.source || ""}`
      : String(source);

  useEffect(() => {
    setLoadFailed(false);
  }, [sourceKey]);

  // Determine fallback and primary source
  const fallbackSource =
    (source && typeof source === "object" && (source.source || source.local)) || DEFAULT_BG;

  let resolvedSource = fallbackSource;

  if (loadFailed) {
    resolvedSource = fallbackSource;
  } else if (typeof source === "number") {
    resolvedSource = source;
  } else if (source && typeof source === "object") {
    if (source.uri) {
      resolvedSource = { uri: source.uri };
    } else if (source.source || source.local) {
      resolvedSource = source.source || source.local;
    } else {
      resolvedSource = source;
    }
  } else if (typeof source === "string") {
    resolvedSource = { uri: source };
  }

  return (
    <ImageBackground
      source={resolvedSource}
      style={[styles.bg, style]}
      resizeMode="cover"
      onError={() => setLoadFailed(true)}
    >
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
