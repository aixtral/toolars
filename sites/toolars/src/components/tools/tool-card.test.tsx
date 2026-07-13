import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../scripts/audit-i18n.mjs";
import es from "../../../messages/es.json";
import { tools, type ToolDefinition } from "../../data/registry";
import { getToolCardTopicTags, ToolCard } from "./tool-card";

const toolCardSourceFile = "src/components/tools/tool-card.tsx";
const localizedTool: ToolDefinition = {
  slug: "json-repair",
  name: "JSON Repair",
  description: "Repair JSON",
  category: "developer",
  group: "Toolars",
  type: "ai",
  processing: ["cloud", "ai-consent"],
  pricing: "freemium",
  tags: ["JSON", "AI"],
  source: "toolars",
  accent: "#2563eb",
  status: "ready",
  visibility: "public",
  launchCertified: true,
  featured: true,
  href: "/tools/json-repair",
  aboutHref: "/tools/json-repair/about"
};

function scanToolCardSource() {
  return scanSourceText(readFileSync(toolCardSourceFile, "utf8"), toolCardSourceFile);
}

describe("ToolCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps the tool card source free of hardcoded UI scanner candidates", () => {
    const scan = scanToolCardSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("localizes visible tool labels from shared message keys", () => {
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <ToolCard tool={localizedTool} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Con IA")).toBeInTheDocument();
    expect(screen.getByText("Nube")).toBeInTheDocument();
    expect(screen.getByText("Consentimiento de IA")).toBeInTheDocument();
    expect(screen.getByText("Prueba gratis")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Abrir/i })).toHaveAttribute("href", "/tools/json-repair");
    expect(screen.queryByText("AI-powered")).not.toBeInTheDocument();
    expect(screen.queryByText("Cloud")).not.toBeInTheDocument();
    expect(screen.queryByText("Free trial")).not.toBeInTheDocument();
  });

  it("removes pricing, type, processing, and duplicate topic tags across the registry", () => {
    const taggedTool: ToolDefinition = {
      ...localizedTool,
      tags: ["AI", "Freemium", "JSON", "json", "Local-first"]
    };

    expect(getToolCardTopicTags(taggedTool)).toEqual(["JSON"]);

    for (const tool of tools) {
      const tags = getToolCardTopicTags(tool);
      expect(new Set(tags.map((tag) => tag.toLowerCase())).size, tool.slug).toBe(tags.length);
      expect(tags.map((tag) => tag.toLowerCase()), tool.slug).not.toEqual(
        expect.arrayContaining([
          "free",
          "freemium",
          "paid",
          "ai",
          "ai-powered",
          "traditional",
          "workflow",
          "local",
          "cloud",
          "ai-consent"
        ])
      );
    }
  });
});
