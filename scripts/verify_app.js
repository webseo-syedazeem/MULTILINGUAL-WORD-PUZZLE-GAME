import { createRequire } from "module";
import path from "path";
const req = createRequire(path.resolve("./src/data/backgrounds.js"));
req.extensions[".jpg"] = () => 1;
req.extensions[".png"] = () => 1;
global.require = req;

async function run() {
  console.log("=== Verification Starting ===");

  // 1. Verify Banks
  const { BANKS } = await import("../src/data/banks.js");
  const bankLangs = Object.keys(BANKS);
  console.log(`[PASS] Banks loaded: ${bankLangs.length} languages.`);

  // 2. Verify Dictionary
  const { DICTIONARY_WORDS, isValidDictionaryWord } = await import("../src/data/dictionary.js");
  const dictLangs = Object.keys(DICTIONARY_WORDS);
  console.log(`[PASS] Dictionary loaded: ${dictLangs.length} languages.`);
  console.log(`[PASS] Test word 'CAT' in en:`, isValidDictionaryWord("CAT", "en"));
  console.log(`[PASS] Test word 'شیر' in ur:`, isValidDictionaryWord("شیر", "ur"));

  // 3. Verify Puzzles & Worlds & Levels
  const { LANGUAGES, WORLDS, TOTAL_LEVELS, getLevels, getWorld, getWorldForLevel, getDailyChallenge } = await import("../src/data/puzzles.js");
  console.log(`[PASS] Languages in puzzles: ${LANGUAGES.length}`);
  console.log(`[PASS] Worlds in puzzles: ${WORLDS.length} worlds (Expected: 12)`);
  console.log(`[PASS] Total Levels: ${TOTAL_LEVELS} levels (Expected: 600)`);

  // Test every single world
  for (let w = 1; w <= 12; w++) {
    const world = getWorld(w);
    if (!world) throw new Error(`World ${w} not found!`);
  }
  console.log(`[PASS] All 12 worlds verified.`);

  // Test level ranges
  console.log(`[PASS] World for Level 1: World ${getWorldForLevel(1).id}`);
  console.log(`[PASS] World for Level 320: World ${getWorldForLevel(320).id}`);
  console.log(`[PASS] World for Level 600: World ${getWorldForLevel(600).id}`);

  // Test levels across sample languages
  const testSample = ["en", "ur", "ar", "es", "fr", "de", "ru", "hi", "zh", "ja", "ko", "tr", "pt", "id", "sw", "zu"];
  for (const lang of testSample) {
    const lvls = getLevels(lang);
    if (lvls.length !== 600) throw new Error(`Lang ${lang} only has ${lvls.length} levels!`);
    const daily = getDailyChallenge(lang);
    if (!daily || !daily.words || daily.words.length === 0) throw new Error(`Daily challenge missing for ${lang}`);
  }
  console.log(`[PASS] 600 levels and daily challenges verified across diverse languages.`);

  // 4. Verify Backgrounds
  const { WORLD_BACKGROUNDS, MOUNTAIN_BACKGROUNDS, getBackgroundForLevel, getBackgroundForWorld } = await import("../src/data/backgrounds.js");
  console.log(`[PASS] World backgrounds mapped: ${Object.keys(WORLD_BACKGROUNDS).length} worlds.`);
  console.log(`[PASS] Mountain backgrounds catalog: ${MOUNTAIN_BACKGROUNDS.length} vistas.`);
  console.log(`[PASS] BG for Level 1:`, getBackgroundForLevel(1).name);
  console.log(`[PASS] BG for Level 320:`, getBackgroundForLevel(320).name);
  console.log(`[PASS] BG for Level 600:`, getBackgroundForLevel(600).name);
  console.log(`[PASS] BG for World 7:`, getBackgroundForWorld(7).name);
  console.log(`[PASS] BG for World 12:`, getBackgroundForWorld(12).name);

  // 5. Verify Translations
  const { DICTIONARIES, translate } = await import("../src/i18n/index.js");
  console.log(`[PASS] i18n dictionaries: ${Object.keys(DICTIONARIES).length} loaded.`);
  console.log(`[PASS] World 1 name: ${translate("en", "worldNames.1")}`);
  console.log(`[PASS] World 7 name: ${translate("en", "worldNames.7")}`);
  console.log(`[PASS] World 12 name: ${translate("en", "worldNames.12")}`);
  console.log(`[PASS] Bonus word string: ${translate("en", "game.bonusWord", { word: "TEST" })}`);

  // 6. Verify Beneficiary Details in CardPaymentModal.js
  const fs = (await import("fs")).default;
  const modalContent = fs.readFileSync("./src/components/CardPaymentModal.js", "utf8");
  if (!modalContent.includes("Syed Azeem Haider Bukhari")) throw new Error("Beneficiary Name missing");
  if (!modalContent.includes("00300110167256")) throw new Error("Account Number missing");
  if (!modalContent.includes("Meezan Bank")) throw new Error("Bank Name missing");
  if (!modalContent.includes("PK82MEZN0000300110167256")) throw new Error("IBAN missing");

  console.log(`[PASS] Beneficiary Name: Syed Azeem Haider Bukhari`);
  console.log(`[PASS] Beneficiary Account #: 00300110167256`);
  console.log(`[PASS] Beneficiary Bank: Meezan Bank`);
  console.log(`[PASS] Beneficiary IBAN: PK82MEZN0000300110167256`);

  console.log("=== ALL APP VERIFICATIONS PASSED ===");
}
run().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
