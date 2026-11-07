// Shared layout for the six screens until real content is added.
import { StyleSheet, Text, View } from 'react-native';

export default function PlaceholderScreen({ title, note }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EA',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2914',
    marginBottom: 8,
  },
  note: {
    fontSize: 16,
    color: '#5C4632',
    lineHeight: 22,
  },
});
