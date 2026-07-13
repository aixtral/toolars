import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { auditWorkspaceInteractions } from "./audit-workspace-interactions.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

describe("workspace interaction audit", () => {
  it("keeps workspace controls free from permanent disabled and handlerless buttons", async () => {
    const report = await auditWorkspaceInteractions({
      workspaceRoot: path.resolve(scriptDir, "../src/app/[locale]/tools")
    });

    expect(report.summary.workspaces).toBeGreaterThan(100);
    expect(report.summary).toMatchObject({ permanentDisabled: 0, missingHandler: 0 });
    expect(report.findings).toEqual([]);
  });
});
