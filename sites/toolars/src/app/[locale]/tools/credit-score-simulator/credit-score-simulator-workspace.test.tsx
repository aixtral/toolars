import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
import { CreditScoreSimulatorWorkspace } from "./credit-score-simulator-workspace";

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

describe("CreditScoreSimulatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc credit score simulator workspace sections", () => {
    renderWithIntl(<CreditScoreSimulatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Credit Score Simulator" })).toBeInTheDocument();
    expect(screen.getByText("Credit scenario inputs")).toBeInTheDocument();
    expect(screen.getByText("Score simulation")).toBeInTheDocument();
    expect(screen.getByText("Credit model notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Current credit score")).toHaveValue(680);
    expect(screen.getByLabelText("Simulated action")).toHaveValue("payoff");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/credit-score-simulator/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<CreditScoreSimulatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Simulador de puntuación de crédito" })).toBeInTheDocument();
    expect(screen.getByText("Entradas del escenario de crédito")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Simular cambio de puntuación" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/credit-score-simulator/about"
    );
    expect(screen.queryByText("Credit scenario inputs")).not.toBeInTheDocument();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const source = readFileSync(
      path.join(
        process.cwd(),
        "src/app/[locale]/tools/credit-score-simulator/credit-score-simulator-workspace.tsx"
      ),
      "utf8"
    );

    expect(scanAuditCandidates(source)).toEqual({
      hardcodedText: [],
      absoluteHrefs: []
    });
  });

  it("simulates the default score change and saves assumptions locally", () => {
    renderWithIntl(<CreditScoreSimulatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Simulate score change" }));

    expect(screen.getByText("720")).toBeInTheDocument();
    expect(screen.getByText("+40")).toBeInTheDocument();
    expect(screen.getByText("0.0%")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save score scenario" }));

    expect(window.localStorage.getItem("toolars.credit-score-simulator.plan")).toContain("680");
  });
});
