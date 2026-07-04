import { describe, expect, it } from "vitest";
import { detectLocale, isStaticAssetPath } from "./proxy";

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
    expect(isStaticAssetPath("/favicon.svg")).toBe(true);
    expect(isStaticAssetPath("/tools/json-repair")).toBe(false);
  });
});
