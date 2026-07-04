import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { CreatineCalculatorWorkspace } from "./creatine-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio suplemento centinela",
  title: "Calculadora de creatina centinela",
  subtitle: "Dosis centinela de mantenimiento.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    reference: "Referencia centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Peso centinela local."
    },
    supplement: {
      label: "Suplemento centinela",
      text: "Contexto clínico centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Plan centinela local."
    }
  },
  inputSection: {
    title: "Entradas suplemento centinela",
    description: "Contexto de dosis centinela."
  },
  fields: {
    weight: "Peso centinela",
    unit: "Unidad centinela",
    kg: "Kilogramos centinela",
    lb: "Libras centinela",
    trainingIntensity: "Entrenamiento centinela",
    trainingOptions: {
      standard: "Ligero centinela",
      moderate: "Fuerza centinela",
      intense: "Competitivo centinela"
    },
    vegetarian: "Contexto vegetariano centinela",
    loading: "Carga centinela"
  },
  actions: {
    save: "Guardar suplemento centinela",
    calculate: "Calcular creatina centinela"
  },
  resultSection: {
    title: "Resultado creatina centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    maintenance: "Mantenimiento centinela",
    sourceRange: "Rango centinela",
    loadingPhase: "Carga centinela",
    notEnabled: "No habilitado centinela",
    extraWater: "Agua centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas suplemento centinela",
    notes: {
      maintenance: "Nota centinela de mantenimiento.",
      training: "Nota centinela de entrenamiento.",
      loading: "Nota centinela de carga."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Consulta clínica centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "creatine-calculator": {
      ...en.tools["creatine-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <CreatineCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("CreatineCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.weight)).toHaveValue(70);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/creatine-calculator/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc creatine workspace sections", () => {
    renderWithIntl(<CreatineCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Creatine Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Supplement inputs")).toBeInTheDocument();
    expect(screen.getByText("Creatine result")).toBeInTheDocument();
    expect(screen.getByText("Supplement notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/creatine-calculator/about");
  });

  it("calculates the default maintenance dose and saves the plan locally", () => {
    renderWithIntl(<CreatineCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate creatine dose" }));

    expect(screen.getByText("3 g")).toBeInTheDocument();
    expect(screen.getByText("700 ml")).toBeInTheDocument();
    expect(screen.getByText("3-5 g/day")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save supplement plan" }));

    expect(window.localStorage.getItem("toolars.creatine-calculator.plan:v1")).toContain("moderate");
  });
});
