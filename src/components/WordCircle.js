import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, PanResponder, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadow, glowShadow } from "../theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DEFAULT_CIRCLE_SIZE = Math.min(236, Math.floor(SCREEN_WIDTH * 0.62));

/**
 * Mathematically computes the optimal layout geometry for any number of letters.
 * - For count <= 8: Single circular ring with responsive node sizing & radius.
 * - For count >= 9: Dual concentric rings (outer & inner) with staggered angles
 *   so nodes NEVER overlap, spacing is balanced, and touch targets remain large.
 */
export function getWheelGeometry(count, circleSize = DEFAULT_CIRCLE_SIZE) {
  const half = circleSize / 2;

  if (count <= 8) {
    // ----------------------------------------------------
    // Mode 1: Single Ring Layout (3 to 8 letters)
    // ----------------------------------------------------
    let nodeSize = 56;
    let radius = 72;
    let fontSize = 24;

    if (count <= 3) {
      nodeSize = 58;
      radius = half - nodeSize / 2 - 20;
      fontSize = 25;
    } else if (count === 4) {
      nodeSize = 56;
      radius = half - nodeSize / 2 - 18;
      fontSize = 24;
    } else if (count === 5) {
      nodeSize = 52;
      radius = half - nodeSize / 2 - 16;
      fontSize = 22;
    } else if (count === 6) {
      nodeSize = 48;
      radius = half - nodeSize / 2 - 14;
      fontSize = 20;
    } else if (count === 7) {
      nodeSize = 44;
      radius = half - nodeSize / 2 - 12;
      fontSize = 18;
    } else {
      // 8 letters
      nodeSize = 40;
      radius = half - nodeSize / 2 - 10;
      fontSize = 17;
    }

    const positions = [];
    for (let i = 0; i < count; i++) {
      // Start from 12 o'clock (-90 degrees) and distribute clockwise
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      positions.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }

    const hitRadius = nodeSize / 2 + 10;
    return { circleSize, nodeSize, radius, fontSize, hitRadius, positions, isDualRing: false };
  } else {
    // ----------------------------------------------------
    // Mode 2: Concentric Dual Rings (9+ letters)
    // Completely eliminates crowding and prevents node collisions!
    // ----------------------------------------------------
    const outerCount = Math.ceil(count * 0.6);
    const innerCount = count - outerCount;

    const outerRadius = half - 26;
    const innerRadius = Math.max(38, Math.round(outerRadius * 0.52));

    // Dynamic node diameter bounded to guarantee clear spacing on both rings
    const outerMaxNode = Math.floor(2 * outerRadius * Math.sin(Math.PI / outerCount) - 6);
    const innerMaxNode = Math.floor(2 * innerRadius * Math.sin(Math.PI / innerCount) - 6);
    const nodeSize = Math.max(32, Math.min(38, Math.min(outerMaxNode, innerMaxNode)));

    const positions = [];
    // Outer ring: starts at -90 degrees
    for (let i = 0; i < outerCount; i++) {
      const angle = (2 * Math.PI * i) / outerCount - Math.PI / 2;
      positions.push({
        x: outerRadius * Math.cos(angle),
        y: outerRadius * Math.sin(angle),
      });
    }

    // Inner ring: offset by half-step so inner letters nest neatly between outer spokes
    const innerOffset = Math.PI / innerCount;
    for (let i = 0; i < innerCount; i++) {
      const angle = (2 * Math.PI * i) / innerCount - Math.PI / 2 + innerOffset;
      positions.push({
        x: innerRadius * Math.cos(angle),
        y: innerRadius * Math.sin(angle),
      });
    }

    const fontSize = Math.max(14, Math.round(nodeSize * 0.48));
    const hitRadius = nodeSize / 2 + 8;
    return { circleSize, nodeSize, radius: outerRadius, fontSize, hitRadius, positions, isDualRing: true };
  }
}

function WheelNode({ ltr, i, p, isSelected, orderIndex, nodeSize, fontSize, circleSize }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.18 : 1.0,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.node,
        {
          width: nodeSize,
          height: nodeSize,
          borderRadius: nodeSize / 2,
          left: circleSize / 2 + p.x - nodeSize / 2,
          top: circleSize / 2 + p.y - nodeSize / 2,
          backgroundColor: isSelected ? colors.gold : "#133E29",
          borderColor: isSelected ? colors.white : "rgba(246, 211, 101, 0.4)",
          borderWidth: isSelected ? 2.5 : 1.5,
          transform: [{ scale: scaleAnim }],
        },
        isSelected && styles.nodeSelectedGlow,
      ]}
    >
      <Text
        style={[
          styles.nodeText,
          {
            fontSize,
            color: isSelected ? colors.forestDark : colors.white,
          },
        ]}
      >
        {ltr}
      </Text>

      {/* Sequential order indicator badge for traced letters */}
      {isSelected && orderIndex >= 0 && (
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>{orderIndex + 1}</Text>
        </View>
      )}
    </Animated.View>
  );
}

