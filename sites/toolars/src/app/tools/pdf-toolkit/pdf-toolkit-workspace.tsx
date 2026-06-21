"use client";

import { type ChangeEvent, type KeyboardEvent as ReactKeyboardEvent, type RefObject, useId, useMemo, useState } from "react";
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
import { buildWorkspaceAuditHeaders } from "@/lib/workspace/workspace-identity";

const localOperations = getPdfOperationPolicies().filter((operation) => operation.processing === "local");
const designSummary =
  "This document is a Q2 2024 marketing report that outlines performance highlights, campaign results, budget utilization, key wins, challenges, and recommendations for the next quarter.";
const designTakeaways = [
  "Total leads increased by 28% compared to Q1.",
  "Paid search delivered the highest ROI (4.3x).",
  "Top performing campaign: Spring Launch 2024.",
  "Budget underspend of 7% due to delayed events."
];
const designCitations = ["p. 3 Q2 Performance Overview", "p. 8 Campaign Results - Paid Search", "p. 12 Budget Summary", "p. 18 Recommendations"];

export function PdfToolkitWorkspace() {
  const [operation, setOperation] = useState<PdfOperation>("merge");
  const [aiSummarySelected, setAiSummarySelected] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [lastLocalUploads, setLastLocalUploads] = useState<PdfUploadItem[]>([]);
  const [lastUploadFiles, setLastUploadFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<PdfFile[]>(() => samplePdfFiles.slice(0, 2));
  const [stagedUploads, setStagedUploads] = useState<PdfUploadItem[]>([]);
  const [uploadStatus, setUploadStatus] = useState("Temporary uploads are auto-deleted after the active session.");
  const [job, setJob] = useState<PdfJobResult>(() =>
    buildPdfJob({
      files: samplePdfFiles.slice(0, 2),
      operation: "merge",
      consentGranted: false
    })
  );

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

  const handleUploadSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    const nextUploads = buildPdfUploadItems(files);
    const readyCount = getReadyPdfUploadItems(nextUploads).length;

    setLastLocalUploads(nextUploads);
    setLastUploadFiles(files);
    setStagedUploads(nextUploads);
    setUploadStatus(
      readyCount === 1
        ? "1 PDF scan passed and is ready for the local queue."
        : `${readyCount} PDF scans passed and are ready for the local queue.`
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
          ? "1 PDF server scan passed and is ready for PDF Summary handoff."
          : `${readyCount} PDF server scans passed and are ready for PDF Summary handoff.`
      );
    } catch {
      const readyCount = getReadyPdfUploadItems(localUploads).length;
      setStagedUploads(markPdfUploadStorageFailed(localUploads));
      setUploadStatus(
        readyCount === 1
          ? "1 PDF scan passed locally; server handoff is unavailable."
          : `${readyCount} PDF scans passed locally; server handoff is unavailable.`
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
        ? `${readyUploads[0].name} added to the local queue.`
        : `${readyUploads.length} PDFs added to the local queue.`
    );
    setStagedUploads([]);
    closeUploadDialog();
  };

  const deleteSelectedFile = (file: PdfFile) => {
    setSelectedFiles((currentFiles) => currentFiles.filter((item) => item.id !== file.id));
    setUploadStatus(`Deleted ${file.name} from the local queue.`);
  };

  return (
    <div className="pdf-workspace-shell" data-pdf-desktop-layout="workspace-v2" data-pdf-mobile-density="sidebar-first">
      <section className="pdf-mobile-workspace-rail" data-pdf-mobile-rail="true" aria-label="PDF workspace navigation">
        <div className="pdf-mobile-rail-brand">
          <span className="pdf-mobile-rail-mark" aria-hidden="true" />
          <span>
            <strong>Toolars</strong>
            <small>PDF workspace</small>
          </span>
        </div>
        <a className="pdf-mobile-rail-back" href="/explore/pdf">
          <span>PDF</span>
          <strong>Back to PDF catalog</strong>
        </a>

        <h2>Workspace</h2>
        <div className="pdf-mobile-rail-list">
          <div className="pdf-mobile-rail-row is-active">
            <strong>Files</strong>
            <span>3</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>Operations</strong>
            <span>8</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>AI Enhance</strong>
            <span>2</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>Output history</strong>
            <span>12</span>
          </div>
        </div>

        <h2>Recent outputs</h2>
        <div className="pdf-mobile-rail-list">
          <div className="pdf-mobile-rail-row">
            <strong>Q2 PDF summary</strong>
            <span>2h</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>Invoice bundle</strong>
            <span>1d</span>
          </div>
          <div className="pdf-mobile-rail-row">
            <strong>Board notes</strong>
            <span>3d</span>
          </div>
        </div>

        <div className="pdf-mobile-rail-usage">
          <strong>Pro plan usage</strong>
          <span>AI credits 1,250 / 2,000</span>
          <span className="pdf-mobile-rail-meter is-credits">
            <span />
          </span>
          <span>Storage 2.4 GB / 10 GB</span>
          <span className="pdf-mobile-rail-meter is-storage">
            <span />
          </span>
        </div>
      </section>

      <section className="workspace-tabs" aria-label="PDF workspace modes">
        <button className="workspace-tab is-active" type="button">
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <strong>Traditional Tool</strong>
            <small>Local processing</small>
          </span>
        </button>
        <button className="workspace-tab" type="button" onClick={chooseAiSummary}>
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <strong>AI Enhance</strong>
            <small>AI-powered features</small>
          </span>
        </button>
        <a className="workspace-tab" href="/workflows/pdf-summary">
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <strong>Workflow Builder</strong>
            <small>Automate your tasks</small>
          </span>
        </a>
      </section>

      <div className="workspace-layout pdf-workspace">
        <section className="workspace-panel">
          <span className="eyebrow">PDF workspace</span>
          <h1>PDF Toolkit</h1>
          <p className="subtitle">Merge, split, compress, convert, summarize, and export PDFs in one place.</p>

          <div className="workspace-section-title">
            <h2>Add & organize PDF files</h2>
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setSelectedFiles([]);
                setUploadStatus("Cleared all files from the local queue.");
              }}
            >
              <Trash2 size={14} aria-hidden="true" /> Clear all
            </button>
          </div>
          <div className="pdf-actions">
            <button ref={uploadTriggerRef} className="button button-outline" type="button" onClick={() => setIsUploadDialogOpen(true)}>
              <Upload size={16} aria-hidden="true" /> Add files
            </button>
            <button className="button button-outline" type="button">Import from Drive</button>
          </div>

          <div className="pdf-file-list" aria-label="Selected PDF files">
            {selectedFiles.map((file) => (
              <article className="pdf-file-row" key={file.id}>
                <span className="pdf-drag-handle" aria-hidden="true">::</span>
                <span className="pdf-file-icon">PDF</span>
                <span>
                  <strong>{file.name}</strong>
                  <small>{file.sizeMb.toFixed(1)} MB · {file.pages} pages</small>
                  {isPdfUploadItem(file) ? <small>Uploaded · {file.scanLabel} · {file.retentionLabel}</small> : null}
                </span>
                <span className="badge local">Local</span>
                <button
                  aria-label={`Delete uploaded file ${file.name}`}
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
            <h2>Choose operation</h2>
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
                {item.label}
              </button>
            ))}
          </div>

          <div className="settings-list">
            <div>
              <strong>{activePolicy.label} settings</strong>
              <p className="tool-description">{activePolicy.description}</p>
            </div>
            <label className="toggle-row">
              <span>Add bookmark for each file</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="toggle-row">
              <span>Optimize for smaller size</span>
              <input type="checkbox" />
            </label>
          </div>

          <button className="button button-solid full-width" type="button" onClick={runOperation}>
            {activePolicy.primaryAction}
          </button>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title">
            <h2>Result</h2>
            {job.status === "completed" ? <span className="badge local"><CheckCircle2 size={14} aria-hidden="true" /> Completed</span> : null}
          </div>

          <div className={job.status === "needs-consent" ? "status-error" : "status-success"}>{job.message}</div>

          <article className="pdf-output-card">
            <span className="pdf-file-icon large">PDF</span>
            <span>
              <strong>{job.output?.fileName ?? "Q2_Marketing_Report_2024_pending.pdf"}</strong>
              <small>{job.output ? `${job.output.sizeMb.toFixed(1)} MB · ${job.output.pages} pages` : `${totalSize.toFixed(1)} MB · ${totalPages} pages`}</small>
            </span>
          </article>

          <div className="button-row" style={{ justifyContent: "flex-start" }}>
            <button className="button button-solid" type="button" disabled={job.status !== "completed"}>
              <Download size={16} aria-hidden="true" /> Download
            </button>
            <button className="button button-outline" type="button" disabled={job.status !== "completed"}>
              <Link2 size={16} aria-hidden="true" /> Copy link
            </button>
            <button className="button button-outline" type="button">
              <MoreHorizontal size={16} aria-hidden="true" />
            </button>
          </div>

          <h2 style={{ marginTop: 24 }}>Preview</h2>
          <div className="pdf-preview-strip" aria-label="Preview pages">
            {[1, 2, 3, 4].map((page) => (
              <span className="pdf-preview-page" key={page}>
                <FileText size={22} aria-hidden="true" />
                <small>{page}</small>
              </span>
            ))}
          </div>

          <dl className="detail-list">
            <div>
              <dt>Operation</dt>
              <dd>{activePolicy.label}</dd>
            </div>
            <div>
              <dt>Original size</dt>
              <dd>{totalSize.toFixed(1)} MB ({selectedFiles.length} files)</dd>
            </div>
            <div>
              <dt>Pages</dt>
              <dd>{totalPages} pages</dd>
            </div>
            <div>
              <dt>Security</dt>
              <dd>{job.securityLabel}</dd>
            </div>
          </dl>
        </section>

        <aside className="workspace-panel">
          <div className="workspace-section-title">
            <h2>AI Enhance</h2>
            <span className="badge ai">Beta</span>
          </div>
          <div className="ai-tabs" aria-label="AI enhance actions">
            <button className={aiSummarySelected ? "is-selected" : ""} type="button" onClick={chooseAiSummary}>
              Summarize
            </button>
            <button type="button">Action items</button>
            <button type="button">Translate</button>
          </div>

          <div className="consent-box">
            <strong>
              <LockKeyhole size={16} aria-hidden="true" /> AI only after consent
            </strong>
            <p>Your file will be sent to our AI model to generate results. Files are deleted after processing.</p>
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
              {consentGranted ? "Consent granted" : "I consent"}
            </button>
          </div>

          <button className="button button-solid full-width" type="button" onClick={runAiSummary}>
            Generate summary
          </button>

          <div className="summary-box pdf-ai-summary-box">
            <strong>{job.output?.summary ? "AI summary ready" : "Summary"}</strong>
            <p>{job.output?.summary ?? designSummary}</p>
            <strong>Key takeaways</strong>
            <ul>
              {designTakeaways.map((takeaway) => (
                <li key={takeaway}>{takeaway}</li>
              ))}
            </ul>
            <strong>Citations</strong>
            <ul className="pdf-citation-list">
              {(job.output?.citations ?? designCitations).map((citation) => (
                <li key={citation}>{citation}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className="next-step-strip" aria-label="PDF Toolkit next steps">
        <article>
          <Sparkles size={20} aria-hidden="true" />
          <span>
            <strong>Summarize PDF</strong>
            <small>Get AI summary of this document</small>
          </span>
        </article>
        <article>
          <FileText size={20} aria-hidden="true" />
          <span>
            <strong>Turn PDF into slides</strong>
            <small>Convert key points to slides</small>
          </span>
        </article>
        <article>
          <Table2 size={20} aria-hidden="true" />
          <span>
            <strong>Extract tables to CSV</strong>
            <small>Extract data to CSV file</small>
          </span>
        </article>
        <article>
          <Mail size={20} aria-hidden="true" />
          <span>
            <strong>Create email draft</strong>
            <small>Draft an email from this report</small>
          </span>
        </article>
        <article>
          <RotateCcw size={20} aria-hidden="true" />
          <span>
            <strong>View all workflows</strong>
            <small>Explore more automations</small>
          </span>
        </article>
      </section>

      <section className="trust-strip" aria-label="PDF Toolkit trust notes">
        <div>
          <CheckCircle2 size={22} aria-hidden="true" />
          <span>
            <strong>Local PDF operations</strong>
            <small>Your files are processed on your device.</small>
          </span>
        </div>
        <div>
          <LockKeyhole size={22} aria-hidden="true" />
          <span>
            <strong>AI only after consent</strong>
            <small>You choose when to use AI features.</small>
          </span>
        </div>
        <div>
          <Trash2 size={22} aria-hidden="true" />
          <span>
            <strong>Files removed after session</strong>
            <small>We do not store your files or data.</small>
          </span>
        </div>
      </section>

      <AiConsentDialog
        contentSummary="Only selected PDF text is sent after you approve this step."
        dialogRef={consentDialogRef}
        isOpen={isConsentDialogOpen}
        onApprove={approveAiConsent}
        onClose={closeConsentDialog}
        retentionSummary="You can cancel before approval. Files are deleted after processing and are not used for model training."
        scopeSummary="AI processing starts only after you click Approve AI consent."
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

function PdfUploadDialog({
  dialogRef,
  isOpen,
  onAddReadyUploads,
  onClose,
  onFilesSelected,
  onRetryServerUploadHandoff,
  stagedUploads
}: {
  dialogRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onAddReadyUploads: () => void;
  onClose: () => void;
  onFilesSelected: (event: ChangeEvent<HTMLInputElement>) => void;
  onRetryServerUploadHandoff: () => void;
  stagedUploads: PdfUploadItem[];
}) {
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
          <span className="eyebrow">Local upload</span>
          <h2 id={titleId}>Add PDF files</h2>
          <p>Stage PDFs in the local queue before choosing an operation.</p>
        </div>

        <div className="file-upload-checklist" aria-label="PDF upload guidance">
          <article>
            <strong>Files stay on this device until you choose a cloud or AI step.</strong>
            <small>Local merge, split, compress, and convert actions use the browser queue first.</small>
          </article>
          <article>
            <strong>PDF limit: 50 MB per file</strong>
            <small>Larger production uploads will require the Phase 4 storage service and scan state.</small>
          </article>
          <article>
            <strong>Queued locally</strong>
            <small>Toolars keeps this upload step separate from AI consent so users know when content would leave the device.</small>
          </article>
        </div>

        <label className="file-upload-picker">
          <span>Choose PDF files</span>
          <input aria-label="Choose PDF files" accept="application/pdf,.pdf" multiple type="file" onChange={onFilesSelected} />
        </label>

        {stagedUploads.length > 0 ? (
          <div className="file-upload-staged-list" aria-label="Staged PDF uploads">
            {stagedUploads.map((file) => (
              <article className="pdf-file-row" key={file.id}>
                <span className="pdf-file-icon">PDF</span>
                <span>
                  <strong>{file.name}</strong>
                  <small>{file.sizeMb.toFixed(1)} MB</small>
                  <small>{file.scanLabel}</small>
                  <small>{file.retentionLabel}</small>
                  <small>{file.storageLabel}</small>
                  {file.handoffToken ? <small>{file.handoffToken}</small> : null}
                  {file.storageStatus === "failed" ? (
                    <button
                      aria-label={`Retry upload handoff ${file.name}`}
                      className="text-button"
                      type="button"
                      onClick={onRetryServerUploadHandoff}
                    >
                      <RotateCcw size={13} aria-hidden="true" /> Retry upload handoff
                    </button>
                  ) : null}
                </span>
                <span className={`badge ${file.scanStatus === "scan-passed" ? "local" : "ai"}`}>{file.scanStatus === "scan-passed" ? "Ready" : "Rejected"}</span>
              </article>
            ))}
          </div>
        ) : null}

        <footer className="core-modal-footer">
          <button className="button button-outline-neutral" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button button-solid" disabled={readyCount === 0} type="button" onClick={onAddReadyUploads}>
            {readyCount === 1 ? "Add 1 file to queue" : `Add ${readyCount} files to queue`}
          </button>
        </footer>
      </section>
    </div>
  );
}
