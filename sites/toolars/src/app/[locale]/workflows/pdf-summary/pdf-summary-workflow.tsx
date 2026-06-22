"use client";

import { useEffect, useState } from "react";
import { FileText, Play, Save } from "lucide-react";
import { AiConsentDialog } from "@/components/core/ai-consent-dialog";
import { useDialogFocus } from "@/components/core/use-dialog-focus";
import { appendAiConsentAuditEvent } from "@/lib/ai/consent-audit-storage";
import { buildAiConsentRunMetadata } from "@/lib/ai/consent-audit-run-metadata";
import { selectAiProviderRoute } from "@/lib/ai/provider-routing";
import type { PdfUploadServerHandoffRecord } from "@/lib/tools/pdf-upload-lifecycle";
import { buildWorkspaceAuditHeaders, buildWorkspaceScopedJsonHeaders } from "@/lib/workspace/workspace-identity";
import {
  buildPdfSummarySteps,
  runPdfSummaryWorkflow,
  type PdfSummaryResult
} from "@/lib/workflows/pdf-summary";

const variations = ["Board pack", "Client summary", "Table extract"] as const;
const steps = buildPdfSummarySteps();
const pdfSummaryProviderRoute = selectAiProviderRoute({ workflowSlug: "pdf-summary", stepId: "summarize-with-ai" });

