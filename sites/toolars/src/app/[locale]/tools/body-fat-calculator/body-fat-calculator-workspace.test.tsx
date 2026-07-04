import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { BodyFatCalculatorWorkspace } from "./body-fat-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio corporal centinela",
  title: "Calculadora de grasa centinela",
  subtitle: "Estimación centinela de composición corporal.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    reference: "Referencia centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Medidas centinela en este navegador."
    },
    reference: {
      label: "Referencia centinela",
      text: "Método centinela de referencia."
    },
    private: {
      label: "Privado centinela",
      text: "Guardado centinela local."
    }
  },
  inputSection: {
    title: "Medidas centinela",
    description: "Introduce medidas centinela."
  },
  fields: {
    sex: "Sexo centinela",
    male: "Masculino centinela",
    female: "Femenino centinela",
    weightKg: "Peso centinela",
    heightCm: "Altura centinela",
    neckCm: "Cuello centinela",
    waistCm: "Cintura centinela",
    hipCm: "Cadera centinela"
  },
  actions: {
    save: "Guardar medidas centinela",
    calculate: "Calcular grasa centinela"
  },
  resultSection: {
    title: "Composición centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    bodyFat: "Grasa centinela",
    pending: "Pendiente centinela",
    referenceCategory: "Categoría centinela",
    fatMass: "Masa grasa centinela",
    leanMass: "Masa magra centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela.",
    trendDescription: "Compara tendencias centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de medida centinela",
    notes: {
      consistency: "Nota centinela de consistencia.",
      sexFormula: "Nota centinela de fórmula.",
      variables: "Nota centinela de variables."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Sin diagnóstico clínico centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "body-fat-calculator": {
      ...en.tools["body-fat-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <BodyFatCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("BodyFatCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.weightKg)).toHaveValue(70);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc body fat workspace sections", () => {
    renderWithIntl(<BodyFatCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Body Fat Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Measurement inputs")).toBeInTheDocument();
    expect(screen.getByText("Body composition result")).toBeInTheDocument();
    expect(screen.getByText("Measurement notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("85")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/body-fat-calculator/about"
    );
  });

  it("calculates body fat percentage and saves measurements locally", () => {
    renderWithIntl(<BodyFatCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate body fat" }));

    expect(screen.getByText("16.9%")).toBeInTheDocument();
    expect(screen.getByText("Fitness")).toBeInTheDocument();
    expect(screen.getByText("11.9 kg")).toBeInTheDocument();
    expect(screen.getByText("58.1 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save measurements" }));

    expect(window.localStorage.getItem("toolars.body-fat-calculator.measurements")).toContain("85");
  });
});
