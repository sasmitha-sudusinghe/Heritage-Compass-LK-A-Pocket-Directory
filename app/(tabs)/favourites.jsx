// app/(tabs)/favourites.jsx — Shows all sites the user saved as favourites.
//
// Uses useFocusEffect so the list refreshes every time the tab gains focus
// (tab screens stay mounted in Expo Router, so useEffect only fires once).

import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SiteCard from '../../components/SiteCard';
import sites from '../../data/sites.json';
import { getFavouriteIds, getVisitedIds, toggleFavourite } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

export default function FavouritesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [favouriteIds, setFavouriteIds] = useState([]);
  const [visitedIds, setVisitedIds] = useState([]);

  // ── Reload every time the tab gets focus ──────────────────────────────────
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

  // Filter sites.json to only the favourited ones
  const favouriteSites = sites.filter((s) => favouriteIds.includes(s.id));

  // ── Handle removing a favourite and updating the list immediately ─────────
  const handleRemoveFavourite = async (site) => {
    const updatedIds = await toggleFavourite(site.id);
    setFavouriteIds(updatedIds);
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (favouriteSites.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: theme.bg }]}>
        <View style={[styles.emptyIconWrap, { backgroundColor: theme.cardRaised || theme.card }]}>
          <Ionicons name="heart-outline" size={48} color={theme.textMuted} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
          No saved sites yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
          Tap the heart on any site to save it here.
        </Text>
      </View>
    );
  }

  // ── List of favourite sites ───────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Favourites
        </Text>
        <Text style={[styles.headerCount, { color: theme.textSecondary }]}>
          {favouriteSites.length} {favouriteSites.length === 1 ? 'site' : 'sites'} saved
        </Text>
      </View>

      <FlatList
        data={favouriteSites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SiteCard
            site={item}
            onPress={(site) => router.push(`/site/${site.id}`)}
            isFavourite={true}
            isVisited={visitedIds.includes(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerCount: {
    fontSize: 14,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // ── Empty state ─────────────────────────────────────────────────────────
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
