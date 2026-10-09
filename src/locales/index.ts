import type { CategoryId, I18nStrings, LocaleDefinition, RelationPair } from "./types";
import { relationKeys } from "../relation-map";
import { en } from "./en";
import { it } from "./it";

export type { CategoryId, I18nStrings, LocaleDefinition, RelationPair } from "./types";
const LOCALES: Record<string, LocaleDefinition> = { en, it };
export type Locale = "en" | "it";

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const raw = (window as unknown as { moment?: { locale?: () => string } }).moment?.locale?.() ?? "en";
  return raw.toLowerCase().startsWith("it") ? "it" : "en";
}

export function getLocale(code?: string): LocaleDefinition {
  return LOCALES[code ?? detectLocale()] ?? en;
}

export function t(): I18nStrings { return getLocale().strings; }

export function getRelationsForLocale(code?: string): RelationPair[] {
  return Object.values(getLocale(code).categories).flat().map((pair) => ({
    ...pair,
    forwardAliases: [...(pair.forwardAliases ?? [])],
    inverseAliases: [...(pair.inverseAliases ?? [])],
  }));
}

export function getAllRelations(): RelationPair[] {
  return getLocaleCodes().flatMap(getRelationsForLocale);
}

export function getDefaultRelations(code?: string): RelationPair[] {
  return getLocaleCodes().flatMap((locale) =>
    getRelationsForLocale(locale).map((pair) => ({ ...pair, enabled: code === undefined || code === locale })),
  );
}

export function getCategoryForKey(key: string): CategoryId | "custom" {
  const normalized = key.trim().toLowerCase();
  for (const locale of Object.values(LOCALES)) {
    for (const [category, pairs] of Object.entries(locale.categories)) {
      if (pairs.some((pair) => [...relationKeys(pair, "forward"), ...relationKeys(pair, "inverse")]
        .some((value) => value.toLowerCase() === normalized))) return category as CategoryId;
    }
  }
  return "custom";
}

export function pairMatchesLocale(pair: RelationPair, code: string): boolean {
  const matches = (locale: string): boolean => getRelationsForLocale(locale)
    .some((preset) => preset.forward.toLowerCase() === pair.forward.trim().toLowerCase());
  return matches(code) || !getLocaleCodes().some(matches);
}

export function getLocaleCodes(): Locale[] { return ["en", "it"]; }
