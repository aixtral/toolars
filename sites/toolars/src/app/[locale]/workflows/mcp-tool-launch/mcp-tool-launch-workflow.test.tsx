import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { McpToolLaunchWorkflow } from "./mcp-tool-launch-workflow";

const mcpToolLaunchSourceFile = "src/app/[locale]/workflows/mcp-tool-launch/mcp-tool-launch-workflow.tsx";

function scanMcpToolLaunchSource() {
  return scanSourceText(readFileSync(mcpToolLaunchSourceFile, "utf8"), mcpToolLaunchSourceFile);
}

const localizedWorkflowCopy = {
  eyebrow: "Flujo MCP centinela",
  title: "Constructor MCP centinela",
  subtitle: "Prepara manifiesto MCP centinela.",
  badges: {
    agentReady: "Agente listo centinela",
    localSteps: "4 pasos centinela",
    duration: "8 min centinela"
  },
  launchTargetTitle: "Destino centinela",
  launchTargetLabel: "Destino grupo centinela",
  launchTargets: {
    internalAgent: "Agente interno centinela",
    hostedServer: "Servidor hospedado centinela",
    marketplaceSubmission: "Marketplace centinela"
  },
  canvas: {
    title: "Lienzo MCP centinela",
    description: "Define herramientas centinela.",
    save: "Guardar plantilla centinela"
  },
  steps: {
    defineTools: {
      title: "Definir herramientas centinela",
      description: "Paso local MCP centinela.",
      badge: "Local centinela"
    },
    buildManifest: {
      title: "Crear manifiesto centinela",
      description: "Paso local MCP centinela.",
      badge: "Local centinela"
    },
    runMcpTests: {
      title: "Probar MCP centinela",
      description: "Valida esquemas centinela.",
      badge: "Prueba centinela"
    },
    exportDocs: {
      title: "Exportar docs centinela",
      description: "Paso local MCP centinela.",
      badge: "Local centinela"
    }
  },
  run: {
    title: "Vista previa MCP centinela",
    description: "Simula checklist centinela.",
    action: "Ejecutar lanzamiento centinela",
    progressLabel: "Progreso MCP centinela",
    readyTitle: "Listo centinela",
    readyDescription: "Genera manifiesto centinela.",
    result: {
      statusTitle: "Checklist centinela listo",
      summary: "Manifiesto centinela generado.",
      reviewGate: "Notas de auth centinela."
    }
  },
  toolChain: {
    title: "Cadena MCP centinela",
    serverBuilder: {
      title: "Constructor servidor centinela",
      description: "Redacta manifiesto centinela"
    },
    tester: {
      title: "Tester MCP centinela",
      description: "Valida metadatos centinela"
    },
    badges: {
      build: "Construir centinela",
      next: "Siguiente centinela"
    }
  },
  reviewGate: {
    title: "Revisión MCP centinela",
    description: "Notas de límites centinela."
  }
};

const localizedMessages = {
  ...en,
  workflows: {
    ...((en as { workflows?: Record<string, unknown> }).workflows ?? {}),
    "mcp-tool-launch": localizedWorkflowCopy
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <McpToolLaunchWorkflow />
    </NextIntlClientProvider>
  );
}

function expectToolChainIconsToUseArtwork(container: HTMLElement) {
  const iconTiles = Array.from(container.querySelectorAll(".workflow-tool-chain .icon-tile"));

  expect(iconTiles).toHaveLength(2);
  iconTiles.forEach((tile) => {
    expect(tile.querySelector("svg")).toBeInTheDocument();
    expect(tile.textContent?.trim()).not.toMatch(/^(?:MC|MT)$/);
  });
}

describe("McpToolLaunchWorkflow", () => {
  it("does not leave hardcoded UI audit candidates in the MCP launch workflow source", () => {
    const scan = scanMcpToolLaunchSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workflow copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkflowCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.canvas.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.run.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.toolChain.title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.launchTargets.internalAgent })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.run.action })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Constructor servidor centinela/ })).toHaveAttribute(
      "href",
      "/es/tools/mcp-server-builder"
    );
  });

  it("renders the MCP launch workflow sections from the design", () => {
    const { container } = renderWithIntl(<McpToolLaunchWorkflow />);

    expect(document.querySelector(".workflow-builder-layout")).toHaveAttribute("data-ai-lab-workflow", "mobile-edge-v3");
    expect(screen.getByRole("heading", { name: "MCP Tool Launch Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Launch canvas")).toBeInTheDocument();
    expect(screen.getByText("Run preview")).toBeInTheDocument();
    expect(screen.getByText("Tool chain")).toBeInTheDocument();
    expect(screen.getByText("Review gate")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Internal agent" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /MCP Server Builder/ })).toHaveAttribute("href", "/tools/mcp-server-builder");
    expect(screen.getByText("Test")).toBeInTheDocument();
    expectToolChainIconsToUseArtwork(container);
  });

  it("simulates the launch check when the user runs the workflow", () => {
    renderWithIntl(<McpToolLaunchWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Run launch check" }));

    expect(screen.getByText("Launch checklist ready")).toBeInTheDocument();
    expect(screen.getByText(/Manifest generated/)).toBeInTheDocument();
    expect(screen.getAllByText(/auth policy notes/)).toHaveLength(2);
    expect(screen.getByLabelText("MCP launch progress")).toHaveAttribute("aria-valuenow", "88");
  });
});
