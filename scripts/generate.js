// Dev-only generator. Run with `node scripts/generate.js` from project root.
// Produces src/data/puzzles.js as a static data file (no runtime generation needed in-app).
const fs = require("fs");
const path = require("path");

// Category keys are language-agnostic; display names are translated via
// src/i18n/*.js under the "categories.<key>" keys.
const CATEGORIES = ["animals", "food", "nature", "colors", "house"];

// Word banks: every word MUST have all-unique letters/characters (so the
// letter-circle mechanic never needs to represent a repeated letter twice).
const BANKS = {
  en: {
    animals: ["CAT", "DOG", "FOX", "OWL", "BAT", "RAM", "COW", "HEN", "LION", "BEAR", "WOLF", "HORSE",
      "ZEBRA", "GOAT", "DUCK", "CRAB", "SEAL", "MOUSE", "SNAKE", "WHALE"],
    food: ["TEA", "PIE", "JAM", "RICE", "SOUP", "BREAD", "CAKE", "LIME", "MILK", "FISH", "SALT", "HONEY",
      "PEAR", "PLUM", "MANGO", "GRAPE", "YOGURT", "SPICE", "GRAVY"],
    nature: ["SUN", "SKY", "SEA", "ICE", "RAIN", "CLOUD", "STORM", "OCEAN", "FOREST", "GLACIER", "ISLAND", "SPRING",
      "STAR", "EARTH", "WINTER", "DEW", "FOG", "CAVE"],
    colors: ["RED", "TAN", "GOLD", "PINK", "BLUE", "GRAY", "TEAL", "NAVY", "CORAL", "IVORY", "SILVER", "BRONZE",
      "AMBER", "JADE", "RUBY", "ONYX", "PEARL", "MAUVE", "UMBER"],
    house: ["BED", "CUP", "FORK", "LAMP", "SOFA", "SHELF", "CHAIR", "TABLE", "CARPET", "GARDEN", "BLANKET", "CABINET",
      "DESK", "RUG", "VASE", "CURTAIN", "OVEN", "SINK"],
  },
  es: {
    animals: ["GATO", "PATO", "LEON", "CIERVO", "TIGRE", "FOCA", "BUHO", "PEZ", "LINCE", "MULA", "CUERVO", "PUMA",
      "RATON", "VENADO", "HALCON", "DELFIN"],
    food: ["PAN", "SAL", "MIEL", "QUESO", "CREMA", "FRUTA", "CARNE", "LIMON", "PASTEL", "HUEVO", "SOPA", "DULCE",
      "MANGO", "UVA", "AJO", "VINO"],
    nature: ["SOL", "MAR", "RIO", "CIELO", "LUNA", "HIELO", "BOSQUE", "MONTE", "ISLA", "NUBE", "VIENTO",
      "VOLCAN", "SUR", "NORTE"],
    colors: ["GRIS", "AZUL", "ROSA", "CAFE", "CIAN", "OCRE", "CORAL", "PERLA", "NEGRO", "BLANCO", "VIOLETA"],
    house: ["MESA", "MURO", "PISO", "BANCO", "LIBRO", "TECHO", "PUERTA", "JARDIN", "CUADRO", "CORTINA",
      "PATIO", "BALCON"],
  },
  fr: {
    animals: ["CHAT", "CHIEN", "LOUP", "OURS", "LION", "CHEVAL", "TIGRE", "SINGE", "PIGEON", "LAPIN",
      "REQUIN", "DAUPHIN"],
    food: ["PAIN", "LAIT", "MIEL", "RIZ", "SEL", "FROMAGE", "POIVRE", "SUCRE", "SOUPE", "VIANDE",
      "POIRE", "CITRON", "OEUF"],
    nature: ["MER", "CIEL", "LUNE", "GLACE", "FORET", "PLUIE", "NUAGE", "ILE", "VENT", "SABLE",
      "VOLCAN", "HIVER"],
    colors: ["GRIS", "BLEU", "VERT", "ROSE", "NOIR", "DORE", "ROUGE", "BLANC", "ARGENT", "VIOLET", "CUIVRE"],
    house: ["LIT", "MUR", "BANC", "LAMPE", "TAPIS", "TABLE", "PORTE", "CHAISE", "JARDIN", "RIDEAU", "BALCON"],
  },
  de: {
    animals: ["HUND", "WOLF", "HASE", "BÄR", "LÖWE", "TIGER", "FUCHS", "SCHAF", "KATZE", "PFERD",
      "MAUS", "DELFIN"],
    food: ["OBST", "SALZ", "KÄSE", "REIS", "MILCH", "HONIG", "FISCH", "KUCHEN", "ZUCKER", "BROT",
      "BIRNE", "TRAUBE"],
    nature: ["EIS", "WIND", "MOND", "WALD", "BERG", "FELS", "STERN", "INSEL", "WOLKE", "STRAND",
      "VULKAN", "WINTER", "HERBST"],
    colors: ["ROT", "BLAU", "GRÜN", "GELB", "GRAU", "ROSA", "BRAUN", "SILBER", "GOLD", "TÜRKIS", "KUPFER"],
    house: ["SOFA", "TISCH", "STUHL", "TÜR", "GARTEN", "LAMPE", "REGAL", "VORHANG", "DACH", "WAND", "BALKON"],
  },
  ar: {
    animals: ["قطة", "كلب", "أسد", "ثعلب", "ذئب", "حصان", "فيل", "نمر", "أرنب", "قرد", "زرافة", "جمل", "غزال"],
    food: ["خبز", "حليب", "عسل", "أرز", "ملح", "جبن", "سمك", "لحم", "تفاح", "موز", "عنب", "برتقال"],
    nature: ["شمس", "بحر", "قمر", "ثلج", "غيم", "جبل", "نهر", "غابة", "جزيرة", "ريح", "بركان", "صحراء", "شتاء"],
    colors: ["أحمر", "أزرق", "أخضر", "أصفر", "أبيض", "أسود", "بني", "وردي", "ذهبي", "فضي", "بنفسجي"],
    house: ["شباك", "طاولة", "كرسي", "مطبخ", "حديقة", "مصباح", "سقف", "جدار", "ستارة", "رف", "شرفة"],
  },
  ur: {
    animals: ["بلی", "کتا", "شیر", "لومڑی", "گھوڑا", "ہاتھی", "بندر", "خرگوش", "گائے", "مرغی", "زرافہ", "اونٹ"],
    food: ["روٹی", "نمک", "شہد", "چاول", "پنیر", "مچھلی", "گوشت", "سیب", "کیلا", "آٹا", "انگور", "سنترہ"],
    nature: ["سورج", "سمندر", "چاند", "برف", "بادل", "پہاڑ", "دریا", "جنگل", "جزیرہ", "ہوا", "صحرا", "سردی"],
    colors: ["سرخ", "نیلا", "سبز", "پیلا", "سفید", "سیاہ", "گلابی", "سنہرا", "چاندی", "جامنی", "بھورا"],
    house: ["میز", "دروازہ", "چراغ", "باغ", "چھت", "دیوار", "پردہ", "بستر", "صحن", "بالکونی"],
  },
};

