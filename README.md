# Heritage Compass LK: A Pocket Directory

An offline React Native (Expo) app that works as a pocket directory of Sri Lanka's temples and heritage sites. Browse sites by type, era, and district, read their history and visitor etiquette, and keep your own lists of favourites and places visited. It needs no internet connection.

> Individual project for **ICA 03 – React Native**.

---

## Screenshots

| Home | Browse | Site Detail |
|------|--------|-------------|
| ![Home](screenshots/home.png) | ![Browse](screenshots/browse.png) | ![Detail](screenshots/detail.png) |

| Favourites | Categories | About |
|------------|------------|-------|
| ![Favourites](screenshots/favourites.png) | ![Categories](screenshots/categories.png) | ![About](screenshots/about.png) |

*(Add your own screenshots to a `screenshots/` folder and update the file names above.)*

---

## Features

- **Fully offline:** no APIs, no online databases, no remote images
- **Local dataset** of Sri Lankan temples and heritage sites (`data/sites.json`)
- **Live search** by site name
- **Filters** by district, site type, and UNESCO status
- **Sorting** by name or era
- **Site detail view** with history, opening hours, entrance fee, and visitor etiquette
- **Favourites** saved on the device with AsyncStorage
- **Visited checklist** with a progress counter (e.g. "7 of 25 visited")
- **Browse by category** (type) and by era

---

## Screens

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Home | Featured sites, category shortcuts, search bar |
| 2 | Browse | Full list with search, filter chips, and sorting |
| 3 | Site Detail | Full information about one site, with favourite and visited toggles |
| 4 | Favourites | Saved sites, kept after the app is closed |
| 5 | Categories | Browse by type and by era |
| 6 | About | Visitor etiquette, tips, and visited progress |

**Navigation:** a bottom tab navigator (Home, Browse, Favourites, Categories, About) with a native stack on top for the Site Detail screen.

---

## Tech Stack

- [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/) (bottom tabs and native stack)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for local user data
- Bundled JSON file for the site dataset

---

## Data

The dataset is created by the author and stored in `data/sites.json`. Each record looks like this:

```json
{
  "id": 1,
  "name": "Temple of the Sacred Tooth Relic",
  "district": "Kandy",
  "type": "Buddhist Temple",
  "era": "Kandy",
  "unesco": true,
  "openHours": "5:30 AM - 8:00 PM",
  "entryFee": "LKR 2,000",
  "description": "...",
  "etiquette": "Dress modestly, remove shoes and hats.",
  "image": "tooth_relic.jpg"
}
```

Site data is loaded from this file at runtime. Favourites and visited sites are stored separately on the device using AsyncStorage.

---

## Project Structure

```
heritage-compass-lk/
├── App.js
├── assets/
│   └── images/          # bundled site photos
├── components/
│   └── SiteCard.js
├── data/
│   └── sites.json       # local dataset
├── navigation/
│   └── AppNavigator.js
├── screens/
│   ├── HomeScreen.js
│   ├── BrowseScreen.js
│   ├── SiteDetailScreen.js
│   ├── FavouritesScreen.js
│   ├── CategoriesScreen.js
│   └── AboutScreen.js
└── utils/
    └── storage.js       # favourites and visited helpers
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- The **Expo Go** app on your phone, or an Android/iOS emulator

### Installation

```bash
git clone https://github.com/<your-username>/heritage-compass-lk.git
cd heritage-compass-lk
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` (Android emulator) or `i` (iOS simulator).

---

## Offline Support

The app makes no network requests. Site data and images are bundled with the app, and user data (favourites and visited sites) is kept in on-device storage.

---

## Author

**<Your Name>**
Index No: `<your index number>`
GitHub: [@your-username](https://github.com/<your-username>)

---

## Acknowledgements

Site information was compiled by the author from publicly available heritage and tourism references. Please verify details such as opening hours and entrance fees before visiting.
