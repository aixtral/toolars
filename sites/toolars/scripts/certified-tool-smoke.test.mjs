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
      contracted: 33,
      disabledRun: 30,
      invalidInput: 3
    });
    expect(certifiedToolSmokeScenarios.find((scenario) => scenario.slug === "json-repair")?.failureAssertion).toMatchObject({
      type: "invalidInput",
      resultAssertion: { type: "selectorVisible", selector: ".status-error" }
    });
    expect(certifiedToolSmokeScenarios.find((scenario) => scenario.slug === "password-generator")?.failureAssertion).toMatchObject({
      type: "invalidInput",
      resultAssertion: { type: "pageText", text: "Length must be between 4 and 128" }
    });
    expect(certifiedToolSmokeScenarios.find((scenario) => scenario.slug === "chmod-calculator")?.failureAssertion).toMatchObject({
      type: "invalidInput",
      resultAssertion: { type: "pageText", text: "Enter a 3-digit octal mode" }
    });
    expect(certifiedToolSmokeScenarios.find((scenario) => scenario.slug === "pdf-toolkit")).toMatchObject({
      inputActions: [{ type: "uploadPdf" }, { type: "clickButton", name: "Compress" }],
      resultAssertion: { type: "selectorText", selector: ".pdf-output-card", text: "toolars-smoke_compressed.pdf" },
      downloadFileName: "toolars-smoke_compressed.pdf",
      failureAssertion: { type: "disabledRun", inputActions: [], runButtonName: "Merge PDFs" }
    });
    for (const scenario of certifiedToolSmokeScenarios) {
      expect(scenario.path).toBe(`/tools/${scenario.slug}`);
      expect(scenario.workspaceSelector.length).toBeGreaterThan(0);
      expect(scenario.inputActions.length).toBeGreaterThan(0);
      expect(scenario.runButtonName.length).toBeGreaterThan(0);
      expect(scenario.resultAssertion).toBeTruthy();
      if (scenario.failureAssertion?.type === "disabledRun") {
        expect(scenario.failureAssertion.inputActions).toBeInstanceOf(Array);
      }
      if (scenario.failureAssertion?.type === "invalidInput") {
        expect(scenario.failureAssertion.inputActions.length).toBeGreaterThan(0);
        expect(scenario.failureAssertion.resultAssertion).toBeTruthy();
      }
    }
  });
});
