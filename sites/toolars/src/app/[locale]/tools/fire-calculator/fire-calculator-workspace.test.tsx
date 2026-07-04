import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { FireCalculatorWorkspace } from "./fire-calculator-workspace";

const fireCalculatorSourceFile = "src/app/[locale]/tools/fire-calculator/fire-calculator-workspace.tsx";

function scanFireCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(fireCalculatorSourceFile, "utf8"), fireCalculatorSourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("FireCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanFireCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc FIRE workspace sections", () => {
    renderWithIntl(<FireCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "FIRE Calculator" })).toBeInTheDocument();
    expect(screen.getByText("FIRE inputs")).toBeInTheDocument();
    expect(screen.getByText("FIRE summary")).toBeInTheDocument();
    expect(screen.getByText("No-advice notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Annual expenses")).toHaveValue(50000);
    expect(screen.getByLabelText("Annual income")).toHaveValue(100000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/fire-calculator/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<FireCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora FIRE" })).toBeInTheDocument();
    expect(screen.getByText("Entradas FIRE")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/fire-calculator/about"
    );
    expect(screen.queryByText("FIRE inputs")).not.toBeInTheDocument();
  });

  it("calculates the default FIRE estimate and saves assumptions locally", () => {
    renderWithIntl(<FireCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate FIRE" }));

    expect(screen.getByText("$1,250,000")).toBeInTheDocument();
    expect(screen.getByText("50.0%")).toBeInTheDocument();
    expect(screen.getByText("12 years")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save FIRE plan" }));

    expect(window.localStorage.getItem("toolars.fire-calculator.plan")).toContain("50000");
  });
});
