// app/(tabs)/about.jsx — About tab.
//
// Shows visit progress, app info with stats, visitor etiquette tips, and a footer.
// Counts refresh on every focus via useFocusEffect (same pattern as index.jsx).

import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import sites from '../../data/sites.json';
import { getFavouriteIds, getVisitedIds } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

// ── Computed stats (never hardcoded) ──────────────────────────────────────────
const TOTAL_SITES   = sites.length;
const UNESCO_COUNT  = sites.filter((s) => s.unesco).length;
const DISTRICT_COUNT = new Set(sites.map((s) => s.district)).size;

// ── Etiquette tips ────────────────────────────────────────────────────────────
const TIPS = [
  {
    icon: 'shirt-outline',
    title: 'Dress modestly',
    text: 'Cover shoulders and knees at temples, kovils, mosques and churches. Carry a light scarf or sarong.',
  },
  {
    icon: 'footsteps-outline',
    title: 'Remove shoes & hats',
    text: 'Take off your shoes and hats before entering any Buddhist temple or Hindu kovil. Socks are usually fine.',
  },
  {
    icon: 'camera-outline',
    title: 'Ask before photographing',
    text: 'Do not photograph worshippers or ceremonies without permission. Flash is often banned near murals and statues.',
  },
  {
    icon: 'water-outline',
    title: 'Carry water',
    text: 'Most heritage sites are outdoors with long walks. Bring a refillable bottle, especially for climbs like Sigiriya and Mihintale.',
  },
  {
    icon: 'sunny-outline',
    title: 'Go early to avoid heat',
    text: 'Arrive by 7–8 AM. The midday sun is harsh, and morning light is best for photographs.',
  },
  {
    icon: 'airplane-outline',
    title: 'No drones',
    text: 'Drone flights over heritage sites are banned without a special permit from the Central Cultural Fund.',
  },
];

// ── Reusable section heading ──────────────────────────────────────────────────
function SectionTitle({ icon, label, theme }) {
  return (
    <View style={styles.sectionRow}>
      <Ionicons name={icon} size={18} color={theme.brand} style={{ marginRight: 6 }} />
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{label}</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function AboutScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [visitedCount,   setVisitedCount]   = useState(0);
  const [favouriteCount, setFavouriteCount] = useState(0);

  // ── Refresh counts every time the tab gains focus ─────────────────────────
  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getVisitedIds(), getFavouriteIds()]).then(([visited, favs]) => {
        if (!active) return;
        setVisitedCount(visited.length);
        setFavouriteCount(favs.length);
      });
      return () => { active = false; };
    }, [])
  );

  const pct = TOTAL_SITES > 0 ? Math.round((visitedCount / TOTAL_SITES) * 100) : 0;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.bg }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Screen title ──────────────────────────────────────────────────── */}
      <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>About</Text>

      {/* ── 1. Progress card ──────────────────────────────────────────────── */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.progressHeader}>
          <Ionicons name="footsteps" size={22} color={theme.brand} />
          <Text style={[styles.progressTitle, { color: theme.textPrimary }]}>
            Your Progress
          </Text>
        </View>

        {/* Visited line */}
        <Text style={[styles.progressCount, { color: theme.textPrimary }]}>
          {visitedCount} of {TOTAL_SITES} visited
        </Text>

        {/* Progress bar */}
        <View style={[styles.barTrack, { backgroundColor: theme.separator }]}>
          <View
            style={[
              styles.barFill,
              { width: `${pct}%`, backgroundColor: theme.brand },
            ]}
          />
        </View>
        <Text style={[styles.pctText, { color: theme.textMuted }]}>
          {pct}% complete
        </Text>

        {/* Saved count */}
        <View style={[styles.savedRow, { borderTopColor: theme.separator }]}>
          <Ionicons name="heart" size={15} color={theme.brand} style={{ marginRight: 5 }} />
          <Text style={[styles.savedText, { color: theme.textSecondary }]}>
            {favouriteCount} {favouriteCount === 1 ? 'site' : 'sites'} saved
          </Text>
        </View>
      </View>

      {/* ── 2. App info ───────────────────────────────────────────────────── */}
      <SectionTitle icon="information-circle" label="About the App" theme={theme} />
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.appName, { color: theme.textPrimary }]}>
          Heritage Compass LK
        </Text>
        <Text style={[styles.appTagline, { color: theme.textSecondary }]}>
          A Pocket Directory
        </Text>
        <Text style={[styles.appDesc, { color: theme.textSecondary }]}>
          An offline directory of {TOTAL_SITES} Sri Lankan heritage sites. Browse
          ancient cities, sacred temples, historic forts and cultural treasures —
          all without an internet connection.
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.bg }]}>
            <Ionicons name="location" size={18} color={theme.brand} />
            <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{TOTAL_SITES}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Sites</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.bg }]}>
            <Ionicons name="star" size={18} color={theme.accent} />
            <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{UNESCO_COUNT}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>UNESCO</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.bg }]}>
            <Ionicons name="map" size={18} color={theme.brand} />
            <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{DISTRICT_COUNT}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Districts</Text>
          </View>
        </View>
      </View>

      {/* ── 3. Visitor etiquette ──────────────────────────────────────────── */}
      <SectionTitle icon="shield-checkmark" label="Visitor Etiquette" theme={theme} />
      {TIPS.map((tip, i) => (
        <View
          key={i}
          style={[styles.tipCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={[styles.tipIconWrap, { backgroundColor: theme.brandLight }]}>
            <Ionicons name={tip.icon} size={22} color={theme.brand} />
          </View>
          <View style={styles.tipBody}>
            <Text style={[styles.tipTitle, { color: theme.textPrimary }]}>{tip.title}</Text>
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>{tip.text}</Text>
          </View>
        </View>
      ))}

      {/* ── 4. Footer ─────────────────────────────────────────────────────── */}
      <View style={[styles.footer, { borderTopColor: theme.separator }]}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>
          © 2026 Student App. All Rights Reserved.
        </Text>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>
          Photos: Wikimedia Commons, see CREDITS.md
        </Text>
      </View>
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 16,
  },

  // ── Card base ─────────────────────────────────────────────────────────────
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },

  // ── Progress card ─────────────────────────────────────────────────────────
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  progressCount: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  pctText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  savedText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Section heading ───────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  // ── App info ──────────────────────────────────────────────────────────────
  appName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  appTagline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  appDesc: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },

  // ── Tip cards ─────────────────────────────────────────────────────────────
  tipCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  tipIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipBody: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
