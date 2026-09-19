import { en } from "./en.js";
import { es } from "./es.js";
import { fr } from "./fr.js";
import { de } from "./de.js";
import { ar } from "./ar.js";
import { ur } from "./ur.js";
import { pt } from "./pt.js";
import { it } from "./it.js";
import { nl } from "./nl.js";
import { pl } from "./pl.js";
import { ro } from "./ro.js";
import { cs } from "./cs.js";
import { sv } from "./sv.js";
import { no } from "./no.js";
import { da } from "./da.js";
import { fi } from "./fi.js";
import { el } from "./el.js";
import { hu } from "./hu.js";
import { tr } from "./tr.js";
import { uk } from "./uk.js";
import { ru } from "./ru.js";
import { bg } from "./bg.js";
import { hr } from "./hr.js";
import { sr } from "./sr.js";
import { sk } from "./sk.js";
import { ca } from "./ca.js";
import { zh } from "./zh.js";
import { zh_TW } from "./zh_TW.js";
import { ja } from "./ja.js";
import { ko } from "./ko.js";
import { hi } from "./hi.js";
import { bn } from "./bn.js";
import { ta } from "./ta.js";
import { te } from "./te.js";
import { th } from "./th.js";
import { vi } from "./vi.js";
import { id } from "./id.js";
import { ms } from "./ms.js";
import { tl } from "./tl.js";
import { my } from "./my.js";
import { km } from "./km.js";
import { si } from "./si.js";
import { ne } from "./ne.js";
import { mr } from "./mr.js";
import { gu } from "./gu.js";
import { pa } from "./pa.js";
import { kn } from "./kn.js";
import { ml } from "./ml.js";
import { sw } from "./sw.js";
import { he } from "./he.js";
import { fa } from "./fa.js";
import { am } from "./am.js";
import { ha } from "./ha.js";
import { yo } from "./yo.js";
import { zu } from "./zu.js";
import { af } from "./af.js";

export const DICTIONARIES = {
  en, es, fr, de, ar, ur,
  pt, it, nl, pl, ro, cs, sv, no, da, fi,
  el, hu, tr, uk, ru, bg, hr, sr, sk, ca,
  zh, "zh-TW": zh_TW, ja, ko, hi, bn, ta, te, th, vi,
  id, ms, tl, my, km, si, ne, mr, gu, pa, kn, ml,
  sw, he, fa, am, ha, yo, zu, af,
};

export function translate(langCode, key, vars) {
  const dict = DICTIONARIES[langCode] || DICTIONARIES.en;
  let template = dict ? dict[key] : undefined;
  if (template === undefined && DICTIONARIES.en) template = DICTIONARIES.en[key];
  if (template === undefined) return key; // last-resort fallback, never blank

  if (!vars) return template;
  return Object.keys(vars).reduce(
    (str, varName) => str.replace(new RegExp(`{{${varName}}}`, "g"), String(vars[varName])),
    template
  );
}
