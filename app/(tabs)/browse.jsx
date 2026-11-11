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
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import SiteCard from '../../components/SiteCard';
import sites from '../../data/sites.json';
import { getFavouriteIds, getVisitedIds } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

function uniqueValues(field) {
  const seen = new Set();
  return sites
    .filter((s) => { if (seen.has(s[field])) return false; seen.add(s[field]); return true; })
    .map((s) => s[field]);
}

function Chip({ label, selected, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: theme.card, borderColor: theme.border },
        selected && { backgroundColor: theme.brand, borderColor: theme.brand },
      ]}
    >
      <Text style={[styles.chipText, { color: theme.brand }, selected && { color: '#FFFFFF' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

// Lightweight section label used inside the ListHeaderComponent.
function FilterLabel({ title, theme }) {
  return (
    <Text style={[styles.filterLabel, { color: theme.textMuted }]}>{title}</Text>
  );
}

export default function BrowseScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [query,      setQuery]      = useState('');
  const [type,       setType]       = useState('All');
  const [district,   setDistrict]   = useState('All');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [sortBy,     setSortBy]     = useState('name');
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [visitedIds,   setVisitedIds]   = useState([]);

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

  const Header = (
    <View style={[styles.header, { backgroundColor: theme.bg }]}>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} style={styles.searchIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search the directory"
          placeholderTextColor={theme.textMuted}
          style={[styles.searchInput, { color: theme.textPrimary }]}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Sort / flag */}
      <FilterLabel title="SORT & FLAGS" theme={theme} />
      <View style={styles.row}>
        <Chip label="Name"   selected={sortBy === 'name'} onPress={() => setSortBy('name')} theme={theme} />
        <Chip label="Era"    selected={sortBy === 'era'}  onPress={() => setSortBy('era')}  theme={theme} />
        <Chip
          label="UNESCO ★"
          selected={unescoOnly}
          onPress={() => setUnescoOnly((v) => !v)}
          theme={theme}
        />
      </View>

      {/* Type */}
      <FilterLabel title="TYPE" theme={theme} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label="All" selected={type === 'All'} onPress={() => setType('All')} theme={theme} />
        {uniqueValues('type').map((v) => (
          <Chip key={v} label={v} selected={type === v} onPress={() => setType(v)} theme={theme} />
        ))}
      </ScrollView>

      {/* District */}
      <FilterLabel title="DISTRICT" theme={theme} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label="All" selected={district === 'All'} onPress={() => setDistrict('All')} theme={theme} />
        {districts.map((v) => (
          <Chip key={v} label={v} selected={district === v} onPress={() => setDistrict(v)} theme={theme} />
        ))}
      </ScrollView>

      {/* Result count pill */}
      <View style={[styles.countWrap, { backgroundColor: theme.inputBg }]}>
        <Ionicons name="list-outline" size={14} color={theme.textMuted} style={{ marginRight: 5 }} />
        <Text style={[styles.countText, { color: theme.textSecondary }]}>
          {visible.length} {visible.length === 1 ? 'site' : 'sites'}
        </Text>
      </View>

      {visible.length === 0 && (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>No sites match these filters.</Text>
      )}
    </View>
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={styles.list}
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
      ListHeaderComponent={Header}
    />
  );
}

const styles = StyleSheet.create({
  list:   { paddingBottom: 40 },
  header: { padding: 16, paddingBottom: 8 },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
  },
  searchIcon:  { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15 },

  // Filter labels
  filterLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 8,
  },
  row:  { flexDirection: 'row', flexWrap: 'wrap' },

  // Chips
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 13,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 13, fontWeight: '700' },

  // Count
  countWrap: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  countText: { fontSize: 13, fontWeight: '600' },

  empty: { fontSize: 15, marginTop: 4, marginBottom: 8 },
});
