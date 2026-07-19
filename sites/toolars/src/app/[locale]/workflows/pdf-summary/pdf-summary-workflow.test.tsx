import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AI_CONSENT_AUDIT_STORAGE_KEY } from "@/lib/ai/consent-audit-storage";
import en from "../../../../../messages/en.json";
import { PdfSummaryWorkflow } from "./pdf-summary-workflow";

const localizedWorkflowCopy = {
  eyebrow: "Constructor centinela",
  title: "Flujo PDF centinela",
  subtitle: "Fusiona, extrae y resume con consentimiento centinela.",
  badges: {
    aiConsent: "Consentimiento IA centinela",
    localSteps: "3 pasos locales centinela",
    duration: "6 min centinela",
    local: "Local centinela",
    ai: "IA centinela",
    style: "Estilo centinela",
    handoffReady: "Traspaso servidor centinela"
  },
  variations: {
    title: "Variaciones recomendadas centinela",
    ariaLabel: "Variaciones recomendadas centinela",
    boardPack: "Paquete directivo centinela",
    clientSummary: "Resumen cliente centinela",
    tableExtract: "Extracción tabla centinela"
  },
  stepCanvas: {
    title: "Lienzo de pasos centinela",
    description: "Cada paso centinela puede editarse."
  },
  actions: {
    saveTemplate: "Guardar plantilla centinela",
    runWorkflow: "Ejecutar flujo centinela",
    reviewConsent: "Revisar consentimiento centinela"
  },
  runPreview: {
    title: "Vista previa centinela",
    description: "Simula extracción y consentimiento centinela.",
    progressLabel: "Progreso PDF centinela",
    readyTitle: "Listo centinela",
    readyDescription: "Sube un PDF centinela antes de exportar."
  },
  settings: {
    title: "Ajustes de paso centinela",
    pdfToolkitTitle: "Kit PDF centinela",
    pdfToolkitDescription: "Fuente centinela · cola PDF",
    executiveTitle: "Informe ejecutivo centinela",
    executiveDescription: "Estilo centinela · citas y acciones",
    reviewTitle: "Consentimiento IA por paso centinela",
    reviewDescription: "Solo el texto extraído centinela se envía.",
    reviewed: "Consentimiento centinela revisado."
  },
  consent: {
    contentSummary: "Solo se envía el texto extraído centinela.",
    providerSummary: "{providerLabel} · {modelFamily} · {retentionDays} días centinela",
    retentionSummary: "Puedes cancelar antes de aprobar el flujo centinela.",
    scopeSummary: "La IA centinela empieza tras aprobar el resumen.",
    workflowTitle: "Flujo PDF centinela"
  }
};

