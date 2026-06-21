"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Copy, LockKeyhole, Sparkles } from "lucide-react";
import { getOrCreateWorkspaceIdentity } from "@/lib/workspace/workspace-identity";

type CoreModalKind = "share" | "save-collection" | "sign-in" | "upgrade";

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
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const title = modalTitle(kind, shareTitle);

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
              <span className="eyebrow">{modalEyebrow(kind)}</span>
              <h2 id={titleId}>{title}</h2>
              <p>{modalDescription(kind)}</p>
            </div>

            {kind === "share" ? (
              <div className="core-modal-body">
                {itemName ? <strong className="core-modal-subject">{itemName}</strong> : null}
                <label className="core-modal-field">
                  <span>Public link</span>
                  <input readOnly value={sharePath ?? ""} />
                </label>
                <div className="core-modal-action-row">
                  <button className="button button-solid" type="button" onClick={copyShareLink}>
                    <Copy size={15} aria-hidden="true" /> Copy link
                  </button>
                  {sharePath ? (
                    <a className="button button-outline-neutral" href={sharePath}>
                      Open page
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
                      <strong>Personal workspace</strong>
                      <small>Save for your own pinned tools and workflows.</small>
                    </span>
                  </label>
                  <label>
                    <input name="save-destination" type="radio" />
                    <span>
                      <strong>Team workspace</strong>
                      <small>Prepare the collection for shared review.</small>
                    </span>
                  </label>
                </div>
                <button className="button button-solid" type="button" onClick={saveCollection}>
                  <CheckCircle2 size={15} aria-hidden="true" /> Save collection
                </button>
              </div>
            ) : null}

            {kind === "sign-in" ? (
              <div className="core-modal-body">
                <div className="core-modal-option-list">
                  <a
                    aria-label="Continue with Google"
                    className="core-modal-auth-option"
                    href={buildGoogleSignInHref()}
                  >
                    <LockKeyhole size={16} aria-hidden="true" />
                    <span>
                      <strong>Continue with Google</strong>
                      <small>Start a free trial workspace with your Google account.</small>
                    </span>
                  </a>
                  <div className="core-modal-auth-option" aria-label="Free trial account">
                    <Sparkles size={16} aria-hidden="true" />
                    <span>
                      <strong>Free trial mode</strong>
                      <small>No card is required during the beta.</small>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {kind === "upgrade" ? (
              <div className="core-modal-body">
                <strong className="core-modal-subject">{planName ? `${planName} plan` : "Future plan"}</strong>
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
                  Start upgrade
                </button>
              </div>
            ) : null}

            <footer className="core-modal-footer">
              {status ? <span role="status">{status}</span> : <span />}
              <button className="button button-outline-neutral" type="button" onClick={() => close()}>
                Close
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}

function modalTitle(kind: CoreModalKind, shareTitle?: string): string {
  if (kind === "share") return shareTitle ?? "Share this tool";
  if (kind === "save-collection") return "Save collection";
  if (kind === "sign-in") return "Sign in to Toolars";
  return "Upgrade workspace";
}

function modalEyebrow(kind: CoreModalKind): string {
  if (kind === "share") return "Public link";
  if (kind === "save-collection") return "Workspace";
  if (kind === "sign-in") return "Account";
  return "Plan upgrade";
}

function modalDescription(kind: CoreModalKind): string {
  if (kind === "share") return "Copy a stable Toolars link for this public surface.";
  if (kind === "save-collection") return "Choose where this collection should appear in your workspace.";
  if (kind === "sign-in") return "Use Google to keep trial history, saved collections, and account settings in sync.";
  return "Review future plan benefits. Paid upgrades are parked while the beta trial is active.";
}

function buildGoogleSignInHref() {
  const workspaceId = getOrCreateWorkspaceIdentity().workspaceId;
  return `/api/auth/google/start?workspaceId=${encodeURIComponent(workspaceId)}`;
}
