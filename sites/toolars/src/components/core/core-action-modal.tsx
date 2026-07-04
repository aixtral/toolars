"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Copy, LockKeyhole, Sparkles } from "lucide-react";
import { getOrCreateWorkspaceIdentity } from "@/lib/workspace/workspace-identity";

type CoreModalKind = "share" | "save-collection" | "sign-in" | "sign-up" | "upgrade";

const activeCoreModalClosers = new Map<string, () => void>();

interface CoreActionModalButtonProps {
  kind: CoreModalKind;
  className: string;
  children: ReactNode;
  itemName?: string;
  sharePath?: string;
  shareTitle?: string;
  planName?: string;
  planPrice?: string;
  planFeatures?: readonly string[];
}

export function CoreActionModalButton({
  kind,
  className,
  children,
  itemName,
  sharePath,
  shareTitle,
  planName,
  planPrice,
  planFeatures = []
}: CoreActionModalButtonProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef(null as HTMLElement | null);
  const title = kind === "share" && shareTitle ? shareTitle : t(modalTitleKey(kind));

  const close = useCallback((options: { restoreFocus?: boolean } = {}) => {
    setOpen(false);
    setStatus("");
    if (options.restoreFocus ?? true) {
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const closePeer = () => close({ restoreFocus: false });
    activeCoreModalClosers.set(instanceId, closePeer);

    return () => {
      if (activeCoreModalClosers.get(instanceId) === closePeer) {
        activeCoreModalClosers.delete(instanceId);
      }
    };
  }, [close, instanceId, open]);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close, open]);

  function openModal() {
    for (const [activeId, closeActiveModal] of activeCoreModalClosers) {
      if (activeId !== instanceId) {
        closeActiveModal();
      }
    }
    setStatus("");
    setOpen(true);
  }

  function copyShareLink() {
    if (sharePath && typeof navigator !== "undefined") {
      void navigator.clipboard?.writeText(sharePath);
    }
    setStatus("Link copied locally");
  }

  function saveCollection() {
    setStatus("Collection saved locally");
  }

  function startUpgrade() {
    setStatus("Upgrade request queued");
  }

  return (
    <>
      <button
        ref={triggerRef}
        className={className}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={openModal}
      >
        {children}
      </button>

      {open ? (
        <div
          className="core-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            ref={dialogRef}
            className="core-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            <div className="core-modal-head">
              <span className="eyebrow">{t(modalEyebrowKey(kind))}</span>
              <h2 id={titleId}>{title}</h2>
              <p>{t(modalDescriptionKey(kind))}</p>
            </div>

            {kind === "share" ? (
              <div className="core-modal-body">
                {itemName ? <strong className="core-modal-subject">{itemName}</strong> : null}
                <label className="core-modal-field">
                  <span>{t("modal.share.fieldLabel")}</span>
                  <input readOnly value={sharePath ?? ""} />
                </label>
                <div className="core-modal-action-row">
                  <button className="button button-solid" type="button" onClick={copyShareLink}>
                    <Copy size={15} aria-hidden="true" /> {t("modal.share.copyLink")}
                  </button>
                  {sharePath ? (
                    <a className="button button-outline-neutral" href={sharePath}>
                      {t("modal.share.openPage")}
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {kind === "save-collection" ? (
              <div className="core-modal-body">
                {itemName ? <strong className="core-modal-subject">{itemName}</strong> : null}
                <div className="core-modal-option-list">
                  <label>
                    <input defaultChecked name="save-destination" type="radio" />
                    <span>
                      <strong>{t("modal.saveCollection.personal")}</strong>
                      <small>{t("modal.saveCollection.personalDescription")}</small>
                    </span>
                  </label>
                  <label>
                    <input name="save-destination" type="radio" />
                    <span>
                      <strong>{t("modal.saveCollection.team")}</strong>
                      <small>{t("modal.saveCollection.teamDescription")}</small>
                    </span>
                  </label>
                </div>
                <button className="button button-solid" type="button" onClick={saveCollection}>
                  <CheckCircle2 size={15} aria-hidden="true" /> {t("modal.saveCollection.save")}
                </button>
              </div>
            ) : null}

            {kind === "sign-in" ? (
              <div className="core-modal-body">
                <div className="core-modal-option-list">
                  <a
                    aria-label={t("auth.signIn.google")}
                    className="core-modal-auth-option"
                    href={buildGoogleSignInHref()}
                  >
                    <LockKeyhole size={16} aria-hidden="true" />
                    <span>
                      <strong>{t("auth.signIn.google")}</strong>
                      <small>{t("auth.signIn.googleDescription")}</small>
                    </span>
                  </a>
                  <div className="core-modal-auth-option" aria-label={t("auth.signIn.freeTrial")}>
                    <Sparkles size={16} aria-hidden="true" />
                    <span>
                      <strong>{t("auth.signIn.freeTrial")}</strong>
                      <small>{t("auth.signIn.freeTrialDescription")}</small>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {kind === "sign-up" ? (
              <div className="core-modal-body">
                <div className="core-modal-option-list">
                  <a
                    aria-label={t("auth.signUp.google")}
                    className="core-modal-auth-option"
                    href={buildGoogleSignInHref()}
                  >
                    <LockKeyhole size={16} aria-hidden="true" />
                    <span>
                      <strong>{t("auth.signUp.google")}</strong>
                      <small>{t("auth.signUp.googleDescription")}</small>
                    </span>
                  </a>
                  <div className="core-modal-auth-option" aria-label={t("auth.signUp.freeTrial")}>
                    <Sparkles size={16} aria-hidden="true" />
                    <span>
                      <strong>{t("auth.signUp.freeTrial")}</strong>
                      <small>{t("auth.signUp.freeTrialDescription")}</small>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {kind === "upgrade" ? (
              <div className="core-modal-body">
                <strong className="core-modal-subject">{planName ? `${planName} plan` : t("modal.upgrade.futurePlan")}</strong>
                {planPrice ? <p className="core-modal-price">{planPrice}</p> : null}
                <ul className="core-modal-feature-list">
                  {planFeatures.slice(0, 5).map((feature) => (
                    <li key={feature}>
                      <Sparkles size={14} aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="button button-solid" type="button" onClick={startUpgrade}>
                  {t("modal.upgrade.start")}
                </button>
              </div>
            ) : null}

            <footer className="core-modal-footer">
              {status ? <span role="status">{status}</span> : <span />}
              <button className="button button-outline-neutral" type="button" onClick={() => close()}>
                {t("modal.close")}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}

function modalTitleKey(kind: CoreModalKind): string {
  if (kind === "share") return "modal.share.title";
  if (kind === "save-collection") return "modal.saveCollection.title";
  if (kind === "sign-in") return "auth.signIn.title";
  if (kind === "sign-up") return "auth.signUp.title";
  return "modal.upgrade.title";
}

function modalEyebrowKey(kind: CoreModalKind): string {
  if (kind === "share") return "modal.share.eyebrow";
  if (kind === "save-collection") return "modal.saveCollection.eyebrow";
  if (kind === "sign-in" || kind === "sign-up") return "auth.signIn.eyebrow";
  return "modal.upgrade.eyebrow";
}

function modalDescriptionKey(kind: CoreModalKind): string {
  if (kind === "share") return "modal.share.description";
  if (kind === "save-collection") return "modal.saveCollection.description";
  if (kind === "sign-in") return "auth.signIn.description";
  if (kind === "sign-up") return "auth.signUp.description";
  return "modal.upgrade.description";
}

function buildGoogleSignInHref() {
  const workspaceId = getOrCreateWorkspaceIdentity().workspaceId;
  return `/api/auth/google/start?workspaceId=${encodeURIComponent(workspaceId)}`;
}
