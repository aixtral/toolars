import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { DividendReinvestmentWorkspace } from "./dividend-reinvestment-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio DRIP centinela",
  title: "Calculadora reinversión centinela",
  subtitle: "Dividendos reinvertidos centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    drip: "DRIP centinela",
    projection: "Proyección centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "DRIP centinela local."
    },
    estimate: {
      label: "Estimación centinela",
      text: "Supuestos centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Plan centinela local."
    }
  },
  inputSection: {
    title: "Entradas DRIP centinela",
    description: "Inversión y rendimiento centinela."
  },
  fields: {
    initialInvestment: "Inversión inicial centinela",
    dividendYield: "Rendimiento dividendos centinela",
    stockGrowthRate: "Crecimiento acción centinela",
    holdingYears: "Años tenencia centinela",
    reinvestmentFrequency: "Frecuencia reinversión centinela",
    taxRate: "Tasa impuesto centinela"
  },
  actions: {
    save: "Guardar DRIP centinela",
    calculate: "Calcular DRIP centinela"
  },
  resultSection: {
    title: "Resumen DRIP centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    finalValue: "Valor final centinela",
    totalDividends: "Dividendos totales centinela",
    reinvestmentAdvantage: "Ventaja reinversión centinela",
    noReinvestValue: "Valor sin reinvertir centinela"
  },
  callout: {
    periods: "{periods} periodos centinela",
    waitingTitle: "Esperando cálculo centinela",
    resultDescription: "Compara reinversión centinela.",
    waitingDescription: "Calcula primero centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas dividendos centinela",
    notes: {
      compound: "Nota compuesto centinela.",
      comparison: "Nota comparación centinela.",
      variance: "Nota variación centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Estimación privada centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "dividend-reinvestment": {
      ...en.tools["dividend-reinvestment"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <DividendReinvestmentWorkspace />
    </NextIntlClientProvider>
  );
}

describe("DividendReinvestmentWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.initialInvestment)).toHaveValue(100000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc dividend reinvestment workspace sections", () => {
    renderWithIntl(<DividendReinvestmentWorkspace />);

    expect(screen.getByRole("heading", { name: "Dividend Reinvestment Calculator" })).toBeInTheDocument();
    expect(screen.getByText("DRIP inputs")).toBeInTheDocument();
    expect(screen.getByText("DRIP summary")).toBeInTheDocument();
    expect(screen.getByText("Dividend notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Initial investment")).toHaveValue(100000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/dividend-reinvestment/about");
  });

  it("calculates the default DRIP projection and saves assumptions locally", () => {
    renderWithIntl(<DividendReinvestmentWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate DRIP" }));

    expect(screen.getByText("$522,226")).toBeInTheDocument();
    expect(screen.getByText("$204,731")).toBeInTheDocument();
    expect(screen.getByText("+$140,980")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save DRIP plan" }));

    expect(window.localStorage.getItem("toolars.dividend-reinvestment.plan")).toContain("100000");
  });
});
