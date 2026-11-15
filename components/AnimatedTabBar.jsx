// components/AnimatedTabBar.jsx — custom tab bar with a sliding active highlight pill.
//
// Features:
// - Single Animated.View pill that springs smoothly (translateX) to the active tab
// - Wraps icon and label together so they never overlap
// - Active tab: white icon & label on theme.brand pill
// - Inactive tabs: theme.tabInactive / theme.textSecondary
// - Safe area bottom inset support
// - Max width 600px, centered for web layout

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../contexts/ThemeContext';

export default function AnimatedTabBar(props) {
  const {
    state,
    descriptors,
    navigation,
    emitter,
    navigateToTab,
    insets,
  } = props;

  const { theme } = useTheme();
  const safeInsets = useSafeAreaInsets();
  const bottomInset = Math.max(insets?.bottom ?? safeInsets.bottom ?? 0, 8);

  const [barWidth, setBarWidth] = useState(0);

  // Measure tab bar width on layout (e.g. capped at 600px on desktop)
  const onLayout = (e) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && Math.round(width) !== Math.round(barWidth)) {
      setBarWidth(width);
    }
  };

  // Only render tabs that are not hidden (options.href !== null)
  const visibleRoutes = state.routes.filter((route) => {
    const { options } = descriptors[route.key];
    return options?.href !== null && !options?.hidden;
  });

  const activeRoute = state.routes[state.index];
  const activeIndex = Math.max(
    0,
    visibleRoutes.findIndex((r) => r.key === activeRoute?.key)
  );

  const tabCount = visibleRoutes.length || 1;
  const tabWidth = barWidth > 0 ? barWidth / tabCount : 0;

  // ── Animated translation for the sliding pill ──────────────────────────────
  const translateX = useRef(new Animated.Value(0)).current;
  const hasMeasured = useRef(false);

  useEffect(() => {
    if (tabWidth > 0 && activeIndex >= 0) {
      const toValue = activeIndex * tabWidth;
      if (!hasMeasured.current) {
        hasMeasured.current = true;
        translateX.setValue(toValue);
      } else {
        Animated.spring(translateX, {
          toValue,
          useNativeDriver: true,
          friction: 8,
          tension: 65,
        }).start();
      }
    }
  }, [activeIndex, tabWidth]);

  // Theme tokens
  const barBg = theme.tabBarBg || theme.navBackground || theme.card;
  const borderTopColor = theme.tabBarBorder || theme.border;
  const pillBg = theme.brand;
  const activeColor = '#FFFFFF';
  const inactiveColor = theme.tabInactive || theme.textSecondary;

  return (
    <View style={[styles.outerContainer, { backgroundColor: barBg, borderTopColor }]}>
      <View style={[styles.innerContainer, { paddingBottom: bottomInset }]}>
        <View style={styles.tabsRow} onLayout={onLayout}>
          {/* ── Sliding Active Pill ────────────────────────────────────────── */}
          {tabWidth > 0 && (
            <Animated.View
              style={[
                styles.pillWrapper,
                {
                  width: tabWidth,
                  transform: [{ translateX }],
                },
              ]}
              pointerEvents="none"
            >
              <View style={[styles.pill, { backgroundColor: pillBg }]} />
            </Animated.View>
          )}

          {/* ── Tab Items ─────────────────────────────────────────────────── */}
          {visibleRoutes.map((route) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === state.routes.indexOf(route);

            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const onPress = () => {
              let isDefaultPrevented = false;

              // Support both Expo Router (emitter.emit) and React Navigation (navigation.emit)
              const emit = emitter?.emit?.bind(emitter) ?? navigation?.emit?.bind(navigation);
              if (emit) {
                const event = emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                isDefaultPrevented = !!event?.defaultPrevented;
              }

              if (!isFocused && !isDefaultPrevented) {
                if (typeof navigateToTab === 'function') {
                  navigateToTab(route.key);
                } else if (navigation?.navigate) {
                  navigation.navigate(route.name, route.params);
                } else {
                  router.push(`/(tabs)/${route.name === 'index' ? '' : route.name}`);
                }
              }
            };

            const onLongPress = () => {
              const emit = emitter?.emit?.bind(emitter) ?? navigation?.emit?.bind(navigation);
              if (emit) {
                emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <View style={styles.iconContainer}>
                  {options.tabBarIcon
                    ? options.tabBarIcon({
                        focused: isFocused,
                        color: isFocused ? activeColor : inactiveColor,
                        size: 21,
                      })
                    : null}
                </View>
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? activeColor : inactiveColor },
                  ]}
                  numberOfLines={1}
                >
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    borderTopWidth: 1,
  },
  innerContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    height: 58,
    position: 'relative',
    alignItems: 'stretch',
  },
  pillWrapper: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  pill: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
