import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { FiberIntakeWorkspace } from "./fiber-intake-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio nutricional centinela",
  title: "Calculadora de fibra centinela",
  subtitle: "Objetivo diario de fibra centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles de fibra centinela",
  badges: {
    local: "Local centinela",
    target: "Objetivo centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Perfil centinela local."
    },
    gutHealth: {
      label: "Salud digestiva centinela",
      text: "Aumenta fibra centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Guardado centinela local."
    }
  },
  inputSection: {
    title: "Entradas de fibra centinela",
    description: "Configura perfil centinela."
  },
  fields: {
    weight: "Peso centinela",
    age: "Edad centinela",
    sex: "Sexo centinela",
    currentFiber: "Fibra actual centinela"
  },
  sexOptions: {
    male: "Masculino centinela",
    female: "Femenino centinela"
  },
  actions: {
    save: "Guardar fibra centinela",
    calculate: "Calcular fibra centinela"
  },
  resultSection: {
    title: "Resumen de fibra centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    dailyTarget: "Objetivo diario centinela",
    recommendedRange: "Rango recomendado centinela",
    progress: "Progreso centinela",
    gap: "Brecha centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela.",
    remaining: "{gap} restante centinela",
    gradual: "Aumenta gradualmente centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de fibra centinela",
    notes: {
      model: "Nota centinela de modelo.",
      baseline: "Nota centinela de referencia.",
      tolerance: "Nota centinela de tolerancia."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Tolerancia digestiva centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "fiber-intake": {
      ...en.tools["fiber-intake"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <FiberIntakeWorkspace />
    </NextIntlClientProvider>
  );
}

describe("FiberIntakeWorkspace", () => {
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
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc fiber intake workspace sections", () => {
    renderWithIntl(<FiberIntakeWorkspace />);

    expect(screen.getByRole("heading", { name: "Fiber Intake Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Profile inputs")).toBeInTheDocument();
    expect(screen.getByText("Fiber summary")).toBeInTheDocument();
    expect(screen.getByText("Fiber notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/fiber-intake/about");
  });

  it("calculates the default fiber target and saves the profile locally", () => {
    renderWithIntl(<FiberIntakeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate fiber needs" }));

    expect(screen.getByText("25 g")).toBeInTheDocument();
    expect(screen.getByText("25-28 g/day")).toBeInTheDocument();
    expect(screen.getAllByText("60%").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save fiber profile" }));

    expect(window.localStorage.getItem("toolars.fiber-intake.profile:v1")).toContain("70");
  });
});