export function PdfSummaryWorkflow() {
  const [variation, setVariation] = useState<(typeof variations)[number]>("Board pack");
  const [result, setResult] = useState<PdfSummaryResult | null>(null);
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false);
  const [consentReviewed, setConsentReviewed] = useState(false);
  const [handoffUploads, setHandoffUploads] = useState<PdfUploadServerHandoffRecord[]>([]);
  const {
    dialogRef: consentDialogRef,
    restoreTriggerFocus: restoreConsentTriggerFocus,
    triggerRef: consentTriggerRef
  } = useDialogFocus(isConsentDialogOpen);
  const progress = result?.progressPercent ?? 0;

  useEffect(() => {
    let isActive = true;

    async function loadPdfToolkitHandoff() {
      if (typeof fetch !== "function") return;

      try {
        const response = await fetch("/api/pdf/uploads?handoff=pdf-summary", {
          headers: buildWorkspaceAuditHeaders()
        });
        if (!response.ok) throw new Error("PDF upload handoff unavailable");
        const payload = (await response.json()) as { uploads?: PdfUploadServerHandoffRecord[] };
        if (isActive) setHandoffUploads(payload.uploads ?? []);
      } catch {
        if (isActive) setHandoffUploads([]);
      }
    }

    void loadPdfToolkitHandoff();

    return () => {
      isActive = false;
    };
  }, []);

  const runWorkflow = () => {
    setResult(runPdfSummaryWorkflow());
  };

  const closeConsentDialog = () => {
    setIsConsentDialogOpen(false);
    restoreConsentTriggerFocus();
  };

  const approveAiConsent = () => {
    const approvedAt = new Date().toISOString();
    const contentSummary = "Only extracted text from the selected workflow step is sent.";
    const event = {
      approvedAt,
      contentSummary,
      providerLabel: pdfSummaryProviderRoute.providerLabel,
      providerRouteId: pdfSummaryProviderRoute.providerRouteId,
      stepId: pdfSummaryProviderRoute.stepId,
      workflowSlug: pdfSummaryProviderRoute.workflowSlug,
      workflowTitle: "PDF Summary Workflow"
    };
    const runMetadata = buildAiConsentRunMetadata({
      approvedAt,
      contentSummary,
      providerRoute: pdfSummaryProviderRoute
    });

    appendAiConsentAuditEvent(event);
    void fetch("/api/ai/consent-audit", {
      body: JSON.stringify({ event, runMetadata }),
      headers: buildWorkspaceScopedJsonHeaders(),
      method: "POST"
    }).catch(() => undefined);
    setConsentReviewed(true);
    closeConsentDialog();
  };

  return (
    <div className="workflow-builder-layout">
      <section className="workspace-panel workflow-overview-panel">
        <span className="eyebrow">Workflow builder</span>
        <h1>PDF Summary Workflow Builder</h1>
        <p className="subtitle">Merge PDFs, extract text locally, run AI summary with consent, and export citations.</p>

        <div className="badge-row workflow-badge-row">
          <span className="badge ai">AI consent</span>
          <span className="badge local">3 local steps</span>
          <span className="badge">6 min</span>
        </div>

        <h2 style={{ marginTop: 26 }}>Recommended variations</h2>
        <div className="workflow-mode-row" role="group" aria-label="Recommended variations">
          {variations.map((item) => (
            <button
              aria-pressed={variation === item}
              className={`button ${variation === item ? "button-soft" : "button-outline-neutral"}`}
              key={item}
              onClick={() => setVariation(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Step canvas</h2>
              <p className="tool-description">Each step can be edited before running the workflow.</p>
            </div>
            <button className="button button-outline-neutral" type="button">
              <Save size={16} aria-hidden="true" /> Save template
            </button>
          </div>

          <div className="workflow-step-list">
            {steps.map((step, index) => (
              <article className="workflow-step-row" key={step.title}>
                <span className="mcp-stage-number">{index + 1}</span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.description}</small>
                </span>
                <span className={`badge ${step.badge === "AI" ? "ai" : "local"}`}>{step.badge}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workflow-run-head">
            <div>
              <h2>Run preview</h2>
              <p className="tool-description">Simulate extraction, consent, and summary export before connecting production services.</p>
            </div>
            <button className="button button-solid workflow-run-button" onClick={runWorkflow} type="button">
              <Play size={16} aria-hidden="true" /> Run workflow
            </button>
          </div>

          <div
            aria-label="PDF summary progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="workflow-progress"
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="workflow-output-box">
            <strong>{result?.statusTitle ?? "Ready to run"}</strong>
            <p>{result?.summary ?? "Upload a PDF, confirm AI consent, then export the final summary."}</p>
            {result ? <small>{result.securityNote}</small> : null}
          </div>
        </section>
      </div>

      <aside className="workspace-panel workflow-tool-chain">
        <h2>Step settings</h2>
        <div className="workflow-resource-list">
          <a className="workflow-resource-row" href="/tools/pdf-toolkit">
            <span className="icon-tile rose">
              <FileText size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>PDF Toolkit</strong>
              <small>Input source · PDF Toolkit queue</small>
            </span>
            <span className="badge local">Local</span>
          </a>
          {handoffUploads.map((upload) => (
            <div className="workflow-resource-row" key={upload.handoffToken}>
              <span className="icon-tile rose">
                <FileText size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>{upload.fileName}</strong>
                <small>{upload.handoffToken}</small>
              </span>
              <span className="badge local">Server handoff ready</span>
            </div>
          ))}
          <div className="workflow-resource-row">
            <span className="icon-tile emerald">EX</span>
            <span>
              <strong>Executive brief</strong>
              <small>Summary style · Citations and action items</small>
            </span>
            <span className="badge">Style</span>
          </div>
        </div>

        <div className="workflow-review-gate">
          <strong>AI consent is step-scoped</strong>
          <p>Only the selected extracted text is sent when the summarization step is approved.</p>
          {consentReviewed ? <small>Consent reviewed for this workflow step.</small> : null}
          <button
            ref={consentTriggerRef}
            className="button button-outline-neutral"
            type="button"
            onClick={() => setIsConsentDialogOpen(true)}
          >
            Review consent
          </button>
        </div>
      </aside>

      <AiConsentDialog
        contentSummary="Only extracted text from the selected workflow step is sent."
        dialogRef={consentDialogRef}
        isOpen={isConsentDialogOpen}
        onApprove={approveAiConsent}
        onClose={closeConsentDialog}
        providerSummary={`${pdfSummaryProviderRoute.providerLabel} · ${pdfSummaryProviderRoute.modelFamily} · ${pdfSummaryProviderRoute.retentionDays} day audit retention`}
        retentionSummary="You can cancel before approval. Generated summary context is deleted after the simulated workflow run."
        scopeSummary="AI processing starts only after the summarization step is approved."
      />
    </div>
  );
}
