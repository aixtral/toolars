import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { StepsToCaloriesWorkspace } from "./steps-to-calories-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio actividad centinela",
  title: "Calculadora pasos centinela",
  subtitle: "Estimacion centinela de calorias caminando.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    met: "MET centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Pasos centinela en este navegador."
    },
    activity: {
      label: "Actividad centinela",
      text: "Calorias centinela variables."
    },
    private: {
      label: "Privado centinela",
      text: "Guardado centinela local."
    }
  },
  inputSection: {
    title: "Entradas actividad centinela",
    description: "Introduce pasos centinela."
  },
  fields: {
    steps: "Pasos centinela",
    weightKg: "Peso centinela",
    heightCm: "Altura centinela",
    speed: "Velocidad centinela"
  },
  options: {
    speed: {
      slow: "Lento centinela",
      normal: "Normal centinela",
      fast: "Rapido centinela",
      "very-fast": "Trote centinela"
    }
  },
  actions: {
    save: "Guardar actividad centinela",
    calculate: "Calcular calorias centinela"
  },
  resultSection: {
    title: "Resultado quema centinela",
    emptyDescription: "Ejecuta calculo centinela."
  },
  metrics: {
    emptyCalories: "0 kcal",
    caloriesBurned: "Calorias centinela",
    emptyDistance: "0.00 km",
    distance: "Distancia centinela",
    emptyRiceEquivalent: "0.0 arroz centinela",
    equivalent: "Equivalente centinela",
    emptyStepsPerRice: "0 pasos",
    stepsPerRice: "Pasos por arroz centinela"
  },
  equivalents: {
    soda: "Refresco centinela",
    burger: "Hamburguesa centinela",
    tenThousandSteps: "10k pasos centinela"
  },
  callout: {
    waitingTitle: "Esperando calculo centinela",
    waitingDescription: "Calcula primero centinela.",
    calculatedDescription: "MET {met}, zancada {strideMeters} m"
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas actividad centinela",
    notes: {
      stride: "Nota zancada centinela.",
      met: "Nota MET centinela.",
      normalization: "Nota normalizacion centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Estimacion actividad centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "steps-to-calories": {
      ...en.tools["steps-to-calories"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <StepsToCaloriesWorkspace />
    </NextIntlClientProvider>
  );
}

describe("StepsToCaloriesWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.steps)).toHaveValue(8000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc steps to calories workspace sections", () => {
    renderWithIntl(<StepsToCaloriesWorkspace />);

    expect(screen.getByRole("heading", { name: "Steps to Calories Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Activity inputs")).toBeInTheDocument();
    expect(screen.getByText("Burn result")).toBeInTheDocument();
    expect(screen.getByText("Activity notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Steps today")).toHaveValue(8000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/steps-to-calories/about");
  });

  it("calculates calorie burn and saves the activity sample locally", () => {
    renderWithIntl(<StepsToCaloriesWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate burn" }));

    expect(screen.getByText("276 kcal")).toBeInTheDocument();
    expect(screen.getByText("5.63 km")).toBeInTheDocument();
    expect(screen.getByText("1.2 bowls rice")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save activity sample" }));

    expect(window.localStorage.getItem("toolars.steps-to-calories.activity:v1")).toContain("\"steps\":8000");
  });
});
