// app/(tabs)/_layout.jsx — the bottom tab bar.
// Each screen in this folder becomes one tab.
// The theme-toggle button lives in the header here so every tab shows it.
import { Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';

// Map each tab route name to an Ionicons icon (outline = inactive, filled = active).
const ICONS = {
  index: ['home', 'home-outline'],
  browse: ['search', 'search-outline'],
  favourites: ['heart', 'heart-outline'],
  categories: ['grid', 'grid-outline'],
  about: ['information-circle', 'information-circle-outline'],
};

export default function TabLayout() {
  const { scheme, theme, toggleTheme } = useTheme();

  // The moon/sun button that appears in every tab header.
  function ThemeToggle() {
    return (
      <Pressable
        onPress={toggleTheme}
        style={{ marginRight: 16 }}
        accessibilityLabel="Toggle light and dark theme"
      >
        <Ionicons
          name={scheme === 'dark' ? 'sunny' : 'moon'}
          size={22}
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
          // Header chrome
          headerStyle: { backgroundColor: theme.headerBg },
          headerTintColor: theme.headerText,
          headerRight: () => <ThemeToggle />,
          // Tab bar chrome
          tabBarStyle: { backgroundColor: theme.tabBarBg },
          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          // Icon
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? filled : outline} size={size} color={color} />
          ),
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse' }} />
      <Tabs.Screen name="favourites" options={{ title: 'Favourites' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
    </Tabs>
  );
}

