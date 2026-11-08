// Site Detail opens with a site id. It shows every field from sites.json
// and can save or remove that id in the favourite and visited lists.
import { useCallback, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import sites from '../data/sites.json';
import {
  getFavouriteIds,
  getVisitedIds,
  toggleFavourite,
  toggleVisited,
} from '../utils/storage';

function Field({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function SiteDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const site = sites.find((item) => item.id === route.params?.siteId);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isVisited, setIsVisited] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: site ? site.name : 'Site' });
  }, [navigation, site]);

  useFocusEffect(
    useCallback(() => {
      if (!site) {
        return undefined;
      }
      let active = true;
      Promise.all([getFavouriteIds(), getVisitedIds()]).then(([favourites, visited]) => {
        if (!active) {
          return;
        }
        setIsFavourite(favourites.includes(site.id));
        setIsVisited(visited.includes(site.id));
      });
      return () => {
        active = false;
      };
    }, [site])
  );

  async function onToggleFavourite() {
    const ids = await toggleFavourite(site.id);
    setIsFavourite(ids.includes(site.id));
  }

  async function onToggleVisited() {
    const ids = await toggleVisited(site.id);
    setIsVisited(ids.includes(site.id));
  }

  if (!site) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>This site is not in the offline directory.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.swatch}>
        <Text style={styles.swatchText}>{site.name.slice(0, 1)}</Text>
      </View>

      <Text style={styles.name}>{site.name}</Text>
      <Text style={styles.meta}>
        {site.district} · {site.type} · {site.era}
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={[styles.action, isFavourite && styles.actionOn]}
          onPress={onToggleFavourite}
        >
          <Text style={[styles.actionText, isFavourite && styles.actionTextOn]}>
            {isFavourite ? 'Remove favourite' : 'Save favourite'}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.action, isVisited && styles.actionOn]}
          onPress={onToggleVisited}
        >
          <Text style={[styles.actionText, isVisited && styles.actionTextOn]}>
            {isVisited ? 'Unmark visited' : 'Mark visited'}
          </Text>
        </Pressable>
      </View>

      <Field label="Open hours" value={site.openHours} />
      <Field label="Entry fee" value={site.entryFee} />
      <Field label="Description" value={site.description} />
      <Field label="Etiquette" value={site.etiquette} />
      <Field label="UNESCO" value={site.unesco ? 'Yes' : 'No'} />
      <Field label="Image file" value={site.image} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F3EA',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  missing: {
    flex: 1,
    backgroundColor: '#F7F3EA',
    padding: 24,
    justifyContent: 'center',
  },
  missingText: {
    fontSize: 16,
    color: '#5C4632',
  },
  swatch: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#8B4513',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  swatchText: {
    color: '#F7F3EA',
    fontSize: 48,
    fontWeight: '700',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3D2914',
  },
  meta: {
    marginTop: 4,
    fontSize: 15,
    color: '#5C4632',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  action: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  actionOn: {
    backgroundColor: '#8B4513',
  },
  actionText: {
    color: '#8B4513',
    fontWeight: '700',
  },
  actionTextOn: {
    color: '#F7F3EA',
  },
  field: {
    marginTop: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B4513',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 22,
    color: '#3D2914',
  },
});
