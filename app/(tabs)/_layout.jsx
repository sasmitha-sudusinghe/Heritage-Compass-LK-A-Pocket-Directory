// app/(tabs)/_layout.jsx — the bottom tab bar.
// Matches the design mockup:
//   - Dark rich-brown tab bar (#4A1E00)
//   - Active tab: golden rounded pill with white icon
//   - Inactive tabs: warm-tan icons + labels
//   - Home tab has NO nav header (content is inside the ScrollView)
//   - Other tabs: cream-coloured header to blend with the warm bg
import { Pressable, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';

// Tab icons  [focused-name, unfocused-name]  — icons from the mockup
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
      screenOptions={({ route }) => {
        const [filled, outline] = ICONS[route.name] ?? ['ellipse', 'ellipse-outline'];

        return {
          // ── Header (cream background to blend with the warm app bg)
          headerStyle:       { backgroundColor: theme.headerBg },
          headerTintColor:   theme.headerText,
          headerTitleStyle:  { fontWeight: '800', fontSize: 17, letterSpacing: 0.2 },
          headerShadowVisible: false,
          headerRight: () => <ThemeToggle />,

          // ── Tab bar
          tabBarStyle: {
            backgroundColor: theme.tabBarBg,
            borderTopWidth: 0,
            height: 68,
            paddingTop: 6,
            paddingBottom: 10,
          },
          tabBarActiveTintColor:   '#FFFFFF',       // white label on active tab
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },

          // ── Active icon: golden rounded pill  (matches mockup exactly)
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <View style={[styles.activePill, { backgroundColor: theme.tabActive }]}>
                <Ionicons name={filled} size={size - 1} color="#FFFFFF" />
              </View>
            ) : (
              <Ionicons name={outline} size={size - 1} color={color} />
            ),
        };
      }}
    >
      {/* Home — no nav header; the screen renders its own logo + hero */}
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', headerShown: false }}
      />
      {/* Renamed Browse → Explore  &  Favourites → Favorites */}
      <Tabs.Screen name="browse"     options={{ title: 'Explore' }} />
      <Tabs.Screen name="favourites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="about"      options={{ title: 'About' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  toggleBtn: { marginRight: 16, padding: 4 },

  // Golden pill for the active tab icon — matches mockup
  activePill: {
    width: 52,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
