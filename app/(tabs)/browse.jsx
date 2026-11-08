// app/(tabs)/browse.jsx — Browse tab.
// A FlatList of all 25 sites with search, sort, type/district chips.
// Accepts an optional ?type param from the Home shortcuts.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import SiteCard from '../../components/SiteCard';
import sites from '../../data/sites.json';
import { getFavouriteIds, getVisitedIds } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

function uniqueValues(field) {
  const seen = new Set();
  return sites.filter((s) => {
    if (seen.has(s[field])) return false;
    seen.add(s[field]);
    return true;
  }).map((s) => s[field]);
}

function Chip({ label, selected, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, marginRight: 8, marginBottom: 8 },
        selected && { backgroundColor: theme.brand, borderColor: theme.brand },
      ]}
    >
      <Text style={[{ color: theme.brand, fontWeight: '600' }, selected && { color: '#F7F3EA' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function BrowseScreen() {
  const { theme } = useTheme();
  // The Home screen may push a ?type param when a chip is tapped.
  const params = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [district, setDistrict] = useState('All');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [visitedIds, setVisitedIds] = useState([]);

  // Apply the type param once per navigation event (not on every render).
  const lastType = useRef(null);
  useEffect(() => {
    if (params.type && params.type !== lastType.current) {
      lastType.current = params.type;
      setType(params.type);
    }
  }, [params.type]);

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
  const visible = sites
    .filter((s) => {
      const hay = `${s.name} ${s.district} ${s.type} ${s.era}`.toLowerCase();
      return (
        (!needle || hay.includes(needle)) &&
        (type === 'All' || s.type === type) &&
        (district === 'All' || s.district === district) &&
        (!unescoOnly || s.unesco)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'era') {
        const diff = a.era.localeCompare(b.era);
        if (diff !== 0) return diff;
      }
      return a.name.localeCompare(b.name);
    });

  const districts = uniqueValues('district').sort((a, b) => a.localeCompare(b));
  const s = makeStyles(theme);

  return (
    <FlatList
      style={s.screen}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
      data={visible}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SiteCard
          site={item}
          onPress={() => router.push(`/site/${item.id}`)}
          isFavourite={favouriteIds.includes(item.id)}
          isVisited={visitedIds.includes(item.id)}
        />
      )}
      ListHeaderComponent={
        <View>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search the directory"
            placeholderTextColor={theme.textMuted}
            style={s.search}
            autoCorrect={false}
          />

          <Text style={s.label}>Sort</Text>
          <View style={s.row}>
            <Chip label="Name" selected={sortBy === 'name'} onPress={() => setSortBy('name')} theme={theme} />
            <Chip label="Era"  selected={sortBy === 'era'}  onPress={() => setSortBy('era')}  theme={theme} />
            <Chip label="UNESCO" selected={unescoOnly} onPress={() => setUnescoOnly((v) => !v)} theme={theme} />
          </View>

          <Text style={s.label}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip label="All" selected={type === 'All'} onPress={() => setType('All')} theme={theme} />
            {uniqueValues('type').map((v) => (
              <Chip key={v} label={v} selected={type === v} onPress={() => setType(v)} theme={theme} />
            ))}
          </ScrollView>

          <Text style={s.label}>District</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip label="All" selected={district === 'All'} onPress={() => setDistrict('All')} theme={theme} />
            {districts.map((v) => (
              <Chip key={v} label={v} selected={district === v} onPress={() => setDistrict(v)} theme={theme} />
            ))}
          </ScrollView>

          <Text style={s.count}>
            {visible.length} {visible.length === 1 ? 'site' : 'sites'}
          </Text>
          {visible.length === 0 && <Text style={s.empty}>No sites match these filters.</Text>}
        </View>
      }
    />
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.bg },
    content: { padding: 16, paddingBottom: 32 },
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
    label: { marginTop: 14, marginBottom: 8, fontSize: 14, fontWeight: '700', color: theme.textPrimary },
    row: { flexDirection: 'row', flexWrap: 'wrap' },
    count: { marginTop: 8, marginBottom: 12, color: theme.textSecondary, fontSize: 15 },
    empty: { color: theme.textSecondary, fontSize: 15 },
  });
}

