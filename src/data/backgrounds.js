// Mountain Backgrounds Catalog for Word Connect
// 50 curated mountain landscapes mapped across 6 Worlds and 300 Levels.
// Includes bundled offline mountain assets and CDN photo URLs.

export const LOCAL_MOUNTAIN_ASSETS = {
  alps: require("../../assets/images/mountain_alps.jpg"),
  misty: require("../../assets/images/mountain_misty.jpg"),
  sunset: require("../../assets/images/mountain_sunset.jpg"),
  scenic: require("../../assets/images/scenic_game_bg.jpg"),
  nature: require("../../assets/images/clean_nature_bg.jpg"),
  window: require("../../assets/images/scenic_window_bg.jpg"),
};

// 6 World primary backgrounds
export const WORLD_BACKGROUNDS = {
  1: LOCAL_MOUNTAIN_ASSETS.alps,
  2: LOCAL_MOUNTAIN_ASSETS.misty,
  3: LOCAL_MOUNTAIN_ASSETS.sunset,
  4: LOCAL_MOUNTAIN_ASSETS.scenic,
  5: LOCAL_MOUNTAIN_ASSETS.nature,
  6: LOCAL_MOUNTAIN_ASSETS.alps,
};

// 50 Curated Mountain Landscapes (8-9 per world biome)
export const MOUNTAIN_BACKGROUNDS = [
  // World 1: Alpine Lakes & Meadows (Levels 1-50, BGs 1-8)
  {
    id: 1,
    worldId: 1,
    name: "Matterhorn Alpine Lake",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 2,
    worldId: 1,
    name: "Lake Louise Glacial Vista",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 3,
    worldId: 1,
    name: "Emerald Pine Pass",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 4,
    worldId: 1,
    name: "Bavarian Mountain Stream",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 5,
    worldId: 1,
    name: "Wildflower Alpine Crest",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 6,
    worldId: 1,
    name: "Mirror Reflection Lake",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 7,
    worldId: 1,
    name: "Turquoise Mountain Lagoon",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1439853941329-a99ce0421c80?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 8,
    worldId: 1,
    name: "Sunny Alpine Ridge",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1080&q=80",
  },

  // World 2: Misty Pine Mountains & Foggy Emerald Valleys (Levels 51-100, BGs 9-16)
  {
    id: 9,
    worldId: 2,
    name: "Misty Spire Valleys",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 10,
    worldId: 2,
    name: "Swirling Fog Pine Peaks",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 11,
    worldId: 2,
    name: "Cascade Mist Forest",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 12,
    worldId: 2,
    name: "Towering Granite Cloud Peak",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 13,
    worldId: 2,
    name: "Misty Mountain Ravine",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 14,
    worldId: 2,
    name: "Pacific Northwest Pine Range",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 15,
    worldId: 2,
    name: "Moody Fog Horizon",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 16,
    worldId: 2,
    name: "Silent Mountain Sanctuary",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1080&q=80",
  },

  // World 3: Golden Sunset Peaks & Alpenglow (Levels 101-150, BGs 17-25)
  {
    id: 17,
    worldId: 3,
    name: "Dolomites Golden Glow",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 18,
    worldId: 3,
    name: "Sunset Lake Reflection",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 19,
    worldId: 3,
    name: "Fiery Orange Summit",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 20,
    worldId: 3,
    name: "Rose Alpenglow Ridges",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 21,
    worldId: 3,
    name: "Crimson Sky Pinnacles",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 22,
    worldId: 3,
    name: "Golden Hour Mountain Valley",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 23,
    worldId: 3,
    name: "Amber Mountain Horizon",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 24,
    worldId: 3,
    name: "Twilight Mountain Lake",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 25,
    worldId: 3,
    name: "Sundown Mountain Lookout",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=80",
  },

  // World 4: Snowcapped Glaciers & Craggy Summits (Levels 151-200, BGs 26-33)
  {
    id: 26,
    worldId: 4,
    name: "Mont Blanc Snowy Massif",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 27,
    worldId: 4,
    name: "Himalayan Frozen Crest",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1465919292275-c60ba49da6ae?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 28,
    worldId: 4,
    name: "Glacial Ice Valley",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 29,
    worldId: 4,
    name: "Arctic Mountain Fjord",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 30,
    worldId: 4,
    name: "High Altitude Blizzard Ridge",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 31,
    worldId: 4,
    name: "Frozen Crystal Lake",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 32,
    worldId: 4,
    name: "Winter Alpine Wonderland",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1457269449834-928af64c604d?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 33,
    worldId: 4,
    name: "Majestic Glacier Horn",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1516431883659-655d41c09bf9?auto=format&fit=crop&w=1080&q=80",
  },

  // World 5: Highland Canyons & Emerald Valleys (Levels 201-250, BGs 34-41)
  {
    id: 34,
    worldId: 5,
    name: "Highland Emerald Cliffs",
    local: LOCAL_MOUNTAIN_ASSETS.nature,
    uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 35,
    worldId: 5,
    name: "Autumn Forest Mountain Valley",
    local: LOCAL_MOUNTAIN_ASSETS.nature,
    uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 36,
    worldId: 5,
    name: "Grand Mountain Canyon",
    local: LOCAL_MOUNTAIN_ASSETS.nature,
    uri: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 37,
    worldId: 5,
    name: "Lush Mountain Plateau",
    local: LOCAL_MOUNTAIN_ASSETS.nature,
    uri: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 38,
    worldId: 5,
    name: "Golden Aspens & Mountain Range",
    local: LOCAL_MOUNTAIN_ASSETS.nature,
    uri: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 39,
    worldId: 5,
    name: "Waterfall Mountain Grotto",
    local: LOCAL_MOUNTAIN_ASSETS.nature,
    uri: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 40,
    worldId: 5,
    name: "Pine Foothills & Sunbeams",
    local: LOCAL_MOUNTAIN_ASSETS.nature,
    uri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 41,
    worldId: 5,
    name: "Scenic Overlook Horizon",
    local: LOCAL_MOUNTAIN_ASSETS.nature,
    uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1080&q=80",
  },

  // World 6: Twilight Cosmic Auroras & Mountain Silhouettes (Levels 251-300, BGs 42-50)
  {
    id: 42,
    worldId: 6,
    name: "Aurora Borealis Over Peaks",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 43,
    worldId: 6,
    name: "Starry Night Mountain Sky",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 44,
    worldId: 6,
    name: "Milky Way Mountain Vista",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 45,
    worldId: 6,
    name: "Midnight Lake & Mountain Crags",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 46,
    worldId: 6,
    name: "Violet Twilight Mountain Peak",
    local: LOCAL_MOUNTAIN_ASSETS.sunset,
    uri: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 47,
    worldId: 6,
    name: "Moonlit Glacial Summit",
    local: LOCAL_MOUNTAIN_ASSETS.scenic,
    uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 48,
    worldId: 6,
    name: "Celestial Aurora Dance",
    local: LOCAL_MOUNTAIN_ASSETS.misty,
    uri: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 49,
    worldId: 6,
    name: "Deep Space Mountain Summit",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: 50,
    worldId: 6,
    name: "Infinity Mountain Horizon",
    local: LOCAL_MOUNTAIN_ASSETS.alps,
    uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80",
  },
];

