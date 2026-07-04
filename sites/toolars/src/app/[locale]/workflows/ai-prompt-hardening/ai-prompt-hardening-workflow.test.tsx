import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { AiPromptHardeningWorkflow } from "./ai-prompt-hardening-workflow";

const aiPromptHardeningSourceFile =
  "src/app/[locale]/workflows/ai-prompt-hardening/ai-prompt-hardening-workflow.tsx";

function scanAiPromptHardeningSource() {
  return scanSourceText(readFileSync(aiPromptHardeningSourceFile, "utf8"), aiPromptHardeningSourceFile);
}

const localizedWorkflowCopy = {
  eyebrow: "Flujo seguridad centinela",
  title: "Flujo endurecimiento centinela",
  subtitle: "Escaneo de prompt centinela.",
  badges: {
    aiReviewOptional: "Revisión IA centinela",
    injectionRisk: "Riesgo centinela",
    duration: "4 min centinela"
  },
  inputSurfacesTitle: "Superficies centinela",
  inputSurfacesLabel: "Superficies grupo centinela",
  inputSurfaces: {
    systemPrompt: "Sistema centinela",
    toolInstruction: "Herramienta centinela",
    retrievedText: "Texto recuperado centinela"
  },
  canvas: {
    title: "Lienzo centinela",
    description: "Del prompt centinela a guardrails.",
    save: "Guardar plantilla centinela"
  },
  steps: {
    pastePrompt: {
      title: "Pegar prompt centinela",
      description: "Paso local centinela.",
      badge: "Local paso centinela"
    },
    scanInjectionRisk: {
      title: "Escanear riesgo centinela",
      description: "Reglas scanner centinela.",
      badge: "Scan paso centinela"
    },
    addGuardrails: {
      title: "Añadir guardrails centinela",
      description: "Guardrails locales centinela.",
      badge: "Local paso centinela"
    },
    redTeamVariants: {
      title: "Variantes red-team centinela",
      description: "Variantes locales centinela.",
      badge: "Local paso centinela"
    }
  },
  run: {
    title: "Vista previa centinela",
    description: "Simula guardrails centinela.",
    action: "Ejecutar endurecimiento centinela",
    progressLabel: "Progreso centinela",
    readyTitle: "Listo centinela",
    readyDescription: "Pega prompt centinela."
  },
  toolChain: {
    title: "Cadena centinela",
    promptScanner: {
      title: "Escáner prompt centinela",
      description: "Detecta patrones centinela"
    },
    jsonRepair: {
      title: "Reparar JSON centinela",
      description: "Limpia payload centinela"
    },
    badges: {
      scan: "Escanear centinela",
      local: "Local centinela"
    }
  },
  reviewGate: {
    title: "Revisión profunda centinela",
    description: "Consentimiento explícito centinela.",
    action: "Revisar consentimiento centinela"
  }
};

const localizedMessages = {
  ...en,
  workflows: {
    ...((en as { workflows?: Record<string, unknown> }).workflows ?? {}),
    "ai-prompt-hardening": localizedWorkflowCopy
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <AiPromptHardeningWorkflow />
    </NextIntlClientProvider>
  );
}

function expectToolChainIconsToUseArtwork(container: HTMLElement) {
  const iconTiles = Array.from(container.querySelectorAll(".workflow-tool-chain .icon-tile"));

  expect(iconTiles).toHaveLength(2);
  iconTiles.forEach((tile) => {
    expect(tile.querySelector("svg")).toBeInTheDocument();
    expect(tile.textContent?.trim()).not.toMatch(/^(?:PR|JS)$/);
  });
}

describe("AiPromptHardeningWorkflow", () => {
  it("does not leave hardcoded UI audit candidates in the AI prompt hardening workflow source", () => {
    const sourceScan = scanAiPromptHardeningSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workflow copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkflowCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.canvas.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.run.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.toolChain.title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.inputSurfaces.systemPrompt })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.run.action })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.reviewGate.action })).toBeInTheDocument();
  });

  it("renders the AI prompt hardening workflow sections from the design", () => {
    const { container } = renderWithIntl(<AiPromptHardeningWorkflow />);

    expect(document.querySelector(".workflow-builder-layout")).toHaveAttribute("data-ai-lab-workflow", "mobile-edge-v3");
    expect(screen.getByRole("heading", { name: "AI Prompt Hardening Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Hardening canvas")).toBeInTheDocument();
    expect(screen.getByText("Run preview")).toBeInTheDocument();
    expect(screen.getByText("Tool chain")).toBeInTheDocument();
    expect(screen.getByText("AI deep review")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "System prompt" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /Prompt Injection Scanner/ })).toHaveAttribute(
      "href",
      "/tools/prompt-injection-scanner"
    );
    expect(screen.getAllByText("Scan")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Review consent" })).toBeInTheDocument();
    expectToolChainIconsToUseArtwork(container);
  });

  it("simulates hardening when the user runs the workflow", () => {
    renderWithIntl(<AiPromptHardeningWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Run hardening" }));

    expect(screen.getByText("Hardening report ready")).toBeInTheDocument();
    expect(screen.getByText(/3 injection patterns found/)).toBeInTheDocument();
    expect(screen.getByText(/Guardrails and red-team variants/)).toBeInTheDocument();
    expect(screen.getByLabelText("Prompt hardening progress")).toHaveAttribute("aria-valuenow", "82");
  });
});
