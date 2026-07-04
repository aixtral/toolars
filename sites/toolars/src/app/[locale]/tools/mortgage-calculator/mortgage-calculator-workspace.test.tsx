import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { MortgageCalculatorWorkspace } from "./mortgage-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio hipoteca centinela",
  title: "Calculadora hipoteca centinela",
  subtitle: "Pago hipotecario centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Entradas hipoteca centinela local."
    },
    free: {
      label: "Gratis centinela",
      text: "Matemática hipoteca centinela."
    },
    export: {
      label: "Exportar centinela",
      text: "Guardar supuestos centinela."
    }
  },
  inputSection: {
    title: "Entradas préstamo centinela",
    description: "Ajusta compra centinela."
  },
  fields: {
    homePrice: "Precio vivienda centinela",
    downPayment: "Pago inicial centinela",
    interestRate: "Interés centinela",
    loanTerm: "Plazo préstamo centinela",
    propertyTax: "Impuesto anual centinela",
    insurance: "Seguro mensual centinela"
  },
  actions: {
    save: "Guardar escenario centinela",
    calculate: "Calcular pago centinela",
    exportPlan: "Exportar plan centinela"
  },
  resultSection: {
    title: "Pago mensual centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    totalMonthlyPayment: "Pago mensual total centinela",
    totalInterest: "Interés total centinela",
    downPayment: "Inicial resultado centinela",
    loanToValue: "LTV centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela.",
    escrowDetail: "{principalAndInterest} principal centinela con {escrow} escrow centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas asequibilidad centinela",
    notes: {
      escrow: "Nota escrow centinela.",
      rates: "Nota tasas centinela.",
      saved: "Nota guardado centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Sin cuenta centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "mortgage-calculator": {
      ...en.tools["mortgage-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <MortgageCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("MortgageCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.homePrice)).toHaveValue(450000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/mortgage-calculator/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc mortgage workspace sections", () => {
    renderWithIntl(<MortgageCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Mortgage Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Loan inputs")).toBeInTheDocument();
    expect(screen.getByText("Monthly payment")).toBeInTheDocument();
    expect(screen.getByText("Affordability notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("450000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("90000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/mortgage-calculator/about"
    );
  });

  it("calculates the default monthly payment and interest summary", () => {
    renderWithIntl(<MortgageCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate payment" }));

    expect(screen.getByText("$2,875")).toBeInTheDocument();
    expect(screen.getByText("$459,160")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByText("Principal and interest $2,275 + escrow $600")).toBeInTheDocument();
    expect(screen.getByText("Strong down payment cushion")).toBeInTheDocument();
  });

  it("updates the scenario and saves it locally", () => {
    renderWithIntl(<MortgageCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Down payment"), {
      target: { value: "100000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save scenario" }));

    expect(screen.getByLabelText("Down payment")).toHaveValue(100000);
    expect(window.localStorage.getItem("toolars.mortgage-calculator.scenario")).toContain("100000");
  });
});
