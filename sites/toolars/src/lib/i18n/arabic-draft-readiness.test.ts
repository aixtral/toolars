import { describe, expect, it, vi } from "vitest";
import ar from "../../../messages/ar.json";
import en from "../../../messages/en.json";
import sitemap from "../../app/sitemap";
import { generateStaticParams } from "../../app/[locale]/layout";
import { resolveRequestLocale } from "../../i18n/request";
import {
  DRAFT_LOCALES,
  getLocaleDirection,
  ROUTED_LOCALES,
  getAlternateLanguageLinks
} from "./index";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  }
}));

type MessageValue = string | number | boolean | null | MessageValue[] | { [key: string]: MessageValue };

describe("Arabic draft locale readiness", () => {
  it("keeps the Arabic draft bundle structurally complete while preserving RTL metadata", () => {
    expect(Object.keys(flattenMessages(ar)).sort()).toEqual(Object.keys(flattenMessages(en)).sort());
    expect(DRAFT_LOCALES.map((locale) => locale.code)).toEqual(["ar", "fr", "hi", "ja", "pt", "ru"]);
    expect(DRAFT_LOCALES.find((locale) => locale.code === "ar")).toMatchObject({
      code: "ar",
      dir: "rtl",
      phase: "phase-two"
    });
    expect(DRAFT_LOCALES.filter((locale) => locale.dir === "rtl").map((locale) => locale.code)).toEqual(["ar"]);
    expect(getLocaleDirection("ar")).toBe("rtl");
  });

  it("keeps Arabic out of public routing, request resolution, sitemap alternates, and language switcher sources", () => {
    const sitemapPaths = sitemap().flatMap((route) => [
      new URL(route.url).pathname,
      ...Object.values(route.alternates?.languages ?? {}).map((href) => new URL(String(href)).pathname)
    ]);

    expect(ROUTED_LOCALES.map((locale) => locale.code)).not.toContain("ar");
    expect(generateStaticParams()).not.toContainEqual({ locale: "ar" });
    expect(resolveRequestLocale("ar")).toBe("en");
    expect(getAlternateLanguageLinks("/tools/pdf-toolkit", "https://toolars.app").map((link) => link.hreflang)).not.toContain("ar");
    expect(sitemapPaths.some((pathname) => pathname === "/ar" || pathname.startsWith("/ar/"))).toBe(false);
  });
});

function flattenMessages(messages: MessageValue, prefix = "", output: Record<string, string> = {}) {
  if (!messages || typeof messages !== "object" || Array.isArray(messages)) return output;

  for (const [key, value] of Object.entries(messages)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenMessages(value, nextKey, output);
      continue;
    }

    output[nextKey] = String(value);
  }

  return output;
}
