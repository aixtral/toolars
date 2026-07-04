import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { RetirementCalculatorWorkspace } from "./retirement-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio jubilación centinela",
  title: "Calculadora jubilación centinela",
  subtitle: "Objetivo y brecha centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    rule: "Regla centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Edad, ahorro y retorno centinela quedan en este navegador."
    },
    reference: {
      label: "Referencia centinela",
      text: "La regla centinela es una heurística simplificada."
    },
    private: {
      label: "Privado centinela",
      text: "Guardar solo conserva el plan centinela localmente."
    }
  },
  inputSection: {
    title: "Entradas jubilación centinela",
    description: "Ajusta edad, ahorro, aportes, retorno y gastos centinela."
  },
  fields: {
    currentAge: "Edad actual centinela",
    retirementAge: "Edad jubilación centinela",
    currentSavings: "Ahorro actual centinela",
    monthlyContribution: "Aporte mensual centinela",
    annualReturnRate: "Retorno anual centinela",
    monthlyRetirementExpenses: "Gastos jubilación centinela"
  },
  actions: {
    save: "Guardar plan centinela",
    calculate: "Calcular jubilación centinela"
  },
  resultSection: {
    title: "Panorama jubilación centinela",
    emptyDescription: "Ejecuta el cálculo centinela.",
    zeroAmount: "$0 centinela",
    zeroYears: "0 centinela"
  },
  metrics: {
    nestEggNeeded: "Meta necesaria centinela",
    projectedSavings: "Ahorro proyectado centinela",
    gapOrSurplus: "Brecha superávit centinela",
    yearsToRetirement: "Años hasta jubilación centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero la proyección centinela.",
    calculatedDescription: "Revisa inflación, comisiones e impuestos centinela.",
    firstYearTemplate: "Año 1 centinela {balance} con {contributions} aportados"
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas jubilación centinela",
    notes: {
      target: "Nota centinela de objetivo.",
      compounding: "Nota centinela de capitalización.",
      risks: "Nota centinela de riesgos."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "No se requiere cuenta de corretaje centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "retirement-calculator": {
      ...en.tools["retirement-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <RetirementCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("RetirementCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.currentAge)).toHaveValue(35);
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/retirement-calculator/about"
    );
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc retirement workspace sections", () => {
    renderWithIntl(<RetirementCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Retirement Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Retirement inputs")).toBeInTheDocument();
    expect(screen.getByText("Retirement outlook")).toBeInTheDocument();
    expect(screen.getByText("Retirement notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("35")).toBeInTheDocument();
    expect(screen.getByDisplayValue("65")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/retirement-calculator/about"
    );
  });

  it("calculates the default retirement projection and saves assumptions locally", () => {
    renderWithIntl(<RetirementCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate retirement" }));

    expect(screen.getByText("$1,200,000")).toBeInTheDocument();
    expect(screen.getByText("$1,625,796")).toBeInTheDocument();
    expect(screen.getByText("+$425,796")).toBeInTheDocument();
    expect(screen.getByText("Year 1 balance $66,007 with $62,000 contributed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save retirement plan" }));

    expect(window.localStorage.getItem("toolars.retirement-calculator.plan")).toContain("35");
  });
});
