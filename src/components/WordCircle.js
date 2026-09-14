import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder } from "react-native";
import { colors } from "../theme";

const CIRCLE_SIZE = 220;
const NODE_SIZE = 56;
const RADIUS = CIRCLE_SIZE / 2 - NODE_SIZE / 2 - 6;

export default function WordCircle({ letters, onSubmitWord, onShuffle, isRTL }) {
  const [selected, setSelected] = useState([]); // array of indices into letters
  const positions = useMemo(() => computePositions(letters.length), [letters.length]);
  const containerRef = useRef(null);
  const layoutRef = useRef({ x: 0, y: 0 });

  const nodeCenter = (i) => {
    const p = positions[i];
    return {
      x: CIRCLE_SIZE / 2 + p.x,
      y: CIRCLE_SIZE / 2 + p.y,
    };
  };

  const hitTest = (localX, localY) => {
    for (let i = 0; i < letters.length; i++) {
      const c = nodeCenter(i);
      const dx = localX - c.x;
      const dy = localY - c.y;
      if (Math.sqrt(dx * dx + dy * dy) <= NODE_SIZE / 2 + 10) {
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
          // allow backtracking to previous node to undo
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
            onSubmitWord(word);
          }
          return [];
        });
      },
      onPanResponderTerminate: () => setSelected([]),
    })
  ).current;

  return (
    <View style={styles.wrap}>
      <View
        ref={containerRef}
        style={styles.circleOuter}
        {...panResponder.panHandlers}
      >
        {/* connection lines */}
        {selected.slice(1).map((idx, i) => {
          const from = nodeCenter(selected[i]);
          const to = nodeCenter(idx);
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <View
              key={`line-${i}`}
              pointerEvents="none"
              style={{
                position: "absolute",
                left: from.x,
                top: from.y - 2,
                width: length,
                height: 4,
                backgroundColor: colors.gold,
                borderRadius: 2,
                transform: [{ rotate: `${angle}deg` }],
                transformOrigin: "0 50%",
              }}
            />
          );
        })}

        {letters.map((ltr, i) => {
          const p = positions[i];
          const isSelected = selected.includes(i);
          return (
            <View
              key={i}
              pointerEvents="none"
              style={[
                styles.node,
                {
                  left: CIRCLE_SIZE / 2 + p.x - NODE_SIZE / 2,
                  top: CIRCLE_SIZE / 2 + p.y - NODE_SIZE / 2,
                  backgroundColor: isSelected ? colors.gold : colors.forest,
                  borderColor: isSelected ? colors.gold : "rgba(255,255,255,0.6)",
                },
              ]}
            >
              <Text style={[styles.nodeText, { color: isSelected ? colors.forestDark : colors.white }]}>
                {ltr}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function computePositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    positions.push({ x: RADIUS * Math.cos(angle), y: RADIUS * Math.sin(angle) });
  }
  return positions;
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  circleOuter: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#123626",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  node: {
    position: "absolute",
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeText: { fontSize: 24, fontWeight: "800" },
});
