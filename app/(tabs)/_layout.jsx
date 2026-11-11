// app/(tabs)/_layout.jsx — the bottom tab bar.
// Each screen in this folder becomes one tab.
// The theme-toggle button lives in the header here so every tab shows it.
import { Pressable, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';

// Map each tab route name to an Ionicons icon (outline = inactive, filled = active).
const ICONS = {
  index:      ['home',               'home-outline'],
  browse:     ['search',             'search-outline'],
  favourites: ['heart',              'heart-outline'],
  categories: ['grid',               'grid-outline'],
  about:      ['information-circle', 'information-circle-outline'],
};

export default function TabLayout() {
  const { scheme, theme, toggleTheme } = useTheme();

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
          // ── Header
          headerStyle: { backgroundColor: theme.headerBg },
          headerTintColor: theme.headerText,
          headerTitleStyle: { fontWeight: '700', letterSpacing: 0.3 },
          headerRight: () => <ThemeToggle />,
          headerShadowVisible: false,

          // ── Tab bar
          tabBarStyle: {
            backgroundColor: theme.tabBarBg,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.tabBarBorder,
            paddingTop: 4,
            height: 58,
          },
          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 4 },

          // ── Icon: wrap active icon in a small tinted pill
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <View style={[styles.iconPill, { backgroundColor: theme.brandLight }]}>
                <Ionicons name={filled} size={size - 2} color={theme.tabActive} />
              </View>
            ) : (
              <Ionicons name={outline} size={size - 2} color={color} />
            )
          ),
        };
      }}
    >
      <Tabs.Screen name="index"      options={{ title: 'Home' }} />
      <Tabs.Screen name="browse"     options={{ title: 'Browse' }} />
      <Tabs.Screen name="favourites" options={{ title: 'Favourites' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="about"      options={{ title: 'About' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  toggleBtn: {
    marginRight: 16,
    padding: 4,
  },
  iconPill: {
    width: 36,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});
