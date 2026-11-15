// app/(tabs)/categories.jsx — Browse sites grouped by Type or by Era.
//
// Groups are computed from sites.json at runtime (not hardcoded).
// Tapping a tile navigates to Browse pre-filtered by type or era.

import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import sites from '../../data/sites.json';
import { useTheme } from '../../contexts/ThemeContext';

// ── Icon + colour maps ────────────────────────────────────────────────────────
// Match the category tile colours from the Home screen.
const TYPE_META = {
  'Buddhist Temple':     { icon: 'leaf',             color: '#8B2020' },
  'Archaeological Site': { icon: 'compass',          color: '#1E5C3A' },
  'Fort':                { icon: 'shield',           color: '#B8820A' },
  'Hindu Kovil':         { icon: 'flame',            color: '#1E5C5C' },
  'Mosque':              { icon: 'moon',             color: '#1E5C5C' },
  'Colonial':            { icon: 'business',         color: '#B8820A' },
};
const DEFAULT_TYPE_META = { icon: 'location', color: '#8B6240' };

const ERA_META = {
  'Anuradhapura':     { icon: 'time',         color: '#8B2020' },
  'Polonnaruwa':      { icon: 'library',      color: '#1E5C3A' },
  'Kandy':            { icon: 'flower',       color: '#B8820A' },
  'Colonial':         { icon: 'business',     color: '#B8820A' },
  'Jaffna Kingdom':   { icon: 'flag',         color: '#1E5C5C' },
  'Ancient':          { icon: 'earth',        color: '#8B2020' },
  'Medieval':         { icon: 'hourglass',    color: '#1E5C3A' },
  'Dambadeniya':      { icon: 'trail-sign',   color: '#1E5C5C' },
  'Gampola':          { icon: 'bonfire',      color: '#B8820A' },
  'Ruhuna':           { icon: 'sunny',        color: '#8B2020' },
};
const DEFAULT_ERA_META = { icon: 'calendar', color: '#8B6240' };

// ── Grouping helper ───────────────────────────────────────────────────────────
// Returns an array of { name, count, icon, color } sorted by count (descending)
function groupBy(field, metaMap, defaultMeta) {
  const map = {};
  sites.forEach((s) => {
    const key = s[field];
    if (!map[key]) {
      const meta = metaMap[key] || defaultMeta;
      map[key] = { name: key, count: 0, icon: meta.icon, color: meta.color };
    }
    map[key].count += 1;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

// ── Toggle button ─────────────────────────────────────────────────────────────
function ToggleButton({ label, active, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.toggleBtn,
        { backgroundColor: active ? theme.brand : theme.card,
          borderColor: active ? theme.brand : theme.border },
      ]}
    >
      <Text
        style={[
          styles.toggleText,
          { color: active ? '#FFFFFF' : theme.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ── Category tile ─────────────────────────────────────────────────────────────
function CategoryTile({ item, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
      ]}
    >
      {/* Coloured icon circle */}
      <View style={[styles.iconCircle, { backgroundColor: item.color + '18' }]}>
        <Ionicons name={item.icon} size={28} color={item.color} />
      </View>

      {/* Label */}
      <Text style={[styles.tileName, { color: theme.textPrimary }]} numberOfLines={2}>
        {item.name}
      </Text>

      {/* Count pill */}
      <View style={[styles.countPill, { backgroundColor: item.color + '18' }]}>
        <Text style={[styles.countText, { color: item.color }]}>
          {item.count} {item.count === 1 ? 'site' : 'sites'}
        </Text>
      </View>
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function CategoriesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('type'); // 'type' | 'era'

  const groups = mode === 'type'
    ? groupBy('type', TYPE_META, DEFAULT_TYPE_META)
    : groupBy('era', ERA_META, DEFAULT_ERA_META);

  function openGroup(group) {
    if (mode === 'type') {
      router.push({ pathname: '/browse', params: { type: group.name } });
    } else {
      router.push({ pathname: '/browse', params: { era: group.name } });
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + 12 },
        ]}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            {/* Title */}
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Categories
            </Text>

            {/* Toggle */}
            <View style={styles.toggleRow}>
              <ToggleButton
                label="By Type"
                active={mode === 'type'}
                onPress={() => setMode('type')}
                theme={theme}
              />
              <ToggleButton
                label="By Era"
                active={mode === 'era'}
                onPress={() => setMode('era')}
                theme={theme}
              />
            </View>

            {/* Summary count */}
            <View style={[styles.summaryPill, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              <Ionicons name="grid-outline" size={14} color={theme.textMuted} style={{ marginRight: 5 }} />
              <Text style={[styles.summaryText, { color: theme.textSecondary }]}>
                {sites.length} sites in {groups.length} {mode === 'type' ? 'types' : 'eras'}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CategoryTile
            item={item}
            onPress={() => openGroup(item)}
            theme={theme}
          />
        )}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Header
  headerWrap: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginBottom: 12,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryPill: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Grid
  row: {
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },

  // Tile
  tile: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 8,
  },
  countPill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
