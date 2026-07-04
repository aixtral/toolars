import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { LlmCostReviewWorkflow } from "./llm-cost-review-workflow";

const llmCostReviewSourceFile = "src/app/[locale]/workflows/llm-cost-review/llm-cost-review-workflow.tsx";

function scanLlmCostReviewSource() {
  return scanSourceText(readFileSync(llmCostReviewSourceFile, "utf8"), llmCostReviewSourceFile);
}

const localizedWorkflowCopy = {
  eyebrow: "Flujo coste centinela",
  title: "Constructor coste centinela",
  subtitle: "Planifica coste centinela antes del lanzamiento.",
  badges: {
    localSteps: "4 pasos centinela",
    duration: "5 min centinela",
    launchReview: "Revisión lanzamiento centinela"
  },
  reviewModeTitle: "Modo revisión centinela",
  reviewModeLabel: "Grupo revisión centinela",
  reviewModes: {
    mvpLaunch: "Lanzamiento MVP centinela",
    teamBudget: "Presupuesto equipo centinela",
    apiPricing: "Precio API centinela"
  },
  canvas: {
    title: "Lienzo coste centinela",
    description: "Estima uso centinela.",
    save: "Guardar plantilla centinela"
  },
  steps: {
    countTokens: {
      title: "Contar tokens centinela",
      description: "Supuestos locales centinela.",
      badge: "Local centinela"
    },
    compareModels: {
      title: "Comparar modelos centinela",
      description: "Coste y latencia centinela.",
      badge: "Local centinela"
    },
    planContext: {
      title: "Planificar contexto centinela",
      description: "Presupuesto contexto centinela.",
      badge: "Local centinela"
    },
    exportBudget: {
      title: "Exportar presupuesto centinela",
      description: "Notas de presupuesto centinela.",
      badge: "Local centinela"
    }
  },
  run: {
    title: "Vista ejecución centinela",
    description: "Simula revisión centinela.",
    action: "Ejecutar revisión centinela",
    progressLabel: "Progreso coste centinela",
    readyTitle: "Listo centinela",
    readyDescription: "Abre calculadora centinela.",
    resultTitle: "Revisión lista centinela",
    resultMemo: "Estimado {monthlyCost}/mes. Memo centinela para modelo pequeño.",
    monthlyTokens: "{monthlyTokens} tokens centinela"
  },
  toolChain: {
    title: "Cadena herramientas centinela",
    llmCostCalculator: {
      title: "Calculadora coste LLM centinela",
      description: "Estima tokens centinela"
    },
    modelComparator: {
      title: "Comparador modelos centinela",
      description: "Compara precio centinela"
    },
    badges: {
      estimate: "Estimar centinela",
      next: "Siguiente centinela"
    }
  },
  budgetPolicy: {
    title: "Política presupuesto centinela",
    description: "Usa plan equipo centinela."
  }
};

const localizedMessages = {
  ...en,
  workflows: {
    ...((en as { workflows?: Record<string, unknown> }).workflows ?? {}),
    "llm-cost-review": localizedWorkflowCopy
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <LlmCostReviewWorkflow />
    </NextIntlClientProvider>
  );
}

function expectToolChainIconsToUseArtwork(container: HTMLElement) {
  const iconTiles = Array.from(container.querySelectorAll(".workflow-tool-chain .icon-tile"));

  expect(iconTiles).toHaveLength(2);
  iconTiles.forEach((tile) => {
    expect(tile.querySelector("svg")).toBeInTheDocument();
    expect(tile.textContent?.trim()).not.toMatch(/^(?:LL|MO)$/);
  });
}

describe("LlmCostReviewWorkflow", () => {
  it("does not leave hardcoded UI audit candidates in the LLM cost review workflow source", () => {
    const sourceScan = scanLlmCostReviewSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workflow copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkflowCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.canvas.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.run.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.toolChain.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.budgetPolicy.title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.reviewModes.mvpLaunch })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.run.action })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Calculadora coste LLM centinela/ })).toHaveAttribute(
      "href",
      "/es/tools/llm-cost-calculator"
    );
  });

  it("renders the LLM cost review workflow sections from the design", () => {
    const { container } = renderWithIntl(<LlmCostReviewWorkflow />);

    expect(document.querySelector(".workflow-builder-layout")).toHaveAttribute("data-ai-lab-workflow", "mobile-edge-v3");
    expect(screen.getByRole("heading", { name: "LLM Cost Review Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Cost review canvas")).toBeInTheDocument();
    expect(screen.getByText("Run preview")).toBeInTheDocument();
    expect(screen.getByText("Tool chain")).toBeInTheDocument();
    expect(screen.getByText("Budget policy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "MVP launch" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /LLM Cost Calculator/ })).toHaveAttribute("href", "/tools/llm-cost-calculator");
    expectToolChainIconsToUseArtwork(container);
  });

  it("simulates the launch review when the user runs the workflow", () => {
    renderWithIntl(<LlmCostReviewWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Run review" }));

    expect(screen.getByText("Cost review ready")).toBeInTheDocument();
    expect(screen.getByText(/Estimated \$562\/month/)).toBeInTheDocument();
    expect(screen.getByText(/smaller model/)).toBeInTheDocument();
    expect(screen.getByLabelText("Cost review progress")).toHaveAttribute("aria-valuenow", "76");
  });
});
