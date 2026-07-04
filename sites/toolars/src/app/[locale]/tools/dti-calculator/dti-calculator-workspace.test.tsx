import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { DtiCalculatorWorkspace } from "./dti-calculator-workspace";

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

const dtiCalculatorSourceFile = "src/app/[locale]/tools/dti-calculator/dti-calculator-workspace.tsx";

function scanDtiCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(dtiCalculatorSourceFile, "utf8"), dtiCalculatorSourceFile);
}

describe("DtiCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanDtiCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc DTI workspace sections", () => {
    renderWithIntl(<DtiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Debt-to-Income Calculator" })).toBeInTheDocument();
    expect(screen.getByText("DTI inputs")).toBeInTheDocument();
    expect(screen.getByText("DTI summary")).toBeInTheDocument();
    expect(screen.getByText("DTI notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("8000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("800")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/dti-calculator/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<DtiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de relación deuda-ingresos" })).toBeInTheDocument();
    expect(screen.getByText("Entradas DTI")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/dti-calculator/about"
    );
    expect(screen.queryByText("DTI inputs")).not.toBeInTheDocument();
  });

  it("calculates the default DTI ratios and saves assumptions locally", () => {
    renderWithIntl(<DtiCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate DTI" }));

    expect(screen.getByText("47.5%")).toBeInTheDocument();
    expect(screen.getByText("37.5%")).toBeInTheDocument();
    expect(screen.getByText("$3,800")).toBeInTheDocument();
    expect(screen.getByText("$4,200")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save DTI plan" }));

    expect(window.localStorage.getItem("toolars.dti-calculator.plan")).toContain("8000");
  });
});
