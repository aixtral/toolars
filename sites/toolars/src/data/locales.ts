export type LocaleCode = "en" | "es" | "zh-hans" | "zh-hant";

export interface LocaleDefinition {
  code: LocaleCode;
  label: string;
  /** English name shown in language switchers. */
  englishLabel: string;
  /** Compact, non-ambiguous label shown in dense controls. */
  shortLabel: string;
  /** BCP-47 language tag for hreflang. */
  hreflang: string;
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
 */
export const LOCALES: LocaleDefinition[] = [
  {
    code: "en",
    label: "English",
    englishLabel: "English",
    shortLabel: "EN",
    hreflang: "en",
    default: true,
    phase: "launch"
  },
  {
    code: "es",
    label: "Español",
    englishLabel: "Spanish",
    shortLabel: "ES",
    hreflang: "es",
    default: false,
    phase: "launch"
  },
  {
    code: "zh-hans",
    label: "简体中文",
    englishLabel: "Chinese (Simplified)",
    shortLabel: "简体",
    hreflang: "zh-Hans",
    default: false,
    phase: "launch"
  },
  {
    code: "zh-hant",
    label: "繁體中文",
    englishLabel: "Chinese (Traditional)",
    shortLabel: "繁體",
    hreflang: "zh-Hant",
    default: false,
    phase: "launch"
  }
];
