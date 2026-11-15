// app/(tabs)/_layout.jsx — the bottom tab bar.
// Uses custom AnimatedTabBar with sliding active highlight pill.

import { Pressable, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';
import AnimatedTabBar from '../../components/AnimatedTabBar';

// Tab icons [focused-name, unfocused-name] — icons from the mockup
const ICONS = {
  index:      ['home',    'home-outline'],
  browse:     ['compass', 'compass-outline'],
  favourites: ['heart',   'heart-outline'],
  categories: ['grid',    'grid-outline'],
  about:      ['person',  'person-outline'],
};

export default function TabLayout() {
  const { scheme, theme, toggleTheme } = useTheme();

  // Moon/sun toggle — only shown on tabs that have a header.
  function ThemeToggle() {
    return (
      <Pressable
        onPress={toggleTheme}
        style={styles.toggleBtn}
        accessibilityLabel="Toggle light and dark theme"
        hitSlop={10}
      >
        <Ionicons
          name={scheme === 'dark' ? 'sunny-outline' : 'moon-outline'}
          size={21}
          color={theme.headerText}
        />
      </Pressable>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={({ route }) => {
        const [filled, outline] = ICONS[route.name] ?? ['ellipse', 'ellipse-outline'];

        return {
          animation: 'shift',

          // ── Header (cream background to blend with the warm app bg)
          headerStyle:       { backgroundColor: theme.headerBg },
          headerTintColor:   theme.headerText,
          headerTitleStyle:  { fontWeight: '800', fontSize: 17, letterSpacing: 0.2 },
          headerShadowVisible: false,
          headerRight: () => <ThemeToggle />,

          // ── Tab icon for AnimatedTabBar
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? filled : outline} size={size ?? 22} color={color} />
          ),
        };
      }}
    >
      {/* Home — no nav header; the screen renders its own logo + hero */}
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', headerShown: false }}
      />
      {/* Renamed Browse → Explore & Favourites → Favorites */}
      <Tabs.Screen name="browse"     options={{ title: 'Explore' }} />
      <Tabs.Screen name="favourites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="about"      options={{ title: 'About' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  toggleBtn: { marginRight: 16, padding: 4 },
});