/**
 * Returns the mountain background for a given level (1..300).
 * Maps 300 levels smoothly across the 50 mountain backgrounds.
 */
export function getBackgroundForLevel(levelId = 1) {
  const num = Number(levelId) || 1;
  const index = Math.max(0, num - 1) % MOUNTAIN_BACKGROUNDS.length;
  const bg = MOUNTAIN_BACKGROUNDS[index] || MOUNTAIN_BACKGROUNDS[0];

  // Rotate between all 6 bundled high-res mountain wallpapers so offline play also changes every level!
  const localList = [
    LOCAL_MOUNTAIN_ASSETS.alps,
    LOCAL_MOUNTAIN_ASSETS.misty,
    LOCAL_MOUNTAIN_ASSETS.sunset,
    LOCAL_MOUNTAIN_ASSETS.scenic,
    LOCAL_MOUNTAIN_ASSETS.nature,
    LOCAL_MOUNTAIN_ASSETS.window,
  ];
  const localRotating = localList[(num - 1) % localList.length];

  return {
    source: localRotating,
    local: localRotating,
    uri: bg.uri,
    name: bg.name,
    worldId: bg.worldId,
    levelId: num,
  };
}

/**
 * Returns the signature mountain background for a World (1..6).
 */
export function getBackgroundForWorld(worldId = 1) {
  const local = WORLD_BACKGROUNDS[worldId] || LOCAL_MOUNTAIN_ASSETS.alps;
  const match = MOUNTAIN_BACKGROUNDS.find((b) => b.worldId === Number(worldId)) || MOUNTAIN_BACKGROUNDS[0];
  return {
    source: local,
    uri: match.uri,
    name: match.name,
  };
}
