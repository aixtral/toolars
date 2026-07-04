import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { BodyRecompositionWorkspace } from "./body-recomposition-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio corporal centinela",
  title: "Calculadora de recomposición centinela",
  subtitle: "Calorías y macros centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    recomp: "Recomp centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Los datos corporales centinela quedan en este navegador."
    },
    reference: {
      label: "Referencia centinela",
      text: "Los objetivos centinela son estimaciones."
    },
    private: {
      label: "Privado centinela",
      text: "El plan centinela se guarda localmente."
    }
  },
  inputSection: {
    title: "Entradas de recomposición centinela",
    description: "Ajusta actividad y objetivo centinela."
  },
  fields: {
    sex: "Sexo centinela",
    age: "Edad centinela",
    heightCm: "Altura centinela",
    weightKg: "Peso centinela",
    activityLevel: "Actividad centinela",
    goal: "Objetivo centinela"
  },
  options: {
    sex: {
      male: "Masculino centinela",
      female: "Femenino centinela"
    },
    activity: {
      sedentary: "Sedentario centinela",
      lightlyActive: "Ligero centinela",
      moderatelyActive: "Moderado centinela",
      veryActive: "Activo centinela",
      extremelyActive: "Muy activo centinela"
    },
    goals: {
      recomp: "Recomposición centinela",
      slowCut: "Recorte lento centinela",
      maintain: "Mantenimiento centinela"
    }
  },
  actions: {
    save: "Guardar recomp centinela",
    calculate: "Calcular recomp centinela"
  },
  resultSection: {
    title: "Resultado recomp centinela",
    emptyDescription: "Ejecuta el cálculo macro centinela."
  },
  metrics: {
    targetCalories: "Calorías objetivo centinela",
    tdee: "TDEE centinela",
    protein: "Proteína centinela",
    carbs: "Carbohidratos centinela",
    fat: "Grasa centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero los macros centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas recomp centinela",
    notes: {
      training: "Nota centinela de entrenamiento.",
      protein: "Nota centinela de proteína.",
      recovery: "Nota centinela de recuperación."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "No se requiere cuenta centinela para estimar."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "body-recomposition": {
      ...en.tools["body-recomposition"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <BodyRecompositionWorkspace />
    </NextIntlClientProvider>
  );
}

describe("BodyRecompositionWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.weightKg)).toHaveValue(75);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc body recomposition workspace sections", () => {
    renderWithIntl(<BodyRecompositionWorkspace />);

    expect(screen.getByRole("heading", { name: "Body Recomposition Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Recomposition inputs")).toBeInTheDocument();
    expect(screen.getByText("Recomp plan result")).toBeInTheDocument();
    expect(screen.getByText("Recomp notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("75")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/body-recomposition/about"
    );
  });

  it("calculates recomp calories and saves the plan locally", () => {
    renderWithIntl(<BodyRecompositionWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate recomp plan" }));

    expect(screen.getByText("2,383 kcal")).toBeInTheDocument();
    expect(screen.getByText("2,633 kcal")).toBeInTheDocument();
    expect(screen.getByText("150 g")).toBeInTheDocument();
    expect(screen.getByText("293 g")).toBeInTheDocument();
    expect(screen.getByText("25% protein / 49% carbs / 26% fat")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save recomp plan" }));

    expect(window.localStorage.getItem("toolars.body-recomposition.plan")).toContain("75");
  });
});
