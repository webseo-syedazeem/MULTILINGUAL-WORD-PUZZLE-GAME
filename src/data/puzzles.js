import { BANKS } from "./banks.js";

export const LANGUAGES = [
  { "code": "en", "name": "English", "isRTL": false },
  { "code": "es", "name": "Español", "isRTL": false },
  { "code": "fr", "name": "Français", "isRTL": false },
  { "code": "de", "name": "Deutsch", "isRTL": false },
  { "code": "ar", "name": "العربية", "isRTL": true },
  { "code": "ur", "name": "اردو", "isRTL": true },
  { "code": "pt", "name": "Português", "isRTL": false },
  { "code": "it", "name": "Italiano", "isRTL": false },
  { "code": "nl", "name": "Nederlands", "isRTL": false },
  { "code": "pl", "name": "Polski", "isRTL": false },
  { "code": "ro", "name": "Română", "isRTL": false },
  { "code": "cs", "name": "Čeština", "isRTL": false },
  { "code": "sv", "name": "Svenska", "isRTL": false },
  { "code": "no", "name": "Norsk", "isRTL": false },
  { "code": "da", "name": "Dansk", "isRTL": false },
  { "code": "fi", "name": "Suomi", "isRTL": false },
  { "code": "el", "name": "Ελληνικά", "isRTL": false },
  { "code": "hu", "name": "Magyar", "isRTL": false },
  { "code": "tr", "name": "Türkçe", "isRTL": false },
  { "code": "uk", "name": "Українська", "isRTL": false },
  { "code": "ru", "name": "Русский", "isRTL": false },
  { "code": "bg", "name": "Български", "isRTL": false },
  { "code": "hr", "name": "Hrvatski", "isRTL": false },
  { "code": "sr", "name": "Српски", "isRTL": false },
  { "code": "sk", "name": "Slovenčina", "isRTL": false },
  { "code": "ca", "name": "Català", "isRTL": false },
  { "code": "zh", "name": "简体中文", "isRTL": false },
  { "code": "zh-TW", "name": "繁體中文", "isRTL": false },
  { "code": "ja", "name": "日本語", "isRTL": false },
  { "code": "ko", "name": "한국어", "isRTL": false },
  { "code": "hi", "name": "हिन्दी", "isRTL": false },
  { "code": "bn", "name": "বাংলা", "isRTL": false },
  { "code": "ta", "name": "தமிழ்", "isRTL": false },
  { "code": "te", "name": "తెలుగు", "isRTL": false },
  { "code": "th", "name": "ไทย", "isRTL": false },
  { "code": "vi", "name": "Tiếng Việt", "isRTL": false },
  { "code": "id", "name": "Bahasa Indonesia", "isRTL": false },
  { "code": "ms", "name": "Bahasa Melayu", "isRTL": false },
  { "code": "tl", "name": "Filipino", "isRTL": false },
  { "code": "my", "name": "မြန်မာ", "isRTL": false },
  { "code": "km", "name": "ខ្មែរ", "isRTL": false },
  { "code": "si", "name": "සිංහල", "isRTL": false },
  { "code": "ne", "name": "नेपाली", "isRTL": false },
  { "code": "mr", "name": "मराठी", "isRTL": false },
  { "code": "gu", "name": "ગુજરાતી", "isRTL": false },
  { "code": "pa", "name": "ਪੰਜਾਬੀ", "isRTL": false },
  { "code": "kn", "name": "ಕನ್ನಡ", "isRTL": false },
  { "code": "ml", "name": "മലയാളം", "isRTL": false },
  { "code": "sw", "name": "Kiswahili", "isRTL": false },
  { "code": "he", "name": "עברית", "isRTL": true },
  { "code": "fa", "name": "فارسی", "isRTL": true },
  { "code": "am", "name": "አማርኛ", "isRTL": false },
  { "code": "ha", "name": "Hausa", "isRTL": false },
  { "code": "yo", "name": "Yorùbá", "isRTL": false },
  { "code": "zu", "name": "isiZulu", "isRTL": false },
  { "code": "af", "name": "Afrikaans", "isRTL": false }
];

export const WORLDS = [
  { id: 1, startLevel: 1, endLevel: 50 },
  { id: 2, startLevel: 51, endLevel: 100 },
  { id: 3, startLevel: 101, endLevel: 150 },
  { id: 4, startLevel: 151, endLevel: 200 },
  { id: 5, startLevel: 201, endLevel: 250 },
  { id: 6, startLevel: 251, endLevel: 300 },
  { id: 7, startLevel: 301, endLevel: 350 },
  { id: 8, startLevel: 351, endLevel: 400 },
  { id: 9, startLevel: 401, endLevel: 450 },
  { id: 10, startLevel: 451, endLevel: 500 },
  { id: 11, startLevel: 501, endLevel: 550 },
  { id: 12, startLevel: 551, endLevel: 600 },
];

