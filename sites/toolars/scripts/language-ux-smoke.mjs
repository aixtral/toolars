import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outputRoot = process.env.TOOLARS_LANGUAGE_UX_OUTPUT_DIR
  ? path.resolve(process.env.TOOLARS_LANGUAGE_UX_OUTPUT_DIR)
  : path.join(repoRoot, "output", "language-ux-smoke", runId);
const baseUrl = (process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9321").replace(/\/$/, "");
const launchLocaleLabels = ["English", "Español", "简体中文", "繁體中文"];
const draftLocaleLabels = ["العربية", "Français", "हिन्दी", "日本語", "Português", "Русский"];

mkdirSync(outputRoot, { recursive: true });

const results = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function screenshotPath(name) {
  return path.join(outputRoot, `${name}.png`);
}

function relativeUrl(route) {
  return `${baseUrl}${route}`;
}

function acceptableDefaultLocalePaths(route) {
  if (route === "/") return ["/", "/en"];
  if (route.startsWith("/es/") || route.startsWith("/zh-hans/") || route.startsWith("/zh-hant/")) return [route];
  return [route, `/en${route}`];
}

async function waitForRoute(page, route) {
  const paths = acceptableDefaultLocalePaths(route);
  await page.waitForURL((url) => url.origin === baseUrl && paths.includes(url.pathname), { timeout: 10000 });
}

async function gotoAndCheck(page, route) {
  await page.goto(relativeUrl(route), { waitUntil: "networkidle", timeout: 30000 });

  const title = await page.title();
  assert(title && title.length > 0, `Missing page title for ${route}`);

  const mainTextLength = await page.locator("main").evaluateAll((nodes) =>
    nodes.reduce((total, node) => total + (node.textContent?.trim().length ?? 0), 0)
  );
  assert(mainTextLength > 40, `Blank or near-blank main content for ${route}`);

  const hasFrameworkOverlay = await page.evaluate(() => {
    const bodyText = document.body?.innerText ?? "";
    const overlay = document.querySelector("[data-nextjs-dialog-overlay], [data-nextjs-dialog], nextjs-portal [role='dialog']");
    return Boolean(overlay) || ["Unhandled Runtime Error", "Build Error", "Failed to compile", "Application error"].some((text) => bodyText.includes(text));
  });
  assert(!hasFrameworkOverlay, `Framework error overlay detected for ${route}`);

  return { title, url: page.url() };
}

async function checkConsoleHealth(logs) {
  const errors = logs.filter((entry) => entry.level === "error" || entry.level === "pageerror");
  assert(errors.length === 0, `Console/page errors found: ${errors.map((entry) => entry.text).join(" | ")}`);
}

async function openDesktopLanguageMenu(page, triggerName = "Switch language: English") {
  const trigger = page.getByRole("button", { name: triggerName });
  assert(await trigger.count() === 1, `Expected one language trigger named ${triggerName}`);
  await trigger.click();

  const menu = page.getByRole("listbox", { name: triggerName });
  await menu.waitFor({ state: "visible", timeout: 5000 });
  return menu;
}

async function runScenario(browser, name, viewport, scenario) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: "light" });
  const page = await context.newPage();
  const logs = [];
  page.on("console", (message) => {
    logs.push({ level: message.type(), text: message.text() });
  });
  page.on("pageerror", (error) => {
    logs.push({ level: "pageerror", text: error.message });
  });

  const startedAt = Date.now();
  try {
    const detail = await scenario(page, logs);
    await checkConsoleHealth(logs);
    results.push({ name, ok: true, elapsedMs: Date.now() - startedAt, ...detail });
    console.log(`ok ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, ok: false, elapsedMs: Date.now() - startedAt, error: message, logs });
    console.error(`fail ${name}: ${message}`);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch();

try {
  await runScenario(browser, "desktop-language-menu", { width: 1440, height: 960 }, async (page) => {
    const pageInfo = await gotoAndCheck(page, "/explore/pdf");
    const beforeScreenshot = screenshotPath("desktop-pdf-language-before");
    await page.screenshot({ path: beforeScreenshot, fullPage: false });

    const menu = await openDesktopLanguageMenu(page);
    const optionTexts = await menu.locator("[role='option']").evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim() ?? ""));
    assert(JSON.stringify(optionTexts) === JSON.stringify(launchLocaleLabels), `Unexpected launch locale list: ${optionTexts.join(", ")}`);
    for (const label of draftLocaleLabels) {
      assert(!optionTexts.includes(label), `Draft locale leaked into switcher: ${label}`);
    }

    const activeOption = menu.getByRole("option", { name: "English" });
    assert((await activeOption.getAttribute("aria-selected")) === "true", "English option was not active");

    const spanishOption = menu.getByRole("option", { name: "Español" });
    assert((await spanishOption.getAttribute("href")) === "/es/explore/pdf", "Spanish option did not preserve /explore/pdf");

    await page.mouse.click(6, 6);
    await menu.waitFor({ state: "hidden", timeout: 5000 });

    const reopened = await openDesktopLanguageMenu(page);
    await reopened.getByRole("option", { name: "Español" }).click();
    await page.waitForURL(relativeUrl("/es/explore/pdf"), { timeout: 10000 });

    return { pageInfo, screenshots: [beforeScreenshot], finalUrl: page.url() };
  });

  await runScenario(browser, "desktop-special-locale-paths", { width: 1440, height: 960 }, async (page) => {
    const cases = [
      { route: "/explore/ai-developer", trigger: "Switch language: English", option: "Español", href: "/es/explore/ai-developer" },
      { route: "/explore/finance", trigger: "Switch language: English", option: "繁體中文", href: "/zh-hant/explore/finance" },
      { route: "/zh-hans/explore/ai-developer", trigger: "切换语言: 简体中文", option: "English", href: "/explore/ai-developer" }
    ];

    for (const item of cases) {
      await gotoAndCheck(page, item.route);
      const menu = await openDesktopLanguageMenu(page, item.trigger);
      const option = menu.getByRole("option", { name: item.option });
      assert((await option.getAttribute("href")) === item.href, `${item.route} did not preserve path for ${item.option}`);
      await page.keyboard.press("Escape");
      await menu.waitFor({ state: "hidden", timeout: 5000 });
    }

    return { checkedRoutes: cases.map((item) => item.route) };
  });

  await runScenario(browser, "desktop-category-navigation", { width: 1440, height: 960 }, async (page) => {
    const categoryHrefs = [
      "/explore/ai-security",
      "/explore/llm-cost",
      "/explore/rag-mcp-agent",
      "/explore/finance",
      "/explore/pdf",
      "/explore/ai-developer"
    ];

    await gotoAndCheck(page, "/");
    for (const href of categoryHrefs) {
      const link = page.locator(`aside.sidebar a[href="${href}"]`);
      assert(await link.count() === 1, `Missing desktop category link ${href}`);
      await link.click();
      await waitForRoute(page, href);
      const active = page.locator(`aside.sidebar a[href="${href}"][aria-current="page"]`);
      assert(await active.count() === 1, `Desktop category link was not active after navigation: ${href}`);
    }

    await gotoAndCheck(page, "/explore/frontend-design");
    const fallback = page.locator('aside.sidebar a[href="/explore/frontend-design"][aria-current="page"]');
    assert(await fallback.count() === 1, "Frontend & Design active fallback link missing");

    return { clicked: categoryHrefs, frontendDesignActive: true };
  });

  await runScenario(browser, "mobile-category-language-menu", { width: 390, height: 844 }, async (page) => {
    const pageInfo = await gotoAndCheck(page, "/explore/finance");
    const closedScreenshot = screenshotPath("mobile-finance-menu-closed");
    await page.screenshot({ path: closedScreenshot, fullPage: false });

    const menu = page.locator('[data-mobile-menu="rustdesk-mobile-language-v1"]');
    assert(await menu.count() === 1, "Mobile menu details missing");
    const summary = menu.locator("summary");
    assert(await summary.count() === 1, "Mobile menu summary missing");
    await summary.click();

    const panel = page.locator('[data-mobile-menu-panel="rustdesk-mobile-language-v1"]');
    await panel.waitFor({ state: "visible", timeout: 5000 });
    assert((await panel.locator('[role="option"]').count()) === 4, "Mobile menu did not expose four launch language options");
    assert((await panel.locator('a[href="/explore/finance"][aria-current="page"]').count()) === 1, "Mobile finance category was not active");
    assert((await panel.locator('a[href="/explore/ai-security"]').count()) === 1, "Mobile AI Security category link missing");

    const overlap = await page.evaluate(() => {
      const categories = document.querySelector("[data-mobile-menu-section='categories']");
      const languages = document.querySelector("[data-language-switcher='rustdesk-inline-language-list-v1']");
      if (!categories || !languages) return true;
      const a = categories.getBoundingClientRect();
      const b = languages.getBoundingClientRect();
      return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
    });
    assert(!overlap, "Mobile category links overlap the language controls");

    const openScreenshot = screenshotPath("mobile-finance-menu-open");
    await page.screenshot({ path: openScreenshot, fullPage: false });
    await panel.locator('a[href="/explore/ai-security"]').click();
    await waitForRoute(page, "/explore/ai-security");

    return { pageInfo, screenshots: [closedScreenshot, openScreenshot], finalUrl: page.url() };
  });
} finally {
  await browser.close();
}

const report = {
  baseUrl,
  createdAt: new Date().toISOString(),
  outputRoot,
  passed: results.filter((result) => result.ok).length,
  failed: results.filter((result) => !result.ok).length,
  results
};

writeFileSync(path.join(outputRoot, "language-ux-smoke-report.json"), JSON.stringify(report, null, 2));

if (report.failed > 0) {
  console.error(`Language UX smoke failed: ${report.failed}/${results.length} scenarios failed.`);
  console.error(outputRoot);
  process.exit(1);
}

console.log(`Language UX smoke complete: ${report.passed}/${results.length} scenarios passed.`);
console.log(outputRoot);
