// One row in a site list. It only displays data.
// The left accent bar colour matches the category tile colours from the mockup.
// Pressing the card springs it forward (scale + lift) via use3DPress().

import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { use3DPress } from '../utils/use3DPress';

// ── Per-type accent colours — match the 4 category tile colours ───────────────
const TYPE_COLORS = {
  'Buddhist Temple':     '#8B2020',
  'Hindu Temple':        '#8B2020',
  'Archaeological Site': '#1E5C3A',
  'Fort':                '#B8820A',
  'Colonial Heritage':   '#B8820A',
  'Monument':            '#1E5C5C',
  'Nature Reserve':      '#1E5C3A',
  'Mosque':              '#1E5C5C',
  'Church':              '#1E5C5C',
};
function getBarColor(type) { return TYPE_COLORS[type] ?? '#8B6240'; }

function Badge({ label, color, bg }) {
  return (
    <Text style={[styles.badge, { color, backgroundColor: bg }]}>{label}</Text>
  );
}

export default function SiteCard({ site, onPress, isFavourite, isVisited }) {
  const { theme } = useTheme();
  const bar = getBarColor(site.type);

  // ── 3D press animation ──────────────────────────────────────────────────────
  const { onPressIn, onPressOut, animatedStyle } = use3DPress({
    scaleTo: 1.03,
    liftPx:  6,
  });

  return (
    // Animated.View carries the 3D transform; Pressable handles touch events.
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor:     theme.border,
            shadowColor:     bar,
          },
          // subtle opacity on press — Animated.View handles the 3D lift
          pressed && { opacity: 0.92 },
        ]}
        onPress={() => onPress?.(site)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {/* Left accent bar */}
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
              <Text style={[styles.pillText, { color: bar }]}>{site.type}</Text>
            </View>
            <View style={[styles.eraPill, { backgroundColor: theme.brandLight }]}>
              <Text style={[styles.pillText, { color: theme.brand }]}>{site.era}</Text>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // wrapper carries shadow so it lifts visually with the transform
  wrapper: {
    marginBottom: 12,
    // iOS shadow on the wrapper (not the Pressable) so it moves with the card
    ...Platform.select({
      ios: {
        shadowColor:  '#8B6240',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius:  10,
      },
    }),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    // Android elevation on the card itself
    ...Platform.select({ android: { elevation: 4 } }),
  },

  accent: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  accentLetter: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },

  body:   { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
  name:   { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  meta:   { marginTop: 2, fontSize: 13 },

  pills:    { flexDirection: 'row', flexWrap: 'wrap', marginTop: 7, gap: 6 },
  typePill: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999 },
  eraPill:  { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999 },
  pillText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.2 },

  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 5 },
  badge:  {
    paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999,
    fontSize: 11, fontWeight: '700', overflow: 'hidden',
  },

  chevron: { alignSelf: 'center', fontSize: 22, paddingHorizontal: 10 },
});