export const TOTAL_LEVELS = 600;

const CATEGORIES = ["animals", "food", "nature", "colors", "house"];

function isLatin(lang) {
  return !["ar", "ur", "he", "fa", "zh", "zh-TW", "ja", "ko", "hi", "bn", "ta", "te", "th", "my", "km", "si", "ne", "mr", "gu", "pa", "kn", "ml", "am"].includes(lang);
}

function hashInt(n) {
  let x = n | 0;
  x = (x ^ 61) ^ (x >>> 16);
  x = (x + (x << 3)) | 0;
  x = x ^ (x >>> 4);
  x = Math.imul(x, 0x27d4eb2d);
  x = x ^ (x >>> 15);
  return x >>> 0;
}

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

function getCombinedPool(words) {
  const counts = {};
  for (const w of words) {
    const wCounts = {};
    for (const ch of w) wCounts[ch] = (wCounts[ch] || 0) + 1;
    for (const ch in wCounts) {
      counts[ch] = Math.max(counts[ch] || 0, wCounts[ch]);
    }
  }
  const pool = [];
  for (const ch in counts) {
    for (let i = 0; i < counts[ch]; i++) pool.push(ch);
  }
  return pool;
}

export function buildCrosswordLayout(words) {
  if (!words || words.length === 0) {
    return { placements: [], cells: {}, gridWidth: 0, gridHeight: 0 };
  }
  const placements = [];
  placements.push({ word: words[0], row: 0, col: 0, dir: "H" });

  for (let wIdx = 1; wIdx < words.length; wIdx++) {
    const word = words[wIdx];
    let placed = false;
    for (const p of placements) {
      if (placed) break;
      const otherDir = p.dir === "H" ? "V" : "H";
      for (let i = 0; i < word.length; i++) {
        if (placed) break;
        for (let j = 0; j < p.word.length; j++) {
          if (word[i] === p.word[j]) {
            let r = p.dir === "H" ? p.row - i : p.row + j;
            let c = p.dir === "H" ? p.col + j : p.col - i;
            placements.push({ word, row: r, col: c, dir: otherDir });
            placed = true;
            break;
          }
        }
      }
    }
    if (!placed) {
      let maxR = Math.max(
        ...placements.map((p) => (p.dir === "V" ? p.row + p.word.length : p.row))
      );
      placements.push({ word, row: maxR + 1, col: 0, dir: "H" });
    }
  }

  const minR = Math.min(...placements.map((p) => p.row));
  const minC = Math.min(...placements.map((p) => p.col));
  placements.forEach((p) => {
    p.row -= minR;
    p.col -= minC;
  });

  const cells = {};
  let maxR = 0;
  let maxC = 0;

  placements.forEach((p, pIdx) => {
    for (let i = 0; i < p.word.length; i++) {
      const r = p.dir === "V" ? p.row + i : p.row;
      const c = p.dir === "H" ? p.col + i : p.col;
      maxR = Math.max(maxR, r);
      maxC = Math.max(maxC, c);
      const key = `${r},${c}`;
      if (!cells[key]) {
        cells[key] = {
          row: r,
          col: c,
          letter: p.word[i],
          wordIndices: [pIdx],
          words: [p.word],
        };
      } else {
        cells[key].wordIndices.push(pIdx);
        cells[key].words.push(p.word);
      }
    }
  });

  return { placements, cells, gridWidth: maxC + 1, gridHeight: maxR + 1 };
}

