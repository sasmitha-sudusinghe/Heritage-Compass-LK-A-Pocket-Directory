// app/(tabs)/favourites.jsx — placeholder until step 6.
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function FavouritesScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Favourites</Text>
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Sites you mark as favourites will be listed here and kept after a restart.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  note: { fontSize: 16, lineHeight: 22 },
});

