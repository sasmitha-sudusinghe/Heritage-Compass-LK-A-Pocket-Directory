// app/_layout.jsx — the single root of the Expo Router tree.
// ThemeProvider wraps everything so every screen can call useTheme().
// A Stack navigator sits here; the tab group is one entry in that stack,
// and site/[id] is another (no tab bar shown on detail screens).
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// Inner component so it can call useTheme() after the provider is mounted.
function RootStack() {
  const { scheme, theme } = useTheme();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.headerBg },
          headerTintColor: theme.headerText,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        {/* The tab group renders its own header per tab, so hide the Stack header here. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Site detail — shown with a header but no tab bar. */}
        <Stack.Screen
          name="site/[id]"
          options={{ title: 'Site' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