const LANGUAGES = [
  { code: "en", name: "English", isRTL: false },
  { code: "es", name: "Español", isRTL: false },
  { code: "fr", name: "Français", isRTL: false },
  { code: "de", name: "Deutsch", isRTL: false },
  { code: "ar", name: "العربية", isRTL: true },
  { code: "ur", name: "اردو", isRTL: true },
];

// 6 worlds x 50 levels = 300. All worlds share the same background image in
// the app (no per-world art) — this data only drives level ranges and the
// translated world name shown on the map header.
const WORLDS = [
  { id: 1, startLevel: 1, endLevel: 50 },
  { id: 2, startLevel: 51, endLevel: 100 },
  { id: 3, startLevel: 101, endLevel: 150 },
  { id: 4, startLevel: 151, endLevel: 200 },
  { id: 5, startLevel: 201, endLevel: 250 },
  { id: 6, startLevel: 251, endLevel: 300 },
];

const TOTAL_LEVELS = 300;

function isLatin(lang) {
  return !["ar", "ur"].includes(lang);
}

function uniqueChars(word, latin) {
  const source = latin ? word.toUpperCase() : word;
  const seen = new Set();
  for (const ch of source) {
    if (seen.has(ch)) {
      throw new Error(`Word "${word}" has a repeated character "${ch}" — not allowed.`);
    }
    seen.add(ch);
  }
  return Array.from(seen);
}

// simple seeded shuffle so output is deterministic across regenerations
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Deterministic integer hash (xorshift-ish) — used to scatter which words a
// level picks from its category bank, so combos don't feel like a simple
// linear cycle even when a bank has to be reused across many levels.
function hashInt(n) {
  let x = n | 0;
  x = (x ^ 61) ^ (x >>> 16);
  x = (x + (x << 3)) | 0;
  x = x ^ (x >>> 4);
  x = Math.imul(x, 0x27d4eb2d);
  x = x ^ (x >>> 15);
  return x >>> 0;
}

function worldForLevel(id) {
  return WORLDS.find((w) => id >= w.startLevel && id <= w.endLevel);
}

