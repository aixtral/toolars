import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { certifiedToolSmokeScenarios } from "./certified-tool-smoke.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultBaseUrl = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088";
const defaultOutputRoot = path.resolve(scriptDir, "../output/playwright/public-tool-button-audit");
export const scenarioResultTimeoutMs = 15_000;

export function evaluateButtonAttempt({ before, after, downloadedFileName }) {
  if (downloadedFileName) return { ok: true, signal: "download" };
  if (before.url !== after.url) return { ok: true, signal: "navigation" };
  if (before.clipboard !== after.clipboard) return { ok: true, signal: "clipboard" };
  if (before.localStorage !== after.localStorage) return { ok: true, signal: "storage" };
  if (before.dialogCount !== after.dialogCount || before.bodyText !== after.bodyText) return { ok: true, signal: "document" };
  return { ok: false, signal: "none" };
}

export async function runPublicToolButtonAudit({
  baseUrl = defaultBaseUrl,
  outputRoot = process.env.TOOLARS_PUBLIC_BUTTON_AUDIT_OUTPUT_DIR ?? defaultOutputRoot,
  scenarios = certifiedToolSmokeScenarios,
  limit,
  headless = process.env.TOOLARS_SMOKE_HEADED === "1" ? false : true
} = {}) {
  const normalizedBaseUrl = stripTrailingSlash(baseUrl);
  const selectedScenarios = scenarios.slice(0, limit ?? undefined);
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({ baseURL: normalizedBaseUrl });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: normalizedBaseUrl });
  const fixturePath = await createPdfFixture(outputRoot);
  const results = [];

  try {
    for (const scenario of selectedScenarios) {
      results.push(await auditScenarioButtons(context, scenario, fixturePath));
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const attempts = results.flatMap((result) => result.buttons);
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: normalizedBaseUrl,
    summary: {
      totalTools: results.length,
      totalButtons: attempts.length,
      verified: attempts.filter((attempt) => attempt.status === "verified").length,
      primaryContracts: attempts.filter((attempt) => attempt.status === "primary-contract").length,
      contextDisabled: attempts.filter((attempt) => attempt.status === "context-disabled").length,
      failed: attempts.filter((attempt) => attempt.status === "failed").length
    },
    results
  };

  await fs.mkdir(outputRoot, { recursive: true });
  await fs.writeFile(path.join(outputRoot, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

async function auditScenarioButtons(context, scenario, fixturePath) {
  const baselinePage = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  baselinePage.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  baselinePage.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await prepareAndRun(baselinePage, scenario, fixturePath);
    const buttons = await listVisibleButtons(baselinePage, scenario);
    const auditedButtons = [];

    for (const candidate of buttons) {
      if (candidate.name === scenario.runButtonName) {
        auditedButtons.push({ ...candidate, status: "primary-contract", signal: "certified-result" });
        continue;
      }
      auditedButtons.push(await auditButtonCandidate(context, scenario, candidate, fixturePath));
    }

    return { slug: scenario.slug, ok: pageErrors.length === 0 && consoleErrors.length === 0, buttons: auditedButtons, consoleErrors, pageErrors };
  } catch (error) {
    return {
      slug: scenario.slug,
      ok: false,
      buttons: [],
      consoleErrors,
      pageErrors,
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    await baselinePage.close();
  }
}

async function auditButtonCandidate(context, scenario, candidate, fixturePath) {
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await prepareAndRun(page, scenario, fixturePath);
    const root = await getWorkspaceRoot(page, scenario);
    const button = root.getByRole("button", { name: candidate.name, exact: true }).nth(candidate.index);
    if (await button.isDisabled()) return { ...candidate, status: "context-disabled", signal: "disabled" };

    const before = await captureEffectSnapshot(page);
    const download = page.waitForEvent("download", { timeout: 1_000 }).catch(() => null);
    await button.click({ timeout: 5_000 });
    await page.waitForTimeout(180);
    const downloaded = await download;
    const after = await captureEffectSnapshot(page);
    const verdict = evaluateButtonAttempt({ before, after, downloadedFileName: downloaded?.suggestedFilename() });

    return {
      ...candidate,
      status: verdict.ok && consoleErrors.length === 0 && pageErrors.length === 0 ? "verified" : "failed",
      signal: verdict.signal,
      consoleErrors,
      pageErrors
    };
  } catch (error) {
    return {
      ...candidate,
      status: "failed",
      signal: "error",
      error: error instanceof Error ? error.message : String(error),
      consoleErrors,
      pageErrors
    };
  } finally {
    await page.close();
  }
}

async function prepareAndRun(page, scenario, fixturePath) {
  const response = await page.goto(scenario.path, { waitUntil: "domcontentloaded", timeout: 30_000 });
  if (!response?.ok()) throw new Error(`Navigation failed with HTTP ${response?.status() ?? "unknown"}`);
  await dismissCookieConsent(page);
  await getWorkspaceRoot(page, scenario);
  await page.waitForTimeout(150);

  for (const action of scenario.inputActions) {
    if (action.type === "fill") {
      await page.locator(action.selector).fill(action.value);
    } else if (action.type === "clickButton") {
      await page.getByRole("button", { name: action.name, exact: true }).click();
    } else if (action.type === "uploadPdf") {
      await page.getByRole("button", { name: "Add files", exact: true }).click();
      await page.locator('input[type="file"]').setInputFiles(fixturePath);
      const addToQueue = page.getByRole("button", { name: "Add 1 file to queue", exact: true });
      await page.waitForFunction((button) => !button.disabled, await addToQueue.elementHandle(), { timeout: 5_000 });
      await addToQueue.click();
    } else {
      throw new Error(`Unsupported input action: ${action.type}`);
    }
  }

  const runButton = page.getByRole("button", { name: scenario.runButtonName, exact: true });
  await runButton.waitFor({ state: "visible" });
  await page.waitForFunction((button) => !button.disabled, await runButton.elementHandle(), { timeout: 5_000 });
  await runButton.click();
  await waitForScenarioResult(page, scenario);
}

async function dismissCookieConsent(page) {
  const banner = page.locator(".cookie-consent-banner");
  if (!(await banner.isVisible().catch(() => false))) return;
  await banner.getByRole("button", { name: "Accept", exact: true }).click();
  await banner.waitFor({ state: "hidden" });
}

async function waitForScenarioResult(page, scenario) {
  const assertion = scenario.resultAssertion;
  if (assertion.type === "selectorText") {
    await page.locator(assertion.selector).filter({ hasText: assertion.text }).first().waitFor({ state: "visible", timeout: scenarioResultTimeoutMs });
  } else if (assertion.type === "pageText") {
    await page.getByText(assertion.text, { exact: false }).first().waitFor({ state: "visible", timeout: scenarioResultTimeoutMs });
  } else if (assertion.type === "selectorVisible") {
    await page.locator(assertion.selector).first().waitFor({ state: "visible", timeout: scenarioResultTimeoutMs });
  } else if (assertion.type === "selectorNotText") {
    await page.waitForFunction(
      ({ selector, text }) => document.querySelector(selector)?.textContent?.trim() !== text,
      assertion,
      { timeout: scenarioResultTimeoutMs }
    );
  } else if (assertion.type === "enabledButton") {
    const button = page.getByRole("button", { name: assertion.name, exact: true });
    await page.waitForFunction((element) => !element.disabled, await button.elementHandle(), { timeout: scenarioResultTimeoutMs });
  } else {
    throw new Error(`Unsupported result assertion: ${assertion.type}`);
  }
}

async function getWorkspaceRoot(page, scenario) {
  const root = page.locator(scenario.workspaceSelector).first();
  await root.waitFor({ state: "visible", timeout: 15_000 });
  return root;
}

async function listVisibleButtons(page, scenario) {
  const root = await getWorkspaceRoot(page, scenario);
  return root.locator("button").evaluateAll((nodes) => {
    const seen = new Map();
    return nodes.flatMap((node) => {
      if (!(node instanceof HTMLButtonElement)) return [];
      const style = window.getComputedStyle(node);
      if (style.visibility === "hidden" || style.display === "none" || node.getClientRects().length === 0) return [];
      const name = node.getAttribute("aria-label") || node.textContent?.replace(/\s+/g, " ").trim() || node.getAttribute("title") || "";
      if (!name) return [];
      const index = seen.get(name) ?? 0;
      seen.set(name, index + 1);
      return [{ name, index }];
    });
  });
}

async function captureEffectSnapshot(page) {
  const clipboard = await page.evaluate(async () => {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return "";
    }
  });
  return page.evaluate((clipboardValue) => ({
    bodyText: document.body.innerText,
    clipboard: clipboardValue,
    dialogCount: document.querySelectorAll('[role="dialog"], dialog[open]').length,
    localStorage: JSON.stringify(Object.fromEntries(Object.entries(localStorage))),
    url: window.location.href
  }), clipboard);
}

async function createPdfFixture(outputRoot) {
  const fixturePath = path.join(outputRoot, "fixtures", "toolars-smoke.pdf");
  const document = await PDFDocument.create();
  document.addPage([320, 240]);
  await fs.mkdir(path.dirname(fixturePath), { recursive: true });
  await fs.writeFile(fixturePath, await document.save());
  return fixturePath;
}

function stripTrailingSlash(value) {
  return String(value).replace(/\/+$/, "");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await runPublicToolButtonAudit();
  process.stdout.write(`${JSON.stringify(report.summary)}\n`);
  if (report.summary.failed > 0) process.exitCode = 1;
}
