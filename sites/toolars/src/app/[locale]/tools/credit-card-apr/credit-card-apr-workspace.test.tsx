import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CreditCardAprWorkspace } from "./credit-card-apr-workspace";

const creditCardAprSourceFile = "src/app/[locale]/tools/credit-card-apr/credit-card-apr-workspace.tsx";

function scanCreditCardAprWorkspaceSource() {
  return scanSourceText(readFileSync(creditCardAprSourceFile, "utf8"), creditCardAprSourceFile);
}

describe("CreditCardAprWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCreditCardAprWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc credit card APR workspace sections", () => {
    renderWithIntl(<CreditCardAprWorkspace />);

    expect(screen.getByRole("heading", { name: "Credit Card APR Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Installment inputs")).toBeInTheDocument();
    expect(screen.getByText("True APR summary")).toBeInTheDocument();
    expect(screen.getByText("Credit cost notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Installment amount")).toHaveValue(10000);
    expect(screen.getByLabelText("Number of payments")).toHaveValue("12");
    expect(screen.getByLabelText("Monthly fee rate")).toHaveValue(0.6);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/credit-card-apr/about"
    );
  });

  it("calculates the default true APR and saves assumptions locally", () => {
    renderWithIntl(<CreditCardAprWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Reveal true APR" }));

    expect(screen.getByText("13.03%")).toBeInTheDocument();
    expect(screen.getByText("7.20%")).toBeInTheDocument();
    expect(screen.getByText("$720")).toBeInTheDocument();
    expect(screen.getByText("$10,720")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save APR plan" }));

    expect(window.localStorage.getItem("toolars.credit-card-apr.plan")).toContain("10000");
  });

  it("renders Spanish workspace copy and localized details link", () => {
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <CreditCardAprWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Calculadora de TAE de tarjeta de crédito" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Revelar TAE real" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/credit-card-apr/about"
    );
  });
});
