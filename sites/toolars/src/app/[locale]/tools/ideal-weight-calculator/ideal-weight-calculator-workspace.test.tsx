import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import es from "../../../../../messages/es.json";
import { IdealWeightCalculatorWorkspace } from "./ideal-weight-calculator-workspace";

const idealWeightCalculatorSourceFile =
  "src/app/[locale]/tools/ideal-weight-calculator/ideal-weight-calculator-workspace.tsx";

function scanIdealWeightCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(idealWeightCalculatorSourceFile, "utf8"), idealWeightCalculatorSourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("IdealWeightCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanIdealWeightCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc ideal weight workspace sections", () => {
    renderWithIntl(<IdealWeightCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Ideal Weight Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Body inputs")).toBeInTheDocument();
    expect(screen.getByText("Ideal weight result")).toBeInTheDocument();
    expect(screen.getByText("Body reference notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Height (cm)")).toHaveValue(175);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/ideal-weight-calculator/about");
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<IdealWeightCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de peso ideal" })).toBeInTheDocument();
    expect(screen.getByText("Entradas corporales")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute("href", "/es/tools/ideal-weight-calculator/about");
    expect(screen.queryByText("Body inputs")).not.toBeInTheDocument();
  });

  it("calculates ideal weight and saves the body profile locally", () => {
    renderWithIntl(<IdealWeightCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate ideal weight" }));

    expect(screen.getByText("70.6 kg")).toBeInTheDocument();
    expect(screen.getByText("63.5 kg")).toBeInTheDocument();
    expect(screen.getByText("77.7 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save body profile" }));

    expect(window.localStorage.getItem("toolars.ideal-weight-calculator.profile:v1")).toContain("\"heightCm\":175");
  });
});
