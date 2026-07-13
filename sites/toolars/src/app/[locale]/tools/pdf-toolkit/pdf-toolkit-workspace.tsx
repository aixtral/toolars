"use client";
import { useLocale, useTranslations } from "next-intl";

import { type KeyboardEvent as ReactKeyboardEvent, useId, useMemo, useState } from "react";
import { CheckCircle2, Download, Sparkles, Trash2, Upload } from "lucide-react";
import { useDialogFocus } from "@/components/core/use-dialog-focus";
import {
  buildPdfJob,
  getPdfOperationPolicies,
  getPdfOperationPolicy,
  type PdfJobResult,
  type PdfOperation
} from "@/lib/tools/pdf-toolkit";
import {
  buildPdfUploadItems,
  type PdfUploadItem
} from "@/lib/tools/pdf-upload-lifecycle";
import { getPdfPageCount, processPdfFiles, type LocalPdfProcessingResult } from "@/lib/tools/pdf-local-processor";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

type PdfWorkspaceTranslator = ReturnType<typeof useTranslations>;
type PdfUploadSelectionEvent = {
  currentTarget: HTMLInputElement;
};
type QueuedPdfFile = PdfUploadItem & { rawFile: File };
type PdfUploadDialogProps = {
  dialogRef: { current: HTMLElement | null };
  isOpen: boolean;
  onAddReadyUploads: () => void;
  onClose: () => void;
  onFilesSelected: (event: PdfUploadSelectionEvent) => void;
  stagedUploads: QueuedPdfFile[];
};

const INITIAL_PDF_OPERATION: PdfOperation = "merge";
const localOperations = getPdfOperationPolicies();

function isLocalPdfOperation(operation: PdfOperation): operation is "merge" | "split" | "compress" {
  return operation === "merge" || operation === "split" || operation === "compress";
}

function createEmptyPdfUploadItems(): QueuedPdfFile[] {
  return [];
}

