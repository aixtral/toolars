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

  it("installs the Playwright browser required by smoke and visual gates", () => {
    expect(workflow).toContain("Install Playwright browsers");
    expect(workflow).toContain("pnpm exec playwright install --with-deps chromium");
  });
});
