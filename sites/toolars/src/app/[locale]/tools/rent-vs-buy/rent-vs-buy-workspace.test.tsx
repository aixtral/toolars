import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { RentVsBuyWorkspace } from "./rent-vs-buy-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Comparación vivienda centinela",
  title: "Calculadora alquilar o comprar centinela",
  subtitle: "Compara compra y alquiler centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    compare: "Comparar centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Los supuestos de vivienda centinela permanecen en este navegador."
    },
    scenario: {
      label: "Escenario centinela",
      text: "Los resultados centinela dependen de supuestos simplificados."
    },
    private: {
      label: "Privado centinela",
      text: "Guardar solo conserva el caso centinela localmente."
    }
  },
  inputSection: {
    title: "Entradas vivienda centinela",
    description: "Usa compra, alquiler, retorno y periodo centinela."
  },
  fields: {
    homePrice: "Precio vivienda centinela",
    downPaymentPercent: "Entrada centinela",
    mortgageRate: "Tasa hipotecaria centinela",
    annualHoldingCost: "Coste anual centinela",
    monthlyRent: "Alquiler mensual centinela",
    investmentReturn: "Retorno entrada centinela",
    years: "Periodo análisis centinela"
  },
  actions: {
    save: "Guardar caso centinela",
    calculate: "Comparar alquiler compra centinela"
  },
  resultSection: {
    title: "Resumen decisión centinela",
    emptyDescription: "Ejecuta la comparación centinela.",
    notCalculated: "Sin cálculo centinela",
    zeroAmount: "$0 centinela",
    zeroMonthlyAmount: "$0/mes centinela"
  },
  metrics: {
    recommendation: "Recomendación centinela",
    totalBuyingCost: "Coste compra centinela",
    totalRentingCost: "Coste alquiler centinela",
    monthlyMortgage: "Hipoteca mensual centinela"
  },
  callout: {
    waitingTitle: "Esperando comparación centinela",
    waitingDescription: "Compara primero el coste de oportunidad centinela.",
    calculatedDescription: "{difference} de brecha centinela durante {years} años."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas vivienda centinela",
    notes: {
      opportunity: "Nota centinela de oportunidad.",
      amortization: "Nota centinela de amortización.",
      localCosts: "Nota centinela de costes locales."
    }
  },
  caveat: {
    title: "Advertencia vivienda centinela",
    body: "Valida impuestos y liquidez centinela antes de decidir."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "rent-vs-buy": {
      ...en.tools["rent-vs-buy"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <RentVsBuyWorkspace />
    </NextIntlClientProvider>
  );
}

describe("RentVsBuyWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.homePrice)).toHaveValue(300000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc rent vs buy workspace sections", () => {
    renderWithIntl(<RentVsBuyWorkspace />);

    expect(screen.getByRole("heading", { name: "Rent vs Buy Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Housing comparison inputs")).toBeInTheDocument();
    expect(screen.getByText("Decision summary")).toBeInTheDocument();
    expect(screen.getByText("Housing notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Home price")).toHaveValue(300000);
    expect(screen.getByLabelText("Monthly rent")).toHaveValue(1500);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/rent-vs-buy/about"
    );
  });

  it("calculates the default rent vs buy comparison and saves assumptions locally", () => {
    renderWithIntl(<RentVsBuyWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Compare rent vs buy" }));

    expect(screen.getByText("Renting is better")).toBeInTheDocument();
    expect(screen.getByText("$408,479")).toBeInTheDocument();
    expect(screen.getByText("$222,000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save housing case" }));

    expect(window.localStorage.getItem("toolars.rent-vs-buy.plan")).toContain("300000");
  });
});
