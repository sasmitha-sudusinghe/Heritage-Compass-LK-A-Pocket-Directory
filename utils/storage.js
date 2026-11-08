// Saves two lists on the phone: favourite site ids, and visited site ids.
// AsyncStorage stores strings, so each list is saved as JSON text.
// Nothing here uses the network. The lists stay after the app is closed.

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = 'heritage-compass:favourites';
const VISITED_KEY = 'heritage-compass:visited';

// Read a JSON array of ids. A missing or broken value becomes an empty list.
async function readIds(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Could not read', key, error);
    return [];
  }
}

async function writeIds(key, ids) {
  await AsyncStorage.setItem(key, JSON.stringify(ids));
  return ids;
}

// If the id is already in the list, remove it. Otherwise add it.
function toggleId(ids, id) {
  if (ids.includes(id)) {
    return ids.filter((savedId) => savedId !== id);
  }
  return [...ids, id];
}

export async function getFavouriteIds() {
  return readIds(FAVOURITES_KEY);
}

export async function toggleFavourite(id) {
  const ids = await getFavouriteIds();
  return writeIds(FAVOURITES_KEY, toggleId(ids, id));
}

export async function getVisitedIds() {
  return readIds(VISITED_KEY);
}

export async function toggleVisited(id) {
  const ids = await getVisitedIds();
  return writeIds(VISITED_KEY, toggleId(ids, id));
}
