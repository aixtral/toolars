import { describe, expect, it } from "vitest";
import { evaluateButtonAttempt, scenarioResultTimeoutMs } from "./audit-public-tool-buttons.mjs";

describe("public tool button audit", () => {
  const baseline = {
    bodyText: "Tool output",
    clipboard: "",
    dialogCount: 0,
    localStorage: "{}",
    url: "http://localhost:9088/en/tools/json-repair"
  };

  it("accepts observable button effects", () => {
    expect(evaluateButtonAttempt({ before: baseline, after: { ...baseline, clipboard: "copied output" } })).toEqual({
      ok: true,
      signal: "clipboard"
    });
    expect(evaluateButtonAttempt({ before: baseline, after: { ...baseline, bodyText: "Updated output" } })).toEqual({
      ok: true,
      signal: "document"
    });
  });

  it("accepts browser downloads and route changes", () => {
    expect(evaluateButtonAttempt({ before: baseline, after: baseline, downloadedFileName: "result.pdf" })).toEqual({
      ok: true,
      signal: "download"
    });
    expect(evaluateButtonAttempt({ before: baseline, after: { ...baseline, url: "http://localhost:9088/en/my-tools" } })).toEqual({
      ok: true,
      signal: "navigation"
    });
  });

  it("reports buttons that leave no observable effect", () => {
    expect(evaluateButtonAttempt({ before: baseline, after: baseline })).toEqual({
      ok: false,
      signal: "none"
    });
  });

  it("bounds each primary-result wait so a broken tool cannot stall the full audit", () => {
    expect(scenarioResultTimeoutMs).toBeGreaterThanOrEqual(5_000);
    expect(scenarioResultTimeoutMs).toBeLessThanOrEqual(30_000);
  });
});
