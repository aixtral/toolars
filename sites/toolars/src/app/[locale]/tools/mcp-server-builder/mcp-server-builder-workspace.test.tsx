import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { McpServerBuilderWorkspace } from "./mcp-server-builder-workspace";

const mcpServerBuilderSourceFile =
  "src/app/[locale]/tools/mcp-server-builder/mcp-server-builder-workspace.tsx";

const localizedWorkspaceCopy = {
  shell: {
    artifactReady: "Manifiesto listo",
    artifactDrafting: "En borrador",
    providerRoute: "Manifiesto local",
    runMode: "Borrador de manifiesto"
  },
  eyebrow: "RAG / MCP / Agente",
  title: "Constructor de servidores MCP",
  subtitle: "Redacta definiciones de herramientas, recursos y notas de manifiesto para un servidor MCP listo para agentes.",
  stageTitle: "Etapas del constructor",
  stages: {
    defineTools: {
      title: "Definir herramientas",
      description: "Nombre, esquema de entrada y contrato de salida",
      status: "Activo"
    },
    addResources: {
      title: "Agregar recursos",
      description: "Documentos, prompts y conjuntos de datos",
      status: "Siguiente"
    },
    testPayloads: {
      title: "Probar cargas",
      description: "Valida metadatos orientados a agentes",
      status: "Siguiente"
    }
  },
  detailsLink: "Detalles de la herramienta",
  draftSection: {
    title: "Borrador del servidor",
    description: "Describe el servidor y la herramienta principal. El prototipo actualiza una vista previa del manifiesto.",
    badge: "Flujo de trabajo"
  },
  fields: {
    serverName: "Nombre del servidor",
    primaryTool: "Herramienta principal",
    toolDescription: "Descripción de la herramienta"
  },
  toggles: {
    jsonSchema: "Esquema JSON",
    resourceIndex: "Índice de recursos",
    oauthNotes: "Notas OAuth",
    testPayload: "Carga de prueba"
  },
  actions: {
    saveDraft: "Guardar borrador",
    generateManifest: "Generar manifiesto",
    copyManifest: "Copiar manifiesto"
  },
  preview: {
    title: "Vista previa del manifiesto"
  },
  status: {
    waiting: "Esperando generación.",
    generated: "Manifiesto generado - {toolCount} herramienta - {resourceCount} recurso - {payloadCount} carga de prueba"
  },
  review: {
    eyebrow: "Revisión de lanzamiento",
    title: "Lo que Toolars revisa",
    badges: {
      ok: "OK",
      warn: "Aviso"
    },
    checks: {
      actionName: {
        ok: "El nombre de la herramienta está orientado a la acción.",
        warn: "El nombre de la herramienta debe empezar con un verbo de acción."
      },
      schema: {
        ok: "Los campos del esquema son explícitos.",
        warn: "El esquema JSON debe incluirse antes del lanzamiento."
      },
      auth: {
        ok: "La política de autenticación y límites está documentada.",
        warn: "La política de autenticación y límites aún falta."
      }
    }
  },
  recommendation: {
    title: "Siguiente herramienta sugerida",
    body: "Abre MCP Tester después de exportar para validar respuestas y metadatos."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "mcp-server-builder": {
      ...en.tools["mcp-server-builder"],
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

function scanMcpServerBuilderSource() {
  return scanSourceText(readFileSync(mcpServerBuilderSourceFile, "utf8"), mcpServerBuilderSourceFile);
}

describe("McpServerBuilderWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("has no hardcoded workspace text or absolute href i18n audit candidates", () => {
    const sourceScan = scanMcpServerBuilderSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the Toolars MCP builder workspace sections", () => {
    renderWithIntl(<McpServerBuilderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "mcp-server-builder");
    expect(screen.getByText("Run mode")).toBeInTheDocument();
    expect(screen.getByText("Provider route")).toBeInTheDocument();
    expect(screen.getByText("Artifact state")).toBeInTheDocument();
    expect(screen.getByText("Manifest draft")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "MCP Server Builder" })).toBeInTheDocument();
    expect(screen.getByText("Server draft")).toBeInTheDocument();
    expect(screen.getByText("Manifest preview")).toBeInTheDocument();
    expect(screen.getByText("What Toolars checks")).toBeInTheDocument();
    expect(screen.getByDisplayValue("toolars-research-kit")).toBeInTheDocument();
    expect(screen.getByDisplayValue("search_private_docs")).toBeInTheDocument();
  });

  it("renders localized workspace copy and details link outside English", () => {
    renderWithSpanish(<McpServerBuilderWorkspace />);

    expect(screen.getByRole("heading", { name: "Constructor de servidores MCP" })).toBeInTheDocument();
    expect(screen.getByText("Borrador del servidor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generar manifiesto" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/mcp-server-builder/about"
    );

    fireEvent.click(screen.getByRole("button", { name: "Generar manifiesto" }));

    expect(screen.getByText("Manifiesto generado - 1 herramienta - 1 recurso - 1 carga de prueba")).toBeInTheDocument();
    expect(screen.getByText("La política de autenticación y límites aún falta.")).toBeInTheDocument();
    expect(screen.queryByText("Server draft")).not.toBeInTheDocument();
  });

  it("generates the default manifest preview", () => {
    renderWithIntl(<McpServerBuilderWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Generate manifest" }));

    expect(screen.getByText("Manifest generated - 1 tool - 1 resource - 1 test payload")).toBeInTheDocument();
    expect(screen.getByText(/"name": "toolars-research-kit"/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "search_private_docs"/)).toBeInTheDocument();
    expect(screen.getByText(/"docs:\/\/private-collection\/index"/)).toBeInTheDocument();
  });

  it("updates the manifest when the tool name changes", () => {
    renderWithIntl(<McpServerBuilderWorkspace />);

    fireEvent.change(screen.getByLabelText("Primary tool"), {
      target: { value: "lookup_customer_docs" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate manifest" }));

    expect(screen.getByText(/"name": "lookup_customer_docs"/)).toBeInTheDocument();
  });

  it("saves the draft locally without changing fields", () => {
    renderWithIntl(<McpServerBuilderWorkspace />);

    fireEvent.change(screen.getByLabelText("Server name"), {
      target: { value: "customer-support-kit" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));

    expect(screen.getByLabelText("Server name")).toHaveValue("customer-support-kit");
    expect(window.localStorage.getItem("toolars.mcp-server-builder.draft")).toContain("customer-support-kit");
  });
});
