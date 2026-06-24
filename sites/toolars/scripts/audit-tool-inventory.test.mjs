import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createToolInventoryAudit } from "./audit-tool-inventory.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const sourceRoots = {
  vitalcalcRoot: path.resolve(repoRoot, "../aixtral-calm/vitalcalc"),
  aixtralLabRoot: path.resolve(repoRoot, "../aixtral-lab")
};

describe("tool inventory audit", () => {
  it("reports the current Toolars registry and source-project coverage", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });

    expect(audit.summary.toolars.registryTools).toBe(118);
    expect(audit.summary.toolars.registryBySource).toEqual({
      "aixtral-lab": 22,
      toolars: 10,
      vitalcalc: 86
    });
    expect(audit.summary.toolars.publicTools).toBe(91);
    expect(audit.summary.sources.vitalcalc.rootToolPages).toBe(86);
    expect(audit.summary.sources.aixtralLab.configTools).toBe(92);
    expect(audit.summary.sources.aixtralLab.implementedTools).toBe(66);
  });

  it("derives category count mismatches from real registered tools", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });

    expect(audit.summary.toolars.publicByCategory).toMatchObject({
      "AI": 4,
      "AI Security": 2,
      Finance: 42,
      Health: 42,
      PDF: 1
    });
    expect(audit.gaps.categoryCountMismatches).toEqual([]);
    expect(audit.summary.gaps.categoryCountMismatches).toBe(0);
  });

  it("marks fully wired and source-missing tools separately", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });
    const bySlug = new Map(audit.entries.map((entry) => [entry.slug, entry]));

    expect(bySlug.get("json-repair")).toMatchObject({
      slug: "json-repair",
      status: "source-backed-workspace",
      coverage: {
        registry: true,
        aixtralConfig: true,
        aixtralImplementation: true,
        dedicatedRoute: true,
        dedicatedWorkspace: true,
        toolarsLib: true,
        toolarsLibTest: true,
        workspaceTest: true
      }
    });
    expect(bySlug.get("token-counter")).toMatchObject({
      slug: "token-counter",
      status: "missing-from-toolars",
      coverage: {
        registry: false,
        aixtralConfig: true,
        aixtralImplementation: false
      }
    });
  });

  it("surfaces public registry tools that only have generic or incomplete implementation coverage", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });

    expect(audit.gaps.toolars.publicMissingDedicatedWorkspaces).toEqual([]);
    expect(audit.gaps.toolars.publicMissingToolarsLib).toEqual([]);
    expect(audit.gaps.toolars.publicMissingToolarsLibTests).toEqual([]);
    expect(audit.gaps.toolars.publicMissingWorkspaceTests).toEqual([]);
    expect(audit.gaps.toolars.registryMissingDedicatedWorkspaces).toContain("pii-scanner");
    expect(audit.gaps.toolars.registryMissingToolarsLib).toEqual(
      expect.arrayContaining(["ai-pdf-summarizer", "pdf-merger", "pii-scanner"])
    );
    expect(audit.gaps.aixtralLab.configMissingFromRegistry).toEqual(
      expect.arrayContaining(["token-counter", "hash-generator", "jwt-decoder"])
    );
    expect(audit.gaps.aixtralLab.implementationMissingFromConfig).toContain("http-status-codes");
  });
});
