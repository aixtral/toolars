import { describe, expect, it } from "vitest";
import {
  createLaunchReadinessPlan,
  formatLaunchReadinessMarkdown,
  parseLaunchReadinessArgs,
  runLaunchReadinessPlan
} from "./launch-readiness-report.mjs";

describe("launch readiness report", () => {
  const wrappedCommand = (gate) => [gate?.command, ...(gate?.args ?? [])];

  it("lets --full enable browser and visual gates unless explicitly overridden", () => {
    const parsed = parseLaunchReadinessArgs(["--full", "--base-url", "http://127.0.0.1:9188"]);

    expect(parsed).toMatchObject({
      full: true,
      baseUrl: "http://127.0.0.1:9188"
    });
    expect(parsed).not.toHaveProperty("browser");
    expect(parsed).not.toHaveProperty("visual");
  });

  it("runs the core release gates by default", () => {
    const plan = createLaunchReadinessPlan({
      outputRoot: "/tmp/toolars-launch-readiness"
    });

    expect(plan.map((gate) => gate.id)).toEqual([
      "unit-tests",
      "typecheck",
      "production-build",
      "production-health",
      "tool-inventory-audit",
      "certified-tool-smoke",
      "public-tool-button-audit",
      "deferred-tool-access-smoke",
      "button-behavior-audit",
      "i18n-audit",
      "i18n-quality-audit"
    ]);
    expect(plan.find((gate) => gate.id === "tool-inventory-audit")?.args).toContain("/tmp/toolars-launch-readiness/audits/tool-inventory.json");
    expect(wrappedCommand(plan.find((gate) => gate.id === "production-health"))).toEqual([
      "node",
      "scripts/with-production-server.mjs",
      "--base-url",
      "http://127.0.0.1:9088",
      "--",
      "node",
      "scripts/check-production-health.mjs",
      "--base-url",
      "http://127.0.0.1:9088"
    ]);
    expect(wrappedCommand(plan.find((gate) => gate.id === "certified-tool-smoke"))).toEqual([
      "node",
      "scripts/with-production-server.mjs",
      "--base-url",
      "http://127.0.0.1:9088",
      "--",
      "node",
      "scripts/certified-tool-smoke.mjs",
      "--write",
      "/tmp/toolars-launch-readiness/audits/certified-tool-smoke.json",
      "--output-dir",
      "/tmp/toolars-launch-readiness/browser/certified-tools"
    ]);
    expect(wrappedCommand(plan.find((gate) => gate.id === "public-tool-button-audit"))).toEqual([
      "node",
      "scripts/with-production-server.mjs",
      "--base-url",
      "http://127.0.0.1:9088",
      "--",
      "node",
      "scripts/audit-public-tool-buttons.mjs"
    ]);
    expect(plan.find((gate) => gate.id === "public-tool-button-audit")?.env).toMatchObject({
      TOOLARS_PUBLIC_BUTTON_AUDIT_OUTPUT_DIR: "/tmp/toolars-launch-readiness/browser/public-tool-buttons"
    });
    expect(wrappedCommand(plan.find((gate) => gate.id === "deferred-tool-access-smoke"))).toEqual([
      "node",
      "scripts/with-production-server.mjs",
      "--base-url",
      "http://127.0.0.1:9088",
      "--",
      "node",
      "scripts/deferred-tool-access-smoke.mjs",
      "--output-dir",
      "/tmp/toolars-launch-readiness/browser/deferred-tools"
    ]);
    expect(plan.find((gate) => gate.id === "button-behavior-audit")?.args).toContain("scripts/audit-button-behavior.mjs");
  });

  it("can skip local config and source-repository gates when CI supplies remote equivalents", () => {
    const parsed = parseLaunchReadinessArgs(["--full", "--visual-mobile-max-ratio", "0.14", "--skip-production-health", "--skip-source-inventory"]);
    const plan = createLaunchReadinessPlan({ ...parsed, outputRoot: "/tmp/toolars-launch-readiness" });

    expect(parsed).toMatchObject({ skipProductionHealth: true, skipSourceInventory: true, visualMobileMaxRatio: "0.14" });
    expect(plan.map((gate) => gate.id)).not.toContain("production-health");
    expect(plan.map((gate) => gate.id)).not.toContain("tool-inventory-audit");
    expect(plan.map((gate) => gate.id)).toContain("certified-tool-smoke");
    expect(plan.map((gate) => gate.id)).toContain("visual-release-gate");
    expect(plan.find((gate) => gate.id === "visual-release-gate")?.env).toMatchObject({
      TOOLARS_RELEASE_GATE_MOBILE_MAX_RATIO: "0.14"
    });
  });

  it("adds browser smoke and visual gates for full release mode", () => {
    const plan = createLaunchReadinessPlan({
      full: true,
      baseUrl: "http://127.0.0.1:9088",
      outputRoot: "/tmp/toolars-launch-readiness"
    });

    expect(plan.map((gate) => gate.id)).toEqual([
      "unit-tests",
      "typecheck",
      "production-build",
      "production-health",
      "tool-inventory-audit",
      "certified-tool-smoke",
      "public-tool-button-audit",
      "deferred-tool-access-smoke",
      "button-behavior-audit",
      "i18n-audit",
      "i18n-quality-audit",
      "public-tool-workspace-smoke",
      "route-crawl",
      "language-ux-smoke",
      "draft-locale-smoke",
      "layout-contract",
      "visual-release-gate"
    ]);
    expect(wrappedCommand(plan.find((gate) => gate.id === "public-tool-workspace-smoke"))).toEqual([
      "node",
      "scripts/with-production-server.mjs",
      "--base-url",
      "http://127.0.0.1:9088",
      "--",
      "node",
      "scripts/public-tool-workspace-smoke.mjs",
      "--write",
      "/tmp/toolars-launch-readiness/audits/public-tool-workspace-smoke.json",
      "--output-dir",
      "/tmp/toolars-launch-readiness/browser/public-workspaces"
    ]);
    expect(wrappedCommand(plan.find((gate) => gate.id === "route-crawl")).slice(0, 6)).toEqual([
      "node",
      "scripts/with-production-server.mjs",
      "--base-url",
      "http://127.0.0.1:9088",
      "--",
      "node"
    ]);
    expect(wrappedCommand(plan.find((gate) => gate.id === "visual-release-gate")).slice(0, 6)).toEqual([
      "node",
      "scripts/with-production-server.mjs",
      "--base-url",
      "http://127.0.0.1:9088",
      "--",
      "node"
    ]);
    expect(plan.find((gate) => gate.id === "language-ux-smoke")?.env).toMatchObject({
      TOOLARS_BASE_URL: "http://127.0.0.1:9088",
      TOOLARS_LANGUAGE_UX_OUTPUT_DIR: "/tmp/toolars-launch-readiness/browser/language-ux"
    });
    expect(plan.find((gate) => gate.id === "route-crawl")?.env).toMatchObject({
      TOOLARS_BASE_URL: "http://127.0.0.1:9088",
      TOOLARS_ROUTE_CRAWL_OUTPUT_DIR: "/tmp/toolars-launch-readiness/browser/route-crawl"
    });
    expect(plan.find((gate) => gate.id === "layout-contract")?.env).toMatchObject({
      TOOLARS_BASE_URL: "http://127.0.0.1:9088",
      TOOLARS_LAYOUT_GATE_OUTPUT_DIR: "/tmp/toolars-launch-readiness/browser/layout-contract"
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
