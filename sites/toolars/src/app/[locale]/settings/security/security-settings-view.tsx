"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  KeyRound,
  Laptop,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UserCheck
} from "lucide-react";
import { useDialogFocus } from "@/components/core/use-dialog-focus";
import { buildWorkspaceAuditHeaders } from "@/lib/workspace/workspace-identity";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const overviewCards = ["securityScore", "sessionCount", "recoveryCoverage", "lastReview"] as const;
type OverviewCardId = (typeof overviewCards)[number];

const initialSessions = ["currentSession", "mobileSession", "designReview"] as const;
type SessionId = (typeof initialSessions)[number];

const loginActivity = ["successfulLogin", "passwordChanged", "authenticatorVerified"] as const;
type LoginActivityId = (typeof loginActivity)[number];

const checklist = ["twoFactorEnabled", "recoveryEmailVerified", "unusedSessionsReviewed", "temporaryUploadsAutoDelete"] as const;
type ChecklistId = (typeof checklist)[number];

type SecurityStatus =
  | "active"
  | "twoFactorEnabled"
  | "twoFactorPaused"
  | "revoking"
  | "revoked"
  | "revokeFailed";

const authSessionEndpoint = "/api/auth/session" as const;
const fallbackRevokedSessionId = "current-session" as const;
const initialSessionCount = (): number => initialSessions.length;
const initialRevokedSessionId: string | null = null;
const initialSecurityStatus: SecurityStatus = "active";

