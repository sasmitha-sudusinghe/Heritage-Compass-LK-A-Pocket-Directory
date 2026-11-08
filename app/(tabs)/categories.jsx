// app/(tabs)/categories.jsx — placeholder until step 6.
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function CategoriesScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Categories</Text>
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Sites grouped by type (temple, kovil, fort, and so on) and by era will live here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  note: { fontSize: 16, lineHeight: 22 },
});

