// Home: a search box, shortcuts for each site type, and a few featured sites.
// The search only looks through data/sites.json. Nothing is sent online.
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import SiteCard from '../components/SiteCard';
import sites from '../data/sites.json';
import { getFavouriteIds, getVisitedIds } from '../utils/storage';

// These five ids are the sites shown before the user searches.
const FEATURED_IDS = [
  'sigiriya',
  'temple-of-the-tooth',
  'galle-fort',
  'dambulla-cave-temple',
  'sri-maha-bodhi',
];

function uniqueTypes() {
  const types = [];
  sites.forEach((site) => {
    if (!types.includes(site.type)) {
      types.push(site.type);
    }
  });
  return types;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [visitedIds, setVisitedIds] = useState([]);

  // Reload the saved ids whenever this tab is shown again.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getFavouriteIds(), getVisitedIds()]).then(([favourites, visited]) => {
        if (!active) {
          return;
        }
        setFavouriteIds(favourites);
        setVisitedIds(visited);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? sites.filter((site) => {
        const haystack = `${site.name} ${site.district} ${site.type} ${site.era}`.toLowerCase();
        return haystack.includes(needle);
      })
    : [];

  const featured = FEATURED_IDS.map((id) => sites.find((site) => site.id === id)).filter(Boolean);

  function openSite(site) {
    navigation.navigate('SiteDetail', { siteId: site.id });
  }

  function openType(type) {
    // requestId changes on every tap, so Browse applies this type once.
    navigation.navigate('Browse', { type, requestId: Date.now() });
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.intro}>
        25 temples and heritage sites, saved on this phone.
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name, district, or type"
        placeholderTextColor="#8A7560"
        style={styles.search}
        autoCorrect={false}
      />

      {needle ? (
        <View>
          <Text style={styles.section}>
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </Text>
          {matches.length === 0 ? (
            <Text style={styles.empty}>No sites match that search.</Text>
          ) : (
            matches.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                onPress={openSite}
                isFavourite={favouriteIds.includes(site.id)}
                isVisited={visitedIds.includes(site.id)}
              />
            ))
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.section}>Browse by type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {uniqueTypes().map((type) => (
              <Pressable key={type} style={styles.chip} onPress={() => openType(type)}>
                <Text style={styles.chipText}>{type}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.section}>Featured</Text>
          {featured.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onPress={openSite}
              isFavourite={favouriteIds.includes(site.id)}
              isVisited={visitedIds.includes(site.id)}
            />
          ))}
        </View>
      )}
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
    paddingBottom: 32,
  },
  intro: {
    fontSize: 16,
    lineHeight: 22,
    color: '#5C4632',
    marginBottom: 12,
  },
  search: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6D7C3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#3D2914',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2914',
  },
  empty: {
    color: '#5C4632',
    fontSize: 15,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6D7C3',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  chipText: {
    color: '#8B4513',
    fontWeight: '600',
  },
});
