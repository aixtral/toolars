import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { MacroCalculatorWorkspace } from "./macro-calculator-workspace";

const macroCalculatorSourceFile = "src/app/[locale]/tools/macro-calculator/macro-calculator-workspace.tsx";

function scanMacroCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(macroCalculatorSourceFile, "utf8"), macroCalculatorSourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("MacroCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanMacroCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc macro workspace sections", () => {
    renderWithIntl(<MacroCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Macro Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Macro inputs")).toBeInTheDocument();
    expect(screen.getByText("Macro result")).toBeInTheDocument();
    expect(screen.getByText("Macro notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2200")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/macro-calculator/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<MacroCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de macros" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de macros")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute("href", "/es/tools/macro-calculator/about");
    expect(screen.queryByText("Macro inputs")).not.toBeInTheDocument();
  });

  it("calculates macro grams and saves the split locally", () => {
    renderWithIntl(<MacroCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate macros" }));

    expect(screen.getByText("165 g")).toBeInTheDocument();
    expect(screen.getByText("220 g")).toBeInTheDocument();
    expect(screen.getByText("73 g")).toBeInTheDocument();
    expect(screen.getByText("30% protein / 40% carbs / 30% fat")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save macro split" }));

    expect(window.localStorage.getItem("toolars.macro-calculator.split")).toContain("2200");
  });
});
