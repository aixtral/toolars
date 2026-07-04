import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { HabitCostWorkspace } from "./habit-cost-workspace";

const habitCostSourceFile = "src/app/[locale]/tools/habit-cost/habit-cost-workspace.tsx";

function scanHabitCostWorkspaceSource() {
  return scanSourceText(readFileSync(habitCostSourceFile, "utf8"), habitCostSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "Espacio de coste de habito centinela",
  title: "Calculadora de habitos centinela",
  subtitle: "Estima gasto repetido centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    opportunity: "Oportunidad centinela",
    habit: "Habito centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Los supuestos centinela quedan en este navegador."
    },
    reflection: {
      label: "Reflexion centinela",
      text: "La salida centinela no es una recomendacion."
    },
    private: {
      label: "Privado centinela",
      text: "El guardado centinela queda local."
    }
  },
  inputSection: {
    title: "Entradas de habito centinela",
    description: "Usa coste y frecuencia centinela."
  },
  fields: {
    costPerOccurrence: "Coste por vez centinela",
    frequencyPerWeek: "Frecuencia semanal centinela",
    years: "Anios centinela",
    annualReturnRate: "Retorno anual centinela"
  },
  actions: {
    save: "Guardar habito centinela",
    calculate: "Calcular coste centinela"
  },
  resultSection: {
    title: "Resumen de oportunidad centinela",
    emptyDescription: "Ejecuta el calculo centinela.",
    summary: "{weeklyCost} por semana durante {years} anios centinela"
  },
  metrics: {
    futureValue: "Valor futuro centinela",
    totalSpent: "Gasto total centinela",
    investmentGain: "Ganancia invertida centinela",
    weeklyCost: "Coste semanal centinela"
  },
  callout: {
    waitingTitle: "Esperando calculo centinela",
    waitingDescription: "Calcula primero el habito centinela.",
    calculatedDescription: "El coste de oportunidad centinela resta gasto total al valor futuro."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de reflexion centinela",
    notes: {
      weeklySpend: "Nota semanal centinela.",
      futureValue: "Nota de valor futuro centinela.",
      nonFinancialValue: "Nota no financiera centinela."
    }
  },
  recommendation: {
    title: "Local primero centinela",
    body: "Los supuestos centinela son privados hasta guardarlos."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "habit-cost": {
      ...en.tools["habit-cost"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <HabitCostWorkspace />
    </NextIntlClientProvider>
  );
}

describe("HabitCostWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanHabitCostWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.costPerOccurrence)).toHaveValue(6);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/habit-cost/about"
    );

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getAllByText("$42 por semana durante 10 anios centinela").length).toBeGreaterThan(0);
    expect(screen.getByText(localizedWorkspaceCopy.callout.calculatedDescription)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc habit cost workspace sections", () => {
    renderWithIntl(<HabitCostWorkspace />);

    expect(screen.getByRole("heading", { name: "Habit Cost Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Habit inputs")).toBeInTheDocument();
    expect(screen.getByText("Opportunity cost summary")).toBeInTheDocument();
    expect(screen.getByText("Reflection notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Cost per occurrence")).toHaveValue(6);
    expect(screen.getByLabelText("Frequency per week")).toHaveValue(7);
    expect(screen.getByLabelText("Years")).toHaveValue(10);
    expect(screen.getByLabelText("Annual return rate")).toHaveValue(7);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/habit-cost/about"
    );
  });

  it("calculates the default habit cost and saves assumptions locally", () => {
    renderWithIntl(<HabitCostWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate habit cost" }));

    expect(screen.getByText("$31,131")).toBeInTheDocument();
    expect(screen.getByText("$21,840")).toBeInTheDocument();
    expect(screen.getByText("$9,291")).toBeInTheDocument();
    expect(screen.getAllByText("$42 weekly habit over 10 years").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save habit plan" }));

    expect(window.localStorage.getItem("toolars.habit-cost.plan")).toContain("6");
  });
});