function createInitialSelectedFiles(): QueuedPdfFile[] {
  return [];
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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(createInitialSelectedFiles);
  const [stagedUploads, setStagedUploads] = useState(createEmptyPdfUploadItems);
  const [uploadStatus, setUploadStatus] = useState(t("workspace.upload.status.initial"));
  const [job, setJob] = useState(createInitialPdfJob);
  const [processedOutput, setProcessedOutput] = useState<LocalPdfProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  const activePolicy = getPdfOperationPolicy(operation);
  const {
    dialogRef: uploadDialogRef,
    restoreTriggerFocus: restoreUploadTriggerFocus,
    triggerRef: uploadTriggerRef
  } = useDialogFocus(isUploadDialogOpen);
  const totalPages = useMemo(() => selectedFiles.reduce((sum, file) => sum + file.pages, 0), [selectedFiles]);
  const totalSize = useMemo(() => selectedFiles.reduce((sum, file) => sum + file.sizeMb, 0), [selectedFiles]);
  const runOperation = async () => {
    if (selectedFiles.length === 0) {
      setJob(buildPdfJob({ files: [], operation, consentGranted: false }));
      return;
    }

    if (!isLocalPdfOperation(operation)) return;

    setIsProcessing(true);
    setProcessedOutput(null);
    try {
      const output = await processPdfFiles({
        files: await Promise.all(
          selectedFiles.map(async (file) => ({
            bytes: new Uint8Array(await file.rawFile.arrayBuffer()),
            name: file.name
          }))
        ),
        operation
      });
      setProcessedOutput(output);
      setJob({
        status: "completed",
        consentRequired: false,
        securityLabel: "Processed locally",
        message: "Local processing complete",
        output: {
          fileName: output.fileName,
          pages: output.pages,
          sizeMb: Math.round((output.bytes.byteLength / 1024 / 1024) * 10) / 10
        }
      });
    } catch {
      setJob(buildPdfJob({ files: [], operation, consentGranted: false }));
    } finally {
      setIsProcessing(false);
    }
  };

  const chooseLocalOperation = (nextOperation: PdfOperation) => {
    setOperation(nextOperation);
    setProcessedOutput(null);
    setJob(buildPdfJob({ files: [], operation: nextOperation, consentGranted: false }));
  };

  const closeUploadDialog = () => {
    setIsUploadDialogOpen(false);
    restoreUploadTriggerFocus();
  };

  const handleUploadSelection = async (event: PdfUploadSelectionEvent) => {
    const files = Array.from(event.currentTarget.files ?? []);
    const nextUploads = await Promise.all(
      buildPdfUploadItems(files).map(async (upload, index) => {
        const rawFile = files[index]!;
        if (upload.scanStatus !== "scan-passed") return { ...upload, rawFile };

        try {
          return {
            ...upload,
            pages: await getPdfPageCount(new Uint8Array(await rawFile.arrayBuffer())),
            rawFile
          };
        } catch {
          return {
            ...upload,
            rawFile,
            retentionLabel: "Not retained",
            scanLabel: "The PDF could not be read",
            scanStatus: "rejected" as const
          };
        }
      })
    );
    const readyCount = nextUploads.filter((upload) => upload.scanStatus === "scan-passed").length;

    setStagedUploads(nextUploads);
    setUploadStatus(
      readyCount === 1
        ? t("workspace.upload.status.localReadyOne")
        : t("workspace.upload.status.localReadyMany", { count: readyCount })
    );

  };

  const addReadyUploadsToQueue = () => {
    const readyUploads = stagedUploads.filter(
      (upload) => upload.scanStatus === "scan-passed" && upload.deleteStatus === "active"
    );
    if (readyUploads.length === 0) return;

    setSelectedFiles((currentFiles) => [...currentFiles, ...readyUploads]);
    setUploadStatus(
      readyUploads.length === 1
        ? t("workspace.upload.status.addedOne", { name: readyUploads[0].name })
        : t("workspace.upload.status.addedMany", { count: readyUploads.length })
    );
    setStagedUploads([]);
    setProcessedOutput(null);
    setJob(buildPdfJob({ files: [], operation, consentGranted: false }));
    closeUploadDialog();
  };

  const deleteSelectedFile = (file: QueuedPdfFile) => {
    setSelectedFiles((currentFiles) => currentFiles.filter((item) => item.id !== file.id));
    setProcessedOutput(null);
    setJob(buildPdfJob({ files: [], operation, consentGranted: false }));
    setUploadStatus(t("workspace.upload.status.deleted", { name: file.name }));
  };

  const downloadOutput = () => {
    if (!processedOutput || typeof document === "undefined") return;
    const outputBytes = processedOutput.bytes.buffer.slice(
      processedOutput.bytes.byteOffset,
      processedOutput.bytes.byteOffset + processedOutput.bytes.byteLength
    ) as ArrayBuffer;
    const url = URL.createObjectURL(new Blob([outputBytes], { type: processedOutput.mimeType }));
    const anchor = document.createElement("a");
    anchor.download = processedOutput.fileName;
    anchor.href = url;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pdf-workspace-shell" data-pdf-desktop-layout="workspace-v2">
      <section className="workspace-tabs" aria-label={t("workspace.a11y.modes")}>
        <span className="workspace-tab is-active">
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <strong>{t("workspace.tabs.traditionalTool")}</strong>
            <small>{t("workspace.tabs.localProcessing")}</small>
          </span>
        </span>
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
                setProcessedOutput(null);
                setJob(buildPdfJob({ files: [], operation, consentGranted: false }));
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
          </div>

          <div className="pdf-file-list" aria-label={t("workspace.files.selectedFiles")}>
            {selectedFiles.map((file) => (
              <article className="pdf-file-row" key={file.id}>
                <span className="pdf-drag-handle" aria-hidden="true">::</span>
                <span className="pdf-file-icon">PDF</span>
                <span>
                  <strong>{file.name}</strong>
                  <small>{t("workspace.files.fileMeta", { pages: file.pages, size: file.sizeMb.toFixed(1) })}</small>
                  <small>
                    {t("workspace.upload.uploadedMeta", {
                      retentionLabel: localizePdfUploadLabel(file.retentionLabel, t),
                      scanLabel: localizePdfUploadLabel(file.scanLabel, t)
                    })}
                  </small>
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
          </div>

          <button className="button button-solid full-width" disabled={selectedFiles.length === 0 || isProcessing} type="button" onClick={runOperation}>
            {t(`workspace.operations.${activePolicy.operation}.primaryAction`)}
          </button>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title">
            <h2>{t("workspace.result.title")}</h2>
            {job.status === "completed" ? <span className="badge local"><CheckCircle2 size={14} aria-hidden="true" /> {t("workspace.result.completed")}</span> : null}
          </div>

          <div className={job.status === "completed" ? "status-success" : "status-error"}>{localizePdfJobMessage(job.message, t)}</div>

          {job.output && processedOutput ? (
            <>
              <article className="pdf-output-card">
                <span className="pdf-file-icon large">PDF</span>
                <span>
                  <strong>{job.output.fileName}</strong>
                  <small>{t("workspace.files.fileMeta", { pages: job.output.pages, size: job.output.sizeMb.toFixed(1) })}</small>
                </span>
              </article>

              <div className="button-row" style={{ justifyContent: "flex-start" }}>
                <button className="button button-solid" type="button" onClick={downloadOutput}>
                  <Download size={16} aria-hidden="true" /> {t("workspace.result.download")}
                </button>
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
            </>
          ) : null}
        </section>
      </div>

      <section className="trust-strip" aria-label={t("workspace.trust.ariaLabel")}>
        <div>
          <CheckCircle2 size={22} aria-hidden="true" />
          <span>
            <strong>{t("workspace.trust.localTitle")}</strong>
            <small>{t("workspace.trust.localDescription")}</small>
          </span>
        </div>
      </section>
      <PdfUploadDialog
        dialogRef={uploadDialogRef}
        isOpen={isUploadDialogOpen}
        onAddReadyUploads={addReadyUploadsToQueue}
        onClose={closeUploadDialog}
        onFilesSelected={handleUploadSelection}
        stagedUploads={stagedUploads}
      />
    </div>
  );
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
    case "The PDF could not be read":
      return t("workspace.upload.labels.invalidPdf");
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

function PdfUploadDialog({
  dialogRef,
  isOpen,
  onAddReadyUploads,
  onClose,
  onFilesSelected,
  stagedUploads
}: PdfUploadDialogProps) {
  const t = useTranslations("tools.pdf-toolkit");
  const titleId = useId();
  const readyCount = stagedUploads.filter(
    (upload) => upload.scanStatus === "scan-passed" && upload.deleteStatus === "active"
  ).length;

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
