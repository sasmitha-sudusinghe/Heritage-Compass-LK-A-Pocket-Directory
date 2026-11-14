// utils/use3DPress.js
// Returns onPressIn, onPressOut, and an animatedStyle that makes any
// Animated.View lift forward and scale up with a spring bounce, then
// settle back when released — giving a tactile 3D "card pop" feeling.
//
// Usage:
//   const { onPressIn, onPressOut, animatedStyle } = use3DPress();
//   <Animated.View style={animatedStyle}>
//     <Pressable onPressIn={onPressIn} onPressOut={onPressOut} ...>
//       ...
//     </Pressable>
//   </Animated.View>

import { useRef } from 'react';
import { Animated } from 'react-native';

export function use3DPress({
  scaleTo    = 1.05,   // how much the card grows
  liftPx     = 8,      // how many pixels it "lifts" (Y-axis)
  tension    = 420,    // spring stiffness  (higher = snappier)
  friction   = 7,      // spring damping    (lower = more bounce)
} = {}) {
  const scale     = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const spring = (value, toValue) =>
    Animated.spring(value, {
      toValue,
      useNativeDriver: true,
      tension,
      friction,
    });

  function onPressIn() {
    Animated.parallel([
      spring(scale,      scaleTo),
      spring(translateY, -liftPx),
    ]).start();
  }

  function onPressOut() {
    Animated.parallel([
      spring(scale,      1),
      spring(translateY, 0),
    ]).start();
  }

  // perspective gives depth to the scale + lift so it reads as truly 3D.
  const animatedStyle = {
    transform: [
      { perspective: 1200 },
      { scale },
      { translateY },
    ],
  };

  return { onPressIn, onPressOut, animatedStyle };
}

