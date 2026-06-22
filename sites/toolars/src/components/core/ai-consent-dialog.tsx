"use client";

import { useId, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("aiConsent");
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
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 id={titleId}>{t("title")}</h2>
          <p>{t("intro")}</p>
        </div>

        <div className="ai-consent-checklist" aria-label="AI consent details">
          <article>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>{t("checklist.whenSent")}</strong>
              <small>{scopeSummary}</small>
            </span>
          </article>
          <article>
            <LockKeyhole size={16} aria-hidden="true" />
            <span>
              <strong>{t("checklist.whatSent")}</strong>
              <small>{contentSummary}</small>
            </span>
          </article>
          <article>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>{t("checklist.deletion")}</strong>
              <small>{retentionSummary}</small>
            </span>
          </article>
          {providerSummary ? (
            <article>
              <LockKeyhole size={16} aria-hidden="true" />
              <span>
                <strong>{t("checklist.providerRoute")}</strong>
                <small>{providerSummary}</small>
              </span>
            </article>
          ) : null}
        </div>

        <footer className="core-modal-footer">
          <button className="button button-outline-neutral" type="button" onClick={onClose}>
            {t("actions.cancel")}
          </button>
          <button className="button button-solid" type="button" onClick={onApprove}>
            {t("actions.approve")}
          </button>
        </footer>
      </section>
    </div>
  );
}
