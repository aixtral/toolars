"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { CheckCircle2, Copy, LockKeyhole, Sparkles } from "lucide-react";
import { submitToolarsSupabaseEmailAuth } from "@/lib/supabase/toolars-supabase-auth-client";
import { bindWorkspaceIdentityToAccount } from "@/lib/workspace/workspace-identity";

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
  const authMode = kind === "sign-up" ? "sign-up" : "sign-in";
  const isAuthModal = kind === "sign-in" || kind === "sign-up";
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [submittingAuth, setSubmittingAuth] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const passwordHintId = `${instanceId}-password-hint`;
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

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingAuth(true);
    setStatus("");

    const result = await submitToolarsSupabaseEmailAuth({
      email: authEmail,
      emailRedirectTo: buildEmailRedirectTo(),
      mode: authMode,
      password: authPassword
    });

    setSubmittingAuth(false);

    if (!result.ok) {
      setStatus(t(authStatusKey(result.errorCode)));
      return;
    }

    bindWorkspaceIdentityToAccount({
      accountEmail: result.accountEmail,
      accountId: result.accountId
    });
    notifyAuthSessionChanged();
    setStatus(t(result.needsEmailConfirmation ? "auth.status.checkEmail" : "auth.status.signedIn"));
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

      {open && typeof document !== "undefined"
        ? createPortal(
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

            {isAuthModal ? (
              <div className="core-modal-body">
                <form className="core-modal-auth-form" onSubmit={(event) => void submitAuth(event)}>
                  <label className="core-modal-field">
                    <span>{t("auth.emailLabel")}</span>
                    <input
                      autoComplete="email"
                      inputMode="email"
                      onChange={(event) => setAuthEmail(event.target.value)}
                      required
                      type="email"
                      value={authEmail}
                    />
                  </label>
                  <label className="core-modal-field">
                    <span>{t("auth.passwordLabel")}</span>
                    <input
                      aria-describedby={passwordHintId}
                      autoComplete={kind === "sign-up" ? "new-password" : "current-password"}
                      minLength={6}
                      onChange={(event) => setAuthPassword(event.target.value)}
                      required
                      type="password"
                      value={authPassword}
                    />
                  </label>
                  <small id={passwordHintId}>{t("auth.passwordHint")}</small>
                  <button className="button button-solid" disabled={submittingAuth} type="submit">
                    <LockKeyhole size={16} aria-hidden="true" />
                    {submittingAuth ? t("auth.status.submitting") : t(kind === "sign-up" ? "auth.signUp.submit" : "auth.signIn.submit")}
                  </button>
                </form>
                <div className="core-modal-option-list">
                  <div
                    className="core-modal-auth-option"
                    aria-label={t(kind === "sign-up" ? "auth.signUp.freeTrial" : "auth.signIn.freeTrial")}
                  >
                    <Sparkles size={16} aria-hidden="true" />
                    <span>
                      <strong>{t(kind === "sign-up" ? "auth.signUp.freeTrial" : "auth.signIn.freeTrial")}</strong>
                      <small>{t(kind === "sign-up" ? "auth.signUp.freeTrialDescription" : "auth.signIn.freeTrialDescription")}</small>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {kind === "upgrade" ? (
              <div className="core-modal-body">
                <strong className="core-modal-subject">
                  {planName ? t("modal.upgrade.planLabel", { planName }) : t("modal.upgrade.futurePlan")}
                </strong>
                {planPrice ? <p className="core-modal-price">{planPrice}</p> : null}
                <p className="tool-description">{t("modal.upgrade.phase2Notice")}</p>
                <ul className="core-modal-feature-list">
                  {planFeatures.slice(0, 5).map((feature) => (
                    <li key={feature}>
                      <Sparkles size={14} aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="button button-solid" disabled type="button">
                  {t("modal.upgrade.phase2Cta")}
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
            </div>,
            document.body
          )
        : null}
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

function authStatusKey(errorCode: "invalid-input" | "not-configured" | "provider-error") {
  if (errorCode === "not-configured") return "auth.status.notConfigured";
  if (errorCode === "invalid-input") return "auth.status.invalidInput";
  return "auth.status.failed";
}

function buildEmailRedirectTo() {
  if (typeof window === "undefined") return undefined;
  return window.location.href;
}

function notifyAuthSessionChanged() {
  if (typeof window === "undefined" || typeof CustomEvent === "undefined") return;
  window.dispatchEvent(new CustomEvent("toolars:auth-session-changed"));
}
