import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SipCalculatorWorkspace } from "./sip-calculator-workspace";

const sipCalculatorSourceFile = "src/app/[locale]/tools/sip-calculator/sip-calculator-workspace.tsx";

function scanSipCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(sipCalculatorSourceFile, "utf8"), sipCalculatorSourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("SipCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanSipCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc SIP workspace sections", () => {
    renderWithIntl(<SipCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Fund SIP Calculator" })).toBeInTheDocument();
    expect(screen.getByText("SIP inputs")).toBeInTheDocument();
    expect(screen.getByText("SIP summary")).toBeInTheDocument();
    expect(screen.getByText("SIP notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly investment")).toHaveValue(500);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/sip-calculator/about");
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<SipCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora SIP de fondos" })).toBeInTheDocument();
    expect(screen.getByText("Entradas SIP")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute("href", "/es/tools/sip-calculator/about");
    expect(screen.queryByText("SIP inputs")).not.toBeInTheDocument();
  });

  it("calculates the default SIP projection and saves assumptions locally", () => {
    renderWithIntl(<SipCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate SIP returns" }));

    expect(screen.getByText("$36,738")).toBeInTheDocument();
    expect(screen.getByText("$30,000")).toBeInTheDocument();
    expect(screen.getByText("22.5%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save SIP plan" }));

    expect(window.localStorage.getItem("toolars.sip-calculator.plan")).toContain("500");
  });
});
