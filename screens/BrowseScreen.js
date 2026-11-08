// Browse: the full offline list, with search, filter chips, and a simple sort.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import SiteCard from '../components/SiteCard';
import sites from '../data/sites.json';
import { getFavouriteIds, getVisitedIds } from '../utils/storage';

function uniqueValues(field) {
  const values = [];
  sites.forEach((site) => {
    if (!values.includes(site[field])) {
      values.push(site[field]);
    }
  });
  return values;
}

function Chip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function BrowseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [district, setDistrict] = useState('All');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [visitedIds, setVisitedIds] = useState([]);

  // Home sends a new requestId each time a type shortcut is tapped.
  const lastRequestId = useRef(null);
  useEffect(() => {
    const requestId = route.params?.requestId;
    if (!requestId || lastRequestId.current === requestId) {
      return;
    }
    lastRequestId.current = requestId;
    setType(route.params?.type ?? 'All');
  }, [route.params?.requestId, route.params?.type]);

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
  const visibleSites = sites
    .filter((site) => {
      const haystack = `${site.name} ${site.district} ${site.type} ${site.era}`.toLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      const matchesType = type === 'All' || site.type === type;
      const matchesDistrict = district === 'All' || site.district === district;
      const matchesUnesco = !unescoOnly || site.unesco;
      return matchesQuery && matchesType && matchesDistrict && matchesUnesco;
    })
    .sort((a, b) => {
      if (sortBy === 'era') {
        const byEra = a.era.localeCompare(b.era);
        if (byEra !== 0) {
          return byEra;
        }
      }
      return a.name.localeCompare(b.name);
    });

  function openSite(site) {
    navigation.navigate('SiteDetail', { siteId: site.id });
  }

  const districts = uniqueValues('district').sort((a, b) => a.localeCompare(b));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search the directory"
        placeholderTextColor="#8A7560"
        style={styles.search}
        autoCorrect={false}
      />

      <Text style={styles.label}>Sort</Text>
      <View style={styles.row}>
        <Chip label="Name" selected={sortBy === 'name'} onPress={() => setSortBy('name')} />
        <Chip label="Era" selected={sortBy === 'era'} onPress={() => setSortBy('era')} />
        <Chip
          label="UNESCO"
          selected={unescoOnly}
          onPress={() => setUnescoOnly((current) => !current)}
        />
      </View>

      <Text style={styles.label}>Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label="All" selected={type === 'All'} onPress={() => setType('All')} />
        {uniqueValues('type').map((value) => (
          <Chip
            key={value}
            label={value}
            selected={type === value}
            onPress={() => setType(value)}
          />
        ))}
      </ScrollView>

      <Text style={styles.label}>District</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label="All" selected={district === 'All'} onPress={() => setDistrict('All')} />
        {districts.map((value) => (
          <Chip
            key={value}
            label={value}
            selected={district === value}
            onPress={() => setDistrict(value)}
          />
        ))}
      </ScrollView>

      <Text style={styles.count}>
        {visibleSites.length} {visibleSites.length === 1 ? 'site' : 'sites'}
      </Text>

      {visibleSites.length === 0 ? (
        <Text style={styles.empty}>No sites match these filters.</Text>
      ) : (
        visibleSites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            onPress={openSite}
            isFavourite={favouriteIds.includes(site.id)}
            isVisited={visitedIds.includes(site.id)}
          />
        ))
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
  label: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#3D2914',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6D7C3',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  chipText: {
    color: '#8B4513',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#F7F3EA',
  },
  count: {
    marginTop: 8,
    marginBottom: 12,
    color: '#5C4632',
    fontSize: 15,
  },
  empty: {
    color: '#5C4632',
    fontSize: 15,
  },
});
