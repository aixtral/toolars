"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ClipboardList, FileText, Play, Save } from "lucide-react";
import { AiConsentDialog } from "@/components/core/ai-consent-dialog";
import { useDialogFocus } from "@/components/core/use-dialog-focus";
import { appendAiConsentAuditEvent } from "@/lib/ai/consent-audit-storage";
import { buildAiConsentRunMetadata } from "@/lib/ai/consent-audit-run-metadata";
import { selectAiProviderRoute } from "@/lib/ai/provider-routing";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import type { PdfUploadServerHandoffRecord } from "@/lib/tools/pdf-upload-lifecycle";
import { buildWorkspaceAuditHeaders, buildWorkspaceScopedJsonHeaders } from "@/lib/workspace/workspace-identity";
import {
  buildPdfSummarySteps,
  runPdfSummaryWorkflow,
  type PdfSummaryResult
} from "@/lib/workflows/pdf-summary";

const variations = ["boardPack", "clientSummary", "tableExtract"] as const;
const steps = buildPdfSummarySteps();
const pdfSummaryProviderRoute = selectAiProviderRoute({ workflowSlug: "pdf-summary", stepId: "summarize-with-ai" });
type PdfSummaryVariation = (typeof variations)[number];

export function PdfSummaryWorkflow() {
  const t = useTranslations("workflowsPage.pdfSummary.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [variation, setVariation] = useState("boardPack" as PdfSummaryVariation);
  const [result, setResult] = useState(null as PdfSummaryResult | null);
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false);
  const [consentReviewed, setConsentReviewed] = useState(false);
  const [handoffUploads, setHandoffUploads] = useState([] as PdfUploadServerHandoffRecord[]);
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
    const contentSummary = t("consent.contentSummary");
    const event = {
      approvedAt,
      contentSummary,
      providerLabel: pdfSummaryProviderRoute.providerLabel,
      providerRouteId: pdfSummaryProviderRoute.providerRouteId,
      stepId: pdfSummaryProviderRoute.stepId,
      workflowSlug: pdfSummaryProviderRoute.workflowSlug,
      workflowTitle: t("consent.workflowTitle")
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
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <div className="badge-row workflow-badge-row">
          <span className="badge ai">{t("badges.aiConsent")}</span>
          <span className="badge local">{t("badges.localSteps")}</span>
          <span className="badge">{t("badges.duration")}</span>
        </div>

        <h2 style={{ marginTop: 26 }}>{t("variations.title")}</h2>
        <div className="workflow-mode-row" role="group" aria-label={t("variations.ariaLabel")}>
          {variations.map((item) => (
            <button
              aria-pressed={variation === item}
              className={`button ${variation === item ? "button-soft" : "button-outline-neutral"}`}
              key={item}
              onClick={() => setVariation(item)}
              type="button"
            >
              {t(`variations.${item}`)}
            </button>
          ))}
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("stepCanvas.title")}</h2>
              <p className="tool-description">{t("stepCanvas.description")}</p>
            </div>
            <button disabled className="button button-outline-neutral" type="button">
              <Save size={16} aria-hidden="true" /> {t("actions.saveTemplate")}
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
                <span className={`badge ${step.badge === "AI" ? "ai" : "local"}`}>
                  {step.badge === "AI" ? t("badges.ai") : t("badges.local")}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workflow-run-head">
            <div>
              <h2>{t("runPreview.title")}</h2>
              <p className="tool-description">{t("runPreview.description")}</p>
            </div>
            <button className="button button-solid workflow-run-button" onClick={runWorkflow} type="button">
              <Play size={16} aria-hidden="true" /> {t("actions.runWorkflow")}
            </button>
          </div>

          <div
            aria-label={t("runPreview.progressLabel")}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="workflow-progress"
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="workflow-output-box">
            <strong>{result?.statusTitle ?? t("runPreview.readyTitle")}</strong>
            <p>{result?.summary ?? t("runPreview.readyDescription")}</p>
            {result ? <small>{result.securityNote}</small> : null}
          </div>
        </section>
      </div>

      <aside className="workspace-panel workflow-tool-chain">
        <h2>{t("settings.title")}</h2>
        <div className="workflow-resource-list">
          <a className="workflow-resource-row" href={localizedHref("/tools/pdf-toolkit")}>
            <span className="icon-tile rose">
              <FileText size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("settings.pdfToolkitTitle")}</strong>
              <small>{t("settings.pdfToolkitDescription")}</small>
            </span>
            <span className="badge local">{t("badges.local")}</span>
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
              <span className="badge local">{t("badges.handoffReady")}</span>
            </div>
          ))}
          <div className="workflow-resource-row">
            <span className="icon-tile emerald" data-workflow-resource-icon="executive-summary-style">
              <ClipboardList size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("settings.executiveTitle")}</strong>
              <small>{t("settings.executiveDescription")}</small>
            </span>
            <span className="badge">{t("badges.style")}</span>
          </div>
        </div>

        <div className="workflow-review-gate">
          <strong>{t("settings.reviewTitle")}</strong>
          <p>{t("settings.reviewDescription")}</p>
          {consentReviewed ? <small>{t("settings.reviewed")}</small> : null}
          <button
            ref={consentTriggerRef}
            className="button button-outline-neutral"
            type="button"
            onClick={() => setIsConsentDialogOpen(true)}
          >
            {t("actions.reviewConsent")}
          </button>
        </div>
      </aside>

      <AiConsentDialog
        contentSummary={t("consent.contentSummary")}
        dialogRef={consentDialogRef}
        isOpen={isConsentDialogOpen}
        onApprove={approveAiConsent}
        onClose={closeConsentDialog}
        providerSummary={t("consent.providerSummary", {
          modelFamily: pdfSummaryProviderRoute.modelFamily,
          providerLabel: pdfSummaryProviderRoute.providerLabel,
          retentionDays: pdfSummaryProviderRoute.retentionDays
        })}
        retentionSummary={t("consent.retentionSummary")}
        scopeSummary={t("consent.scopeSummary")}
      />
    </div>
  );
}
