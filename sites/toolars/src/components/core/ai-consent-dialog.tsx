"use client";

import { useId, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

interface AiConsentDialogProps {
  contentSummary: string;
  dialogRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onApprove: () => void;
  onClose: () => void;
  providerSummary?: string;
  retentionSummary: string;
  scopeSummary: string;
}

export function AiConsentDialog({
  contentSummary,
  dialogRef,
  isOpen,
  onApprove,
  onClose,
  providerSummary,
  retentionSummary,
  scopeSummary
}: AiConsentDialogProps) {
  const titleId = useId();

  if (!isOpen) return null;

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      onClose();
    }
  }

  return (
    <div className="core-modal-overlay ai-consent-overlay" role="presentation">
      <section
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className="core-modal-dialog ai-consent-dialog"
        onKeyDown={handleKeyDown}
        role="dialog"
        tabIndex={-1}
      >
        <div className="core-modal-head">
          <span className="eyebrow">AI consent</span>
          <h2 id={titleId}>Review AI consent</h2>
          <p>Approve this step before any content leaves the local Toolars workspace for model processing.</p>
        </div>

        <div className="ai-consent-checklist" aria-label="AI consent details">
          <article>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>When data is sent</strong>
              <small>{scopeSummary}</small>
            </span>
          </article>
          <article>
            <LockKeyhole size={16} aria-hidden="true" />
            <span>
              <strong>What is sent</strong>
              <small>{contentSummary}</small>
            </span>
          </article>
          <article>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>Deletion and cancel</strong>
              <small>{retentionSummary}</small>
            </span>
          </article>
          {providerSummary ? (
            <article>
              <LockKeyhole size={16} aria-hidden="true" />
              <span>
                <strong>Provider route</strong>
                <small>{providerSummary}</small>
              </span>
            </article>
          ) : null}
        </div>

        <footer className="core-modal-footer">
          <button className="button button-outline-neutral" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button button-solid" type="button" onClick={onApprove}>
            Approve AI consent
          </button>
        </footer>
      </section>
    </div>
  );
}
