// ThemeContext — provides scheme, theme tokens, and toggleTheme().
// Wrap the app root with <ThemeProvider> and call useTheme() in any screen.
import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// ─── Sri Lankan Heritage palette ──────────────────────────────────────────────
//
//  Light: warm parchment background, saffron-gold brand, deep-teak headers.
//  Dark:  charcoal background, burnished-gold brand, midnight-teak chrome.
//
// ─────────────────────────────────────────────────────────────────────────────

const LIGHT = {
  // ── backgrounds
  bg: '#FDF8F0',          // warm parchment
  card: '#FFFFFF',
  inputBg: '#F5EDE0',     // slightly warmer than bg for inputs

  // ── text
  textPrimary: '#1E0F05',   // deep espresso
  textSecondary: '#6B3F20', // warm brown
  textMuted: '#A07850',     // muted terracotta

  // ── brand (saffron / temple gold)
  brand: '#B8600A',         // main saffron
  brandDark: '#8B4508',     // pressed state
  brandLight: '#FEF0D6',    // badge bg / chip bg

  // ── accent: heritage green (UNESCO only)
  accent: '#1D6B40',
  accentLight: '#E6F4EC',

  // ── borders & separators
  border: '#EDD9B8',        // warm sand
  separator: '#F0E4CC',

  // ── header / nav chrome
  headerBg: '#1E0F05',      // deep teak
  headerText: '#FDF8F0',

  // ── tab bar
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#EDD9B8',
  tabActive: '#B8600A',
  tabInactive: '#A07850',

  // ── card shadow colour (iOS shadow / Android elevation tint)
  cardShadow: '#8B6240',
};

const DARK = {
  bg: '#140A03',
  card: '#241208',
  inputBg: '#1C0E06',

  textPrimary: '#F5EDD8',
  textSecondary: '#C9966A',
  textMuted: '#7A5538',

  brand: '#D4842A',
  brandDark: '#B86C18',
  brandLight: '#3D1E08',

  accent: '#2DA05E',
  accentLight: '#0B2D1C',

  border: '#3A1E0A',
  separator: '#2C1508',

  headerBg: '#0E0702',
  headerText: '#F5EDD8',

  tabBarBg: '#1A0C04',
  tabBarBorder: '#3A1E0A',
  tabActive: '#D4842A',
  tabInactive: '#7A5538',

  cardShadow: 'transparent',
};

// ─── context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [override, setOverride] = useState(null); // null | 'light' | 'dark'

  const scheme = override ?? systemScheme ?? 'light';
  const theme = scheme === 'dark' ? DARK : LIGHT;

  function toggleTheme() {
    setOverride((current) => {
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