export function SecuritySettingsView() {
  const t = useTranslations("settings.security");
  const overviewCopy = {
    securityScore: {
      label: t("overviewCards.securityScore.label"),
      value: t("overviewCards.securityScore.value"),
      detail: t("overviewCards.securityScore.detail")
    },
    sessionCount: {
      label: t("overviewCards.sessionCount.label"),
      value: t("overviewCards.sessionCount.value"),
      detail: t("overviewCards.sessionCount.detail")
    },
    recoveryCoverage: {
      label: t("overviewCards.recoveryCoverage.label"),
      value: t("overviewCards.recoveryCoverage.value"),
      detail: t("overviewCards.recoveryCoverage.detail")
    },
    lastReview: {
      label: t("overviewCards.lastReview.label"),
      value: t("overviewCards.lastReview.value"),
      detail: t("overviewCards.lastReview.detail")
    }
  } satisfies Record<OverviewCardId, { label: string; value: string; detail: string }>;
  const sessionCopy = {
    currentSession: {
      label: t("sessions.currentSession.label"),
      device: t("sessions.currentSession.device"),
      location: t("sessions.currentSession.location"),
      time: t("sessions.currentSession.time")
    },
    mobileSession: {
      label: t("sessions.mobileSession.label"),
      device: t("sessions.mobileSession.device"),
      location: t("sessions.mobileSession.location"),
      time: t("sessions.mobileSession.time")
    },
    designReview: {
      label: t("sessions.designReview.label"),
      device: t("sessions.designReview.device"),
      location: t("sessions.designReview.location"),
      time: t("sessions.designReview.time")
    }
  } satisfies Record<SessionId, { label: string; device: string; location: string; time: string }>;
  const loginActivityCopy = {
    successfulLogin: {
      time: t("loginActivity.successfulLogin.time"),
      detail: t("loginActivity.successfulLogin.detail")
    },
    passwordChanged: {
      time: t("loginActivity.passwordChanged.time"),
      detail: t("loginActivity.passwordChanged.detail")
    },
    authenticatorVerified: {
      time: t("loginActivity.authenticatorVerified.time"),
      detail: t("loginActivity.authenticatorVerified.detail")
    }
  } satisfies Record<LoginActivityId, { time: string; detail: string }>;
  const checklistCopy = {
    twoFactorEnabled: t("checklist.twoFactorEnabled"),
    recoveryEmailVerified: t("checklist.recoveryEmailVerified"),
    unusedSessionsReviewed: t("checklist.unusedSessionsReviewed"),
    temporaryUploadsAutoDelete: t("checklist.temporaryUploadsAutoDelete")
  } satisfies Record<ChecklistId, string>;
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionCount, setSessionCount] = useState(initialSessionCount);
  const [revokedSessionId, setRevokedSessionId] = useState(initialRevokedSessionId);
  const [status, setStatus] = useState(initialSecurityStatus);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const {
    dialogRef: signOutDialogRef,
    restoreTriggerFocus: restoreSignOutTriggerFocus,
    triggerRef: signOutDialogTriggerRef
  } = useDialogFocus(isSignOutDialogOpen);

  function closeSignOutDialog() {
    setIsSignOutDialogOpen(false);
    restoreSignOutTriggerFocus();
  }

  function handleSignOutDialogKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      closeSignOutDialog();
    }
  }

  function toggleTwoFactor() {
    setTwoFactorEnabled((current) => {
      const nextValue = !current;
      setStatus(nextValue ? "twoFactorEnabled" : "twoFactorPaused");
      return nextValue;
    });
  }

  async function signOutSessions() {
    setStatus("revoking");

    try {
      if (typeof fetch !== "function") throw new Error("Auth session API unavailable");

      const response = await fetch(authSessionEndpoint, {
        credentials: "same-origin",
        headers: buildWorkspaceAuditHeaders(),
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Auth session revoke failed");

      const payload = (await response.json()) as { revokedSession?: { sessionId?: string; status?: string } | null };
      setSessionCount(0);
      setRevokedSessionId(payload.revokedSession?.sessionId ?? fallbackRevokedSessionId);
      setStatus("revoked");
    } catch {
      setStatus("revokeFailed");
    } finally {
      closeSignOutDialog();
    }
  }

  function statusMessage() {
    switch (status) {
      case "active":
        return t("statusMessages.active");
      case "twoFactorEnabled":
        return t("statusMessages.twoFactorEnabled");
      case "twoFactorPaused":
        return t("statusMessages.twoFactorPaused");
      case "revoking":
        return t("statusMessages.revoking");
      case "revoked":
        return t("statusMessages.revoked");
      case "revokeFailed":
        return t("statusMessages.revokeFailed");
    }
  }

  return (
    <div className="settings-subpage security-settings-page" data-security-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">{t("sections.eyebrow")}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">{t("hero.subtitle")}</p>
          </span>
          <span className="settings-trust-note">
            <ShieldCheck size={15} aria-hidden="true" /> {t("trustNote")}
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.overview")}</h2>
                <p className="tool-description">{t("overview.description")}</p>
              </span>
              <span className="badge local">{t("overview.badge")}</span>
            </div>
            <div className="settings-stat-grid">
              {overviewCards.map((cardId) => (
                <article className="settings-stat-card" key={cardId}>
                  <strong>{overviewCopy[cardId].value}</strong>
                  <span>{overviewCopy[cardId].label}</span>
                  <small>{overviewCopy[cardId].detail}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.twoFactor")}</h2>
            <article className="privacy-toggle-row">
              <span className="icon-tile green">
                <LockKeyhole size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>{t("twoFactor.authenticatorApp")}</strong>
                <small>{t("twoFactor.description")}</small>
              </span>
              <button
                aria-label={t("twoFactor.ariaLabel")}
                aria-pressed={twoFactorEnabled}
                className={`privacy-switch-button ${twoFactorEnabled ? "is-on" : ""}`}
                onClick={toggleTwoFactor}
                type="button"
              />
            </article>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {statusMessage()}
            </p>
          </section>

          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.activeSessions")}</h2>
                <p className="tool-description">{t("activeSessions.description", { count: sessionCount })}</p>
              </span>
              <button
                ref={signOutDialogTriggerRef}
                className="button button-outline-neutral"
                onClick={() => setIsSignOutDialogOpen(true)}
                type="button"
              >
                <UserCheck size={15} aria-hidden="true" /> {t("activeSessions.signOutAll")}
              </button>
            </div>
            <div className="security-session-list">
              {initialSessions.slice(0, sessionCount).map((sessionId, index) => (
                <article className="security-session-row" key={sessionId}>
                  <span className="icon-tile green">
                    {index === 1 ? <Smartphone size={18} aria-hidden="true" /> : <Laptop size={18} aria-hidden="true" />}
                  </span>
                  <span>
                    <strong>{sessionCopy[sessionId].label}</strong>
                    <small>
                      {sessionCopy[sessionId].device} · {sessionCopy[sessionId].location} · {sessionCopy[sessionId].time}
                    </small>
                  </span>
                  <span className={index === 0 ? "badge local" : "badge"}>{index === 0 ? t("sessionBadges.current") : t("sessionBadges.trusted")}</span>
                </article>
              ))}
            </div>
            {revokedSessionId ? (
              <p className="settings-status-note" aria-live="polite">
                <CheckCircle2 size={15} aria-hidden="true" /> {t("activeSessions.revokedSession")} <code>{revokedSessionId}</code>
              </p>
            ) : null}
          </section>

          <div className="settings-two-card-grid">
            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Database size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.uploadDeletion")}</h2>
              <p className="tool-description">{t("uploadDeletion.description")}</p>
              <span className="badge local">{t("uploadDeletion.badge")}</span>
            </section>

            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <KeyRound size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.recovery")}</h2>
              <p className="tool-description">{t("recovery.description")}</p>
              <span className="badge local">{t("recovery.badge")}</span>
            </section>
          </div>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.loginActivity")}</h2>
            <div className="key-activity-list">
              {loginActivity.map((activityId) => (
                <article key={activityId}>
                  <Activity size={15} aria-hidden="true" />
                  <span>
                    <strong>{loginActivityCopy[activityId].time}</strong>
                    <small>{loginActivityCopy[activityId].detail}</small>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.checklist")}</h2>
            <div className="settings-row-list compact">
              {checklist.map((item) => (
                <div className="settings-detail-row compact-row" key={item}>
                  <ShieldCheck size={15} aria-hidden="true" />
                  <span>{checklistCopy[item]}</span>
                  <span className="badge local">{t("checklistStatus")}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.riskActions")}</h2>
            <div className="consent-preview-box">
              <ShieldAlert size={18} aria-hidden="true" />
              <strong>{t("riskActions.reviewSensitiveChanges")}</strong>
              <p>{t("riskActions.description")}</p>
              <button className="button button-outline-neutral" type="button">
                {t("riskActions.downloadLog")}
              </button>
            </div>
          </section>
        </aside>
      </div>
      {isSignOutDialogOpen ? (
        <div className="settings-confirmation-overlay" role="presentation">
          <section
            ref={signOutDialogRef}
            aria-labelledby="sign-out-sessions-title"
            aria-modal="true"
            className="settings-confirmation-dialog"
            onKeyDown={handleSignOutDialogKeyDown}
            role="dialog"
            tabIndex={-1}
          >
            <span className="icon-tile amber">
              <AlertTriangle size={20} aria-hidden="true" />
            </span>
            <h2 id="sign-out-sessions-title">{t("dialog.title")}</h2>
            <p>{t("dialog.description")}</p>
            <div className="states-alert amber">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>{t("dialog.warning")}</span>
            </div>
            <div className="settings-button-row">
              <button className="button button-outline-neutral" onClick={closeSignOutDialog} type="button">
                {t("dialog.cancel")}
              </button>
              <button className="button button-danger" onClick={() => void signOutSessions()} type="button">
                {t("dialog.confirm")}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
