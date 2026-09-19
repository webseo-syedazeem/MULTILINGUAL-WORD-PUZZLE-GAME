import { useCallback } from "react";
import { useGame } from "../context/GameContext";
import { translate } from "./index";

export function useT() {
  const { state } = useGame();
  const lang = state.language || "en";
  const isRTL = lang === "ar" || lang === "ur" || lang === "he" || lang === "fa";

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);

  return { t, lang, isRTL };
}
