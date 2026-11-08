// One row in a site list. It only displays data.
// Favourites and "visited" are saved by utils/storage.js, then passed in as props.
// The image file named on each site is added in a later step, so this card uses a colour block.

import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SiteCard({ site, onPress, isFavourite, isVisited }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(site)}
    >
      <View style={styles.swatch}>
        <Text style={styles.swatchText}>{site.name.slice(0, 1)}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{site.name}</Text>
        <Text style={styles.meta}>
          {site.district} · {site.type}
        </Text>
        <Text style={styles.era}>{site.era}</Text>

        <View style={styles.badges}>
          {site.unesco ? <Text style={styles.badge}>UNESCO</Text> : null}
          {isFavourite ? <Text style={styles.badge}>Favourite</Text> : null}
          {isVisited ? <Text style={styles.badge}>Visited</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6D7C3',
  },
  cardPressed: {
    opacity: 0.85,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#8B4513',
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
    color: '#3D2914',
  },
  meta: {
    marginTop: 2,
    fontSize: 14,
    color: '#5C4632',
  },
  era: {
    marginTop: 2,
    fontSize: 13,
    color: '#8A7560',
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
    backgroundColor: '#F3E6D4',
    color: '#8B4513',
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
});
