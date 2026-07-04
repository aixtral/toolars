"use client";
import { useLocale, useTranslations } from "next-intl";

import { type KeyboardEvent as ReactKeyboardEvent, useId, useMemo, useState } from "react";
import { CheckCircle2, Download, FileText, Link2, LockKeyhole, Mail, MoreHorizontal, RotateCcw, Sparkles, Table2, Trash2, Upload } from "lucide-react";
import { AiConsentDialog } from "@/components/core/ai-consent-dialog";
import { useDialogFocus } from "@/components/core/use-dialog-focus";
import {
  buildPdfJob,
  getPdfOperationPolicies,
  getPdfOperationPolicy,
  samplePdfFiles,
  type PdfFile,
  type PdfJobResult,
  type PdfOperation
} from "@/lib/tools/pdf-toolkit";
import {
  buildPdfUploadItems,
  getReadyPdfUploadItems,
  markPdfUploadStorageFailed,
  mergePdfUploadServerRecords,
  type PdfUploadItem,
  type PdfUploadServerHandoffRecord
} from "@/lib/tools/pdf-upload-lifecycle";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { buildWorkspaceAuditHeaders } from "@/lib/workspace/workspace-identity";

type PdfWorkspaceTranslator = ReturnType<typeof useTranslations>;
type PdfUploadSelectionEvent = {
  currentTarget: HTMLInputElement;
};
type PdfUploadDialogProps = {
  dialogRef: { current: HTMLElement | null };
  isOpen: boolean;
  onAddReadyUploads: () => void;
  onClose: () => void;
  onFilesSelected: (event: PdfUploadSelectionEvent) => void;
  onRetryServerUploadHandoff: () => void;
  stagedUploads: PdfUploadItem[];
};

const INITIAL_PDF_OPERATION: PdfOperation = "merge";
const localOperations = getPdfOperationPolicies().filter((operation) => operation.processing === "local");

function createEmptyPdfUploadItems(): PdfUploadItem[] {
  return [];
}

function createEmptyUploadFiles(): File[] {
  return [];
}

function createInitialSelectedFiles(): PdfFile[] {
  return samplePdfFiles.slice(0, 2);
}

function createInitialPdfJob(): PdfJobResult {
  return buildPdfJob({
    files: createInitialSelectedFiles(),
    operation: INITIAL_PDF_OPERATION,
    consentGranted: false
  });
}

