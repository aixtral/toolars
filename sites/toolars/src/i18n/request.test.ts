import { describe, expect, it } from "vitest";
import { DRAFT_LOCALES, LAUNCH_LOCALES } from "@/lib/i18n";
import { resolveRequestLocale } from "./request";

describe("request i18n config", () => {
  it("serves messages only for launch locales while draft locales fall back to English", () => {
    for (const locale of LAUNCH_LOCALES) {
      expect(resolveRequestLocale(locale.code), locale.code).toBe(locale.code);
    }

    for (const locale of DRAFT_LOCALES) {
      expect(resolveRequestLocale(locale.code), locale.code).toBe("en");
    }
    expect(resolveRequestLocale("xx")).toBe("en");
  });
});
