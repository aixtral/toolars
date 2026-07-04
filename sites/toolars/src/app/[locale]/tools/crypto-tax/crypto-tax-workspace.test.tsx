import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CryptoTaxWorkspace } from "./crypto-tax-workspace";

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

const cryptoTaxSourceFile = "src/app/[locale]/tools/crypto-tax/crypto-tax-workspace.tsx";

function scanCryptoTaxWorkspaceSource() {
  return scanSourceText(readFileSync(cryptoTaxSourceFile, "utf8"), cryptoTaxSourceFile);
}

describe("CryptoTaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCryptoTaxWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<CryptoTaxWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de impuestos cripto" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de transacciones")).toBeInTheDocument();
    expect(screen.getByText("Resumen de PnL")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/crypto-tax/about"
    );
    expect(screen.queryByText("Transaction inputs")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Calcular PnL cripto" }));

    expect(screen.getAllByText("0.3000 vendido contra 0.7500 comprado")).toHaveLength(2);
  });

  it("renders the local VitalCalc crypto tax workspace sections", () => {
    renderWithIntl(<CryptoTaxWorkspace />);

    expect(screen.getByRole("heading", { name: "Crypto Tax Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Transaction inputs")).toBeInTheDocument();
    expect(screen.getByText("PnL summary")).toBeInTheDocument();
    expect(screen.getByText("Crypto tax notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Buy 1 price")).toHaveValue(30000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/crypto-tax/about");
  });

  it("calculates the default PnL and saves transactions locally", () => {
    renderWithIntl(<CryptoTaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate crypto PnL" }));

    expect(screen.getByText("$33,333.33")).toBeInTheDocument();
    expect(screen.getByText("$8,000.00")).toBeInTheDocument();
    expect(screen.getByText("$7,500.00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save transactions" }));

    expect(window.localStorage.getItem("toolars.crypto-tax.transactions:v1")).toContain("30000");
  });
});
