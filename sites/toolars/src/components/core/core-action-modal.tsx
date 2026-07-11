"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { CheckCircle2, Copy, GitFork, Globe2, ShieldCheck, Sparkles, X } from "lucide-react";
import { ToolarsLogoMark } from "@/components/shell/toolars-logo";
import { startToolarsSupabaseOAuth, type ToolarsSupabaseOAuthProvider } from "@/lib/supabase/toolars-supabase-auth-client";

type CoreModalKind = "share" | "save-collection" | "sign-in" | "sign-up" | "upgrade";
type AuthModalKind = "sign-in" | "sign-up";

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
  const authMode: AuthModalKind = kind === "sign-up" ? "sign-up" : "sign-in";
  const isAuthModal = kind === "sign-in" || kind === "sign-up";
  const [authPanelMode, setAuthPanelMode] = useState(authMode);
  const [submittingProvider, setSubmittingProvider] = useState<ToolarsSupabaseOAuthProvider | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef(null as HTMLElement | null);
  const renderedKind: CoreModalKind = isAuthModal ? authPanelMode : kind;
  const title = kind === "share" && shareTitle ? shareTitle : t(modalTitleKey(renderedKind));

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
    setAuthPanelMode(authMode);
    setSubmittingProvider(null);
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

  async function startOAuth(provider: ToolarsSupabaseOAuthProvider) {
    setSubmittingProvider(provider);
    setStatus("");

    const result = await startToolarsSupabaseOAuth({
      provider,
      redirectTo: buildOAuthRedirectTo()
    });

    if (!result.ok) {
      setSubmittingProvider(null);
      setStatus(t(authStatusKey(result.errorCode), { provider: authProviderLabel(t, provider) }));
      return;
    }

    setStatus(t("auth.status.redirecting", { provider: authProviderLabel(t, provider) }));
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
            className={`core-modal-dialog${isAuthModal ? " core-modal-auth-dialog" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            {!isAuthModal ? (
              <div className="core-modal-head">
                <span className="eyebrow">{t(modalEyebrowKey(kind))}</span>
                <h2 id={titleId}>{title}</h2>
                <p>{t(modalDescriptionKey(kind))}</p>
              </div>
            ) : null}

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
              <>
                <aside className="core-modal-auth-aside">
                  <ToolarsLogoMark label="Toolars" size="md" />
                  <p className="core-modal-auth-aside-status">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    {t("auth.workspaceReady")}
                  </p>
                </aside>
                <div className="core-modal-auth-main">
                  <button
                    aria-label={t("auth.close")}
                    className="core-modal-icon-button"
                    onClick={() => close()}
                    type="button"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                  <div className="core-modal-head core-modal-auth-head">
                    <span className="eyebrow">{t("auth.eyebrow")}</span>
                    <h2 id={titleId}>{title}</h2>
                    <p>{t(modalDescriptionKey(renderedKind))}</p>
                  </div>
                  <div className="core-modal-auth-providers">
                    <button
                      className="core-modal-provider-button"
                      disabled={Boolean(submittingProvider)}
                      onClick={() => void startOAuth("google")}
                      type="button"
                    >
                      <Globe2 size={20} aria-hidden="true" />
                      {t("auth.continueWith", { provider: t("auth.providers.google") })}
                    </button>
                    <button
                      className="core-modal-provider-button"
                      disabled={Boolean(submittingProvider)}
                      onClick={() => void startOAuth("github")}
                      type="button"
                    >
                      <GitFork size={20} aria-hidden="true" />
                      {t("auth.continueWith", { provider: t("auth.providers.github") })}
                    </button>
                  </div>
                  <p className="core-modal-auth-trust">
                    <ShieldCheck size={17} aria-hidden="true" />
                    {t("auth.trust")}
                  </p>
                  <p className="core-modal-auth-switch">
                    <span>{t(authPanelMode === "sign-up" ? "auth.signUp.switchPrompt" : "auth.signIn.switchPrompt")}</span>
                    <button
                      onClick={() => setAuthPanelMode(authPanelMode === "sign-up" ? "sign-in" : "sign-up")}
                      type="button"
                    >
                      {t(authPanelMode === "sign-up" ? "auth.signUp.switchAction" : "auth.signIn.switchAction")}
                    </button>
                  </p>
                  {status ? <p className="core-modal-auth-status" role="status">{status}</p> : null}
                </div>
              </>
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

            {!isAuthModal ? (
              <footer className="core-modal-footer">
                {status ? <span role="status">{status}</span> : <span />}
                <button className="button button-outline-neutral" type="button" onClick={() => close()}>
                  {t("modal.close")}
                </button>
              </footer>
            ) : null}
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
  if (kind === "sign-in" || kind === "sign-up") return "auth.eyebrow";
  return "modal.upgrade.eyebrow";
}

function modalDescriptionKey(kind: CoreModalKind): string {
  if (kind === "share") return "modal.share.description";
  if (kind === "save-collection") return "modal.saveCollection.description";
  if (kind === "sign-in") return "auth.signIn.description";
  if (kind === "sign-up") return "auth.signUp.description";
  return "modal.upgrade.description";
}

function authStatusKey(errorCode: "not-configured" | "provider-error") {
  if (errorCode === "not-configured") return "auth.status.notConfigured";
  return "auth.status.failed";
}

function authProviderLabel(t: ReturnType<typeof useTranslations>, provider: ToolarsSupabaseOAuthProvider) {
  return t(`auth.providers.${provider}`);
}

function buildOAuthRedirectTo() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${window.location.pathname}`;
}
