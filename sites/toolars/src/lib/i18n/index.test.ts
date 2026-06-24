import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  getAlternateLanguageLinks,
  isDefaultLocale,
  isValidLocale,
  localizeCurrentPathForLocale,
  localizePath,
  LOCALES
} from "./index";

describe("i18n", () => {
  it("declares en as the default locale with no path prefix", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(LOCALES.find((locale) => locale.code === "en")?.default).toBe(true);
  });

  it("ships at least en, es, zh-Hans, and zh-Hant as launch locales", () => {
    const codes = LOCALES.map((locale) => locale.code);
    expect(codes).toContain("en");
    expect(codes).toContain("es");
    expect(codes).toContain("zh-hans");
    expect(codes).toContain("zh-hant");
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
    expect(isValidLocale("xx")).toBe(false);
  });

  it("recognizes the default locale", () => {
    expect(isDefaultLocale("en")).toBe(true);
    expect(isDefaultLocale("es")).toBe(false);
  });

  it("builds hreflang alternate links for every locale", () => {
    const links = getAlternateLanguageLinks("/tools/bmi-calculator", "https://toolars.app");
    const hreflangMap = new Map(links.map((link) => [link.hreflang, link.href]));

    expect(hreflangMap.get("en")).toBe("https://toolars.app/tools/bmi-calculator");
    expect(hreflangMap.get("es")).toBe("https://toolars.app/es/tools/bmi-calculator");
    expect(hreflangMap.get("zh-Hans")).toBe("https://toolars.app/zh-hans/tools/bmi-calculator");
    expect(hreflangMap.get("zh-Hant")).toBe("https://toolars.app/zh-hant/tools/bmi-calculator");
    expect(hreflangMap.get("x-default")).toBe("https://toolars.app/tools/bmi-calculator");
  });

  it("switches localized paths back to the unprefixed default locale", () => {
    expect(localizeCurrentPathForLocale("/es/tools/pdf-toolkit", "en")).toBe("/tools/pdf-toolkit");
    expect(localizeCurrentPathForLocale("/zh-hans/settings/billing", "en")).toBe("/settings/billing");
  });

  it("replaces an existing locale prefix instead of nesting locale segments", () => {
    expect(localizeCurrentPathForLocale("/zh-hans/tools/json-repair", "es")).toBe("/es/tools/json-repair");
    expect(localizeCurrentPathForLocale("/tools/json-repair", "zh-hant")).toBe("/zh-hant/tools/json-repair");
  });
});
