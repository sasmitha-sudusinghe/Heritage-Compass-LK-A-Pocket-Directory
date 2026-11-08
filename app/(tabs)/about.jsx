// app/(tabs)/about.jsx — placeholder until step 6.
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function AboutScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>About</Text>
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Visitor etiquette, tips, and an X of 25 visited progress counter will live here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  note: { fontSize: 16, lineHeight: 22 },
});

