import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { CoastFireWorkspace } from "./coast-fire-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio costa centinela",
  title: "Calculadora Coast FIRE centinela",
  subtitle: "Meta de retiro centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    coast: "Costa centinela",
    ready: "Listo centinela",
    gap: "Brecha centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Datos centinela locales."
    },
    advice: {
      label: "Sin consejo centinela",
      text: "Escenario centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Plan centinela local."
    }
  },
  inputSection: {
    title: "Entradas Coast FIRE centinela",
    description: "Edades y activos centinela."
  },
  fields: {
    currentAge: "Edad actual centinela",
    retirementAge: "Edad retiro centinela",
    currentAssets: "Activos actuales centinela",
    annualExpenses: "Gastos anuales centinela",
    annualReturn: "Rendimiento anual centinela",
    withdrawalRate: "Tasa retiro centinela"
  },
  actions: {
    save: "Guardar costa centinela",
    calculate: "Calcular costa centinela"
  },
  resultSection: {
    title: "Punto Coast FIRE centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    fireTarget: "Meta FIRE centinela",
    coastTarget: "Meta Coast FIRE centinela",
    progress: "Progreso centinela",
    gapOrSurplus: "Brecha o superávit centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas compuesto centinela",
    notes: {
      traditional: "Nota tradicional centinela.",
      coast: "Nota coast centinela.",
      assumptions: "Nota supuestos centinela."
    }
  },
  caveat: {
    title: "Advertencia retiro centinela",
    body: "Valida supuestos centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "coast-fire": {
      ...en.tools["coast-fire"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <CoastFireWorkspace />
    </NextIntlClientProvider>
  );
}

describe("CoastFireWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.currentAge)).toHaveValue(30);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc Coast FIRE workspace sections", () => {
    renderWithIntl(<CoastFireWorkspace />);

    expect(screen.getByRole("heading", { name: "Coast FIRE Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Coast FIRE inputs")).toBeInTheDocument();
    expect(screen.getByText("Coast checkpoint")).toBeInTheDocument();
    expect(screen.getByText("Compounding notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Current age")).toHaveValue(30);
    expect(screen.getByLabelText("Retirement age")).toHaveValue(55);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/coast-fire/about"
    );
  });

  it("calculates the default Coast FIRE estimate and saves assumptions locally", () => {
    renderWithIntl(<CoastFireWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate Coast FIRE" }));

    expect(screen.getByText("$1,500,000")).toBeInTheDocument();
    expect(screen.getByText("$276,374")).toBeInTheDocument();
    expect(screen.getByText("180.9%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save coast plan" }));

    expect(window.localStorage.getItem("toolars.coast-fire.plan")).toContain("500000");
  });
});
