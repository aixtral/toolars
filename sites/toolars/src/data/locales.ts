export type LocaleCode = "en" | "es" | "zh-hans" | "zh-hant" | "ar" | "fr" | "hi" | "ja" | "pt" | "ru";

export interface LocaleDefinition {
  code: LocaleCode;
  label: string;
  /** English name shown in language switchers. */
  englishLabel: string;
  /** Compact, non-ambiguous label shown in dense controls. */
  shortLabel: string;
  /** BCP-47 language tag for hreflang. */
  hreflang: string;
  /** Text direction for the locale. Arabic is registered as RTL before public launch. */
  dir: "ltr" | "rtl";
  /** The default locale has no path prefix (`/tools/...` vs `/es/tools/...`). */
  default: boolean;
  /** Phase this locale launches in. */
  phase: "launch" | "phase-two";
}

/**
 * Supported locales. English is the default (no path prefix). Spanish and
 * Chinese (Simplified + Traditional) ship as launch locales for the overseas
 * audience. Locale codes are lowercase in URLs (/zh-hans/, /zh-hant/).
 * hreflang tags use the canonical BCP-47 casing (zh-Hans, zh-Hant).
 *
 * Phase-two locales are registered for audit parity and staged translation
 * work, but they are not routed, listed in the switcher, or emitted in sitemap
 * until their message bundles and RTL/LTR QA gates are complete.
 */
export const LOCALES: LocaleDefinition[] = [
  {
    code: "en",
    label: "English",
    englishLabel: "English",
    shortLabel: "EN",
    hreflang: "en",
    dir: "ltr",
    default: true,
    phase: "launch"
  },
  {
    code: "es",
    label: "Español",
    englishLabel: "Spanish",
    shortLabel: "ES",
    hreflang: "es",
    dir: "ltr",
    default: false,
    phase: "launch"
  },
  {
    code: "zh-hans",
    label: "简体中文",
    englishLabel: "Chinese (Simplified)",
    shortLabel: "简体",
    hreflang: "zh-Hans",
    dir: "ltr",
    default: false,
    phase: "launch"
  },
  {
    code: "zh-hant",
    label: "繁體中文",
    englishLabel: "Chinese (Traditional)",
    shortLabel: "繁體",
    hreflang: "zh-Hant",
    dir: "ltr",
    default: false,
    phase: "launch"
  },
  {
    code: "ar",
    label: "العربية",
    englishLabel: "Arabic",
    shortLabel: "AR",
    hreflang: "ar",
    dir: "rtl",
    default: false,
    phase: "phase-two"
  },
  {
    code: "fr",
    label: "Français",
    englishLabel: "French",
    shortLabel: "FR",
    hreflang: "fr",
    dir: "ltr",
    default: false,
    phase: "phase-two"
  },
  {
    code: "hi",
    label: "हिन्दी",
    englishLabel: "Hindi",
    shortLabel: "HI",
    hreflang: "hi",
    dir: "ltr",
    default: false,
    phase: "phase-two"
  },
  {
    code: "ja",
    label: "日本語",
    englishLabel: "Japanese",
    shortLabel: "JA",
    hreflang: "ja",
    dir: "ltr",
    default: false,
    phase: "phase-two"
  },
  {
    code: "pt",
    label: "Português",
    englishLabel: "Portuguese",
    shortLabel: "PT",
    hreflang: "pt",
    dir: "ltr",
    default: false,
    phase: "phase-two"
  },
  {
    code: "ru",
    label: "Русский",
    englishLabel: "Russian",
    shortLabel: "RU",
    hreflang: "ru",
    dir: "ltr",
    default: false,
    phase: "phase-two"
  }
];
