import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { detectLocale, getLaunchCertificationRobotsHeader, isLaunchPublicToolPath, isStaticAssetPath, proxy } from "./proxy";

describe("proxy locale detection", () => {
  it("detects only launch locales for public routing", () => {
    expect(detectLocale("es-MX,es;q=0.9,en;q=0.8")).toBe("es");
    expect(detectLocale("zh-TW,zh;q=0.9,en;q=0.8")).toBe("zh-hant");

    expect(detectLocale("fr-FR,fr;q=0.9,en;q=0.8")).toBe("en");
    expect(detectLocale("ar-SA,ar;q=0.9,en;q=0.8")).toBe("en");
  });

  it("falls through draft preferred languages to the next launch locale", () => {
    expect(detectLocale("fr-FR,fr;q=1,es;q=0.8,en;q=0.7")).toBe("es");
    expect(detectLocale("ar-SA,ar;q=1,zh-CN;q=0.9,en;q=0.8")).toBe("zh-hans");
  });
});

describe("proxy static asset routing", () => {
  it("leaves brand SVG assets unlocalized so logo images load directly", () => {
    expect(isStaticAssetPath("/brand/toolars-stack-monolith-mark-v9.svg")).toBe(true);
    expect(isStaticAssetPath("/brand/toolars-stack-monolith-mark-v9.png")).toBe(true);
    expect(isStaticAssetPath("/brand/toolars-tool-network.png")).toBe(true);
    expect(isStaticAssetPath("/favicon.svg")).toBe(true);
    expect(isStaticAssetPath("/pdf-worker.min.mjs")).toBe(true);
    expect(isStaticAssetPath("/llms.txt")).toBe(true);
    expect(isStaticAssetPath("/tools/json-repair")).toBe(false);
  });
});

describe("proxy tool certification robots header", () => {
  it("admits only launch-certified tool paths to the public launch surface", () => {
    expect(isLaunchPublicToolPath("/tools/json-repair")).toBe(true);
    expect(isLaunchPublicToolPath("/es/tools/token-counter/about")).toBe(true);
    expect(isLaunchPublicToolPath("/tools/color-contrast-checker")).toBe(false);
    expect(isLaunchPublicToolPath("/zh-hans/tools/color-contrast-checker/about")).toBe(false);
    expect(isLaunchPublicToolPath("/explore/pdf")).toBe(true);
  });

  it("rewrites deferred tool paths to a locale-scoped not-found route", () => {
    const response = proxy(new NextRequest("https://toolars.test/zh-hans/tools/color-contrast-checker/about"));

    expect(response.headers.get("x-middleware-rewrite")).toBe("https://toolars.test/zh-hans/__tool-unavailable__");
  });

  it("marks uncertified tool workspace and about paths as noindex", () => {
    expect(getLaunchCertificationRobotsHeader("/tools/color-contrast-checker")).toBe("noindex, nofollow");
    expect(getLaunchCertificationRobotsHeader("/en/tools/color-contrast-checker")).toBe("noindex, nofollow");
    expect(getLaunchCertificationRobotsHeader("/zh-hans/tools/color-contrast-checker/about")).toBe("noindex, nofollow");
  });

  it("keeps launch-certified tools and non-tool paths indexable", () => {
    expect(getLaunchCertificationRobotsHeader("/tools/json-repair")).toBeNull();
    expect(getLaunchCertificationRobotsHeader("/es/tools/json-repair/about")).toBeNull();
    expect(getLaunchCertificationRobotsHeader("/explore/pdf")).toBeNull();
  });
});
