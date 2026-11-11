// ThemeContext — provides scheme, theme tokens, and toggleTheme().
// Wrap the app root with <ThemeProvider> and call useTheme() in any screen.
import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// ─── Heritage Compass palette (matched from the design mockup) ─────────────────
//
//  Light
//    Background  warm sandy cream  #F5E6C8
//    Brand       warm amber-gold   #C87800  (tab active pill, "View All", accents)
//    Text        deep rich brown   #3D1A00
//    Header      same cream as bg  — home screen has no nav header; other tabs
//                                    use a cream header to blend with the bg.
//    Tab bar     dark rich brown   #4A1E00
//    Tab active  golden pill       #C87800
//
//  Category tile colours (also used as SiteCard accent bars):
//    Temples       maroon red    #8B2020
//    Ancient Cities forest green #1E5C3A
//    Forts         amber gold    #B8820A
//    Monuments     dark teal     #1E5C5C
//
// ─────────────────────────────────────────────────────────────────────────────

const LIGHT = {
  // ── backgrounds
  bg:      '#F5E6C8',   // warm sandy cream — the whole-screen background
  card:    '#FFFFFF',   // card surfaces
  inputBg: '#FFFFFF',   // search / input background (white lifts from cream bg)

  // ── text
  textPrimary:   '#3D1A00',   // deep rich brown
  textSecondary: '#6B3A1E',   // medium warm brown
  textMuted:     '#A07850',   // muted tan

  // ── brand — amber gold
  brand:       '#C87800',
  brandDark:   '#A05E00',
  brandLight:  '#FEF3DC',
  brandOnDark: '#FFFFFF',   // white text on any solid-colour header/bg

  // ── accent — heritage green (UNESCO badges, nature sites)
  accent:      '#1E5C3A',
  accentLight: '#E4F0EA',

  // ── borders & separators
  border:    '#E0C898',
  separator: '#EDD8A8',

  // ── header / nav chrome  (cream — blends with the warm bg on non-home tabs)
  headerBg:   '#F5E6C8',
  headerText: '#3D1A00',

  // ── tab bar  (dark brown from the mockup)
  tabBarBg:     '#4A1E00',
  tabBarBorder: '#3A1600',
  tabActive:    '#C87800',   // golden active pill
  tabInactive:  '#D4A880',   // warm tan for inactive icons/labels

  // ── card shadow
  cardShadow: '#8B6240',
};

const DARK = {
  bg:      '#1A0A00',
  card:    '#2C1408',
  inputBg: '#1A0A00',

  textPrimary:   '#F5E6C8',
  textSecondary: '#D4A880',
  textMuted:     '#8A6240',

  brand:       '#E09020',
  brandDark:   '#C87800',
  brandLight:  '#3D1E00',
  brandOnDark: '#F5E6C8',

  accent:      '#2E8A56',
  accentLight: '#0E2A1A',

  border:    '#3D2010',
  separator: '#2C1408',

  headerBg:   '#1A0A00',
  headerText: '#F5E6C8',

  tabBarBg:     '#120600',
  tabBarBorder: '#2C1408',
  tabActive:    '#E09020',
  tabInactive:  '#8A6240',

  cardShadow: 'transparent',
};

// ─── context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [override, setOverride] = useState(null); // null | 'light' | 'dark'

  const scheme = override ?? systemScheme ?? 'light';
  const theme  = scheme === 'dark' ? DARK : LIGHT;

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
