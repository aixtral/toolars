import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { IncomeTaxWorkspace } from "./income-tax-workspace";

const incomeTaxSourceFile = "src/app/[locale]/tools/income-tax/income-tax-workspace.tsx";

function scanIncomeTaxWorkspaceSource() {
  return scanSourceText(readFileSync(incomeTaxSourceFile, "utf8"), incomeTaxSourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("IncomeTaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanIncomeTaxWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc income tax workspace sections", () => {
    renderWithIntl(<IncomeTaxWorkspace />);

    expect(screen.getByRole("heading", { name: "Income Tax Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Income inputs")).toBeInTheDocument();
    expect(screen.getByText("Take-home summary")).toBeInTheDocument();
    expect(screen.getByText("Tax context notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly salary")).toHaveValue(5000);
    expect(screen.getByLabelText("Tax rate")).toHaveValue(20);
    expect(screen.getByLabelText("Monthly deduction")).toHaveValue(500);
    expect(screen.getByLabelText("Extra withheld")).toHaveValue(300);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/income-tax/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<IncomeTaxWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de impuesto sobre la renta" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de ingresos")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/income-tax/about"
    );
    expect(screen.queryByText("Income inputs")).not.toBeInTheDocument();
  });

  it("calculates the default take-home estimate and saves assumptions locally", () => {
    renderWithIntl(<IncomeTaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate take-home" }));

    expect(screen.getByText("$3,800")).toBeInTheDocument();
    expect(screen.getByText("$900")).toBeInTheDocument();
    expect(screen.getByText("$800")).toBeInTheDocument();
    expect(screen.getByText("$45,600")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save tax plan" }));

    expect(window.localStorage.getItem("toolars.income-tax.plan")).toContain("5000");
  });
});
