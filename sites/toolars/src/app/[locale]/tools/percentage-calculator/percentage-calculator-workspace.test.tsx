import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { PercentageCalculatorWorkspace } from "./percentage-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio porcentual centinela",
  title: "Calculadora de porcentaje centinela",
  subtitle: "Contexto centinela para porcentajes.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    percent: "Porcentaje centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Las entradas porcentuales centinela quedan en este navegador."
    },
    context: {
      label: "Contexto centinela",
      text: "Etiqueta el denominador centinela."
    },
    private: {
      label: "Privado centinela",
      text: "El escenario centinela se guarda localmente."
    }
  },
  inputSection: {
    title: "Entradas porcentuales centinela",
    description: "Elige modo centinela y valores."
  },
  fields: {
    mode: "Modo de cálculo centinela",
    percent: "Porcentaje centinela",
    baseValue: "Valor base centinela",
    partValue: "Parte centinela",
    wholeValue: "Total centinela",
    fromValue: "Valor inicial centinela",
    toValue: "Valor final centinela"
  },
  options: {
    percentOf: "Porcentaje de centinela",
    ratio: "Ratio centinela",
    change: "Cambio centinela"
  },
  actions: {
    save: "Guardar porcentaje centinela",
    calculate: "Calcular porcentaje centinela"
  },
  resultSection: {
    title: "Resumen porcentual centinela",
    emptyDescription: "Ejecuta el cálculo centinela."
  },
  metrics: {
    result: "Resultado centinela",
    mode: "Modo centinela",
    direction: "Dirección centinela",
    denominator: "Denominador centinela",
    checked: "Revisado centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero el denominador centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de denominador centinela",
    notes: {
      percentOf: "Nota centinela de porcentaje.",
      ratio: "Nota centinela de ratio.",
      change: "Nota centinela de cambio."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "El cálculo porcentual centinela permanece local."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "percentage-calculator": {
      ...en.tools["percentage-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <PercentageCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("PercentageCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.percent)).toHaveValue(20);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc percentage workspace sections", () => {
    renderWithIntl(<PercentageCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Percentage Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Percentage inputs")).toBeInTheDocument();
    expect(screen.getByText("Percentage summary")).toBeInTheDocument();
    expect(screen.getByText("Denominator notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Calculation mode")).toHaveValue("percentOf");
    expect(screen.getByLabelText("Percent")).toHaveValue(20);
    expect(screen.getByLabelText("Base value")).toHaveValue(150);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/percentage-calculator/about"
    );
  });

  it("calculates the default percent-of value and saves assumptions locally", () => {
    renderWithIntl(<PercentageCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate percentage" }));

    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getAllByText("20% of 150").length).toBeGreaterThan(0);
    expect(screen.getByText("20 / 100 x 150")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save percentage" }));

    expect(window.localStorage.getItem("toolars.percentage-calculator.plan")).toContain("percentOf");
  });
});
