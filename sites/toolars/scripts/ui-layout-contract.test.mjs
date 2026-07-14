import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createLaunchReadinessPlan } from "./launch-readiness-report.mjs";
import { createLayoutFindings, requiredWorkflowLayoutPaths } from "./audit-ui-layout-contract.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(path.join(scriptDir, "../src/app/globals.css"), "utf8");

describe("shared UI layout contract", () => {
  it("keeps shortcut labels and button labels on a single line", () => {
    expect(css).toMatch(/\.kbd\s*\{[^}]*white-space:\s*nowrap;/s);
    expect(css).toMatch(/\.nav a,\s*\.nav button,\s*\.button\s*\{[^}]*white-space:\s*nowrap;/s);
  });

  it("wraps long workspace output instead of expanding the page", () => {
    expect(css).toMatch(/\.prompt-textarea\s*\{[^}]*white-space:\s*pre-wrap;[^}]*overflow-wrap:\s*anywhere;/s);
  });

  it("lets localized workspace headings wrap on narrow screens", () => {
    expect(css).toMatch(/\.workspace-panel h1\s*\{[^}]*overflow-wrap:\s*anywhere;/s);
    expect(css).toMatch(/\.prompt-overview-panel\[data-prompt-mobile-density="title-single-line-v2"\] h1\s*\{[^}]*white-space:\s*normal;[^}]*overflow-wrap:\s*anywhere;/s);
  });

  it("moves workflow actions as a complete control when a desktop panel is narrow", () => {
    expect(css).toMatch(/\.workflow-run-head\s*\{[^}]*flex-wrap:\s*wrap;/s);
    expect(css).toMatch(/\.workflow-run-button\s*\{[^}]*min-width:\s*max-content;/s);
  });

  it("includes the browser layout contract in full release readiness", () => {
    const plan = createLaunchReadinessPlan({
      full: true,
      outputRoot: "/tmp/toolars-launch-readiness"
    });

    expect(plan.map((gate) => gate.id)).toContain("layout-contract");
  });

  it("reports page overflow and multi-line interactive labels", () => {
    expect(createLayoutFindings({
      controls: [
        { label: "Command K", lineCount: 2, selector: ".kbd", whiteSpace: "normal" },
        { label: "Run workflow", lineCount: 1, selector: "button.button", whiteSpace: "nowrap" }
      ],
      root: { clientWidth: 390, scrollWidth: 463 },
      url: "http://localhost:9088/es/workflows/mcp-tool-launch",
      viewport: { height: 844, width: 390 }
    })).toEqual([
      expect.objectContaining({ kind: "page-horizontal-overflow" }),
      expect.objectContaining({ kind: "control-not-single-line", label: "Command K" })
    ]);
  });

  it("requires every workflow detail page in every launch locale", () => {
    expect(requiredWorkflowLayoutPaths).toEqual([
      "/en/workflows/pdf-summary",
      "/en/workflows/ai-prompt-hardening",
      "/en/workflows/llm-cost-review",
      "/en/workflows/mcp-tool-launch",
      "/es/workflows/pdf-summary",
      "/es/workflows/ai-prompt-hardening",
      "/es/workflows/llm-cost-review",
      "/es/workflows/mcp-tool-launch",
      "/zh-hans/workflows/pdf-summary",
      "/zh-hans/workflows/ai-prompt-hardening",
      "/zh-hans/workflows/llm-cost-review",
      "/zh-hans/workflows/mcp-tool-launch",
      "/zh-hant/workflows/pdf-summary",
      "/zh-hant/workflows/ai-prompt-hardening",
      "/zh-hant/workflows/llm-cost-review",
      "/zh-hant/workflows/mcp-tool-launch"
    ]);
  });
});
