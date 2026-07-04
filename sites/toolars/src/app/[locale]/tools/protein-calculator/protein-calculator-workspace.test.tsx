import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
import { ProteinCalculatorWorkspace } from "./protein-calculator-workspace";

const copiedValueAllowlist = new Set(["AI", "API", "Beta", "CSV", "Free", "Google", "JSON", "LLM", "MCP", "PDF", "Pro", "Team", "Toolars", "URL"]);

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

function scanAuditCandidates(source: string) {
  const hardcodedText: string[] = [];
  const absoluteHrefs: string[] = [];
  const attributePattern = /\b(aria-label|placeholder|title|alt)=["']([^"']+)["']/g;
  const textNodePattern = />\s*([^<>{}][^<>{}]*?)\s*</g;
  const hrefPattern = /\bhref=["'](\/(?!\/|#)[^"']*)["']/g;

  for (const match of source.matchAll(attributePattern)) {
    const text = normalizeText(match[2]);
    if (isLikelyHardcodedEnglish(text)) hardcodedText.push(text);
  }

  for (const match of source.matchAll(textNodePattern)) {
    const text = normalizeText(match[1]);
    if (isLikelyHardcodedEnglish(text)) hardcodedText.push(text);
  }

  for (const match of source.matchAll(hrefPattern)) {
    absoluteHrefs.push(match[1]);
  }

  return { hardcodedText, absoluteHrefs };
}

function isLikelyHardcodedEnglish(text: string) {
  if (!text || text.length < 3) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (/^[A-Z0-9 /&+-]{2,8}$/.test(text)) return false;
  if (/^[{}()[\].,:;'"`]+$/.test(text)) return false;
  if (copiedValueAllowlist.has(text)) return false;

  return true;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

describe("ProteinCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc protein workspace sections", () => {
    renderWithIntl(<ProteinCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Protein Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Nutrition inputs")).toBeInTheDocument();
    expect(screen.getByText("Protein result")).toBeInTheDocument();
    expect(screen.getByText("Nutrition notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("70")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/protein-calculator/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<ProteinCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de proteínas" })).toBeInTheDocument();
    expect(screen.getByText("Datos de nutrición")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calcular proteína" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/protein-calculator/about"
    );
    expect(screen.queryByText("Nutrition inputs")).not.toBeInTheDocument();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const source = readFileSync(
      path.join(process.cwd(), "src/app/[locale]/tools/protein-calculator/protein-calculator-workspace.tsx"),
      "utf8"
    );

    expect(scanAuditCandidates(source)).toEqual({
      hardcodedText: [],
      absoluteHrefs: []
    });
  });

  it("calculates daily protein needs and saves the plan locally", () => {
    renderWithIntl(<ProteinCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate protein" }));

    expect(screen.getByText("112 g")).toBeInTheDocument();
    expect(screen.getByText("37 g")).toBeInTheDocument();
    expect(screen.getByText("19 eggs")).toBeInTheDocument();
    expect(screen.getByText("362 g")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save protein plan" }));

    expect(window.localStorage.getItem("toolars.protein-calculator.plan")).toContain("70");
  });
});