export default function WordCircle({ letters = [], onSubmitWord, onShuffle, isRTL }) {
  const [selected, setSelected] = useState([]); // Array of indices into letters
  const containerRef = useRef(null);
  const previewAnim = useRef(new Animated.Value(0)).current;

  const hasSelected = selected.length > 0;
  useEffect(() => {
    Animated.spring(previewAnim, {
      toValue: hasSelected ? 1 : 0,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [hasSelected]);

  // Compute responsive geometry dynamically based on the letter count
  const count = letters.length;
  const geometry = useMemo(() => getWheelGeometry(count), [count]);
  const { circleSize, nodeSize, fontSize, hitRadius, positions, isDualRing } = geometry;

  const nodeCenter = (i) => {
    const p = positions[i] || { x: 0, y: 0 };
    return {
      x: circleSize / 2 + p.x,
      y: circleSize / 2 + p.y,
    };
  };

  const hitTest = (localX, localY) => {
    for (let i = 0; i < letters.length; i++) {
      const c = nodeCenter(i);
      const dx = localX - c.x;
      const dy = localY - c.y;
      if (Math.sqrt(dx * dx + dy * dy) <= hitRadius) {
        return i;
      }
    }
    return -1;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const idx = hitTest(locationX, locationY);
        if (idx >= 0) setSelected([idx]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const idx = hitTest(locationX, locationY);
        if (idx < 0) return;
        setSelected((prev) => {
          if (prev.length === 0) return [idx];
          const last = prev[prev.length - 1];
          if (last === idx) return prev;
          // Backtracking undo: return to previous letter to unselect last
          if (prev.length > 1 && prev[prev.length - 2] === idx) {
            return prev.slice(0, prev.length - 1);
          }
          if (prev.includes(idx)) return prev;
          return [...prev, idx];
        });
      },
      onPanResponderRelease: () => {
        setSelected((prev) => {
          if (prev.length > 0) {
            const word = prev.map((i) => letters[i]).join("");
            if (onSubmitWord) onSubmitWord(word);
          }
          return [];
        });
      },
      onPanResponderTerminate: () => setSelected([]),
    })
  ).current;

  return (
    <View style={styles.wrap}>
      {/* Real-time floating word preview bubble */}
      <View style={styles.previewContainer}>
        <Animated.View
          style={[
            styles.previewBubble,
            {
              opacity: previewAnim,
              transform: [
                {
                  scale: previewAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.75, 1],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={hasSelected ? "auto" : "none"}
        >
          <Text style={styles.previewText}>
            {selected.map((i) => letters[i]).join("  ")}
          </Text>
        </Animated.View>
      </View>

      {/* Main Wheel Circle */}
      <View
        ref={containerRef}
        style={[
          styles.circleOuter,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Subtle decorative center accent for single ring mode */}
        {!isDualRing && (
          <View
            pointerEvents="none"
            style={[
              styles.centerDecor,
              {
                left: circleSize / 2 - 16,
                top: circleSize / 2 - 16,
              },
            ]}
          >
            <Ionicons name="sparkles" size={16} color="rgba(246, 211, 101, 0.22)" />
          </View>
        )}

        {/* Tracing lines between currently selected nodes */}
        {selected.slice(1).map((idx, i) => {
          const from = nodeCenter(selected[i]);
          const to = nodeCenter(idx);
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <View
              key={`line-${i}`}
              pointerEvents="none"
              style={{
                position: "absolute",
                left: midX - length / 2,
                top: midY - 2.5,
                width: length,
                height: 5,
                backgroundColor: colors.gold,
                borderRadius: 2.5,
                transform: [{ rotate: `${angle}deg` }],
                ...glowShadow,
              }}
            />
          );
        })}

        {/* Dynamic Letter Nodes */}
        {letters.map((ltr, i) => {
          const p = positions[i] || { x: 0, y: 0 };
          const isSelected = selected.includes(i);
          const orderIndex = selected.indexOf(i);

          return (
            <WheelNode
              key={i}
              ltr={ltr}
              i={i}
              p={p}
              isSelected={isSelected}
              orderIndex={orderIndex}
              nodeSize={nodeSize}
              fontSize={fontSize}
              circleSize={circleSize}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  previewContainer: {
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  previewPlaceholder: {
    height: 38,
  },
  previewBubble: {
    backgroundColor: "rgba(10, 41, 26, 0.95)",
    paddingVertical: 7,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.cardBorderGold,
    ...glowShadow,
  },
  previewText: {
    color: colors.goldLight,
    fontWeight: "900",
    fontSize: 20,
    letterSpacing: 2.5,
    textAlign: "center",
  },
  circleOuter: {
    backgroundColor: "rgba(12, 38, 25, 0.88)",
    borderWidth: 2,
    borderColor: "rgba(246, 211, 101, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  centerDecor: {
    position: "absolute",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  node: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  nodeSelectedGlow: {
    ...glowShadow,
    elevation: 8,
  },
  nodeText: {
    fontWeight: "900",
    textAlign: "center",
    includeFontPadding: false,
  },
  orderBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.forestDark,
    borderWidth: 1,
    borderColor: colors.goldLight,
    alignItems: "center",
    justifyContent: "center",
  },
  orderBadgeText: {
    color: colors.goldLight,
    fontSize: 9,
    fontWeight: "900",
  },
});
