import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { RuleOf72Workspace } from "./rule-of-72-workspace";

const ruleOf72SourceFile = "src/app/[locale]/tools/rule-of-72/rule-of-72-workspace.tsx";

function scanRuleOf72WorkspaceSource() {
  return scanSourceText(readFileSync(ruleOf72SourceFile, "utf8"), ruleOf72SourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel doubling workspace",
  title: "Calculadora sentinel de regla del 72",
  subtitle: "Estima duplicacion sentinel sin texto ingles fijo.",
  modelTitle: "Modelo local sentinel",
  detailsLink: "Detalles sentinel de la herramienta",
  trustRows: {
    local: {
      label: "Local sentinel",
      text: "Tasa y capital permanecen en esta sesion sentinel"
    },
    shortcut: {
      label: "Atajo sentinel",
      text: "La regla del 72 es aproximada sentinel"
    },
    private: {
      label: "Privado sentinel",
      text: "Guardar conserva solo este escenario sentinel"
    }
  },
  inputSection: {
    title: "Entradas sentinel de duplicacion",
    description: "Usa rendimiento anual e inversion inicial sentinel."
  },
  badges: {
    local: "Local sentinel",
    rule: "Regla sentinel",
    close: "cercano sentinel",
    rough: "aproximado sentinel"
  },
  fields: {
    annualReturn: "Retorno anual sentinel",
    principal: "Inversion inicial sentinel"
  },
  actions: {
    save: "Guardar caso sentinel de regla 72",
    calculate: "Calcular tiempo sentinel de duplicacion"
  },
  resultSection: {
    title: "Resumen sentinel de duplicacion",
    emptyDescription: "Ejecuta el calculo para comparar sentinel.",
    summary: "La regla sentinel estima {years} para duplicar a {rate}%"
  },
  values: {
    yearsOneDecimal: "{value} anos sentinel",
    yearsTwoDecimal: "{value} anos exactos sentinel"
  },
  metrics: {
    ruleYears: "Estimacion sentinel regla 72",
    exactYears: "Tiempo exacto sentinel",
    doubledValue: "Valor duplicado sentinel",
    reverseTenYearRate: "Tasa sentinel para duplicar en 10 anos"
  },
  callout: {
    readyTitle: "Comparacion exacta sentinel lista",
    waitingTitle: "Esperando calculo sentinel",
    readyDescription: "{value} despues del ano 1 sentinel.",
    waitingDescription: "Calcula primero para revisar sentinel."
  },
  review: {
    eyebrow: "Lista sentinel de revision",
    title: "Notas sentinel del atajo",
    notes: {
      formula: "VitalCalc sentinel divide 72 por la tasa anual.",
      exact: "La duplicacion exacta sentinel usa logaritmos.",
      context: "Tasas extremas necesitan contexto sentinel."
    }
  },
  recommendation: {
    title: "Solo atajo sentinel",
    body: "Usa capitalizacion exacta y contexto sentinel."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "rule-of-72": {
      ...en.tools["rule-of-72"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("RuleOf72Workspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanRuleOf72WorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithSpanish(<RuleOf72Workspace />);

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.annualReturn)).toHaveValue(7);
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/rule-of-72/about"
    );
    expect(screen.queryByText("Doubling inputs")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getByText("La regla sentinel estima 10.3 anos sentinel para duplicar a 7.00%")).toBeInTheDocument();
    expect(screen.getByText("10.24 anos exactos sentinel")).toBeInTheDocument();
    expect(screen.getByText("$10,700 despues del ano 1 sentinel.")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc Rule of 72 workspace sections", () => {
    renderWithIntl(<RuleOf72Workspace />);

    expect(screen.getByRole("heading", { name: "Rule of 72 Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Doubling inputs")).toBeInTheDocument();
    expect(screen.getByText("Doubling time summary")).toBeInTheDocument();
    expect(screen.getByText("Shortcut notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Annual return rate")).toHaveValue(7);
    expect(screen.getByLabelText("Initial investment")).toHaveValue(10000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/rule-of-72/about"
    );
  });

  it("calculates the default doubling time and saves assumptions locally", () => {
    renderWithIntl(<RuleOf72Workspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate doubling time" }));

    expect(screen.getByText("10.3 years")).toBeInTheDocument();
    expect(screen.getByText("10.24 years")).toBeInTheDocument();
    expect(screen.getByText("$20,000")).toBeInTheDocument();
    expect(screen.getByText("7.2%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save Rule of 72 case" }));

    expect(window.localStorage.getItem("toolars.rule-of-72.plan")).toContain("10000");
  });
});
