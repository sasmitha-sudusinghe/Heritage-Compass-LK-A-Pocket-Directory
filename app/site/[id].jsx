// app/site/[id].jsx — Site Detail.
// Expo Router fills `id` from the URL segment; we find the matching site in
// sites.json and display every field. The header title updates dynamically.
// The Stack.Screen in app/_layout.jsx keeps this route out of the tab bar.
import { useCallback, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';

import sites from '../../data/sites.json';
import {
  getFavouriteIds,
  getVisitedIds,
  toggleFavourite,
  toggleVisited,
} from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

// A labelled field row.
function Field({ label, value, theme }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.brand }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  );
}

export default function SiteDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const site = sites.find((item) => item.id === id);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isVisited, setIsVisited] = useState(false);

  // Update the Stack header title once we know the site name.
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
        <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
          This site is not in the offline directory.
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Override the Stack header colours to follow the theme. */}
      <Stack.Screen
        options={{
          title: site.name,
          headerStyle: { backgroundColor: theme.headerBg },
          headerTintColor: theme.headerText,
        }}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: theme.bg }}
        contentContainerStyle={styles.content}
      >
        {/* Colour swatch — replaced by a real image in a later step. */}
        <View style={[styles.swatch, { backgroundColor: theme.brand }]}>
          <Text style={styles.swatchText}>{site.name.slice(0, 1)}</Text>
        </View>

        <Text style={[styles.name, { color: theme.textPrimary }]}>{site.name}</Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {site.district} · {site.type} · {site.era}
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={[styles.action, { borderColor: theme.brand, backgroundColor: isFavourite ? theme.brand : theme.card }]}
            onPress={onToggleFavourite}
          >
            <Text style={[styles.actionText, { color: isFavourite ? '#F7F3EA' : theme.brand }]}>
              {isFavourite ? 'Remove favourite' : 'Save favourite'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.action, { borderColor: theme.brand, backgroundColor: isVisited ? theme.brand : theme.card }]}
            onPress={onToggleVisited}
          >
            <Text style={[styles.actionText, { color: isVisited ? '#F7F3EA' : theme.brand }]}>
              {isVisited ? 'Unmark visited' : 'Mark visited'}
            </Text>
          </Pressable>
        </View>

        <Field label="Open hours"  value={site.openHours}             theme={theme} />
        <Field label="Entry fee"   value={site.entryFee}              theme={theme} />
        <Field label="Description" value={site.description}           theme={theme} />
        <Field label="Etiquette"   value={site.etiquette}             theme={theme} />
        <Field label="UNESCO"      value={site.unesco ? 'Yes' : 'No'} theme={theme} />
        <Field label="Image file"  value={site.image}                 theme={theme} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, padding: 24, justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  swatch: {
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  swatchText: { color: '#F7F3EA', fontSize: 48, fontWeight: '700' },
  name: { fontSize: 26, fontWeight: '700' },
  meta: { marginTop: 4, fontSize: 15 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 },
  action: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  actionText: { fontWeight: '700' },
  field: { marginTop: 16 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: { marginTop: 4, fontSize: 16, lineHeight: 22 },
});

