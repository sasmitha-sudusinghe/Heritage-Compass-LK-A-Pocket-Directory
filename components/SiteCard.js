// One row in a site list. It only displays data.
// Favourites and "visited" are saved by utils/storage.js, then passed in as props.
// The image file named on each site is added in a later step; this card uses a
// coloured left-accent bar with the site initial.

import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Badge colours differ by meaning so they carry visual weight.
function Badge({ label, color, bg }) {
  return (
    <Text style={[styles.badge, { color, backgroundColor: bg }]}>
      {label}
    </Text>
  );
}

export default function SiteCard({ site, onPress, isFavourite, isVisited }) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          // subtle drop-shadow on iOS; elevation on Android
          shadowColor: theme.cardShadow,
        },
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress?.(site)}
    >
      {/* Left accent column: coloured bar + first-letter initial */}
      <View style={[styles.accent, { backgroundColor: theme.brand }]}>
        <Text style={styles.accentLetter}>{site.name.slice(0, 1)}</Text>
      </View>

      {/* Main body */}
      <View style={styles.body}>
        <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={2}>
          {site.name}
        </Text>

        <Text style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
          {site.district} · {site.type}
        </Text>

        {/* Era pill */}
        <View style={[styles.eraPill, { backgroundColor: theme.brandLight }]}>
          <Text style={[styles.eraPillText, { color: theme.brand }]}>{site.era}</Text>
        </View>

        {/* Status badges */}
        {(site.unesco || isFavourite || isVisited) && (
          <View style={styles.badges}>
            {site.unesco   && <Badge label="UNESCO ★"  color={theme.accent}  bg={theme.accentLight} />}
            {isFavourite   && <Badge label="♥ Saved"   color={theme.brand}   bg={theme.brandLight} />}
            {isVisited     && <Badge label="✓ Visited"  color={theme.textSecondary} bg={theme.separator} />}
          </View>
        )}
      </View>

      {/* Chevron hint */}
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
    // iOS shadow
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },

  // Left accent bar
  accent: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  accentLetter: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Body
  body: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  meta: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
  },

  // Era pill
  eraPill: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  eraPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Badges row
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 7,
    gap: 5,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
  },

  // Chevron
  chevron: {
    alignSelf: 'center',
    fontSize: 22,
    paddingHorizontal: 10,
    marginRight: 2,
  },
});
