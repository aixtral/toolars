import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
import { ApyCalculatorWorkspace } from "./apy-calculator-workspace";

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

function scanApyCalculatorWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/apy-calculator/apy-calculator-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("ApyCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanApyCalculatorWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<ApyCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de APY" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de APY")).toBeInTheDocument();
    expect(screen.getByText("Resumen de rendimiento")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/apy-calculator/about"
    );
    expect(screen.queryByText("APY inputs")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Calcular APY" }));

    expect(screen.getByText("APY de 5.12% a partir de un APR de 5.00% con 12 periodos de capitalización.")).toBeInTheDocument();
  });

  it("renders the local VitalCalc APY workspace sections", () => {
    renderWithIntl(<ApyCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "APY Calculator" })).toBeInTheDocument();
    expect(screen.getByText("APY inputs")).toBeInTheDocument();
    expect(screen.getByText("Yield summary")).toBeInTheDocument();
    expect(screen.getByText("APY notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/apy-calculator/about"
    );
  });

  it("calculates the default APY and saves assumptions locally", () => {
    renderWithIntl(<ApyCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate APY" }));

    expect(screen.getByText("5.12%")).toBeInTheDocument();
    expect(screen.getByText("5.00%")).toBeInTheDocument();
    expect(screen.getByText("$10,512")).toBeInTheDocument();
    expect(screen.getByText("$512")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save APY plan" }));

    expect(window.localStorage.getItem("toolars.apy-calculator.plan")).toContain("10000");
  });
});
