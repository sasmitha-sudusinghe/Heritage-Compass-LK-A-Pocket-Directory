// One row in a site list. It only displays data.
// Favourites and "visited" are saved by utils/storage.js, then passed in as props.
// The image file named on each site is added in a later step, so this card uses a colour block.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function SiteCard({ site, onPress, isFavourite, isVisited }) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress?.(site)}
    >
      <View style={[styles.swatch, { backgroundColor: theme.brand }]}>
        <Text style={styles.swatchText}>{site.name.slice(0, 1)}</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, { color: theme.textPrimary }]}>{site.name}</Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {site.district} · {site.type}
        </Text>
        <Text style={[styles.era, { color: theme.textMuted }]}>{site.era}</Text>

        <View style={styles.badges}>
          {site.unesco   ? <Text style={[styles.badge, { backgroundColor: theme.brandLight, color: theme.brand }]}>UNESCO</Text>    : null}
          {isFavourite   ? <Text style={[styles.badge, { backgroundColor: theme.brandLight, color: theme.brand }]}>Favourite</Text> : null}
          {isVisited     ? <Text style={[styles.badge, { backgroundColor: theme.brandLight, color: theme.brand }]}>Visited</Text>   : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.85,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  swatchText: {
    color: '#F7F3EA',
    fontSize: 22,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    marginTop: 2,
    fontSize: 14,
  },
  era: {
    marginTop: 2,
    fontSize: 13,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  badge: {
    marginRight: 6,
    marginBottom: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
});
