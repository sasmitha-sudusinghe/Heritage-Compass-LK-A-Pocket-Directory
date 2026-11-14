// app/(tabs)/index.jsx — Home tab.
//
// Layout matches the design mockup:
//   1. Logo row          — stupa icon + "Heritage Compass LK" / "A POCKET DIRECTORY"
//   2. Hero section      — warm-toned image placeholder, big heading, search bar
//   3. Category tiles    — 4 coloured square tiles (Temples, Ancient Cities, Forts, Monuments)
//   4. Featured section  — horizontal scroll of large site cards
//
// No navigation header — the tab layout sets headerShown: false for this screen.
// Safe-area top inset is handled with useSafeAreaInsets().
import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { use3DPress } from '../../utils/use3DPress';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import sites from '../../data/sites.json';
import images from '../../data/images';
import { getFavouriteIds, getVisitedIds } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Featured site IDs ─────────────────────────────────────────────────────────
const FEATURED_IDS = [
  'sigiriya',
  'temple-of-the-tooth',
  'galle-fort',
  'dambulla-cave-temple',
  'sri-maha-bodhi',
];

// ── Category tiles ────────────────────────────────────────────────────────────
// Colors + icons match the mockup exactly.
// `typeFilter` is passed to Browse as the ?type param.
const CATEGORIES = [
  {
    label: 'Temples',
    icon: 'business-outline',
    color: '#8B2020',      // maroon red
    typeFilter: 'Buddhist Temple',
  },
  {
    label: 'Ancient\nCities',
    icon: 'map-outline',
    color: '#1E5C3A',      // forest green
    typeFilter: 'Archaeological Site',
  },
  {
    label: 'Forts',
    icon: 'shield-outline',
    color: '#B8820A',      // amber gold
    typeFilter: 'Fort',
  },
  {
    label: 'Monuments',
    icon: 'ribbon-outline',
    color: '#1E5C5C',      // dark teal
    typeFilter: 'Monument',
  },
];

// ── Hero search box ───────────────────────────────────────────────────────────
function HeroSearch({ query, onChange, onClear, theme }) {
  return (
    <View style={[hs.wrap, { backgroundColor: '#FFFFFF', shadowColor: theme.cardShadow }]}>
      <Ionicons name="search-outline" size={18} color="#A07850" style={hs.icon} />
      <TextInput
        value={query}
        onChangeText={onChange}
        placeholder="Search heritage sites..."
        placeholderTextColor="#A07850"
        style={[hs.input, { color: theme.textPrimary }]}
        autoCorrect={false}
      />
      {query.length > 0 && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color="#A07850" />
        </Pressable>
      )}
    </View>
  );
}
const hs = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    ...Platform.select({
      ios:     { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  icon:  { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
});

// ── Category tile ─────────────────────────────────────────────────────────────
function CategoryTile({ item, onPress }) {
  const { onPressIn, onPressOut, animatedStyle } = use3DPress({
    scaleTo: 1.07,
    liftPx:  10,
    tension: 380,
    friction: 6,
  });

  return (
    <Animated.View style={[ct.wrapper, animatedStyle]}>
      <Pressable
        style={[ct.tile, { backgroundColor: item.color }]}
        onPress={() => onPress(item.typeFilter)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Ionicons name={item.icon} size={30} color="#FFFFFF" />
        <Text style={ct.label}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}
const ct = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginHorizontal: 5,
    // iOS shadow on wrapper so it lifts with the card
    ...Platform.select({
      ios: {
        shadowColor: '#3D1A00',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.20,
        shadowRadius: 10,
      },
    }),
  },
  tile: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ android: { elevation: 5 } }),
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.2,
  },
});

