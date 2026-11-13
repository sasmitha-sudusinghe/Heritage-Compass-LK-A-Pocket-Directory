// app/site/[id].jsx — Site Detail.
// useLocalSearchParams provides `id`; we find the site in sites.json.
// Hero uses the category tile colour for this site's type.
// A real photo (ImageBackground) replaces the coloured swatch in a later step.
import { useCallback, useLayoutEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';

import sites from '../../data/sites.json';
import images from '../../data/images';
import {
  getFavouriteIds,
  getVisitedIds,
  toggleFavourite,
  toggleVisited,
} from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

// Same mapping as SiteCard so the detail hero matches the card colour.
const TYPE_COLORS = {
  'Buddhist Temple':     '#8B2020',
  'Hindu Temple':        '#8B2020',
  'Archaeological Site': '#1E5C3A',
  'Fort':                '#B8820A',
  'Colonial Heritage':   '#B8820A',
  'Monument':            '#1E5C5C',
  'Nature Reserve':      '#1E5C3A',
  'Mosque':              '#1E5C5C',
  'Church':              '#1E5C5C',
};
function getBarColor(type) { return TYPE_COLORS[type] ?? '#8B6240'; }

// ── Info card ─────────────────────────────────────────────────────────────────
function InfoCard({ iconName, label, value, theme }) {
  return (
    <View style={[ic.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={ic.top}>
        <Ionicons name={iconName} size={15} color={theme.brand} style={ic.icon} />
        <Text style={[ic.label, { color: theme.brand }]}>{label}</Text>
      </View>
      <Text style={[ic.value, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  );
}
const ic = StyleSheet.create({
  card:  {
    borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10,
    ...Platform.select({ ios: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 } }),
  },
  top:   { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  icon:  { marginRight: 6 },
  label: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  value: { fontSize: 15, lineHeight: 22 },
});

// ── Action button ─────────────────────────────────────────────────────────────
function ActionBtn({ iconName, label, active, onPress, theme }) {
  return (
    <Pressable
      style={({ pressed }) => [
        ab.btn,
        { borderColor: theme.brand, backgroundColor: active ? theme.brand : theme.card },
        pressed && { opacity: 0.75 },
      ]}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={17} color={active ? '#FFFFFF' : theme.brand} style={ab.icon} />
      <Text style={[ab.label, { color: active ? '#FFFFFF' : theme.brand }]}>{label}</Text>
    </Pressable>
  );
}
const ab = StyleSheet.create({
  btn:   {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14, marginRight: 10, marginBottom: 8,
  },
  icon:  { marginRight: 6 },
  label: { fontSize: 14, fontWeight: '700' },
});

// ── Main screen ───────────────────────────────────────────────────────────────
export default function SiteDetailScreen() {
  const { theme } = useTheme();
  const { id }    = useLocalSearchParams();
  const navigation = useNavigation();

  const site = sites.find((item) => item.id === id);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isVisited,   setIsVisited]   = useState(false);

  const heroColor = site ? getBarColor(site.type) : theme.brand;

  useLayoutEffect(() => {
    navigation.setOptions({ title: site?.name ?? 'Site' });
  }, [navigation, site]);

  useFocusEffect(
    useCallback(() => {
      if (!site) return undefined;
      let active = true;
      Promise.all([getFavouriteIds(), getVisitedIds()]).then(([favs, visited]) => {
        if (!active) return;
        setIsFavourite(favs.includes(site.id));
        setIsVisited(visited.includes(site.id));
      });
      return () => { active = false; };
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
      <View style={[styles.missing, { backgroundColor: theme.bg }]}>
        <Ionicons name="alert-circle-outline" size={44} color={theme.textMuted} />
        <Text style={[styles.missingText, { color: theme.textSecondary }]}>
          This site is not in the offline directory.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: site.name,
          headerStyle:      { backgroundColor: theme.headerBg },
          headerTintColor:  theme.headerText,
          headerTitleStyle: { fontWeight: '800' },
        }}
      />

      <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={styles.content}>

        {/* ── Hero (category colour + site initial; replaced by photo later) ── */}
        <View style={[styles.hero, { backgroundColor: heroColor }]}>
          {images[site.image] ? (
  <Image source={images[site.image]} style={styles.heroImage} resizeMode="cover" />
) : (
  <Text style={styles.heroLetter}>{site.name.slice(0, 1)}</Text>
)}

          {/* Era pill */}
          <View style={styles.eraPill}>
            <Text style={styles.eraPillText}>{site.era} era</Text>
          </View>

          {/* UNESCO ribbon */}
          {site.unesco && (
            <View style={[styles.unescoRibbon, { backgroundColor: theme.accent }]}>
              <Text style={styles.unescoText}>★ UNESCO World Heritage</Text>
            </View>
          )}
        </View>

        {/* ── Name & meta ── */}
        <View style={styles.nameWrap}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{site.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={theme.brand} style={{ marginRight: 4 }} />
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {site.district} · {site.type}
            </Text>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <ActionBtn
            iconName={isFavourite ? 'heart' : 'heart-outline'}
            label={isFavourite ? 'Saved' : 'Save site'}
            active={isFavourite}
            onPress={onToggleFavourite}
            theme={theme}
          />
          <ActionBtn
            iconName={isVisited ? 'checkmark-circle' : 'checkmark-circle-outline'}
            label={isVisited ? 'Visited' : 'Mark visited'}
            active={isVisited}
            onPress={onToggleVisited}
            theme={theme}
          />
        </View>

        {/* ── Info cards ── */}
        <View style={styles.cards}>
          <InfoCard label="Description"  iconName="book-outline"       value={site.description} theme={theme} />
          <InfoCard label="Open hours"   iconName="time-outline"        value={site.openHours}   theme={theme} />
          <InfoCard label="Entry fee"    iconName="ticket-outline"      value={site.entryFee}    theme={theme} />
          <InfoCard label="Etiquette"    iconName="hand-left-outline"   value={site.etiquette}   theme={theme} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  missing:     { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  missingText: { marginTop: 12, fontSize: 16, textAlign: 'center' },
  content:     { paddingBottom: 48 },

  hero: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroLetter:   { fontSize: 90, fontWeight: '900', color: 'rgba(255,255,255,0.25)' },
  heroImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  eraPill: {
    position: 'absolute', bottom: 14, right: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999,
  },
  eraPillText:  { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  unescoRibbon: {
    position: 'absolute', top: 14, left: 0,
    paddingVertical: 4, paddingHorizontal: 12,
    borderTopRightRadius: 8, borderBottomRightRadius: 8,
  },
  unescoText:   { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  nameWrap: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  name:     { fontSize: 24, fontWeight: '900', lineHeight: 30 },
  metaRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  meta:     { fontSize: 14 },

  actions: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  cards:   { paddingHorizontal: 16, marginTop: 8 },
});
