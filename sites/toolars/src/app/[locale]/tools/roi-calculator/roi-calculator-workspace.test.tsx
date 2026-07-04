import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { RoiCalculatorWorkspace } from "./roi-calculator-workspace";

const roiCalculatorSourceFile = "src/app/[locale]/tools/roi-calculator/roi-calculator-workspace.tsx";

function scanWorkspaceSource() {
  return scanSourceText(readFileSync(roiCalculatorSourceFile, "utf8"), roiCalculatorSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel ROI workspace",
  title: "Calculadora sentinel de ROI",
  subtitle: "Calcula el rendimiento sentinel sin texto ingles fijo.",
  modelTitle: "Modelo local sentinel",
  detailsLink: "Detalles sentinel de la herramienta",
  trustRows: {
    local: {
      label: "Local sentinel",
      text: "Costos y valores permanecen en esta sesion sentinel"
    },
    context: {
      label: "Contexto sentinel",
      text: "El ROI necesita horizonte y riesgo sentinel"
    },
    private: {
      label: "Privado sentinel",
      text: "Guardar conserva solo este caso sentinel"
    }
  },
  inputSection: {
    title: "Entradas sentinel de retorno",
    description: "Usa costo y valor final para calcular ROI sentinel."
  },
  badges: {
    local: "Local sentinel",
    roi: "ROI sentinel",
    gain: "ganancia sentinel",
    loss: "perdida sentinel",
    flat: "plano sentinel"
  },
  fields: {
    investmentCost: "Costo sentinel de inversion",
    finalValue: "Valor final sentinel"
  },
  actions: {
    save: "Guardar caso sentinel de ROI",
    calculate: "Calcular ROI sentinel"
  },
  resultSection: {
    title: "Resumen sentinel de ROI",
    emptyDescription: "Ejecuta el calculo para ver ROI sentinel.",
    summary: "{roi} ROI sentinel con {profit} neto {outcome}"
  },
  outcomes: {
    profit: "ganancia sentinel",
    loss: "perdida sentinel"
  },
  metrics: {
    roi: "Rendimiento sentinel de inversion",
    profit: "Ganancia neta sentinel",
    cost: "Costo sentinel de inversion",
    finalValue: "Valor final sentinel"
  },
  callout: {
    readyTitle: "Resultado sentinel listo",
    waitingTitle: "Esperando calculo sentinel",
    readyDescription: "El ROI total sentinel no incluye duracion.",
    waitingDescription: "Calcula primero para comparar sentinel."
  },
  review: {
    eyebrow: "Lista sentinel de revision",
    title: "Notas sentinel de comparacion",
    notes: {
      formula: "El ROI sentinel resta costo al valor final.",
      totalReturn: "El ROI sentinel es un retorno total.",
      context: "Compara ROI sentinel con riesgo y costos."
    }
  },
  recommendation: {
    title: "Contexto sentinel primero",
    body: "Combina ROI con horizonte y supuestos sentinel."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "roi-calculator": {
      ...en.tools["roi-calculator"],
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

describe("RoiCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace free of i18n audit hardcoded UI text candidates", () => {
    const sourceScan = scanWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithSpanish(<RoiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.investmentCost)).toHaveValue(10000);
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/roi-calculator/about"
    );
    expect(screen.queryByText("Return inputs")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getByText("50.00% ROI sentinel con +$5,000 neto ganancia sentinel")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.callout.readyTitle)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc ROI workspace sections", () => {
    renderWithIntl(<RoiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "ROI Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Return inputs")).toBeInTheDocument();
    expect(screen.getByText("ROI summary")).toBeInTheDocument();
    expect(screen.getByText("Comparison notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Investment cost")).toHaveValue(10000);
    expect(screen.getByLabelText("Final value")).toHaveValue(15000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/roi-calculator/about"
    );
  });

  it("calculates the default ROI and saves assumptions locally", () => {
    renderWithIntl(<RoiCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate ROI" }));

    expect(screen.getByText("50.00%")).toBeInTheDocument();
    expect(screen.getByText("+$5,000")).toBeInTheDocument();
    expect(screen.getByText("$15,000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save ROI case" }));

    expect(window.localStorage.getItem("toolars.roi-calculator.plan")).toContain("15000");
  });
});
