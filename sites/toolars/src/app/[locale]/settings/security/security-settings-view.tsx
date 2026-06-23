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

const overviewCards = [
  ["Security score", "92", "Strong posture"],
  ["Session count", "3", "Across trusted devices"],
  ["Recovery coverage", "2", "Email and authenticator"],
  ["Last review", "Today", "No critical alerts"]
] as const;

const initialSessions = [
  ["Current session", "MacBook Pro", "Singapore", "Now"],
  ["Mobile session", "iPhone", "San Francisco", "2 hours ago"],
  ["Design review", "Chrome", "New York", "Yesterday"]
] as const;

const loginActivity = [
  ["Today", "Successful login from MacBook Pro"],
  ["Yesterday", "Password changed by account owner"],
  ["Jun 12, 2026", "Authenticator app verified"]
] as const;

const checklist = [
  "Two-factor authentication enabled",
  "Recovery email verified",
  "Unused sessions reviewed weekly",
  "Temporary uploads auto-delete after session"
] as const;

export function SecuritySettingsView() {
  const t = useTranslations("settings.security");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionCount, setSessionCount] = useState<number>(initialSessions.length);
  const [revokedSessionId, setRevokedSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState("Security controls are active.");
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
      setStatus(nextValue ? "Two-factor authentication enabled." : "Two-factor authentication paused.");
      return nextValue;
    });
  }

  async function signOutSessions() {
    setStatus("Revoking auth session...");

    try {
      if (typeof fetch !== "function") throw new Error("Auth session API unavailable");

      const response = await fetch("/api/auth/session", {
        credentials: "same-origin",
        headers: buildWorkspaceAuditHeaders(),
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Auth session revoke failed");

      const payload = (await response.json()) as { revokedSession?: { sessionId?: string; status?: string } | null };
      setSessionCount(0);
      setRevokedSessionId(payload.revokedSession?.sessionId ?? "current-session");
      setStatus("Session revoked. Sign in again to continue syncing account settings.");
    } catch {
      setStatus("Session revoke failed. Please try again.");
    } finally {
      closeSignOutDialog();
    }
  }

  return (
    <div className="settings-subpage security-settings-page" data-security-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">Settings</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">Security</h1>
            <p className="subtitle">Review account protection, sessions, login activity, recovery methods, upload deletion, and risk actions.</p>
          </span>
          <span className="settings-trust-note">
            <ShieldCheck size={15} aria-hidden="true" /> Protected workspace
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>Security overview</h2>
                <p className="tool-description">Your workspace has strong protection across sessions, recovery, and data retention.</p>
              </span>
              <span className="badge local">No critical alerts</span>
            </div>
            <div className="settings-stat-grid">
              {overviewCards.map(([label, value, detail]) => (
                <article className="settings-stat-card" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                  <small>{detail}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Two-factor authentication</h2>
            <article className="privacy-toggle-row">
              <span className="icon-tile green">
                <LockKeyhole size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>Authenticator app</strong>
                <small>Require a second factor when signing in or changing sensitive settings.</small>
              </span>
              <button
                aria-label="Two-factor authentication"
                aria-pressed={twoFactorEnabled}
                className={`privacy-switch-button ${twoFactorEnabled ? "is-on" : ""}`}
                onClick={toggleTwoFactor}
                type="button"
              />
            </article>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {status}
            </p>
          </section>

          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>Active sessions</h2>
                <p className="tool-description">{sessionCount} active sessions are currently trusted for this account.</p>
              </span>
              <button
                ref={signOutDialogTriggerRef}
                className="button button-outline-neutral"
                onClick={() => setIsSignOutDialogOpen(true)}
                type="button"
              >
                <UserCheck size={15} aria-hidden="true" /> Sign out all sessions
              </button>
            </div>
            <div className="security-session-list">
              {initialSessions.slice(0, sessionCount).map(([label, device, location, time], index) => (
                <article className="security-session-row" key={`${label}-${device}`}>
                  <span className="icon-tile green">
                    {index === 1 ? <Smartphone size={18} aria-hidden="true" /> : <Laptop size={18} aria-hidden="true" />}
                  </span>
                  <span>
                    <strong>{label}</strong>
                    <small>
                      {device} · {location} · {time}
                    </small>
                  </span>
                  <span className={index === 0 ? "badge local" : "badge"}>{index === 0 ? "Current" : "Trusted"}</span>
                </article>
              ))}
            </div>
            {revokedSessionId ? (
              <p className="settings-status-note" aria-live="polite">
                <CheckCircle2 size={15} aria-hidden="true" /> Revoked session <code>{revokedSessionId}</code>
              </p>
            ) : null}
          </section>

          <div className="settings-two-card-grid">
            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Database size={18} aria-hidden="true" />
              </span>
              <h2>Upload deletion policy</h2>
              <p className="tool-description">Temporary uploaded files are cleared automatically when the active session ends.</p>
              <span className="badge local">Auto-delete on</span>
            </section>

            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <KeyRound size={18} aria-hidden="true" />
              </span>
              <h2>Recovery methods</h2>
              <p className="tool-description">Recovery email and authenticator backup codes are configured for account recovery.</p>
              <span className="badge local">2 methods</span>
            </section>
          </div>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>Login activity</h2>
            <div className="key-activity-list">
              {loginActivity.map(([time, detail]) => (
                <article key={`${time}-${detail}`}>
                  <Activity size={15} aria-hidden="true" />
                  <span>
                    <strong>{time}</strong>
                    <small>{detail}</small>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Security checklist</h2>
            <div className="settings-row-list compact">
              {checklist.map((item) => (
                <div className="settings-detail-row compact-row" key={item}>
                  <ShieldCheck size={15} aria-hidden="true" />
                  <span>{item}</span>
                  <span className="badge local">On</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Risk actions</h2>
            <div className="consent-preview-box">
              <ShieldAlert size={18} aria-hidden="true" />
              <strong>Review sensitive changes</strong>
              <p>Password, API key, and billing authority changes require a fresh two-factor challenge.</p>
              <button className="button button-outline-neutral" type="button">
                Download security log
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
            <h2 id="sign-out-sessions-title">Sign out all sessions?</h2>
            <p>This revokes the active Toolars browser session and signs out trusted devices linked to this workspace.</p>
            <div className="states-alert amber">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>You will need to sign in again before account sync resumes.</span>
            </div>
            <div className="settings-button-row">
              <button className="button button-outline-neutral" onClick={closeSignOutDialog} type="button">
                Cancel
              </button>
              <button className="button button-danger" onClick={() => void signOutSessions()} type="button">
                Sign out other sessions
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
