import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii } from "../theme";
import { useT } from "../i18n/useT";

const ICONS = {
  Home: { active: "home", inactive: "home-outline" },
  Daily: { active: "calendar", inactive: "calendar-outline" },
  Worlds: { active: "earth", inactive: "earth-outline" },
  Shop: { active: "storefront", inactive: "storefront-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

const INACTIVE_COLOR = "rgba(255,255,255,0.78)";
const ACTIVE_COLOR = "#FFFFFF";
const ACCENT = "#6FAE59";
const ACCENT_DEEP = "#4C8A3B";
const GOLD = "#F5C451";

export const TAB_BAR_HEIGHT = 72;
export const TAB_BAR_BOTTOM_CLEARANCE = 110;

export default function GlassTabBar({ state, descriptors, navigation }) {
  const { isRTL } = useT();
  const insets = useSafeAreaInsets();
  const [layouts, setLayouts] = useState({});
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(0)).current;
  const scaleRefs = useRef(state.routes.map(() => new Animated.Value(1))).current;
  const focusAnims = useRef(state.routes.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))).current;

  // ALL hooks MUST run unconditionally before any early return!
  useEffect(() => {
    state.routes.forEach((_, i) => {
      Animated.timing(focusAnims[i], {
        toValue: i === state.index ? 1 : 0,
        duration: 240,
        useNativeDriver: true,
      }).start();
    });

    const activeLayout = layouts[state.index];
    if (activeLayout) {
      Animated.parallel([
        Animated.spring(indicatorX, {
          toValue: activeLayout.x,
          useNativeDriver: true,
          speed: 16,
          bounciness: 9,
        }),
        Animated.spring(indicatorW, {
          toValue: activeLayout.width,
          useNativeDriver: false,
          speed: 16,
          bounciness: 9,
        }),
      ]).start();
    }
  }, [state.index, layouts]);

  // Check if current screen requests tab bar to be hidden (executed AFTER all hooks have run)
  const currentRoute = state.routes[state.index];
  const currentDescriptor = descriptors[currentRoute.key];
  const tabBarStyle = currentDescriptor?.options?.tabBarStyle;
  if (tabBarStyle && tabBarStyle.display === "none") {
    return null;
  }

  const onTabLayout = (index) => (e) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => {
      if (prev[index] && prev[index].x === x && prev[index].width === width) return prev;
      return { ...prev, [index]: { x, width } };
    });
  };

  const onPressTab = (route, index, isFocused) => {
    Animated.sequence([
      Animated.timing(scaleRefs[index], { toValue: 0.82, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleRefs[index], { toValue: 1, friction: 3.5, tension: 140, useNativeDriver: true }),
    ]).start();

    const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={styles.shadowCatcher}>
        <View style={styles.glassContainer}>
          {/* Real blur so background content doesn't bleed through and break contrast */}
          <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />

          {/* Tint layer on top of the blur, darker than before for legibility */}
          <LinearGradient
            colors={["rgba(13, 30, 18, 0.55)", "rgba(13, 30, 18, 0.78)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* Top sheen for the "glass catching light" edge */}
          <LinearGradient
            colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0.0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.topSheen}
            pointerEvents="none"
          />
          {/* Hairline border glow */}
          <View style={styles.borderGlow} pointerEvents="none" />

          <View style={[styles.row, isRTL && { flexDirection: "row-reverse" }]}>
            {layouts[state.index] && (
              <Animated.View
                pointerEvents="none"
                style={[styles.indicatorOuter, { transform: [{ translateX: indicatorX }] }]}
              >
                <Animated.View style={[styles.indicatorWrap, { width: indicatorW }]}>
                  <LinearGradient
                    colors={[ACCENT, ACCENT_DEEP]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.indicator}
                  />
                  <View style={styles.indicatorHighlight} />
                </Animated.View>
              </Animated.View>
            )}

            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label = options.tabBarLabel ?? route.name;
              const isFocused = state.index === index;

              const focusAnim = focusAnims[index];
              const iconTranslateY = focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });

              return (
                <Pressable
                  key={route.key}
                  onLayout={onTabLayout(index)}
                  onPress={() => onPressTab(route, index, isFocused)}
                  style={styles.tabBtn}
                  accessibilityRole="button"
                  accessibilityLabel={String(label)}
                  accessibilityState={isFocused ? { selected: true } : {}}
                  hitSlop={{ top: 6, bottom: 6 }}
                >
                  <Animated.View
                    style={{
                      alignItems: "center",
                      transform: [{ scale: scaleRefs[index] }, { translateY: iconTranslateY }],
                    }}
                  >
                    <View style={styles.iconStack}>
                      <Ionicons name={ICONS[route.name].inactive} size={21} color={INACTIVE_COLOR} />
                      <Animated.View style={[StyleSheet.absoluteFill, { opacity: focusAnim, alignItems: "center" }]}>
                        <Ionicons name={ICONS[route.name].active} size={21} color={ACTIVE_COLOR} />
                      </Animated.View>
                    </View>

                    <View style={styles.labelStack}>
                      <Text
                        style={[styles.label, { color: INACTIVE_COLOR, opacity: isFocused ? 0 : 1 }]}
                        numberOfLines={1}
                        allowFontScaling={false}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                      >
                        {label}
                      </Text>
                      <Animated.Text
                        style={[
                          styles.label,
                          styles.labelAbsolute,
                          { color: ACTIVE_COLOR, opacity: focusAnim, fontWeight: "800" },
                        ]}
                        numberOfLines={1}
                        allowFontScaling={false}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                      >
                        {label}
                      </Animated.Text>
                    </View>
                  </Animated.View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 10,
    backgroundColor: "transparent",
  },
  shadowCatcher: {
    borderRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F0E",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 20,
      },
      android: {
        elevation: 14,
      },
    }),
  },
  glassContainer: {
    height: 72,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(8, 22, 15, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  topSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 26,
  },
  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 8,
  },
  indicatorOuter: {
    position: "absolute",
    top: 8,
    bottom: 8,
    left: 0,
    justifyContent: "center",
  },
  indicatorWrap: {
    height: "100%",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    ...Platform.select({
      ios: {
        shadowColor: ACCENT_DEEP,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  indicator: {
    flex: 1,
  },
  indicatorHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconStack: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  labelStack: {
    marginTop: 4,
    height: 13,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.3,
    textAlign: "center",
    textTransform: "uppercase",
  },
  labelAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});