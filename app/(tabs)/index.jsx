// app/(tabs)/index.jsx — Home tab.
// Shows a short intro, a search box, type-shortcut chips, and a featured list.
// Tapping a card or a chip navigates using expo-router's href.
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import SiteCard from '../../components/SiteCard';
import sites from '../../data/sites.json';
import { getFavouriteIds, getVisitedIds } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

// Five sites shown before the user searches.
const FEATURED_IDS = [
  'sigiriya',
  'temple-of-the-tooth',
  'galle-fort',
  'dambulla-cave-temple',
  'sri-maha-bodhi',
];

function uniqueTypes() {
  const seen = new Set();
  return sites.filter((s) => {
    if (seen.has(s.type)) return false;
    seen.add(s.type);
    return true;
  }).map((s) => s.type);
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [visitedIds, setVisitedIds] = useState([]);

  // Reload saved ids whenever this tab comes into focus.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getFavouriteIds(), getVisitedIds()]).then(([favs, visited]) => {
        if (!active) return;
        setFavouriteIds(favs);
        setVisitedIds(visited);
      });
      return () => { active = false; };
    }, [])
  );

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? sites.filter((s) =>
        `${s.name} ${s.district} ${s.type} ${s.era}`.toLowerCase().includes(needle)
      )
    : [];

  const featured = FEATURED_IDS
    .map((id) => sites.find((s) => s.id === id))
    .filter(Boolean);

  const s = makeStyles(theme);

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.intro}>25 temples and heritage sites, saved on this phone.</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name, district, or type"
        placeholderTextColor={theme.textMuted}
        style={s.search}
        autoCorrect={false}
      />

      {needle ? (
        <View>
          <Text style={s.section}>
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </Text>
          {matches.length === 0
            ? <Text style={s.empty}>No sites match that search.</Text>
            : matches.map((site) => (
                <SiteCard
                  key={site.id}
                  site={site}
                  onPress={() => router.push(`/site/${site.id}`)}
                  isFavourite={favouriteIds.includes(site.id)}
                  isVisited={visitedIds.includes(site.id)}
                />
              ))
          }
        </View>
      ) : (
        <View>
          <Text style={s.section}>Browse by type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {uniqueTypes().map((type) => (
              <Pressable
                key={type}
                style={s.chip}
                // Navigate to Browse tab and pass the type as a param.
                onPress={() => router.push({ pathname: '/browse', params: { type } })}
              >
                <Text style={s.chipText}>{type}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={s.section}>Featured</Text>
          {featured.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onPress={() => router.push(`/site/${site.id}`)}
              isFavourite={favouriteIds.includes(site.id)}
              isVisited={visitedIds.includes(site.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.bg },
    content: { padding: 16, paddingBottom: 32 },
    intro: { fontSize: 16, lineHeight: 22, color: theme.textSecondary, marginBottom: 12 },
    search: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: theme.textPrimary,
    },
    section: { marginTop: 20, marginBottom: 10, fontSize: 18, fontWeight: '700', color: theme.textPrimary },
    empty: { color: theme.textSecondary, fontSize: 15 },
    chip: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginRight: 8,
    },
    chipText: { color: theme.brand, fontWeight: '600' },
  });
}

