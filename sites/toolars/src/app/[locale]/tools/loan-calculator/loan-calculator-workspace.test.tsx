import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { LoanCalculatorWorkspace } from "./loan-calculator-workspace";

const loanCalculatorSourceFile = "src/app/[locale]/tools/loan-calculator/loan-calculator-workspace.tsx";

function scanLoanCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(loanCalculatorSourceFile, "utf8"), loanCalculatorSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "Espacio préstamo centinela",
  title: "Calculadora de préstamo centinela",
  subtitle: "Pago y coste total centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    loan: "Préstamo centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Supuestos centinela locales."
    },
    apr: {
      label: "APR centinela",
      text: "Compara tasas centinela."
    },
    export: {
      label: "Exportar centinela",
      text: "Guarda supuestos centinela."
    }
  },
  inputSection: {
    title: "Condiciones de préstamo centinela",
    description: "Ajusta monto, tasa y plazo centinela."
  },
  fields: {
    principal: "Monto centinela",
    annualInterestRate: "APR centinela",
    termYears: "Años centinela"
  },
  actions: {
    save: "Guardar supuestos centinela",
    calculate: "Calcular préstamo centinela",
    exportPlan: "Exportar plan centinela"
  },
  resultSection: {
    title: "Resumen de pago centinela",
    emptyDescription: "Ejecuta cálculo centinela.",
    summary: "{payments} pagos centinela de {amount} durante {years} años"
  },
  metrics: {
    monthlyPayment: "Pago mensual centinela",
    totalInterest: "Interés total centinela",
    totalRepayment: "Reembolso total centinela",
    payments: "Pagos centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela.",
    calculatedDescription: "Año 1 capital {principal} + interés {interest} centinela"
  },
  recommendations: {
    highApr: "Compara APR centinela",
    longTerm: "Revisa plazo largo centinela",
    reviewApr: "Revisa APR y cargos centinela"
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de amortización centinela",
    notes: {
      formula: "Fórmula centinela.",
      interest: "Interés centinela.",
      payoff: "Pago anticipado centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Sin perfil de crédito centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "loan-calculator": {
      ...en.tools["loan-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <LoanCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("LoanCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanLoanCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.principal)).toHaveValue(25000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/loan-calculator/about"
    );

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getByText("60 pagos centinela de $501 durante 5 años")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendations.reviewApr)).toBeInTheDocument();
    expect(screen.getByText("Año 1 capital $4,282 + interés $1,730 centinela")).toBeInTheDocument();
  });

  it("renders the local VitalCalc loan workspace sections", () => {
    renderWithIntl(<LoanCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Loan Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Loan terms")).toBeInTheDocument();
    expect(screen.getByText("Payment summary")).toBeInTheDocument();
    expect(screen.getByText("Amortization notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7.5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/loan-calculator/about"
    );
  });

  it("calculates the default loan payment and saves assumptions locally", () => {
    renderWithIntl(<LoanCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate loan" }));

    expect(screen.getByText("$501")).toBeInTheDocument();
    expect(screen.getByText("$5,057")).toBeInTheDocument();
    expect(screen.getByText("$30,057")).toBeInTheDocument();
    expect(screen.getByText("Year 1 principal $4,282 + interest $1,730")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Loan amount"), {
      target: { value: "30000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save assumptions" }));

    expect(window.localStorage.getItem("toolars.loan-calculator.scenario")).toContain("30000");
  });
});