export function PdfToolkitWorkspace() {
  const t = useTranslations("tools.pdf-toolkit");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const [operation, setOperation] = useState(INITIAL_PDF_OPERATION);
  const [aiSummarySelected, setAiSummarySelected] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [lastLocalUploads, setLastLocalUploads] = useState(createEmptyPdfUploadItems);
  const [lastUploadFiles, setLastUploadFiles] = useState(createEmptyUploadFiles);
  const [selectedFiles, setSelectedFiles] = useState(createInitialSelectedFiles);
  const [stagedUploads, setStagedUploads] = useState(createEmptyPdfUploadItems);
  const [uploadStatus, setUploadStatus] = useState(t("workspace.upload.status.initial"));
  const [job, setJob] = useState(createInitialPdfJob);

  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  const activePolicy = getPdfOperationPolicy(operation);
  const {
    dialogRef: consentDialogRef,
    restoreTriggerFocus: restoreConsentTriggerFocus,
    triggerRef: consentTriggerRef
  } = useDialogFocus(isConsentDialogOpen);
  const {
    dialogRef: uploadDialogRef,
    restoreTriggerFocus: restoreUploadTriggerFocus,
    triggerRef: uploadTriggerRef
  } = useDialogFocus(isUploadDialogOpen);
  const totalPages = useMemo(() => selectedFiles.reduce((sum, file) => sum + file.pages, 0), [selectedFiles]);
  const totalSize = useMemo(() => selectedFiles.reduce((sum, file) => sum + file.sizeMb, 0), [selectedFiles]);
  const designTakeaways = [
    t("workspace.ai.designTakeaways.leads"),
    t("workspace.ai.designTakeaways.paidSearch"),
    t("workspace.ai.designTakeaways.campaign"),
    t("workspace.ai.designTakeaways.budget")
  ];
  const designCitations = [
    t("workspace.ai.designCitations.overview"),
    t("workspace.ai.designCitations.paidSearch"),
    t("workspace.ai.designCitations.budget"),
    t("workspace.ai.designCitations.recommendations")
  ];

  const runOperation = () => {
    setJob(
      buildPdfJob({
        files: selectedFiles,
        operation,
        consentGranted
      })
    );
  };

  const chooseLocalOperation = (nextOperation: PdfOperation) => {
    setOperation(nextOperation);
    setAiSummarySelected(false);
    setJob(
      buildPdfJob({
        files: selectedFiles,
        operation: nextOperation,
        consentGranted
      })
    );
  };

  const chooseAiSummary = () => {
    setAiSummarySelected(true);
    setJob({
      status: "needs-consent",
      consentRequired: true,
      securityLabel: "AI consent required",
      message: "Consent required before AI processing."
    });
  };

  const runAiSummary = () => {
    setAiSummarySelected(true);
    setJob(
      buildPdfJob({
        files: selectedFiles,
        operation: "summarize",
        consentGranted
      })
    );
  };

  const closeConsentDialog = () => {
    setIsConsentDialogOpen(false);
    restoreConsentTriggerFocus();
  };

  const approveAiConsent = () => {
    setConsentGranted(true);
    closeConsentDialog();
  };

  const closeUploadDialog = () => {
    setIsUploadDialogOpen(false);
    restoreUploadTriggerFocus();
  };

  const handleUploadSelection = (event: PdfUploadSelectionEvent) => {
    const files = Array.from(event.currentTarget.files ?? []);
    const nextUploads = buildPdfUploadItems(files);
    const readyCount = getReadyPdfUploadItems(nextUploads).length;

    setLastLocalUploads(nextUploads);
    setLastUploadFiles(files);
    setStagedUploads(nextUploads);
    setUploadStatus(
      readyCount === 1
        ? t("workspace.upload.status.localReadyOne")
        : t("workspace.upload.status.localReadyMany", { count: readyCount })
    );

    void registerServerUploadHandoff(files, nextUploads);
  };

  const registerServerUploadHandoff = async (files: File[], localUploads: PdfUploadItem[]) => {
    if (files.length === 0 || typeof fetch !== "function" || typeof FormData === "undefined") return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
      formData.append("fileNames", file.name);
    });

    try {
      const response = await fetch("/api/pdf/uploads", {
        body: formData,
        headers: buildWorkspaceAuditHeaders(),
        method: "POST"
      });
      if (!response.ok) throw new Error("PDF upload temp store unavailable");

      const payload = (await response.json()) as { uploads?: PdfUploadServerHandoffRecord[] };
      const serverUploads = mergePdfUploadServerRecords(localUploads, payload.uploads ?? []);
      const readyCount = getReadyPdfUploadItems(serverUploads).length;

      setStagedUploads(serverUploads);
      setUploadStatus(
        readyCount === 1
          ? t("workspace.upload.status.serverReadyOne")
          : t("workspace.upload.status.serverReadyMany", { count: readyCount })
      );
    } catch {
      const readyCount = getReadyPdfUploadItems(localUploads).length;
      setStagedUploads(markPdfUploadStorageFailed(localUploads));
      setUploadStatus(
        readyCount === 1
          ? t("workspace.upload.status.serverFailedOne")
          : t("workspace.upload.status.serverFailedMany", { count: readyCount })
      );
    }
  };

  const retryServerUploadHandoff = () => {
    if (lastUploadFiles.length === 0 || lastLocalUploads.length === 0) return;

    void registerServerUploadHandoff(lastUploadFiles, lastLocalUploads);
  };

  const addReadyUploadsToQueue = () => {
    const readyUploads = getReadyPdfUploadItems(stagedUploads);
    if (readyUploads.length === 0) return;

    setSelectedFiles((currentFiles) => [...currentFiles, ...readyUploads]);
    setUploadStatus(
      readyUploads.length === 1
        ? t("workspace.upload.status.addedOne", { name: readyUploads[0].name })
        : t("workspace.upload.status.addedMany", { count: readyUploads.length })
    );
    setStagedUploads([]);
    closeUploadDialog();
  };

  const deleteSelectedFile = (file: PdfFile) => {
    setSelectedFiles((currentFiles) => currentFiles.filter((item) => item.id !== file.id));
    setUploadStatus(t("workspace.upload.status.deleted", { name: file.name }));
  };

  return (
    <div className="pdf-workspace-shell" data-pdf-desktop-layout="workspace-v2" data-pdf-mobile-density="sidebar-first">
      <section className="pdf-mobile-workspace-rail" data-pdf-mobile-rail="true" aria-label={t("workspace.a11y.navigation")}>
        <div className="pdf-mobile-rail-brand">
          <span className="pdf-mobile-rail-mark" aria-hidden="true" />
          <span>
            <strong>Toolars</strong>
            <small>{t("workspace.mobileRail.workspace")}</small>
          </span>
        </div>
        <a className="pdf-mobile-rail-back" href={localizedHref("/explore/pdf")}>
          <span>PDF</span>
          <strong>{t("workspace.mobileRail.backToCatalog")}</strong>
        </a>

        <h2>{t("workspace.mobileRail.workspace")}</h2>
        <div className="pdf-mobile-rail-list">
          <div className="pdf-mobile-rail-row is-active">
            <strong>{t("workspace.mobileRail.files")}</strong>
            <span>3</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>{t("workspace.mobileRail.operations")}</strong>
            <span>8</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>{t("workspace.ai.title")}</strong>
            <span>2</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>{t("workspace.mobileRail.outputHistory")}</strong>
            <span>12</span>
          </div>
        </div>

        <h2>{t("workspace.mobileRail.recentOutputs")}</h2>
        <div className="pdf-mobile-rail-list">
          <div className="pdf-mobile-rail-row">
            <strong>{t("workspace.mobileRail.recentOutputsList.q2Summary")}</strong>
            <span>{t("workspace.mobileRail.recentOutputTimes.twoHours")}</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>{t("workspace.mobileRail.recentOutputsList.invoiceBundle")}</strong>
            <span>{t("workspace.mobileRail.recentOutputTimes.oneDay")}</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>{t("workspace.mobileRail.recentOutputsList.boardNotes")}</strong>
            <span>{t("workspace.mobileRail.recentOutputTimes.threeDays")}</span>
          </div>
        </div>

        <div className="pdf-mobile-rail-usage">
          <strong>{t("workspace.mobileRail.proPlanUsage")}</strong>
          <span>{t("workspace.mobileRail.aiCredits")}</span>
          <span className="pdf-mobile-rail-meter is-credits">
            <span />
          </span>
          <span>{t("workspace.mobileRail.storage")}</span>
          <span className="pdf-mobile-rail-meter is-storage">
            <span />
          </span>
        </div>
      </section>

      <section className="workspace-tabs" aria-label={t("workspace.a11y.modes")}>
        <button className="workspace-tab is-active" type="button">
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <strong>{t("workspace.tabs.traditionalTool")}</strong>
            <small>{t("workspace.tabs.localProcessing")}</small>
          </span>
        </button>
        <button className="workspace-tab" type="button" onClick={chooseAiSummary}>
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <strong>{t("workspace.ai.title")}</strong>
            <small>{t("workspace.tabs.aiPoweredFeatures")}</small>
          </span>
        </button>
        <a className="workspace-tab" href={localizedHref("/workflows/pdf-summary")}>
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <strong>{t("workspace.tabs.workflowBuilder")}</strong>
            <small>{t("workspace.tabs.automateTasks")}</small>
          </span>
        </a>
      </section>

      <div className="workspace-layout pdf-workspace">
        <section className="workspace-panel">
          <span className="eyebrow">{t("workspace.eyebrow")}</span>
          <h1>{t("name")}</h1>
          <p className="subtitle">{t("description")}</p>

          <div className="workspace-section-title">
            <h2>{t("workspace.files.title")}</h2>
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setSelectedFiles([]);
                setUploadStatus(t("workspace.upload.status.cleared"));
              }}
            >
              <Trash2 size={14} aria-hidden="true" /> {t("workspace.files.clearAll")}
            </button>
          </div>
          <div className="pdf-actions">
            <button ref={uploadTriggerRef} className="button button-outline" type="button" onClick={() => setIsUploadDialogOpen(true)}>
              <Upload size={16} aria-hidden="true" /> {t("workspace.files.addFiles")}
            </button>
            <button className="button button-outline" type="button">{t("workspace.files.importFromDrive")}</button>
          </div>

          <div className="pdf-file-list" aria-label={t("workspace.files.selectedFiles")}>
            {selectedFiles.map((file) => (
              <article className="pdf-file-row" key={file.id}>
                <span className="pdf-drag-handle" aria-hidden="true">::</span>
                <span className="pdf-file-icon">PDF</span>
                <span>
                  <strong>{file.name}</strong>
                  <small>{t("workspace.files.fileMeta", { pages: file.pages, size: file.sizeMb.toFixed(1) })}</small>
                  {isPdfUploadItem(file) ? (
                    <small>
                      {t("workspace.upload.uploadedMeta", {
                        retentionLabel: localizePdfUploadLabel(file.retentionLabel, t),
                        scanLabel: localizePdfUploadLabel(file.scanLabel, t)
                      })}
                    </small>
                  ) : null}
                </span>
                <span className="badge local">{t("workspace.files.localBadge")}</span>
                <button
                  aria-label={t("workspace.files.deleteAria", { name: file.name })}
                  className="text-button"
                  type="button"
                  onClick={() => deleteSelectedFile(file)}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
          <p className="settings-status-note" aria-live="polite">{uploadStatus}</p>

          <div className="workspace-section-title">
            <h2>{t("workspace.operations.title")}</h2>
          </div>
          <div className="operation-grid">
            {localOperations.map((item) => (
              <button
                className={`operation-button ${operation === item.operation ? "is-selected" : ""}`}
                key={item.operation}
                type="button"
                onClick={() => chooseLocalOperation(item.operation)}
              >
                <Sparkles size={17} aria-hidden="true" />
                {t(`workspace.operations.${item.operation}.label`)}
              </button>
            ))}
          </div>

          <div className="settings-list">
            <div>
              <strong>{t("workspace.operations.settingsTitle", { operation: t(`workspace.operations.${activePolicy.operation}.label`) })}</strong>
              <p className="tool-description">{t(`workspace.operations.${activePolicy.operation}.description`)}</p>
            </div>
            <label className="toggle-row">
              <span>{t("workspace.operations.addBookmark")}</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="toggle-row">
              <span>{t("workspace.operations.optimizeSize")}</span>
              <input type="checkbox" />
            </label>
          </div>

          <button className="button button-solid full-width" type="button" onClick={runOperation}>
            {t(`workspace.operations.${activePolicy.operation}.primaryAction`)}
          </button>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title">
            <h2>{t("workspace.result.title")}</h2>
            {job.status === "completed" ? <span className="badge local"><CheckCircle2 size={14} aria-hidden="true" /> {t("workspace.result.completed")}</span> : null}
          </div>

          <div className={job.status === "needs-consent" ? "status-error" : "status-success"}>{localizePdfJobMessage(job.message, t)}</div>

          <article className="pdf-output-card">
            <span className="pdf-file-icon large">PDF</span>
            <span>
              <strong>{job.output?.fileName ?? "Q2_Marketing_Report_2024_pending.pdf"}</strong>
              <small>
                {job.output
                  ? t("workspace.files.fileMeta", { pages: job.output.pages, size: job.output.sizeMb.toFixed(1) })
                  : t("workspace.files.fileMeta", { pages: totalPages, size: totalSize.toFixed(1) })}
              </small>
            </span>
          </article>

          <div className="button-row" style={{ justifyContent: "flex-start" }}>
            <button className="button button-solid" type="button" disabled={job.status !== "completed"}>
              <Download size={16} aria-hidden="true" /> {t("workspace.result.download")}
            </button>
            <button className="button button-outline" type="button" disabled={job.status !== "completed"}>
              <Link2 size={16} aria-hidden="true" /> {t("workspace.result.copyLink")}
            </button>
            <button className="button button-outline" type="button">
              <MoreHorizontal size={16} aria-hidden="true" />
            </button>
          </div>

          <h2 style={{ marginTop: 24 }}>{t("workspace.result.preview")}</h2>
          <div className="pdf-preview-strip" aria-label={t("workspace.result.previewPages")}>
            {[1, 2, 3, 4].map((page) => (
              <span className="pdf-preview-page" key={page}>
                <FileText size={22} aria-hidden="true" />
                <small>{page}</small>
              </span>
            ))}
          </div>

          <dl className="detail-list">
            <div>
              <dt>{t("workspace.result.operation")}</dt>
              <dd>{t(`workspace.operations.${activePolicy.operation}.label`)}</dd>
            </div>
            <div>
              <dt>{t("workspace.result.originalSize")}</dt>
              <dd>{t("workspace.result.originalSizeValue", { count: selectedFiles.length, size: totalSize.toFixed(1) })}</dd>
            </div>
            <div>
              <dt>{t("workspace.result.pages")}</dt>
              <dd>{t("workspace.result.pagesValue", { pages: totalPages })}</dd>
            </div>
            <div>
              <dt>{t("workspace.result.security")}</dt>
              <dd>{localizePdfJobSecurityLabel(job.securityLabel, t)}</dd>
            </div>
          </dl>
        </section>

        <aside className="workspace-panel">
          <div className="workspace-section-title">
            <h2>{t("workspace.ai.title")}</h2>
            <span className="badge ai">{t("workspace.ai.betaBadge")}</span>
          </div>
          <div className="ai-tabs" aria-label={t("workspace.ai.actionsLabel")}>
            <button className={aiSummarySelected ? "is-selected" : ""} type="button" onClick={chooseAiSummary}>
              {t("workspace.ai.summarize")}
            </button>
            <button type="button">{t("workspace.ai.actionItems")}</button>
            <button type="button">{t("workspace.ai.translate")}</button>
          </div>

          <div className="consent-box">
            <strong>
              <LockKeyhole size={16} aria-hidden="true" /> {t("workspace.ai.consentTitle")}
            </strong>
            <p>{t("workspace.ai.consentDescription")}</p>
            <button
              ref={consentTriggerRef}
              className="button button-solid"
              type="button"
              onClick={() => {
                if (!consentGranted) {
                  setIsConsentDialogOpen(true);
                }
              }}
            >
              {consentGranted ? t("workspace.ai.consentGranted") : t("workspace.ai.consentButton")}
            </button>
          </div>

          <button className="button button-solid full-width" type="button" onClick={runAiSummary}>
            {t("workspace.ai.generateSummary")}
          </button>

          <div className="summary-box pdf-ai-summary-box">
            <strong>{job.output?.summary ? t("workspace.ai.summaryReady") : t("workspace.ai.summary")}</strong>
            <p>{job.output?.summary ? localizePdfOutputSummary(job.output.summary, t) : t("workspace.ai.designSummary")}</p>
            <strong>{t("workspace.ai.keyTakeaways")}</strong>
            <ul>
              {designTakeaways.map((takeaway) => (
                <li key={takeaway}>{takeaway}</li>
              ))}
            </ul>
            <strong>{t("workspace.ai.citations")}</strong>
            <ul className="pdf-citation-list">
              {(job.output?.citations?.map((citation) => localizePdfCitation(citation, t)) ?? designCitations).map((citation) => (
                <li key={citation}>{citation}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className="next-step-strip" aria-label={t("workspace.nextSteps.ariaLabel")}>
        <article>
          <Sparkles size={20} aria-hidden="true" />
          <span>
            <strong>{t("workspace.nextSteps.summarizeTitle")}</strong>
            <small>{t("workspace.nextSteps.summarizeDescription")}</small>
          </span>
        </article>
        <article>
          <FileText size={20} aria-hidden="true" />
          <span>
            <strong>{t("workspace.nextSteps.slidesTitle")}</strong>
            <small>{t("workspace.nextSteps.slidesDescription")}</small>
          </span>
        </article>
        <article>
          <Table2 size={20} aria-hidden="true" />
          <span>
            <strong>{t("workspace.nextSteps.csvTitle")}</strong>
            <small>{t("workspace.nextSteps.csvDescription")}</small>
          </span>
        </article>
        <article>
          <Mail size={20} aria-hidden="true" />
          <span>
            <strong>{t("workspace.nextSteps.emailTitle")}</strong>
            <small>{t("workspace.nextSteps.emailDescription")}</small>
          </span>
        </article>
        <article>
          <RotateCcw size={20} aria-hidden="true" />
          <span>
            <strong>{t("workspace.nextSteps.allWorkflowsTitle")}</strong>
            <small>{t("workspace.nextSteps.allWorkflowsDescription")}</small>
          </span>
        </article>
      </section>

      <section className="trust-strip" aria-label={t("workspace.trust.ariaLabel")}>
        <div>
          <CheckCircle2 size={22} aria-hidden="true" />
          <span>
            <strong>{t("workspace.trust.localTitle")}</strong>
            <small>{t("workspace.trust.localDescription")}</small>
          </span>
        </div>
        <div>
          <LockKeyhole size={22} aria-hidden="true" />
          <span>
            <strong>{t("workspace.trust.aiTitle")}</strong>
            <small>{t("workspace.trust.aiDescription")}</small>
          </span>
        </div>
        <div>
          <Trash2 size={22} aria-hidden="true" />
          <span>
            <strong>{t("workspace.trust.filesTitle")}</strong>
            <small>{t("workspace.trust.filesDescription")}</small>
          </span>
        </div>
      </section>

      <AiConsentDialog
        contentSummary={t("workspace.ai.dialogContentSummary")}
        dialogRef={consentDialogRef}
        isOpen={isConsentDialogOpen}
        onApprove={approveAiConsent}
        onClose={closeConsentDialog}
        retentionSummary={t("workspace.ai.dialogRetentionSummary")}
        scopeSummary={t("workspace.ai.dialogScopeSummary")}
      />
      <PdfUploadDialog
        dialogRef={uploadDialogRef}
        isOpen={isUploadDialogOpen}
        onAddReadyUploads={addReadyUploadsToQueue}
        onClose={closeUploadDialog}
        onFilesSelected={handleUploadSelection}
        onRetryServerUploadHandoff={retryServerUploadHandoff}
        stagedUploads={stagedUploads}
      />
    </div>
  );
}

function isPdfUploadItem(file: PdfFile): file is PdfUploadItem {
  return "scanStatus" in file;
}

function localizePdfUploadLabel(label: string, t: PdfWorkspaceTranslator) {
  switch (label) {
    case "Scan passed":
      return t("workspace.upload.labels.scanPassed");
    case "Server scan passed":
      return t("workspace.upload.labels.serverScanPassed");
    case "Only PDF files can be queued":
      return t("workspace.upload.labels.onlyPdf");
    case "Blocked by 50 MB PDF limit":
      return t("workspace.upload.labels.blockedByLimit");
    case "Auto-delete after session":
      return t("workspace.upload.labels.autoDelete");
    case "Not retained":
      return t("workspace.upload.labels.notRetained");
    case "Local only":
      return t("workspace.upload.labels.localOnly");
    case "Storage handoff ready":
      return t("workspace.upload.labels.storageReady");
    case "Storage handoff failed":
      return t("workspace.upload.labels.storageFailed");
    case "Temporary server object":
      return t("workspace.upload.labels.temporaryServerObject");
    default:
      return label;
  }
}

function localizePdfJobMessage(message: string, t: PdfWorkspaceTranslator) {
  switch (message) {
    case "Add at least one PDF file to continue.":
      return t("workspace.jobMessages.addFile");
    case "Consent required before AI processing.":
      return t("workspace.jobMessages.consentRequired");
    case "AI processing complete":
      return t("workspace.jobMessages.aiComplete");
    case "Local processing complete":
      return t("workspace.jobMessages.localComplete");
    default:
      return message;
  }
}

function localizePdfJobSecurityLabel(label: string, t: PdfWorkspaceTranslator) {
  switch (label) {
    case "Waiting for files":
      return t("workspace.securityLabels.waitingForFiles");
    case "AI consent required":
      return t("workspace.securityLabels.aiConsentRequired");
    case "AI consent granted":
      return t("workspace.securityLabels.aiConsentGranted");
    case "Processed locally":
      return t("workspace.securityLabels.processedLocally");
    default:
      return label;
  }
}

function localizePdfOutputSummary(summary: string, t: PdfWorkspaceTranslator) {
  if (
    summary ===
    "This document is a Q2 2024 marketing report that outlines campaign performance, budget utilization, key wins, challenges, and recommendations for the next quarter."
  ) {
    return t("workspace.ai.outputSummary");
  }

  return summary;
}

function localizePdfCitation(citation: string, t: PdfWorkspaceTranslator) {
  switch (citation) {
    case "p. 3 Q2 Performance Overview":
      return t("workspace.ai.outputCitations.overview");
    case "p. 8 Campaign Results":
      return t("workspace.ai.outputCitations.results");
    case "p. 12 Budget Summary":
      return t("workspace.ai.outputCitations.budget");
    default:
      return citation;
  }
}

function PdfUploadDialog({
  dialogRef,
  isOpen,
  onAddReadyUploads,
  onClose,
  onFilesSelected,
  onRetryServerUploadHandoff,
  stagedUploads
}: PdfUploadDialogProps) {
  const t = useTranslations("tools.pdf-toolkit");
  const titleId = useId();
  const readyCount = getReadyPdfUploadItems(stagedUploads).length;

  if (!isOpen) return null;

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      onClose();
    }
  }

  return (
    <div className="core-modal-overlay file-upload-overlay" role="presentation">
      <section
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className="core-modal-dialog file-upload-dialog"
        onKeyDown={handleKeyDown}
        role="dialog"
        tabIndex={-1}
      >
        <div className="core-modal-head">
          <span className="eyebrow">{t("workspace.upload.dialog.eyebrow")}</span>
          <h2 id={titleId}>{t("workspace.upload.dialog.title")}</h2>
          <p>{t("workspace.upload.dialog.description")}</p>
        </div>

        <div className="file-upload-checklist" aria-label={t("workspace.upload.dialog.guidanceLabel")}>
          <article>
            <strong>{t("workspace.upload.dialog.localTitle")}</strong>
            <small>{t("workspace.upload.dialog.localDescription")}</small>
          </article>
          <article>
            <strong>{t("workspace.upload.dialog.limitTitle")}</strong>
            <small>{t("workspace.upload.dialog.limitDescription")}</small>
          </article>
          <article>
            <strong>{t("workspace.upload.dialog.queueTitle")}</strong>
            <small>{t("workspace.upload.dialog.queueDescription")}</small>
          </article>
        </div>

        <label className="file-upload-picker">
          <span>{t("workspace.upload.chooseFiles")}</span>
          <input aria-label={t("workspace.upload.chooseFiles")} accept="application/pdf,.pdf" multiple type="file" onChange={onFilesSelected} />
        </label>

        {stagedUploads.length > 0 ? (
          <div className="file-upload-staged-list" aria-label={t("workspace.upload.stagedUploadsLabel")}>
            {stagedUploads.map((file) => (
              <article className="pdf-file-row" key={file.id}>
                <span className="pdf-file-icon">PDF</span>
                <span>
                  <strong>{file.name}</strong>
                  <small>{t("workspace.upload.sizeMb", { size: file.sizeMb.toFixed(1) })}</small>
                  <small>{localizePdfUploadLabel(file.scanLabel, t)}</small>
                  <small>{localizePdfUploadLabel(file.retentionLabel, t)}</small>
                  <small>{localizePdfUploadLabel(file.storageLabel, t)}</small>
                  {file.handoffToken ? <small>{file.handoffToken}</small> : null}
                  {file.storageStatus === "failed" ? (
                    <button
                      aria-label={t("workspace.upload.retryAria", { name: file.name })}
                      className="text-button"
                      type="button"
                      onClick={onRetryServerUploadHandoff}
                    >
                      <RotateCcw size={13} aria-hidden="true" /> {t("workspace.upload.retryButton")}
                    </button>
                  ) : null}
                </span>
                <span className={`badge ${file.scanStatus === "scan-passed" ? "local" : "ai"}`}>
                  {file.scanStatus === "scan-passed" ? t("workspace.upload.dialog.readyBadge") : t("workspace.upload.dialog.rejectedBadge")}
                </span>
              </article>
            ))}
          </div>
        ) : null}

        <footer className="core-modal-footer">
          <button className="button button-outline-neutral" type="button" onClick={onClose}>
            {t("workspace.upload.dialog.cancel")}
          </button>
          <button className="button button-solid" disabled={readyCount === 0} type="button" onClick={onAddReadyUploads}>
            {readyCount === 1 ? t("workspace.upload.addOne") : t("workspace.upload.addMany", { count: readyCount })}
          </button>
        </footer>
      </section>
    </div>
  );
}
