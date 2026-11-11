// app/(tabs)/index.jsx — Home tab.
// Hero banner → search box → type chips → featured sites.
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import SiteCard from '../../components/SiteCard';
import sites from '../../data/sites.json';
import { getFavouriteIds, getVisitedIds } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

const FEATURED_IDS = [
  'sigiriya',
  'temple-of-the-tooth',
  'galle-fort',
  'dambulla-cave-temple',
  'sri-maha-bodhi',
];

function uniqueTypes() {
  const seen = new Set();
  return sites
    .filter((s) => { if (seen.has(s.type)) return false; seen.add(s.type); return true; })
    .map((s) => s.type);
}

// Decorative section header with a left colour rule.
function SectionHeader({ title, theme }) {
  return (
    <View style={sh.row}>
      <View style={[sh.rule, { backgroundColor: theme.brand }]} />
      <Text style={[sh.text, { color: theme.textPrimary }]}>{title}</Text>
    </View>
  );
}
const sh = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  rule: { width: 4, height: 20, borderRadius: 2, marginRight: 10 },
  text: { fontSize: 18, fontWeight: '800', letterSpacing: 0.2 },
});

export default function HomeScreen() {
  const { theme } = useTheme();
  const [query, setQuery]           = useState('');
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [visitedIds,   setVisitedIds]   = useState([]);

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

  const needle  = query.trim().toLowerCase();
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

      {/* ── Hero banner ── */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>Heritage Compass</Text>
        <Text style={s.heroSub}>25 temples & heritage sites · Sri Lanka</Text>
        <View style={s.heroStats}>
          <Text style={s.heroStat}>{visitedIds.length} visited</Text>
          <View style={s.heroDot} />
          <Text style={s.heroStat}>{favouriteIds.length} saved</Text>
        </View>
      </View>

      {/* ── Search box ── */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} style={s.searchIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, district, or type"
          placeholderTextColor={theme.textMuted}
          style={s.searchInput}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </Pressable>
        )}
      </View>

      {needle ? (
        // ── Search results ──
        <View>
          <SectionHeader
            title={`${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
            theme={theme}
          />
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
          {/* ── Type chips ── */}
          <SectionHeader title="Browse by type" theme={theme} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll}>
            {uniqueTypes().map((type) => (
              <Pressable
                key={type}
                style={({ pressed }) => [s.chip, pressed && { opacity: 0.75 }]}
                onPress={() => router.push({ pathname: '/browse', params: { type } })}
              >
                <Text style={s.chipText}>{type}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ── Featured ── */}
          <SectionHeader title="Featured sites" theme={theme} />
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
    screen:  { flex: 1, backgroundColor: theme.bg },
    content: { paddingBottom: 40 },

    // Hero
    hero: {
      backgroundColor: theme.headerBg,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 28,
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    heroSub: {
      marginTop: 4,
      fontSize: 14,
      color: theme.brand,
      fontWeight: '600',
    },
    heroStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    heroStat: {
      fontSize: 13,
      color: theme.tabBarBorder,
      fontWeight: '500',
    },
    heroDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.brand,
      marginHorizontal: 8,
    },

    // Search
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginHorizontal: 16,
      marginTop: -16, // overlaps hero bottom edge
      marginBottom: 0,
      // shadow
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    searchIcon:  { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 15, color: theme.textPrimary },

    // Chips
    chipScroll: { paddingHorizontal: 16 },
    chip: {
      backgroundColor: theme.brandLight,
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 14,
      marginRight: 8,
    },
    chipText: { color: theme.brand, fontWeight: '700', fontSize: 13 },

    // Misc
    empty: { color: theme.textSecondary, fontSize: 15, paddingHorizontal: 16 },
  });
}
