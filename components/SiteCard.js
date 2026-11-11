// One row in a site list. It only displays data.
// The left accent bar colour matches the category tile colours from the mockup
// so that browsing the list feels visually consistent with the home screen tiles.

import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// ── Per-type accent colours — match the 4 category tile colours ───────────────
const TYPE_COLORS = {
  'Buddhist Temple':     '#8B2020',   // maroon red   — Temples tile
  'Hindu Temple':        '#8B2020',   // same maroon
  'Archaeological Site': '#1E5C3A',   // forest green — Ancient Cities tile
  'Fort':                '#B8820A',   // amber gold   — Forts tile
  'Colonial Heritage':   '#B8820A',   // same amber
  'Monument':            '#1E5C5C',   // dark teal    — Monuments tile
  'Nature Reserve':      '#1E5C3A',   // forest green
  'Mosque':              '#1E5C5C',   // dark teal
  'Church':              '#1E5C5C',   // dark teal
};

function getBarColor(type) {
  return TYPE_COLORS[type] ?? '#8B6240'; // warm brown fallback
}

function Badge({ label, color, bg }) {
  return (
    <Text style={[styles.badge, { color, backgroundColor: bg }]}>{label}</Text>
  );
}

export default function SiteCard({ site, onPress, isFavourite, isVisited }) {
  const { theme } = useTheme();
  const bar = getBarColor(site.type);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border, shadowColor: bar },
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress?.(site)}
    >
      {/* Left accent bar — coloured by site type */}
      <View style={[styles.accent, { backgroundColor: bar }]}>
        <Text style={styles.accentLetter}>{site.name.slice(0, 1)}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={2}>
          {site.name}
        </Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
          {site.district}
        </Text>

        {/* Type + era pills */}
        <View style={styles.pills}>
          <View style={[styles.typePill, { backgroundColor: bar + '22' }]}>
            <Text style={[styles.typePillText, { color: bar }]}>{site.type}</Text>
          </View>
          <View style={[styles.eraPill, { backgroundColor: theme.brandLight }]}>
            <Text style={[styles.eraPillText, { color: theme.brand }]}>{site.era}</Text>
          </View>
        </View>

        {/* Status badges */}
        {(site.unesco || isFavourite || isVisited) && (
          <View style={styles.badges}>
            {site.unesco  && <Badge label="★ UNESCO"  color={theme.accent}        bg={theme.accentLight} />}
            {isFavourite  && <Badge label="♥ Saved"   color={theme.brand}         bg={theme.brandLight}  />}
            {isVisited    && <Badge label="✓ Visited"  color={theme.textSecondary} bg={theme.separator}   />}
          </View>
        )}
      </View>

      {/* Chevron */}
      <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.10, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  cardPressed: { opacity: 0.80, transform: [{ scale: 0.985 }] },

  accent: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  accentLetter: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  body:   { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
  name:   { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  meta:   { marginTop: 2, fontSize: 13 },

  pills: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 7, gap: 6 },
  typePill: {
    paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999,
  },
  typePillText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.2 },
  eraPill: {
    paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999,
  },
  eraPillText: { fontSize: 10, fontWeight: '700' },

  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 5 },
  badge: {
    paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999,
    fontSize: 11, fontWeight: '700', overflow: 'hidden',
  },

  chevron: { alignSelf: 'center', fontSize: 22, paddingHorizontal: 10 },
});
