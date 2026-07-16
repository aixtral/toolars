import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createDeferredToolAccessSmokeManifest,
  evaluateDeferredToolAccessSnapshot,
  formatDeferredToolAccessSmokeSummary,
  parseDeferredToolAccessSmokeArgs
} from "./deferred-tool-access-smoke.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const sourceRoots = {
  vitalcalcRoot: path.resolve(repoRoot, "../aixtral-calm/vitalcalc"),
  aixtralLabRoot: path.resolve(repoRoot, "../aixtral-lab")
};

describe("deferred tool access smoke", () => {
  it("covers every deferred registry tool and launch locale with workspace and about URLs", async () => {
    const manifest = await createDeferredToolAccessSmokeManifest({ siteRoot, ...sourceRoots });

    expect(manifest.summary).toEqual({ tools: 130, locales: 4, total: 1040 });
    expect(manifest.scenarios).toContainEqual({
      slug: "color-contrast-checker",
      locale: "en",
      path: "/tools/color-contrast-checker",
      surface: "workspace"
    });
    expect(manifest.scenarios).toContainEqual({
      slug: "color-contrast-checker",
      locale: "zh-hans",
      path: "/zh-hans/tools/color-contrast-checker/about",
      surface: "about"
    });
    expect(manifest.scenarios.some((scenario) => scenario.slug === "json-repair")).toBe(false);
  });

  it("accepts only a localized not-found response for deferred tools", () => {
    expect(evaluateDeferredToolAccessSnapshot({ status: 404, notFoundMarkerCount: 1 })).toEqual({ ok: true, error: null });
    expect(evaluateDeferredToolAccessSnapshot({ status: 200, notFoundMarkerCount: 1 })).toEqual({
      ok: false,
      error: "Expected HTTP 404, received 200"
    });
    expect(evaluateDeferredToolAccessSnapshot({ status: 404, notFoundMarkerCount: 0 })).toEqual({
      ok: false,
      error: "Localized not-found marker missing"
    });
  });

  it("parses CLI options and formats a compact release summary", () => {
    expect(
      parseDeferredToolAccessSmokeArgs([
        "--base-url",
        "https://toolars.app/",
        "--limit",
        "25",
        "--concurrency",
        "3",
        "--output-dir",
        "/tmp/deferred-tools"
      ])
    ).toEqual({
      baseUrl: "https://toolars.app",
      limit: 25,
      concurrency: 3,
      outputRoot: "/tmp/deferred-tools"
    });

    expect(
      formatDeferredToolAccessSmokeSummary({
        baseUrl: "https://toolars.app",
        summary: { total: 2, passed: 1, failed: 1 },
        results: [
          { slug: "color-contrast-checker", locale: "en", surface: "workspace", ok: true },
          { slug: "svg-optimizer", locale: "zh-hans", surface: "about", ok: false, error: "Expected HTTP 404, received 200" }
        ]
      })
    ).toContain("Deferred tool access smoke: fail");
  });
});
