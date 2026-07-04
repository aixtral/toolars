import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  DRAFT_LOCALES,
  getAlternateLanguageLinks,
  isDefaultLocale,
  isLaunchLocale,
  isValidLocale,
  getLocaleDirection,
  localizeCurrentPathForLocale,
  localizePath,
  LOCALES,
  ROUTED_LOCALES
} from "./index";

describe("i18n", () => {
  it("declares en as the default locale with no path prefix", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(LOCALES.find((locale) => locale.code === "en")?.default).toBe(true);
  });

  it("registers source-aligned locales while keeping only reviewed locales routed", () => {
    const codes = LOCALES.map((locale) => locale.code);
    expect(codes).toEqual(["en", "es", "zh-hans", "zh-hant", "ar", "fr", "hi", "ja", "pt", "ru"]);
    expect(ROUTED_LOCALES.map((locale) => locale.code)).toEqual(["en", "es", "zh-hans", "zh-hant"]);
    expect(DRAFT_LOCALES.map((locale) => locale.code)).toEqual(["ar", "fr", "hi", "ja", "pt", "ru"]);
    expect(LOCALES.every((locale) => locale.dir === "ltr" || locale.dir === "rtl")).toBe(true);
    expect(getLocaleDirection("ar")).toBe("rtl");
    expect(getLocaleDirection("fr")).toBe("ltr");
  });

  it("keeps the default locale path free of a prefix", () => {
    expect(localizePath("/tools/bmi-calculator", "en")).toBe("/tools/bmi-calculator");
  });

  it("prefixes non-default locales", () => {
    expect(localizePath("/tools/bmi-calculator", "es")).toBe("/es/tools/bmi-calculator");
    expect(localizePath("/tools/bmi-calculator", "zh-hans")).toBe("/zh-hans/tools/bmi-calculator");
  });

  it("normalizes the homepage path for a non-default locale", () => {
    expect(localizePath("/", "es")).toBe("/es");
  });

  it("validates locale codes", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("es")).toBe(true);
    expect(isValidLocale("fr")).toBe(true);
    expect(isValidLocale("ar")).toBe(true);
    expect(isValidLocale("xx")).toBe(false);
  });

  it("distinguishes registered draft locales from launch locales", () => {
    expect(isLaunchLocale("en")).toBe(true);
    expect(isLaunchLocale("zh-hant")).toBe(true);
    expect(isLaunchLocale("fr")).toBe(false);
    expect(isLaunchLocale("ar")).toBe(false);
  });

  it("recognizes the default locale", () => {
    expect(isDefaultLocale("en")).toBe(true);
    expect(isDefaultLocale("es")).toBe(false);
  });

  it("builds hreflang alternate links for launch locales only", () => {
    const links = getAlternateLanguageLinks("/tools/bmi-calculator", "https://toolars.app");
    const hreflangMap = new Map(links.map((link) => [link.hreflang, link.href]));

    expect(hreflangMap.get("en")).toBe("https://toolars.app/tools/bmi-calculator");
    expect(hreflangMap.get("es")).toBe("https://toolars.app/es/tools/bmi-calculator");
    expect(hreflangMap.get("zh-Hans")).toBe("https://toolars.app/zh-hans/tools/bmi-calculator");
    expect(hreflangMap.get("zh-Hant")).toBe("https://toolars.app/zh-hant/tools/bmi-calculator");
    expect(hreflangMap.get("x-default")).toBe("https://toolars.app/tools/bmi-calculator");
    for (const locale of DRAFT_LOCALES) {
      expect(hreflangMap.has(locale.hreflang), locale.code).toBe(false);
    }
  });

  it("switches localized paths back to the unprefixed default locale", () => {
    expect(localizeCurrentPathForLocale("/es/tools/pdf-toolkit", "en")).toBe("/tools/pdf-toolkit");
    expect(localizeCurrentPathForLocale("/zh-hans/settings/billing", "en")).toBe("/settings/billing");
  });

  it("replaces an existing locale prefix instead of nesting locale segments", () => {
    expect(localizeCurrentPathForLocale("/zh-hans/tools/json-repair", "es")).toBe("/es/tools/json-repair");
    expect(localizeCurrentPathForLocale("/tools/json-repair", "zh-hant")).toBe("/zh-hant/tools/json-repair");
  });

  it("preserves special explore routes across launch locale switches", () => {
    expect(localizeCurrentPathForLocale("/explore/pdf", "es")).toBe("/es/explore/pdf");
    expect(localizeCurrentPathForLocale("/zh-hans/explore/ai-developer", "en")).toBe("/explore/ai-developer");
    expect(localizeCurrentPathForLocale("/es/explore/finance", "zh-hant")).toBe("/zh-hant/explore/finance");
  });
});
