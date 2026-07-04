import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { OneRepMaxWorkspace } from "./one-rep-max-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio fuerza centinela",
  title: "Calculadora 1RM centinela",
  subtitle: "Estimacion centinela de fuerza maxima.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    epley: "Epley centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Peso centinela local."
    },
    training: {
      label: "Entrenamiento centinela",
      text: "Referencia de fuerza centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Guardado centinela local."
    }
  },
  inputSection: {
    title: "Entradas fuerza centinela",
    description: "Serie completada centinela."
  },
  fields: {
    weightKg: "Peso trabajo centinela",
    reps: "Repeticiones centinela"
  },
  actions: {
    save: "Guardar levantamiento centinela",
    calculate: "Calcular 1RM centinela"
  },
  resultSection: {
    title: "Resultado fuerza centinela",
    emptyDescription: "Ejecuta calculo centinela.",
    summary: "{weightKg} kg por {reps} reps centinela"
  },
  metrics: {
    emptyOneRepMax: "0.0 kg",
    pending: "--",
    estimatedOneRepMax: "1RM estimado centinela",
    accuracyBand: "Banda precision centinela",
    inputReps: "Reps entrada centinela",
    workingSets: "Series trabajo centinela"
  },
  accuracy: {
    epleyReference: "Referencia Epley centinela",
    lowerAccuracy: "Menor precision centinela"
  },
  percentageRows: {
    label: "{percentage}% por {reps} reps centinela"
  },
  callout: {
    waitingTitle: "Esperando calculo centinela",
    waitingDescription: "Calcula primero centinela.",
    calculatedDescription: "Usa porcentajes centinela."
  },
  recommendations: {
    epleyReference: "Recomendacion Epley centinela.",
    lowerAccuracy: "Recomendacion alta reps centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas fuerza centinela",
    notes: {
      formula: "Formula Epley centinela.",
      repRange: "Rango reps centinela.",
      safety: "Seguridad centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Datos fuerza centinela local."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "one-rep-max": {
      ...en.tools["one-rep-max"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <OneRepMaxWorkspace />
    </NextIntlClientProvider>
  );
}

describe("OneRepMaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.weightKg)).toHaveValue(80);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/one-rep-max/about");

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getByText("80 kg por 5 reps centinela")).toBeInTheDocument();
    expect(screen.getAllByText(localizedWorkspaceCopy.accuracy.epleyReference).length).toBeGreaterThan(0);
    expect(screen.getByText("95% por 2 reps centinela")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendations.epleyReference)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc one rep max workspace sections", () => {
    renderWithIntl(<OneRepMaxWorkspace />);

    expect(screen.getByRole("heading", { name: "1RM Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lift inputs")).toBeInTheDocument();
    expect(screen.getByText("Strength result")).toBeInTheDocument();
    expect(screen.getByText("Strength notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Working weight (kg)")).toHaveValue(80);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/one-rep-max/about");
  });

  it("calculates the default Epley estimate and saves the lift locally", () => {
    renderWithIntl(<OneRepMaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate 1RM" }));

    expect(screen.getByText("93.3 kg")).toBeInTheDocument();
    expect(screen.getByText("88.7 kg")).toBeInTheDocument();
    expect(screen.getByText("95% x 2 reps")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lift" }));

    expect(window.localStorage.getItem("toolars.one-rep-max.lift:v1")).toContain("80");
  });
});