function pickClusteredWords(bank, targetCount, levelId, maxPool = 6, maxAnchorLen = 6) {
  const n = bank.length;
  if (n === 0) return { words: ["CAT"], pool: ["C", "A", "T"] };

  const sortedBank = [...bank].sort((a, b) => a.length - b.length);
  const candidates = sortedBank.filter((w) => w.length <= maxAnchorLen);
  const anchorPool = candidates.length > 0 ? candidates : sortedBank;

  for (let aIdx = 0; aIdx < anchorPool.length; aIdx++) {
    const startOffset = (hashInt(levelId * 1000 + 31) + aIdx) % anchorPool.length;
    const anchor = anchorPool[startOffset] || sortedBank[0];
    if (getCombinedPool([anchor]).length > 6) continue;
    const selected = [anchor];

    // Pass 1: find candidates that share letters and fit within maxPool
    for (let step = 1; step < sortedBank.length; step++) {
      if (selected.length >= targetCount) break;
      const candidateIdx = (startOffset + step) % sortedBank.length;
      const candidate = sortedBank[candidateIdx];
      if (selected.includes(candidate)) continue;

      const sharesLetter = selected.some((s) => {
        for (const ch of s) {
          if (candidate.includes(ch)) return true;
        }
        return false;
      });

      if (sharesLetter) {
        const testPool = getCombinedPool([...selected, candidate]);
        if (testPool.length <= maxPool) {
          selected.push(candidate);
        }
      }
    }

    // Pass 2: relax maxPool up to 6 if needed to find matching words
    if (selected.length < targetCount) {
      for (let step = 1; step < sortedBank.length; step++) {
        if (selected.length >= targetCount) break;
        const candidateIdx = (startOffset + step) % sortedBank.length;
        const candidate = sortedBank[candidateIdx];
        if (selected.includes(candidate)) continue;

        const sharesLetter = selected.some((s) => {
          for (const ch of s) {
            if (candidate.includes(ch)) return true;
          }
          return false;
        });

        if (sharesLetter) {
          const testPool = getCombinedPool([...selected, candidate]);
          if (testPool.length <= 6) {
            selected.push(candidate);
          }
        }
      }
    }

    if (selected.length >= 2 && getCombinedPool(selected).length <= 6) {
      return { words: selected, pool: getCombinedPool(selected) };
    }
  }

  // Fallback: take pair of smallest words with smallest combined pool
  const smallest = sortedBank.slice(0, 6);
  let bestPair = [smallest[0], smallest[1] || smallest[0]];
  let minPool = getCombinedPool(bestPair).length;
  for (let i = 0; i < smallest.length; i++) {
    for (let j = i + 1; j < smallest.length; j++) {
      const p = getCombinedPool([smallest[i], smallest[j]]).length;
      if (p < minPool) {
        minPool = p;
        bestPair = [smallest[i], smallest[j]];
      }
    }
  }
  if (minPool <= 6) {
    return { words: bestPair, pool: getCombinedPool(bestPair) };
  }
  const single = sortedBank.find((w) => getCombinedPool([w]).length <= 6) || sortedBank[0];
  return { words: [single], pool: getCombinedPool([single]) };
}

function generateLevelsForLang(langCode) {
  const latin = isLatin(langCode);
  const banks = BANKS[langCode] || BANKS.en;
  const levels = [];

  for (let id = 1; id <= TOTAL_LEVELS; id++) {
    const categoryIndex = (id - 1) % CATEGORIES.length;
    const category = CATEGORIES[categoryIndex];
    const bank = banks[category] || banks.animals || [];
    
    // Scale pool size gradually: early levels have 3-4 letters, mid levels 4-5, late 5-6
    const maxAnchorLen = id <= 8 ? 3 : id <= 25 ? 4 : id <= 80 ? 5 : 6;
    const maxPool = id <= 10 ? 4 : id <= 40 ? 5 : 6;
    const targetWordCount = id <= 12 ? 2 : id <= 60 ? 3 : 4;
    
    const clustered = pickClusteredWords(bank, targetWordCount, id, maxPool, maxAnchorLen);
    const words = latin ? clustered.words.map((w) => w.toUpperCase()) : clustered.words;
    const letters = seededShuffle(clustered.pool, id * 17 + 3);
    const layout = buildCrosswordLayout(words);
    const world = WORLDS.find((w) => id >= w.startLevel && id <= w.endLevel) || WORLDS[0];

    levels.push({
      id,
      worldId: world.id,
      category,
      words,
      letters,
      layout,
    });
  }

  return levels;
}

// In-memory memoization cache for ultra-fast performance
const LEVELS_CACHE = {};

export function getLevels(langCode = "en") {
  const code = BANKS[langCode] ? langCode : "en";
  if (!LEVELS_CACHE[code]) {
    LEVELS_CACHE[code] = generateLevelsForLang(code);
  }
  return LEVELS_CACHE[code];
}

export function getWorld(worldId) {
  return WORLDS.find((w) => w.id === worldId) || WORLDS[0];
}

export function getWorldForLevel(levelId) {
  const id = Number(levelId) || 1;
  return WORLDS.find((w) => id >= w.startLevel && id <= w.endLevel) || WORLDS[0];
}

const DAILY_CACHE = {};

export function getDailyChallenge(langCode = "en") {
  const code = BANKS[langCode] ? langCode : "en";
  if (!DAILY_CACHE[code]) {
    const banks = BANKS[code] || BANKS.en;
    const latin = isLatin(code);
    const words = [];
    for (const cat of CATEGORIES) {
      const picked = pickClusteredWords(banks[cat] || banks.animals, 2, 999, 6, 5).words;
      words.push(...picked);
    }
    const trimmed = words.slice(0, 8).map((w) => (latin ? w.toUpperCase() : w));
    const pool = getCombinedPool(trimmed);

    DAILY_CACHE[code] = {
      words: trimmed,
      letters: seededShuffle(pool, 91),
      timeLimitSeconds: 120,
      rewardCoins: 100,
    };
  }
  return DAILY_CACHE[code];
}
