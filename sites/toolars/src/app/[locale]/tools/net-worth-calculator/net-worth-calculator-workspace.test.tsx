import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { NetWorthCalculatorWorkspace } from "./net-worth-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio financiero centinela",
  title: "Calculadora de patrimonio centinela",
  subtitle: "Resumen centinela de activos y deudas.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    debtFocus: "Deuda centinela",
    snapshot: "Instantánea centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Los activos centinela permanecen en este navegador."
    },
    reference: {
      label: "Referencia centinela",
      text: "El patrimonio centinela se revisa con el tiempo."
    },
    private: {
      label: "Privado centinela",
      text: "El guardado centinela solo queda localmente."
    }
  },
  inputSection: {
    title: "Entradas de activos centinela",
    description: "Introduce activos y pasivos centinela."
  },
  fields: {
    homeValue: "Valor de vivienda centinela",
    investments: "Inversiones centinela",
    cashSavings: "Ahorros centinela",
    vehicleValue: "Vehículo centinela",
    otherAssets: "Otros activos centinela",
    mortgageBalance: "Hipoteca centinela",
    carLoanBalance: "Préstamo auto centinela",
    creditCardDebt: "Tarjeta centinela",
    studentLoanBalance: "Préstamo estudiantil centinela",
    otherDebts: "Otras deudas centinela"
  },
  actions: {
    save: "Guardar patrimonio centinela",
    calculate: "Calcular patrimonio centinela"
  },
  resultSection: {
    title: "Resumen de patrimonio centinela",
    emptyDescription: "Ejecuta el cálculo centinela."
  },
  metrics: {
    netWorth: "Patrimonio centinela",
    totalAssets: "Activos centinela",
    totalLiabilities: "Pasivos centinela",
    debtRatio: "Ratio deuda centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero el mensaje centinela.",
    debtRatio: "Ratio deuda centinela {ratio}%"
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de patrimonio centinela",
    notes: {
      definition: "Nota centinela de definición.",
      trend: "Nota centinela de tendencia.",
      negative: "Nota centinela de deuda."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "No se requieren datos bancarios centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "net-worth-calculator": {
      ...en.tools["net-worth-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <NetWorthCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("NetWorthCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.homeValue)).toHaveValue(400000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/net-worth-calculator/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc net worth workspace sections", () => {
    renderWithIntl(<NetWorthCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Net Worth Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Asset inputs")).toBeInTheDocument();
    expect(screen.getByText("Net worth summary")).toBeInTheDocument();
    expect(screen.getByText("Net worth notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("400000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("280000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/net-worth-calculator/about"
    );
  });

  it("calculates the default net worth and saves assumptions locally", () => {
    renderWithIntl(<NetWorthCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate net worth" }));

    expect(screen.getByText("$215,000")).toBeInTheDocument();
    expect(screen.getByText("$535,000")).toBeInTheDocument();
    expect(screen.getByText("$320,000")).toBeInTheDocument();
    expect(screen.getByText("Debt-to-asset ratio 59.8%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save snapshot" }));

    expect(window.localStorage.getItem("toolars.net-worth-calculator.snapshot")).toContain("400000");
  });
});
