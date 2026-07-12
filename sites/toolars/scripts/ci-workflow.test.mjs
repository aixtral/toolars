import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const workflow = readFileSync(path.join(repoRoot, ".github/workflows/ci.yml"), "utf8");

describe("CI workflow", () => {
  it("runs the full launch readiness gate on a managed production server", () => {
    expect(workflow).toContain("Launch readiness");
    expect(workflow).toContain("pnpm run launch:readiness -- --full --base-url http://127.0.0.1:9188");
  });

  it("uses the configurable temporary production origin for deployed smoke and public health gates", () => {
    expect(workflow).toContain("NEXT_PUBLIC_SITE_URL: https://toolars-two.vercel.app");
    expect(workflow).toContain("TOOLARS_TEMP_PRODUCTION_ORIGIN: ${{ vars.TOOLARS_TEMP_PRODUCTION_ORIGIN || 'https://toolars-two.vercel.app' }}");
    expect(workflow).toContain("Temporary production certified tool smoke");
    expect(workflow).toContain("Temporary production health");
    expect(workflow).toContain('pnpm exec node "$PWD/scripts/check-public-health.mjs" --base-url "$TOOLARS_TEMP_PRODUCTION_ORIGIN"');
    expect(workflow).toContain('pnpm exec node "$PWD/scripts/certified-tool-smoke.mjs" --base-url "$TOOLARS_TEMP_PRODUCTION_ORIGIN"');
    expect(workflow).not.toContain('pnpm run release:health -- --base-url "$TOOLARS_TEMP_PRODUCTION_ORIGIN"');
    expect(workflow).not.toContain("https://toolars.app");
  });

  it("installs the Playwright browser required by smoke and visual gates", () => {
    expect(workflow).toContain("Install Playwright browsers");
    expect(workflow).toContain("pnpm exec playwright install --with-deps chromium");
  });
});
