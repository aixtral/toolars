export type LocaleCode = "en" | "es" | "zh";

export interface LocaleDefinition {
  code: LocaleCode;
  label: string;
  /** English name shown in language switchers. */
  englishLabel: string;
  /** BCP-47 language tag for hreflang. */
  hreflang: string;
  /** The default locale has no path prefix (`/tools/...` vs `/es/tools/...`). */
  default: boolean;
  /** Phase this locale launches in. */
  phase: "launch" | "phase-two";
}

/**
 * Supported locales. English is the default (no path prefix). Spanish and
 * Chinese ship as launch locales for the overseas audience. Add locales here
 * and they automatically flow into sitemap alternates and hreflang tags.
 */
export const LOCALES: LocaleDefinition[] = [
  {
    code: "en",
    label: "English",
    englishLabel: "English",
    hreflang: "en",
    default: true,
    phase: "launch"
  },
  {
    code: "es",
    label: "Español",
    englishLabel: "Spanish",
    hreflang: "es",
    default: false,
    phase: "launch"
  },
  {
    code: "zh",
    label: "中文",
    englishLabel: "Chinese",
    hreflang: "zh",
    default: false,
    phase: "launch"
  }
];
