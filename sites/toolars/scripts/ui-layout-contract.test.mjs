import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createLaunchReadinessPlan } from "./launch-readiness-report.mjs";
import {
  createHeaderGeometryFindings,
  createLayoutFindings,
  headerSearchLayoutContracts,
  layoutGateViewports,
  requiredWorkflowLayoutPaths
} from "./audit-ui-layout-contract.mjs";

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

  it("lets localized tool detail titles wrap instead of overflowing the viewport", () => {
    expect(css).toMatch(/\.tool-detail-head \.title\s*\{[^}]*overflow-wrap:\s*anywhere;/s);
    expect(css).toMatch(/\.tool-detail-head > div:first-child\s*\{[^}]*min-width:\s*0;/s);
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

  it("names the elements that push the page past the viewport on horizontal overflow", () => {
    expect(createLayoutFindings({
      controls: [],
      horizontalOffenders: [
        { left: 0, right: 1080, selector: "section.panel.tool-detail-overview-panel", text: "Case Converter" }
      ],
      root: { clientWidth: 1024, scrollWidth: 1080 },
      url: "http://localhost:9088/es/tools/case-converter/about",
      viewport: { height: 768, width: 1024 }
    })).toEqual([
      expect.objectContaining({
        horizontalOffenders: [
          expect.objectContaining({ right: 1080, selector: "section.panel.tool-detail-overview-panel" })
        ],
        kind: "page-horizontal-overflow"
      })
    ]);
  });

  it("reports a desktop header search position or width that drifts from the shared contract", () => {
    expect(createHeaderGeometryFindings({
      header: {
        command: { left: 232, width: 280 },
        topbar: { left: 0, width: 1280 }
      },
      url: "http://localhost:9088/es/workflows/mcp-tool-launch",
      viewport: { id: "desktop", height: 720, width: 1280 }
    })).toEqual([
      expect.objectContaining({
        actual: { left: 232, width: 280 },
        expected: { left: 262, minWidth: 320 },
        kind: "header-search-geometry-drift"
      })
    ]);
  });

  it("accepts any fluid width at or above the desktop minimum", () => {
    for (const width of [320, 410, 560]) {
      expect(createHeaderGeometryFindings({
        header: {
          command: { left: 262, width },
          topbar: { left: 0, width: 1280 }
        },
        url: "http://localhost:9088/en/workflows/mcp-tool-launch",
        viewport: { id: "desktop", height: 720, width: 1280 }
      })).toEqual([]);
    }
  });

  it("enforces shared header geometry at every audited responsive breakpoint", () => {
    expect(layoutGateViewports.map((viewport) => viewport.id)).toEqual([
      "desktop-wide",
      "desktop",
      "tablet",
      "mobile"
    ]);

    for (const viewport of layoutGateViewports) {
      const expected = headerSearchLayoutContracts[viewport.id];
      const command = { left: expected.left, width: expected.width ?? expected.minWidth };
      expect(createHeaderGeometryFindings({
        header: { command, topbar: { left: 0, width: viewport.width } },
        url: "http://localhost:9088/zh-hant/workflows/mcp-tool-launch",
        viewport
      })).toEqual([]);
    }
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