const localizedMessages = {
  ...en,
  workflowsPage: {
    ...en.workflowsPage,
    pdfSummary: {
      workspace: localizedWorkflowCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <PdfSummaryWorkflow />
    </NextIntlClientProvider>
  );
}

function expectToolChainIconsToUseArtwork(container: HTMLElement) {
  const iconTiles = Array.from(container.querySelectorAll(".workflow-tool-chain .icon-tile"));

  expect(iconTiles).toHaveLength(2);
  iconTiles.forEach((tile) => {
    expect(tile.querySelector("svg")).toBeInTheDocument();
    expect(tile.textContent?.trim()).not.toMatch(/^(?:EX)$/);
  });
}

describe("PdfSummaryWorkflow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders visible workflow copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkflowCopy.title })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: localizedWorkflowCopy.variations.ariaLabel })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.variations.boardPack })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText(localizedWorkflowCopy.stepCanvas.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.runPreview.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkflowCopy.settings.title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedWorkflowCopy.actions.reviewConsent })).toBeInTheDocument();
  });

  it("renders the PDF summary workflow builder sections from the design", () => {
    const { container } = renderWithIntl(<PdfSummaryWorkflow />);

    expect(screen.getByRole("heading", { name: "PDF Summary Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Recommended variations")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Board pack" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Step canvas")).toBeInTheDocument();
    expect(screen.getByText("Run preview")).toBeInTheDocument();
    expect(screen.getByText("Step settings")).toBeInTheDocument();
    expect(screen.getByText("AI consent is step-scoped")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /PDF Toolkit/ })).toHaveAttribute("href", "/tools/pdf-toolkit");
    expect(screen.getByText("AI")).toBeInTheDocument();
    expectToolChainIconsToUseArtwork(container);
  });

  it("simulates the PDF summary run when the user runs the workflow", () => {
    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Run workflow" }));

    expect(screen.getByText("Workflow simulated")).toBeInTheDocument();
    expect(screen.getByText(/Local extraction complete/)).toBeInTheDocument();
    expect(screen.getByText(/AI summary is waiting for consent approval/)).toBeInTheDocument();
    expect(screen.getByLabelText("PDF summary progress")).toHaveAttribute("aria-valuenow", "72");
  });

  it("saves the template locally instead of presenting a disabled save control", () => {
    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Save template" }));
    const dialog = screen.getByRole("dialog", { name: "Save template" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save template" }));

    expect(within(dialog).getByRole("status")).toHaveTextContent("PDF Summary Workflow Builder");
    expect(window.localStorage.getItem("toolars.local-workflows:v1")).toContain("PDF Summary Workflow Builder");
  });

  it("opens the step-scoped AI consent dialog from Review consent", () => {
    renderWithIntl(<PdfSummaryWorkflow />);

    const trigger = screen.getByRole("button", { name: "Review consent" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Review AI consent" });
    expect(dialog).toHaveFocus();
    expect(screen.getByText("Only extracted text from the selected workflow step is sent.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));

    expect(screen.queryByRole("dialog", { name: "Review AI consent" })).not.toBeInTheDocument();
    expect(screen.getByText("Consent reviewed for this workflow step.")).toBeInTheDocument();
  });

  it("persists the approved AI provider route in the consent audit log", () => {
    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Review consent" }));

    expect(screen.getByText("Toolars AI Gateway · Fast summary model · 30 day audit retention")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));

    const rawLog = window.localStorage.getItem(AI_CONSENT_AUDIT_STORAGE_KEY);

    expect(rawLog).toContain("pdf-summary");
    expect(rawLog).toContain("summarize-with-ai");
    expect(rawLog).toContain("pdf-summary.fast-summary:v1");
  });

  it("posts approved consent with run metadata to the server audit ledger", () => {
    const fetchMock = vi.fn((url: string, _init?: RequestInit) => {
      if (url === "/api/pdf/uploads?handoff=pdf-summary") return new Promise(() => {});
      return Promise.resolve({
        json: vi.fn().mockResolvedValue({ ledger: { events: [], runs: [], version: 1 } }),
        ok: true
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Review consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ai/consent-audit",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      })
    );

    const postCall = fetchMock.mock.calls.find(([url, callInit]) => url === "/api/ai/consent-audit" && callInit?.method === "POST");
    expect(postCall).toBeDefined();
    const init = postCall?.[1] as RequestInit;
    const body = JSON.parse(String(init.body));

    expect(body.event).toMatchObject({
      providerRouteId: "pdf-summary.fast-summary:v1",
      stepId: "summarize-with-ai",
      workflowSlug: "pdf-summary"
    });
    expect(body.runMetadata).toMatchObject({
      modelFamily: "Fast summary model",
      providerRouteId: "pdf-summary.fast-summary:v1",
      retentionDays: 30,
      status: "consent-approved"
    });
    expect(body.runMetadata.contentBytes).toBeGreaterThan(0);
    expect(body.runMetadata.runId).toMatch(/^run_pdf-summary_summarize-with-ai_/);
  });

  it("loads PDF Toolkit server upload handoffs for the workflow input source", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        uploads: [
          {
            deleteStatus: "active",
            expiresAt: "2026-06-19T12:30:00Z",
            fileName: "Board Pack.pdf",
            handoffTarget: "pdf-summary",
            handoffToken: "handoff_pdf-summary_board_pack",
            objectKey: "temp/toolars_ws_pdf_handoff_test/pdf_upload_board_pack.pdf",
            retentionLabel: "Temporary server object",
            scanLabel: "Server scan passed",
            scanStatus: "ready",
            uploadId: "pdf_upload_board_pack",
            workspaceId: "toolars_ws_pdf_handoff_test"
          }
        ]
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<PdfSummaryWorkflow />);

    expect(await screen.findByText("Board Pack.pdf")).toBeInTheDocument();
    expect(screen.getByText("Server handoff ready")).toBeInTheDocument();
    expect(screen.getByText("handoff_pdf-summary_board_pack")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/pdf/uploads?handoff=pdf-summary");
  });

  function stubProviderRuns(response: { status: number; body: unknown }) {
    return vi.fn((url: string, _init?: RequestInit) => {
      if (url === "/api/ai/provider-runs") {
        return Promise.resolve({
          json: vi.fn().mockResolvedValue(response.body),
          ok: response.status < 400,
          status: response.status
        });
      }
      return Promise.resolve({
        json: vi.fn().mockResolvedValue({ uploads: [] }),
        ok: true,
        status: 200
      });
    });
  }

  it("runs the real provider contract after consent and shows model output and usage", async () => {
    const fetchMock = stubProviderRuns({
      body: {
        outputText: "Key points: revenue up 12%. Action items: share with the board.",
        run: { modelId: "deepseek-chat", usage: { inputTokens: 120, outputTokens: 48 } }
      },
      status: 201
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Review consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Run workflow" }));

    expect(await screen.findByText("AI summary complete")).toBeInTheDocument();
    expect(screen.getByText(/revenue up 12%/)).toBeInTheDocument();
    expect(screen.getByText(/deepseek-chat/)).toBeInTheDocument();
    expect(screen.getByText(/120 \/ 48/)).toBeInTheDocument();

    const runCall = fetchMock.mock.calls.find(([url, init]) => url === "/api/ai/provider-runs" && init?.method === "POST");
    expect(runCall).toBeDefined();
    const body = JSON.parse(String((runCall?.[1] as RequestInit).body));
    expect(body.prompt).toContain('"boardPack" brief');
    expect(body.event.workflowSlug).toBe("pdf-summary");
    expect(body.runMetadata.status).toBe("consent-approved");
  });

  it("asks for sign-in when the provider run is rejected as unauthenticated", async () => {
    vi.stubGlobal("fetch", stubProviderRuns({ body: { error: "Authentication required" }, status: 401 }));

    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Review consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Run workflow" }));

    expect(await screen.findByText("Sign in to run AI steps")).toBeInTheDocument();
  });

  it("shows the failure state when the provider run fails", async () => {
    vi.stubGlobal("fetch", stubProviderRuns({ body: { error: "AI provider execution failed" }, status: 502 }));

    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Review consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Run workflow" }));

    expect(await screen.findByText("AI summary failed")).toBeInTheDocument();
    expect(screen.getByText(/Local extraction results are still available/)).toBeInTheDocument();
  });
});
