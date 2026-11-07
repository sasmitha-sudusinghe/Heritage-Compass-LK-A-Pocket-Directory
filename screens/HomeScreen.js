// Home tab. Featured sites, category shortcuts, and search come later.
// The button only proves the stack can open Site Detail. It goes away in a later step.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.note}>
        Featured sites, category shortcuts, and a search bar will live here.
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('SiteDetail', { siteId: 'sample' })}
      >
        <Text style={styles.buttonText}>Open a sample site</Text>
      </Pressable>
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
    marginBottom: 20,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B4513',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#F7F3EA',
    fontWeight: '600',
  },
});