// ── Featured site card (large, horizontal scroll) ─────────────────────────────
function FeaturedCard({ site, onPress, isFavourite, isVisited }) {
  const CARD_W = 300;
  const { onPressIn, onPressOut, animatedStyle } = use3DPress({
    scaleTo: 1.04,
    liftPx:  10,
    tension: 360,
    friction: 7,
  });

  return (
    <Animated.View style={[{ width: CARD_W, marginRight: 14 }, animatedStyle,
      Platform.select({
        ios: { shadowColor: '#3D1A00', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 14 },
      }),
    ]}>
      <Pressable
        style={fc.card}
        onPress={() => onPress(site)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {/* Photo placeholder — replace with ImageBackground when photos arrive */}
        <View style={[fc.photo, { backgroundColor: '#8B6240' }]}>
          {images[site.image] ? (
            <Image source={images[site.image]} style={fc.photoImage} resizeMode="cover" />
          ) : (
            <Text style={fc.photoLetter}>{site.name.slice(0, 1)}</Text>
          )}
        </View>

        {/* Dark overlay + text */}
        <View style={fc.overlay}>
          <Text style={fc.siteName} numberOfLines={1}>{site.name}</Text>
          <View style={fc.districtRow}>
            <Ionicons name="location-outline" size={12} color="#E0C898" style={{ marginRight: 4 }} />
            <Text style={fc.district}>{site.district} District</Text>
          </View>
        </View>

        {/* Chevron button */}
        <View style={fc.chevronWrap}>
          <Ionicons name="chevron-forward" size={18} color="#3D1A00" />
        </View>

        {/* Badges */}
        {(isFavourite || isVisited || site.unesco) && (
          <View style={fc.badges}>
            {site.unesco && <Text style={fc.badge}>★ UNESCO</Text>}
            {isFavourite && <Text style={fc.badge}>♥</Text>}
            {isVisited   && <Text style={fc.badge}>✓</Text>}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
const fc = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#8B6240',
    ...Platform.select({ android: { elevation: 6 } }),
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLetter: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 80,
    fontWeight: '900',
  },
  photoImage: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30,10,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  siteName:   { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.1 },
  districtRow:{ flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  district:   { color: '#E0C898', fontSize: 12 },
  chevronWrap:{
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C87800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: 'rgba(200,120,0,0.90)',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
});

// ── Search result row (compact) — reused from SiteCard style ─────────────────
import SiteCard from '../../components/SiteCard';

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { theme, scheme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [query,        setQuery]        = useState('');
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

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? sites.filter((s) =>
        `${s.name} ${s.district} ${s.type} ${s.era}`.toLowerCase().includes(needle)
      )
    : [];

  const featured = FEATURED_IDS
    .map((id) => sites.find((s) => s.id === id))
    .filter(Boolean);

  function openSite(site) {
    router.push(`/site/${site.id}`);
  }

  function openCategory(type) {
    router.push({ pathname: '/browse', params: { type } });
  }

  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingBottom: 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── 1. Logo row (replaces nav header) ── */}
        <View style={[s.logoBar, { paddingTop: insets.top + 10 }]}>
          {/* Logo icon placeholder — replace with <Image> when asset is ready */}
          <View style={s.logoIcon}>
            <Ionicons name="leaf" size={28} color="#C87800" />
          </View>
          <View style={s.logoText}>
            <Text style={s.logoName}>Heritage Compass LK</Text>
            <Text style={s.logoSub}>A POCKET DIRECTORY</Text>
          </View>
          {/* Theme toggle lives here now that the nav header is hidden */}
          <Pressable onPress={toggleTheme} style={s.toggleBtn} hitSlop={8}>
            <Ionicons
              name={scheme === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={theme.textPrimary}
            />
          </Pressable>
        </View>

        {/* ── 2. Hero section ── */}
        <View style={s.hero}>
          {/*
            When the user provides the Sigiriya photo:
              <ImageBackground source={require('../../assets/hero.jpg')} style={s.hero} resizeMode="cover">
            For now we use a warm tone-on-tone coloured view.
          */}
          <View style={s.heroContent}>
            <Text style={s.heroTitle}>Discover{'\n'}Sri Lanka's{'\n'}Heritage</Text>
            <View style={s.heroUnderline} />
            <Text style={s.heroSub}>
              Explore ancient cities, sacred temples,{'\n'}historic forts and cultural treasures.
            </Text>
          </View>
        </View>

        {/* Search bar overlaps hero bottom */}
        <HeroSearch
          query={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          theme={theme}
        />

        {/* ── Search results (shown while typing) ── */}
        {needle ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </Text>
            {matches.length === 0
              ? <Text style={s.empty}>No sites match that search.</Text>
              : matches.map((site) => (
                  <SiteCard
                    key={site.id}
                    site={site}
                    onPress={openSite}
                    isFavourite={favouriteIds.includes(site.id)}
                    isVisited={visitedIds.includes(site.id)}
                  />
                ))
            }
          </View>
        ) : (
          <>
            {/* ── 3. Category tiles ── */}
            <View style={s.section}>
              <View style={s.tileRow}>
                {CATEGORIES.map((cat) => (
                  <CategoryTile key={cat.label} item={cat} onPress={openCategory} />
                ))}
              </View>
            </View>

            {/* ── 4. Featured sites ── */}
            <View style={s.featuredHeader}>
              <View style={s.featuredTitleRow}>
                <View style={s.featuredRule} />
                <Text style={s.featuredTitle}>Featured Heritage Sites</Text>
              </View>
              <Pressable onPress={() => router.push('/browse')}>
                <Text style={s.viewAll}>View All →</Text>
              </Pressable>
            </View>

            <FlatList
              data={featured}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.featuredList}
              scrollEnabled
              renderItem={({ item }) => (
                <FeaturedCard
                  site={item}
                  onPress={openSite}
                  isFavourite={favouriteIds.includes(item.id)}
                  isVisited={visitedIds.includes(item.id)}
                />
              )}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    root:    { flex: 1, backgroundColor: theme.bg },
    scroll:  { flex: 1 },
    content: {},

    // Logo bar
    logoBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 10,
      backgroundColor: theme.bg,
    },
    logoIcon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: theme.brandLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    logoText:  { flex: 1 },
    logoName:  { fontSize: 16, fontWeight: '900', color: theme.textPrimary, letterSpacing: 0.2 },
    logoSub:   { fontSize: 10, fontWeight: '700', color: theme.brand, letterSpacing: 1.0, marginTop: 1 },
    toggleBtn: { padding: 6 },

    // Hero
    hero: {
      backgroundColor: '#D4A060',   // warm golden-sand placeholder; swap for ImageBackground + photo
      minHeight: 200,
      justifyContent: 'flex-end',
    },
    heroContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 24,
      backgroundColor: 'rgba(245,220,170,0.55)', // warm translucent overlay
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#3D1A00',
      lineHeight: 38,
      letterSpacing: 0.1,
    },
    heroUnderline: {
      width: 48,
      height: 3,
      borderRadius: 2,
      backgroundColor: '#C87800',
      marginVertical: 10,
    },
    heroSub: {
      fontSize: 14,
      color: '#5C3010',
      lineHeight: 20,
    },

    // Category tiles
    section:  { paddingHorizontal: 16, marginTop: 20 },
    tileRow:  { flexDirection: 'row', marginHorizontal: -5 },

    // Featured
    featuredHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginTop: 24,
      marginBottom: 14,
    },
    featuredTitleRow: { flexDirection: 'row', alignItems: 'center' },
    featuredRule: {
      width: 4,
      height: 20,
      borderRadius: 2,
      backgroundColor: theme.brand,
      marginRight: 10,
    },
    featuredTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: theme.textPrimary,
      letterSpacing: 0.1,
    },
    viewAll: { fontSize: 14, fontWeight: '700', color: theme.brand },
    featuredList: { paddingLeft: 16, paddingRight: 6 },

    // Misc
    empty: { color: theme.textSecondary, fontSize: 15 },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: 12,
    },
  });
}
