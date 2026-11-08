// ThemeContext — provides scheme, theme tokens, and toggleTheme().
// Wrap the app root with <ThemeProvider> and call useTheme() in any screen.
import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// ─── colour tokens ────────────────────────────────────────────────────────────
const LIGHT = {
  // backgrounds
  bg: '#F7F3EA',
  card: '#FFFFFF',
  // text
  textPrimary: '#3D2914',
  textSecondary: '#5C4632',
  textMuted: '#8A7560',
  // brand / accent
  brand: '#8B4513',
  brandLight: '#F3E6D4',
  // borders & UI chrome
  border: '#E6D7C3',
  headerBg: '#3D2914',
  headerText: '#F7F3EA',
  tabBarBg: '#F7F3EA',
  tabActive: '#8B4513',
  tabInactive: '#8A7560',
};

const DARK = {
  bg: '#1A1008',
  card: '#2C1A0E',
  textPrimary: '#F7F3EA',
  textSecondary: '#D4B896',
  textMuted: '#8A7560',
  brand: '#C87941',
  brandLight: '#3D2914',
  border: '#3D2914',
  headerBg: '#2C1A0E',
  headerText: '#F7F3EA',
  tabBarBg: '#2C1A0E',
  tabActive: '#C87941',
  tabInactive: '#8A7560',
};

// ─── context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  // Track whether the user has manually overridden the system scheme.
  const [override, setOverride] = useState(null); // null | 'light' | 'dark'

  const scheme = override ?? systemScheme ?? 'light';
  const theme = scheme === 'dark' ? DARK : LIGHT;

  function toggleTheme() {
    setOverride((current) => {
      // If overriding, flip it; if following system, flip away from system.
      const active = current ?? systemScheme ?? 'light';
      return active === 'light' ? 'dark' : 'light';
    });
  }

  return (
    <ThemeContext.Provider value={{ scheme, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Convenience hook — throws if used outside <ThemeProvider>.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}