function pickWords(bank, count, levelId, categoryIndex) {
  const n = bank.length;
  const startOffset = hashInt(levelId * 1000 + categoryIndex * 31) % n;
  const step = 1 + (hashInt(levelId * 7 + categoryIndex * 13 + 5) % (n - 1 || 1));

  const idxs = [];
  let k = 0;
  let cursor = startOffset;
  while (idxs.length < count && k < n * 2) {
    if (!idxs.includes(cursor)) idxs.push(cursor);
    cursor = (cursor + step) % n;
    k += 1;
  }
  return idxs.map((i) => bank[i]);
}

function wordCountFor(levelId, categoryIndex) {
  // Early levels stay simple (2 words); variety increases with depth.
  if (levelId <= 15) return 2;
  const options = [2, 3, 3, 4]; // weighted toward 3
  return options[(levelId + categoryIndex) % options.length];
}

function buildLevelsForLang(langCode) {
  const latin = isLatin(langCode);
  const banks = BANKS[langCode];
  const levels = [];
  for (let id = 1; id <= TOTAL_LEVELS; id++) {
    const categoryIndex = (id - 1) % CATEGORIES.length;
    const category = CATEGORIES[categoryIndex];
    const bank = banks[category];
    const wordCount = Math.min(wordCountFor(id, categoryIndex), bank.length);
    const rawWords = pickWords(bank, wordCount, id, categoryIndex);
    const words = latin ? rawWords.map((w) => w.toUpperCase()) : rawWords;

    const poolSet = new Set();
    words.forEach((w) => uniqueChars(w, false).forEach((c) => poolSet.add(c)));
    const letters = seededShuffle(Array.from(poolSet), id * 17 + 3);

    const world = worldForLevel(id);
    levels.push({
      id,
      worldId: world.id,
      category,
      words,
      letters,
    });
  }
  return levels;
}

function buildDailyChallenges() {
  const out = {};
  for (const lang of LANGUAGES) {
    const banks = BANKS[lang.code];
    const latin = isLatin(lang.code);
    const words = [];
    for (const cat of CATEGORIES) {
      const picked = pickWords(banks[cat], 2, 999, CATEGORIES.indexOf(cat));
      words.push(...picked);
    }
    const trimmed = words.slice(0, 8).map((w) => (latin ? w.toUpperCase() : w));
    const poolSet = new Set();
    trimmed.forEach((w) => uniqueChars(w, false).forEach((c) => poolSet.add(c)));
    out[lang.code] = {
      words: trimmed,
      letters: seededShuffle(Array.from(poolSet), 91),
      timeLimitSeconds: 120,
      rewardCoins: 100,
    };
  }
  return out;
}

// ---- validate everything up front ----
for (const lang of LANGUAGES) {
  for (const cat of CATEGORIES) {
    const bank = BANKS[lang.code][cat];
    bank.forEach((w) => uniqueChars(w, isLatin(lang.code)));
  }
}

const LEVELS_BY_LANG = {};
for (const lang of LANGUAGES) {
  LEVELS_BY_LANG[lang.code] = buildLevelsForLang(lang.code);
}
const DAILY_CHALLENGES = buildDailyChallenges();

const output = `// AUTO-GENERATED by scripts/generate.js — do not hand-edit.
// Regenerate with: node scripts/generate.js

export const LANGUAGES = ${JSON.stringify(LANGUAGES, null, 2)};

export const WORLDS = ${JSON.stringify(WORLDS, null, 2)};

const LEVELS_BY_LANG = ${JSON.stringify(LEVELS_BY_LANG, null, 2)};

const DAILY_CHALLENGES = ${JSON.stringify(DAILY_CHALLENGES, null, 2)};

export function getLevels(langCode) {
  return LEVELS_BY_LANG[langCode] || LEVELS_BY_LANG.en;
}

export function getWorld(worldId) {
  return WORLDS.find((w) => w.id === worldId) || WORLDS[0];
}

export function getWorldForLevel(levelId) {
  return WORLDS.find((w) => levelId >= w.startLevel && levelId <= w.endLevel) || WORLDS[0];
}

export function getDailyChallenge(langCode) {
  return DAILY_CHALLENGES[langCode] || DAILY_CHALLENGES.en;
}

export const TOTAL_LEVELS = ${TOTAL_LEVELS};
`;

const outPath = path.join(__dirname, "..", "src", "data", "puzzles.js");
fs.writeFileSync(outPath, output, "utf8");
console.log("Wrote", outPath);
console.log("Levels per language:", Object.fromEntries(LANGUAGES.map((l) => [l.code, LEVELS_BY_LANG[l.code].length])));
