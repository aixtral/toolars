import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(import.meta.dirname, "..");

function readSiteFile(relativePath) {
  return readFileSync(path.join(siteRoot, relativePath), "utf8");
}

describe("Vercel deployment warning guards", () => {
  it("keeps pnpm build-script approvals explicit for Vercel installs", () => {
    const workspaceConfig = readSiteFile("pnpm-workspace.yaml");

    expect(workspaceConfig).not.toContain("set this to true or false");
    expect(workspaceConfig).toMatch(/['"]?@sentry\/cli['"]?:\s+true/);
    expect(workspaceConfig).toMatch(/\bcore-js:\s+true/);
  });

  it("keeps Next output tracing and Turbopack roots aligned", () => {
    const config = readSiteFile("next.config.ts");
    const tracingRoot = config.match(/outputFileTracingRoot:\s*([^,\n]+)/)?.[1]?.trim();
    const turbopackRoot = config.match(/turbopack:\s*{[\s\S]*?root:\s*([^,\n}]+)/)?.[1]?.trim();

    expect(tracingRoot).toBeTruthy();
    expect(turbopackRoot).toBe(tracingRoot);
  });

  it("does not force OpenGraph image routes onto the edge runtime", () => {
    const imageRoutes = ["src/app/opengraph-image.tsx", "src/app/[locale]/opengraph-image.tsx"];

    for (const route of imageRoutes) {
      expect(readSiteFile(route), route).not.toMatch(/export\s+const\s+runtime\s*=\s*["']edge["']/);
    }
  });

  it("keeps OpenGraph headline markup compatible with static prerendering", () => {
    const imageRoutes = ["src/app/opengraph-image.tsx", "src/app/[locale]/opengraph-image.tsx"];

    for (const route of imageRoutes) {
      expect(readSiteFile(route), route).not.toMatch(/<br\s*\/>/);
    }
  });
});
