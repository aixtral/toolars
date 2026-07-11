import { describe, expect, it } from "vitest";
import { DRAFT_LOCALES } from "@/lib/i18n";
import sitemap from "./sitemap";

const draftLocalePathPrefixes = DRAFT_LOCALES.map((locale) => `/${locale.code}`);

describe("sitemap locale routing", () => {
  it("excludes staged draft locales from public urls and hreflang alternates", () => {
    const routes = sitemap();
    const urls = routes.map((route) => new URL(route.url).pathname);
    const alternatePaths = routes.flatMap((route) =>
      Object.values(route.alternates?.languages ?? {})
        .filter((href): href is string => typeof href === "string")
        .map((href) => new URL(href).pathname)
    );
    const alternateHreflangs = routes.flatMap((route) => Object.keys(route.alternates?.languages ?? {}));

    for (const prefix of draftLocalePathPrefixes) {
      expect(urls.some((url) => url === prefix || url.startsWith(`${prefix}/`))).toBe(false);
      expect(alternatePaths.some((url) => url === prefix || url.startsWith(`${prefix}/`))).toBe(false);
    }
    for (const locale of DRAFT_LOCALES) {
      expect(alternateHreflangs, locale.code).not.toContain(locale.hreflang);
    }
  });

  it("publishes launch-locale blog index and article URLs", () => {
    const routes = sitemap();
    const paths = routes.map((route) => new URL(route.url).pathname);

    expect(paths).toContain("/blog");
    expect(paths).toContain("/es/blog");
    expect(paths).toContain("/zh-hans/blog");
    expect(paths).toContain("/zh-hant/blog");

    expect(paths).toContain("/es/blog/json-repair-guide");
    expect(paths).toContain("/zh-hans/blog/json-repair-guide");
    expect(paths).toContain("/zh-hant/blog/json-repair-guide");

    expect(paths).toContain("/blog/what-is-bmi");
    expect(paths).toContain("/es/blog/what-is-bmi");
    expect(paths).toContain("/zh-hans/blog/what-is-bmi");
    expect(paths).toContain("/zh-hant/blog/what-is-bmi");
  });

  it("publishes localized sitemap URLs only for launch-certified tools", () => {
    const routes = sitemap();
    const paths = routes.map((route) => new URL(route.url).pathname);

    expect(paths).toContain("/tools/json-repair");
    expect(paths).toContain("/es/tools/json-repair");
    expect(paths).toContain("/zh-hans/tools/json-repair");
    expect(paths).toContain("/zh-hant/tools/json-repair");

    expect(paths).not.toContain("/tools/color-contrast-checker");
    expect(paths).not.toContain("/tools/color-contrast-checker/about");
    expect(paths).not.toContain("/es/tools/color-contrast-checker");
    expect(paths).not.toContain("/zh-hans/tools/color-contrast-checker");
    expect(paths).not.toContain("/zh-hant/tools/color-contrast-checker");
  });

  it("adds hreflang alternates for localized article fallback routes", () => {
    const routes = sitemap();
    const englishVitalCalcRoute = routes.find((route) => new URL(route.url).pathname === "/blog/what-is-bmi");
    const englishLaunchRoute = routes.find((route) => new URL(route.url).pathname === "/blog/json-repair-guide");
    const vitalCalcAlternates = Object.values(englishVitalCalcRoute?.alternates?.languages ?? {});
    const launchAlternates = Object.values(englishLaunchRoute?.alternates?.languages ?? {});

    expect(vitalCalcAlternates).toContain("http://localhost:9088/blog/what-is-bmi");
    expect(vitalCalcAlternates).toContain("http://localhost:9088/es/blog/what-is-bmi");
    expect(vitalCalcAlternates).toContain("http://localhost:9088/zh-hans/blog/what-is-bmi");
    expect(vitalCalcAlternates).toContain("http://localhost:9088/zh-hant/blog/what-is-bmi");

    expect(launchAlternates).toContain("http://localhost:9088/es/blog/json-repair-guide");
    expect(launchAlternates).toContain("http://localhost:9088/zh-hans/blog/json-repair-guide");
    expect(launchAlternates).toContain("http://localhost:9088/zh-hant/blog/json-repair-guide");
  });
});
