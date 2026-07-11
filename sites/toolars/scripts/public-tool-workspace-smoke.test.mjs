import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createToolInventoryAudit } from "./audit-tool-inventory.mjs";
import {
  evaluatePublicToolWorkspaceSnapshot,
  createPublicToolWorkspaceSmokeManifest,
  formatPublicToolWorkspaceSmokeSummary,
  parsePublicToolWorkspaceSmokeArgs
} from "./public-tool-workspace-smoke.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const sourceRoots = {
  vitalcalcRoot: path.resolve(repoRoot, "../aixtral-calm/vitalcalc"),
  aixtralLabRoot: path.resolve(repoRoot, "../aixtral-lab")
};

describe("public tool workspace smoke manifest", () => {
  it("covers every public tool workspace route with a stable workspace marker", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });
    const publicSlugs = audit.entries
      .filter((entry) => entry.launchCertified)
      .map((entry) => entry.slug)
      .sort((a, b) => a.localeCompare(b));
    const manifest = await createPublicToolWorkspaceSmokeManifest({ siteRoot, ...sourceRoots });

    expect(manifest.scenarios.map((scenario) => scenario.slug)).toEqual(publicSlugs);
    expect(manifest.summary).toEqual({
      total: 55,
      launchCertified: 55,
      publicUncertified: 0
    });

    for (const scenario of manifest.scenarios) {
      expect(scenario.path).toBe(`/tools/${scenario.slug}`);
      expect(scenario.workspaceSelectors).toContain(`[data-tool-workspace="${scenario.slug}"]`);
      expect(scenario.workspaceSelectors).toContain(`[data-ai-lab-tool="${scenario.slug}"]`);
    }
  });

  it("fails a page snapshot when marker, controls, or browser health are missing", () => {
    expect(
      evaluatePublicToolWorkspaceSnapshot({
        status: 200,
        markerCount: 1,
        interactiveControlCount: 3,
        consoleErrors: [],
        pageErrors: []
      })
    ).toMatchObject({ ok: true, error: null });

    expect(
      evaluatePublicToolWorkspaceSnapshot({
        status: 200,
        markerCount: 0,
        interactiveControlCount: 3,
        consoleErrors: [],
        pageErrors: []
      })
    ).toMatchObject({ ok: false, error: "Workspace marker missing" });

    expect(
      evaluatePublicToolWorkspaceSnapshot({
        status: 200,
        markerCount: 1,
        interactiveControlCount: 0,
        consoleErrors: [],
        pageErrors: []
      })
    ).toMatchObject({ ok: false, error: "Interactive controls missing" });

    expect(
      evaluatePublicToolWorkspaceSnapshot({
        status: 200,
        markerCount: 1,
        interactiveControlCount: 3,
        consoleErrors: [],
        pageErrors: ["ReferenceError: broken"]
      })
    ).toMatchObject({ ok: false, error: "Browser errors found" });
  });

  it("parses CLI options and formats a compact release summary", () => {
    expect(
      parsePublicToolWorkspaceSmokeArgs([
        "--base-url",
        "https://toolars.app/",
        "--limit",
        "25",
        "--concurrency",
        "3",
        "--write",
        "/tmp/public-workspaces.json",
        "--output-dir",
        "/tmp/public-workspaces"
      ])
    ).toEqual({
      baseUrl: "https://toolars.app",
      limit: 25,
      concurrency: 3,
      write: "/tmp/public-workspaces.json",
      outputRoot: "/tmp/public-workspaces"
    });

    expect(
      formatPublicToolWorkspaceSmokeSummary({
        baseUrl: "https://toolars.app",
        summary: { total: 2, passed: 1, failed: 1 },
        results: [
          { slug: "json-repair", ok: true },
          { slug: "token-counter", ok: false, error: "Workspace marker missing" }
        ]
      })
    ).toContain("Public tool workspace smoke: fail");
  });
});
