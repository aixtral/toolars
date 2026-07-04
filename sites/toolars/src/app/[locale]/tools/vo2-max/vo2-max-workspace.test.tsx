import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { Vo2MaxWorkspace } from "./vo2-max-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio cardio centinela",
  title: "Calculadora VO2 centinela",
  subtitle: "Estimacion centinela de oxigeno maximo.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    reference: "Formula centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Prueba centinela en este navegador."
    },
    training: {
      label: "Entrenamiento centinela",
      text: "Calidad de prueba centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Guardado centinela local."
    }
  },
  inputSection: {
    title: "Entradas fitness centinela",
    description: "Elige metodo centinela."
  },
  fields: {
    method: "Metodo centinela",
    distanceMeters: "Distancia centinela",
    sex: "Sexo centinela",
    age: "Edad centinela",
    restingHeartRate: "Pulso reposo centinela"
  },
  options: {
    method: {
      cooper: "Cooper centinela",
      restingHeartRate: "Pulso reposo centinela"
    },
    sex: {
      male: "Masculino centinela",
      female: "Femenino centinela"
    }
  },
  actions: {
    save: "Guardar prueba centinela",
    calculate: "Calcular VO2 centinela"
  },
  resultSection: {
    title: "Resultado VO2 centinela",
    emptyDescription: "Ejecuta calculo centinela."
  },
  metrics: {
    emptyVo2Max: "0.0",
    vo2Unit: "ml/kg/min centinela",
    pending: "--",
    fitnessLevel: "Nivel fitness centinela",
    methodCooper: "Cooper centinela",
    methodRestingHeartRate: "Pulso reposo centinela",
    method: "Metodo resultado centinela",
    sourceDistance: "{distanceMeters} m centinela",
    sourceRestingHeartRate: "{restingHeartRate} bpm centinela",
    sourceInput: "Entrada fuente centinela"
  },
  callout: {
    waitingTitle: "Esperando calculo centinela",
    waitingDescription: "Calcula primero centinela.",
    calculatedDescription: "Repite condiciones centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas entrenamiento centinela",
    notes: {
      cooperFormula: "Formula Cooper centinela.",
      femaleMultiplier: "Multiplicador centinela.",
      restingHrFormula: "Formula pulso centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Estimacion fitness centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "vo2-max": {
      ...en.tools["vo2-max"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <Vo2MaxWorkspace />
    </NextIntlClientProvider>
  );
}

describe("Vo2MaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.distanceMeters)).toHaveValue(2400);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc VO2 Max workspace sections", () => {
    renderWithIntl(<Vo2MaxWorkspace />);

    expect(screen.getByRole("heading", { name: "VO2 Max Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Fitness inputs")).toBeInTheDocument();
    expect(screen.getByText("VO2 result")).toBeInTheDocument();
    expect(screen.getByText("Training notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Distance (meters)")).toHaveValue(2400);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/vo2-max/about");
  });

  it("calculates the Cooper estimate and saves the scenario locally", () => {
    renderWithIntl(<Vo2MaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate VO2 Max" }));

    expect(screen.getByText("42.4")).toBeInTheDocument();
    expect(screen.getAllByText("Good").length).toBeGreaterThan(0);
    expect(screen.getByText("42-49 ml/kg/min")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save fitness test" }));

    expect(window.localStorage.getItem("toolars.vo2-max.test:v1")).toContain("cooper");
  });
});
