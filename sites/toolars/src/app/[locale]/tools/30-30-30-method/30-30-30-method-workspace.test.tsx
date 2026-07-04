import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { ThirtyThirtyThirtyMethodWorkspace } from "./30-30-30-method-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio matutino centinela",
  title: "Método 30-30-30 centinela",
  subtitle: "Proteína y actividad matutina centinela.",
  modelTitle: "Modelo de rutina centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    referenceOnly: "Solo referencia centinela",
    protein: "Proteína centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "La rutina centinela queda en este navegador."
    },
    nutrition: {
      label: "Nutrición centinela",
      text: "La proteína centinela es una referencia."
    },
    private: {
      label: "Privado centinela",
      text: "El plan matutino centinela se guarda localmente."
    }
  },
  inputSection: {
    title: "Entradas matutinas centinela",
    description: "Introduce contexto corporal y actividad centinela."
  },
  fields: {
    weightKg: "Peso centinela",
    age: "Edad centinela",
    sex: "Sexo centinela",
    activity: "Actividad centinela"
  },
  options: {
    sex: {
      male: "Masculino centinela",
      female: "Femenino centinela"
    },
    activity: {
      walk: "Caminata centinela",
      jog: "Trote centinela",
      cycle: "Bici centinela",
      swim: "Nado centinela"
    }
  },
  actions: {
    save: "Guardar mañana centinela",
    calculate: "Calcular rutina centinela"
  },
  resultSection: {
    title: "Resultado de rutina centinela",
    emptyDescription: "Ejecuta el cálculo matutino centinela."
  },
  metrics: {
    proteinTarget: "Proteína objetivo centinela",
    burn: "Quema 30 minutos centinela",
    activity: "Actividad resultado centinela",
    sourceMet: "MET fuente centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero la rutina centinela.",
    calculatedDescription: "Mantén la sesión centinela suave."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de rutina centinela",
    notes: {
      target: "Nota centinela de proteína.",
      met: "Nota centinela de MET.",
      medical: "Nota centinela médica."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Ajusta el método centinela con guía clínica."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "30-30-30-method": {
      ...en.tools["30-30-30-method"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <ThirtyThirtyThirtyMethodWorkspace />
    </NextIntlClientProvider>
  );
}

describe("ThirtyThirtyThirtyMethodWorkspace", () => {
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
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/30-30-30-method/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc 30-30-30 workspace sections", () => {
    renderWithIntl(<ThirtyThirtyThirtyMethodWorkspace />);

    expect(screen.getByRole("heading", { name: "30-30-30 Morning Method" })).toBeInTheDocument();
    expect(screen.getByText("Morning inputs")).toBeInTheDocument();
    expect(screen.getByText("Routine result")).toBeInTheDocument();
    expect(screen.getByText("Routine notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/30-30-30-method/about");
  });

  it("calculates the routine and saves the local morning plan", () => {
    renderWithIntl(<ThirtyThirtyThirtyMethodWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate routine" }));

    expect(screen.getByText("30 g")).toBeInTheDocument();
    expect(screen.getByText("123 kcal")).toBeInTheDocument();
    expect(screen.getAllByText("Brisk walk").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save morning plan" }));

    expect(window.localStorage.getItem("toolars.30-30-30-method.plan:v1")).toContain("\"weightKg\":70");
  });
});
