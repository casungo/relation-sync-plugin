/**
 * Locale registry — central hub for language detection and data access.
 *
 * ## Adding a new language
 *
 * 1. Create `src/locales/<code>.ts` (copy `en.ts` as template).
 * 2. Fill in `strings` (UI translations) and `categories` (relation pairs).
 * 3. Import and register it in the `LOCALES` record below.
 *
 * That's it — the rest of the plugin picks it up automatically.
 */

import type {
  CategoryId,
  I18nStrings,
  LocaleDefinition,
  RelationPair,
} from "./types";
import { en } from "./en";
import { it } from "./it";
import { es } from "./es";
import { fr } from "./fr";
import { de } from "./de";
import { pt } from "./pt";
import { ja } from "./ja";
import { zh } from "./zh";

// Re-export types for convenience
export type { CategoryId, I18nStrings, LocaleDefinition, RelationPair } from "./types";

// ── Locale registry ──────────────────────────────────────────────────────

/**
 * All registered locales, keyed by ISO 639-1 code.
 * Add new languages here after creating their locale file.
 */
const LOCALES: Record<string, LocaleDefinition> = { en, it, es, fr, de, pt, ja, zh };

/** Supported locale codes (derived from the registry). */
export type Locale = keyof typeof LOCALES;

// ── Detection ────────────────────────────────────────────────────────────

/**
 * Detect the current Obsidian locale.
 *
 * Obsidian ships a global `moment` instance whose `.locale()` returns
 * the language code selected by the user in Settings → About.
 * We match the first two characters against our registry.
 */
export function detectLocale(): string {
  try {
    const raw: string =
      (window as unknown as { moment?: { locale?: () => string } })
        .moment?.locale?.() ?? "en";
    const lang = raw.toLowerCase().slice(0, 2);
    if (lang in LOCALES) return lang;
  } catch {
    // Fallback silently
  }
  return "en";
}

/** Return the `LocaleDefinition` for the current Obsidian locale. */
export function getLocale(code?: string): LocaleDefinition {
  const key = code ?? detectLocale();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- "en" is always registered
  return LOCALES[key] ?? LOCALES["en"]!;
}

/** Return the UI translation strings for the current locale. */
export function t(): I18nStrings {
  return getLocale().strings;
}

// ── Relation helpers ─────────────────────────────────────────────────────

/** Flatten all relations from a single locale into one array. */
function flattenLocale(def: LocaleDefinition): RelationPair[] {
  const result: RelationPair[] = [];
  for (const pairs of Object.values(def.categories)) {
    result.push(...pairs);
  }
  return result;
}

/** Get all relation pairs across every registered locale (for DEFAULT_SETTINGS). */
export function getAllRelations(): RelationPair[] {
  const result: RelationPair[] = [];
  for (const def of Object.values(LOCALES)) {
    result.push(...flattenLocale(def));
  }
  return result;
}

// ── Category helpers ─────────────────────────────────────────────────────

/**
 * Precomputed map: forward key (lowercase) → category ID.
 * Built once at module load from all registered locales.
 */
const KEY_TO_CATEGORY: Map<string, CategoryId> = (() => {
  const map = new Map<string, CategoryId>();
  for (const def of Object.values(LOCALES)) {
    for (const [catId, pairs] of Object.entries(def.categories)) {
      for (const pair of pairs) {
        map.set(pair.forward.toLowerCase(), catId as CategoryId);
      }
    }
  }
  return map;
})();

/** Look up the category ID for a relation pair's forward key. */
export function getCategoryForKey(forwardKey: string): CategoryId | "custom" {
  return KEY_TO_CATEGORY.get(forwardKey.trim().toLowerCase()) ?? "custom";
}

// ── Language filter helpers ──────────────────────────────────────────────

/**
 * Precomputed map: locale code → Set of all forward keys (lowercase).
 * Used by the settings tab to filter relations by language.
 */
const LOCALE_KEY_SETS: Map<string, Set<string>> = (() => {
  const map = new Map<string, Set<string>>();
  for (const [code, def] of Object.entries(LOCALES)) {
    const keys = new Set<string>();
    for (const pairs of Object.values(def.categories)) {
      for (const pair of pairs) {
        keys.add(pair.forward.toLowerCase());
      }
    }
    map.set(code, keys);
  }
  return map;
})();

/**
 * Check whether a relation pair belongs to the given locale.
 * Custom / unrecognized pairs always pass (they're user-created).
 */
export function pairMatchesLocale(pair: RelationPair, locale: string): boolean {
  const key = pair.forward.trim().toLowerCase();
  const localeKeys = LOCALE_KEY_SETS.get(locale);
  // If the key is in the target locale → show
  if (localeKeys?.has(key)) return true;
  // If the key is not in ANY known locale → custom pair, always show
  for (const [code, keys] of LOCALE_KEY_SETS) {
    if (code !== locale && keys.has(key)) return false;
  }
  return true;
}

/** List of all registered locale codes. */
export function getLocaleCodes(): string[] {
  return Object.keys(LOCALES);
}
