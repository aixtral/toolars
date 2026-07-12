import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createToolInventoryAudit } from "./audit-tool-inventory.mjs";
import { certifiedToolSmokeScenarios, getCertifiedToolFailureCoverage } from "./certified-tool-smoke.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const sourceRoots = {
  vitalcalcRoot: path.resolve(repoRoot, "../aixtral-calm/vitalcalc"),
  aixtralLabRoot: path.resolve(repoRoot, "../aixtral-lab")
};

describe("certified tool smoke manifest", () => {
  it("covers every launch-certified tool with success and failure assertions", async () => {
    const audit = await createToolInventoryAudit({ siteRoot, ...sourceRoots });
    const certifiedSlugs = audit.entries
      .filter((entry) => entry.launchCertified)
      .map((entry) => entry.slug)
      .sort((a, b) => a.localeCompare(b));
    const scenarioSlugs = certifiedToolSmokeScenarios.map((scenario) => scenario.slug).sort((a, b) => a.localeCompare(b));

    expect(certifiedToolSmokeScenarios).toHaveLength(55);
    expect(scenarioSlugs).toEqual(certifiedSlugs);
    expect(getCertifiedToolFailureCoverage()).toMatchObject({
      total: 55,
      contracted: 29,
      disabledRun: 29,
      invalidInput: 0
    });
    for (const scenario of certifiedToolSmokeScenarios) {
      expect(scenario.path).toBe(`/tools/${scenario.slug}`);
      expect(scenario.workspaceSelector.length).toBeGreaterThan(0);
      expect(scenario.inputActions.length).toBeGreaterThan(0);
      expect(scenario.runButtonName.length).toBeGreaterThan(0);
      expect(scenario.resultAssertion).toBeTruthy();
      if (scenario.failureAssertion?.type === "disabledRun") {
        expect(scenario.failureAssertion.inputActions.length).toBeGreaterThan(0);
      }
      if (scenario.failureAssertion?.type === "invalidInput") {
        expect(scenario.failureAssertion.inputActions.length).toBeGreaterThan(0);
        expect(scenario.failureAssertion.resultAssertion).toBeTruthy();
      }
    }
  });
});
