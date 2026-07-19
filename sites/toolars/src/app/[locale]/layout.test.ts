import { describe, expect, it, vi } from "vitest";
import { DRAFT_LOCALES, LAUNCH_LOCALES } from "@/lib/i18n";
import { TOOLARS_FAVICON_URL } from "@/lib/seo/brand-icons";
import {
  generateMetadata,
  generateStaticParams,
  resolveLayoutLocale,
  TOOLARS_ACCOUNT_HINT_BOOTSTRAP_SCRIPT
} from "./layout";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  }
}));

describe("locale layout routing", () => {
  it("marks a cached account before the page body can paint signed-out chrome", () => {
    window.localStorage.setItem(
      "toolars.account.hint",
      JSON.stringify({ accountEmail: "owner@example.com", accountId: "user_123" })
    );
    document.documentElement.removeAttribute("data-toolars-account-hint");

    window.eval(TOOLARS_ACCOUNT_HINT_BOOTSTRAP_SCRIPT);

    expect(document.documentElement).toHaveAttribute("data-toolars-account-hint", "true");

    window.localStorage.clear();
    document.documentElement.removeAttribute("data-toolars-account-hint");
  });

  it("generates static params only for routed launch locales", () => {
    expect(generateStaticParams()).toEqual(LAUNCH_LOCALES.map((locale) => ({ locale: locale.code })));
    expect(generateStaticParams()).not.toEqual(expect.arrayContaining(DRAFT_LOCALES.map((locale) => ({ locale: locale.code }))));
  });

  it("rejects registered draft locales instead of silently serving English", () => {
    for (const locale of DRAFT_LOCALES) {
      expect(() => resolveLayoutLocale(locale.code), locale.code).toThrow("NEXT_NOT_FOUND");
    }
  });

  it("resolves launch locale metadata for html language and direction", () => {
    expect(resolveLayoutLocale("zh-hant")).toEqual({
      localeCode: "zh-hant",
      hreflang: "zh-Hant",
      dir: "ltr"
    });
  });

  it("localizes the site-level homepage metadata", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "zh-hans" }) });

    expect(metadata.title).toMatchObject({
      default: "Toolars — 全部工具，一个工作台。",
      template: "%s · Toolars"
    });
    expect(metadata.description).toContain("找到合适的工具，更快完成事情");
    expect(metadata.openGraph).toMatchObject({
      title: "Toolars — 全部工具，一个工作台。",
      description: expect.stringContaining("找到合适的工具，更快完成事情")
    });
    expect(metadata.twitter).toMatchObject({
      title: "Toolars — 全部工具，一个工作台。",
      description: expect.stringContaining("找到合适的工具，更快完成事情")
    });
  });

  it("uses the redesigned versioned favicon for browser tab icons", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "zh-hans" }) });

    expect(metadata.icons).toMatchObject({
      icon: [
        {
          url: TOOLARS_FAVICON_URL,
          type: "image/svg+xml"
        }
      ]
    });
  });
});
