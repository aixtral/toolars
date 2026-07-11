#!/usr/bin/env node
/**
 * Capture the /en mobile home implementation as the new visual baseline,
 * reflecting the unified standard topbar (Sign in + Sign up auth region).
 *
 * Usage: node scripts/capture-home-mobile-baseline.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const BASE_URL = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088";
const OUTPUT_PATH = "output/visual-baseline/mobile-home-en.png";

async function main() {
  const browser = await chromium.launch();
  // 426 CSS px wide, deviceScaleFactor 2 => 852 device px (matches design 04 width).
  const context = await browser.newContext({
    viewport: { width: 426, height: 923 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  // Dismiss the cookie consent banner so it does not appear in the baseline.
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "toolars:cookie-consent",
      JSON.stringify({ status: "rejected", timestamp: Date.now() })
    );
  });

  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  await page.screenshot({ path: OUTPUT_PATH, fullPage: true });
  console.log(`Captured /en mobile home baseline -> ${OUTPUT_PATH}`);

  await context.close();
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
