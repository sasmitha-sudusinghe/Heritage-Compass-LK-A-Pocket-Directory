// Stack screen. Opened with a site id from Home, Browse, Favourites, or Categories.
import { useRoute } from '@react-navigation/native';
import PlaceholderScreen from './PlaceholderScreen';

export default function SiteDetailScreen() {
  const route = useRoute();
  const siteId = route.params?.siteId ?? 'none yet';

  return (
    <PlaceholderScreen
      title="Site detail"
      note={`This screen will show one site. Current id: ${siteId}.`}
    />
  );
}
