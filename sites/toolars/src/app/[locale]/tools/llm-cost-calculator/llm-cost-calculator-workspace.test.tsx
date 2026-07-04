import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { LlmCostCalculatorWorkspace } from "./llm-cost-calculator-workspace";

const localizedWorkspaceCopy = {
  shell: {
    artifactWaiting: "Esperando artefacto centinela",
    artifactBudgetEstimate: "Estimación presupuesto centinela",
    providerRoute: "Tabla precios centinela",
    runMode: "Estimador estático centinela"
  },
  eyebrow: "Plan costos centinela",
  title: "Calculadora LLM centinela",
  subtitle: "Estimación mensual centinela.",
  modelTitle: "Modelo costos centinela",
  modelProfiles: {
    small: "Modelo pequeño centinela",
    balanced: "Modelo balanceado centinela",
    premium: "Modelo premium centinela"
  },
  detailsLink: "Detalles centinela",
  costRows: {
    local: {
      label: "Local centinela",
      text: "Estimación estática centinela"
    },
    byok: {
      label: "BYOK centinela",
      text: "Precios proveedor centinela"
    },
    pro: {
      label: "Pro centinela",
      text: "Presupuestos históricos centinela"
    }
  },
  inputSection: {
    title: "Entradas uso centinela",
    description: "Supuestos lanzamiento centinela."
  },
  badges: {
    estimator: "Estimador centinela"
  },
  fields: {
    inputTokens: "Tokens entrada centinela",
    outputTokens: "Tokens salida centinela",
    requests: "Solicitudes mes centinela",
    modelProfile: "Perfil modelo centinela"
  },
  actions: {
    save: "Guardar escenario centinela",
    calculate: "Calcular costo centinela",
    export: "Exportar presupuesto centinela"
  },
  resultSection: {
    title: "Estimación mensual centinela",
    emptyDescription: "Ejecuta cálculo centinela.",
    summary: "{model} :: entrada {input} :: salida {output}"
  },
  metrics: {
    monthlyCost: "Costo mensual centinela",
    monthlyTokens: "Tokens mensuales centinela"
  },
  bars: {
    costMixLabel: "Mezcla costo centinela",
    inputTokens: "Tokens entrada barra centinela",
    outputTokens: "Tokens salida barra centinela"
  },
  callout: {
    waitingTitle: "Esperando estimación centinela",
    waitingDescription: "Calcula primero centinela.",
    reviewBudget: "Revisa mezcla centinela."
  },
  recommendations: {
    approval: "Aprobación presupuesto centinela",
    review: "Revisar gasto centinela",
    safe: "Seguro lanzamiento centinela"
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Antes producción centinela",
    notes: {
      context: "Nota contexto centinela.",
      routing: "Nota enrutamiento centinela.",
      tracking: "Nota seguimiento centinela."
    }
  },
  recommendation: {
    title: "Plan recomendado centinela",
    body: "Usa Team centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "llm-cost-calculator": {
      ...en.tools["llm-cost-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <LlmCostCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("LlmCostCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.inputTokens)).toHaveValue(2400);
    expect(screen.getByDisplayValue(localizedWorkspaceCopy.modelProfiles.balanced)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
  });

  it("uses localized model labels and result copy in a non-English workspace", () => {
    renderWithLocalizedMessages();

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getByText("Modelo balanceado centinela :: entrada $259 :: salida $302")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendations.review)).toBeInTheDocument();
  });

  it("renders the Toolars LLM cost planning workspace sections", () => {
    renderWithIntl(<LlmCostCalculatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "llm-cost-calculator");
    expect(screen.getByText("Run mode")).toBeInTheDocument();
    expect(screen.getByText("Provider route")).toBeInTheDocument();
    expect(screen.getByText("Artifact state")).toBeInTheDocument();
    expect(screen.getByText("Static estimator")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LLM Cost Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Usage inputs")).toBeInTheDocument();
    expect(screen.getByText("Monthly estimate")).toBeInTheDocument();
    expect(screen.getByText("Before production")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2400")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Balanced model")).toBeInTheDocument();
  });

  it("calculates the default balanced-model estimate", () => {
    renderWithIntl(<LlmCostCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate cost" }));

    expect(screen.getByText("$562")).toBeInTheDocument();
    expect(screen.getByText("558M")).toBeInTheDocument();
    expect(screen.getByText("Balanced model - input $259 - output $302")).toBeInTheDocument();
    expect(screen.getByText("Review spend before production")).toBeInTheDocument();
  });

  it("updates estimates when the model profile changes", () => {
    renderWithIntl(<LlmCostCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Model profile"), {
      target: { value: "small" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Calculate cost" }));

    expect(screen.getByText("$140")).toBeInTheDocument();
    expect(screen.getByText("Small utility model - input $65 - output $76")).toBeInTheDocument();
  });

  it("saves the usage scenario locally without changing inputs", () => {
    renderWithIntl(<LlmCostCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Requests / month"), {
      target: { value: "250000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save scenario" }));

    expect(screen.getByLabelText("Requests / month")).toHaveValue(250000);
    expect(window.localStorage.getItem("toolars.llm-cost-calculator.scenario")).toContain("250000");
  });
});
