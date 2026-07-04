import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { CityCostComparisonWorkspace } from "./city-cost-comparison-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio de mudanza centinela",
  title: "Comparador de ciudades centinela",
  subtitle: "Compara excedente mensual centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    compare: "Comparar centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Ingresos y costes centinela quedan en este navegador."
    },
    scenario: {
      label: "Escenario centinela",
      text: "La mudanza centinela depende de supuestos."
    },
    private: {
      label: "Privado centinela",
      text: "La comparación centinela se guarda localmente."
    }
  },
  inputSection: {
    title: "Supuestos de ciudad centinela",
    description: "Usa ingresos y costes comparables centinela."
  },
  fields: {
    monthlyIncome: "Ingreso mensual centinela",
    cityARent: "Renta ciudad A centinela",
    cityAFood: "Comida ciudad A centinela",
    cityATransport: "Transporte ciudad A centinela",
    cityAOther: "Otros ciudad A centinela",
    cityBRent: "Renta ciudad B centinela",
    cityBFood: "Comida ciudad B centinela",
    cityBTransport: "Transporte ciudad B centinela",
    cityBOther: "Otros ciudad B centinela"
  },
  actions: {
    save: "Guardar ciudades centinela",
    calculate: "Comparar ciudades centinela"
  },
  resultSection: {
    title: "Resumen de mudanza centinela",
    emptyDescription: "Ejecuta la comparación centinela."
  },
  metrics: {
    cityASurplus: "Excedente ciudad A centinela",
    cityBSurplus: "Excedente ciudad B centinela",
    annualDifference: "Diferencia anual centinela",
    netMonthlyIncome: "Ingreso neto centinela"
  },
  callout: {
    waitingTitle: "Esperando comparación centinela",
    waitingDescription: "Compara primero el excedente centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de mudanza centinela",
    notes: {
      tax: "Nota centinela de impuestos.",
      costs: "Nota centinela de costes.",
      quality: "Nota centinela de calidad de vida."
    }
  },
  caveat: {
    title: "Advertencia de escenario centinela",
    body: "Valida ofertas y alquileres centinela antes de mudarte."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "city-cost-comparison": {
      ...en.tools["city-cost-comparison"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <CityCostComparisonWorkspace />
    </NextIntlClientProvider>
  );
}

describe("CityCostComparisonWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.monthlyIncome)).toHaveValue(8000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/city-cost-comparison/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc city cost workspace sections", () => {
    renderWithIntl(<CityCostComparisonWorkspace />);

    expect(screen.getByRole("heading", { name: "City Cost Comparison" })).toBeInTheDocument();
    expect(screen.getByText("City assumptions")).toBeInTheDocument();
    expect(screen.getByText("Relocation summary")).toBeInTheDocument();
    expect(screen.getByText("Relocation notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly pre-tax income")).toHaveValue(8000);
    expect(screen.getByLabelText("City A rent")).toHaveValue(2500);
    expect(screen.getByLabelText("City B rent")).toHaveValue(1200);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/city-cost-comparison/about"
    );
  });

  it("calculates the default relocation comparison and saves assumptions locally", () => {
    renderWithIntl(<CityCostComparisonWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Compare cities" }));

    expect(screen.getByText("$2,461")).toBeInTheDocument();
    expect(screen.getByText("$4,261")).toBeInTheDocument();
    expect(screen.getByText("$21,600")).toBeInTheDocument();
    expect(screen.getByText("City B saves more")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save city comparison" }));

    expect(window.localStorage.getItem("toolars.city-cost-comparison.plan")).toContain("2500");
  });
});
