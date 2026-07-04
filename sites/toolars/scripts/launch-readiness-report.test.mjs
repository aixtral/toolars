import { describe, expect, it } from "vitest";
import {
  createLaunchReadinessPlan,
  formatLaunchReadinessMarkdown,
  runLaunchReadinessPlan
} from "./launch-readiness-report.mjs";

describe("launch readiness report", () => {
  it("runs the core release gates by default", () => {
    const plan = createLaunchReadinessPlan({
      outputRoot: "/tmp/toolars-launch-readiness"
    });

    expect(plan.map((gate) => gate.id)).toEqual([
      "unit-tests",
      "typecheck",
      "production-build",
      "tool-inventory-audit",
      "i18n-audit",
      "i18n-quality-audit"
    ]);
    expect(plan.find((gate) => gate.id === "tool-inventory-audit")?.args).toContain("/tmp/toolars-launch-readiness/audits/tool-inventory.json");
  });

  it("adds browser smoke and visual gates for full release mode", () => {
    const plan = createLaunchReadinessPlan({
      full: true,
      baseUrl: "http://127.0.0.1:9320",
      outputRoot: "/tmp/toolars-launch-readiness"
    });

    expect(plan.map((gate) => gate.id)).toEqual([
      "unit-tests",
      "typecheck",
      "production-build",
      "tool-inventory-audit",
      "i18n-audit",
      "i18n-quality-audit",
      "route-crawl",
      "language-ux-smoke",
      "draft-locale-smoke",
      "visual-release-gate"
    ]);
    expect(plan.find((gate) => gate.id === "language-ux-smoke")?.env).toMatchObject({
      TOOLARS_BASE_URL: "http://127.0.0.1:9320",
      TOOLARS_LANGUAGE_UX_OUTPUT_DIR: "/tmp/toolars-launch-readiness/browser/language-ux"
    });
    expect(plan.find((gate) => gate.id === "route-crawl")?.env).toMatchObject({
      TOOLARS_BASE_URL: "http://127.0.0.1:9320",
      TOOLARS_ROUTE_CRAWL_OUTPUT_DIR: "/tmp/toolars-launch-readiness/browser/route-crawl"
    });
  });

  it("returns a failed report when any gate fails", () => {
    const plan = [
      { id: "pass", label: "Pass", command: "ok", args: [], cwd: "/tmp" },
      { id: "fail", label: "Fail", command: "nope", args: ["--bad"], cwd: "/tmp" }
    ];

    const report = runLaunchReadinessPlan(plan, {
      startedAt: "2026-07-04T00:00:00.000Z",
      finishedAt: "2026-07-04T00:00:01.000Z",
      runner: (gate) => ({
        status: gate.id === "fail" ? 1 : 0,
        stdout: gate.id,
        stderr: gate.id === "fail" ? "boom" : ""
      })
    });

    expect(report.status).toBe("fail");
    expect(report.summary).toEqual({ total: 2, passed: 1, failed: 1 });
    expect(report.results[1]).toMatchObject({
      id: "fail",
      ok: false,
      commandLine: "nope --bad"
    });
  });

  it("formats a compact markdown evidence report", () => {
    const markdown = formatLaunchReadinessMarkdown({
      status: "pass",
      startedAt: "2026-07-04T00:00:00.000Z",
      finishedAt: "2026-07-04T00:00:01.000Z",
      summary: { total: 1, passed: 1, failed: 0 },
      results: [
        {
          id: "typecheck",
          label: "TypeScript typecheck",
          ok: true,
          elapsedMs: 42,
          commandLine: "pnpm run typecheck",
          stdoutTail: "$ tsc --noEmit",
          stderrTail: ""
        }
      ]
    });

    expect(markdown).toContain("# Toolars Launch Readiness Report");
    expect(markdown).toContain("Status: pass");
    expect(markdown).toContain("| typecheck | pass |");
  });
});
