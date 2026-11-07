// Bottom tabs for the five main sections, plus a native stack so Site Detail
// can open on top of any tab. Site Detail is not a tab of its own.
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AboutScreen from '../screens/AboutScreen';
import SiteDetailScreen from '../screens/SiteDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#3D2914' },
        headerTintColor: '#F7F3EA',
        tabBarActiveTintColor: '#8B4513',
        tabBarInactiveTintColor: '#8A7560',
        tabBarStyle: { backgroundColor: '#F7F3EA' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Tabs are the root. headerShown is false so each tab keeps its own header. */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SiteDetail"
          component={SiteDetailScreen}
          options={{ title: 'Site' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
