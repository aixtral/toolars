"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Download, FileClock, HardDrive, LockKeyhole, ShieldCheck, Trash2 } from "lucide-react";
import { clearAiConsentAuditLog, loadAiConsentAuditLog } from "@/lib/ai/consent-audit-storage";
import { selectAiProviderRoute } from "@/lib/ai/provider-routing";
import type { ServerConsentAuditLedger } from "@/lib/ai/server-consent-audit-ledger";
import type { ToolarsAuthContext } from "@/lib/auth/toolars-auth-context";
import { buildWorkspaceAuditHeaders, subscribeWorkspaceIdentityChanges } from "@/lib/workspace/workspace-identity";

const trustDefaults = [
  {
    label: "Ask before AI processing",
    description: "Show a consent prompt before content leaves your device for AI processing."
  },
  {
    label: "Auto-delete uploads after session",
    description: "Remove temporary uploads after the active workflow session ends."
  },
  {
    label: "Prefer local tools",
    description: "Route work to local tools before cloud or AI-powered alternatives."
  },
  {
    label: "Save output history",
    description: "Keep outputs in your workspace so you can return to prior runs."
  }
] as const;

const policyRows = [
  ["Consent gate", "Consent required", "Every AI workflow displays what content will be sent and why."],
  ["Routing order", "Preferred", "Traditional and browser-local tools stay first in matching and workflow suggestions."],
  ["Model training", "Opt-out", "Workspace content is not used for model training without explicit consent."]
] as const;

const retentionRows = [
  ["Uploads", "Deleted after session"],
  ["AI prompts", "Stored for 30 days"],
  ["Generated outputs", "Saved until removed"],
  ["Audit events", "Retained for 1 year"]
] as const;

const defaultProviderRoute = selectAiProviderRoute({
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary"
});

const providerRouteRows = [
  ["Primary route", defaultProviderRoute.providerRouteId, "Managed gateway"],
  ["Fallback route", defaultProviderRoute.fallbackRouteId, "Local extract only"],
  ["Retention", `Retention ${defaultProviderRoute.retentionDays} days`, defaultProviderRoute.modelFamily]
] as const;

export function PrivacyAiSettingsView() {
  const t = useTranslations("settings.privacy-ai");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(trustDefaults.map((item) => [item.label, true]))
  );
  const [auditLog, setAuditLog] = useState(() => loadAiConsentAuditLog(null));
  const [serverAuthContext, setServerAuthContext] = useState<ToolarsAuthContext | null>(null);
  const [serverAuditLedger, setServerAuditLedger] = useState<ServerConsentAuditLedger | null>(null);
  const [serverAuditStatus, setServerAuditStatus] = useState("Server ledger pending");
  const [status, setStatus] = useState("All privacy defaults are active for this workspace.");
  const latestAuditEvent = auditLog.events[auditLog.events.length - 1];
  const latestServerRun = serverAuditLedger?.runs[serverAuditLedger.runs.length - 1];
  const serverDeletionCount = serverAuditLedger?.deletions?.length ?? 0;
  const latestDeletion = serverDeletionCount > 0 ? serverAuditLedger?.deletions[serverDeletionCount - 1] : undefined;
  const serverIdentityLabel = serverAuthContext?.isAuthenticated ? "Account ledger connected" : "Anonymous workspace ledger";
  const serverIdentityPrimary = serverAuthContext?.accountId ?? serverAuthContext?.workspaceId ?? "Workspace-scoped local identity";
  const serverIdentitySecondary = serverAuthContext?.accountEmail ?? serverAuthContext?.workspaceId ?? "Run metadata is bound before account linking.";
  const serverIdentitySource = serverAuthContext?.source ?? "anonymous";

  useEffect(() => {
    setAuditLog(loadAiConsentAuditLog());

    let isActive = true;

    async function loadServerAuditLedger() {
      if (typeof fetch !== "function") return;

      try {
        const response = await fetch("/api/ai/consent-audit", {
          headers: buildWorkspaceAuditHeaders()
        });
        if (!response.ok) throw new Error("Server audit ledger request failed");
        const payload = (await response.json()) as { auth?: ToolarsAuthContext; ledger?: ServerConsentAuditLedger };
        if (!isActive || payload.ledger?.version !== 1) return;
        if (payload.auth) setServerAuthContext(payload.auth);
        setServerAuditLedger(payload.ledger);
        setServerAuditStatus("Server ledger synced");
      } catch {
        if (isActive) setServerAuditStatus("Server ledger unavailable");
      }
    }

    const unsubscribeFromIdentityChanges = subscribeWorkspaceIdentityChanges(() => {
      void loadServerAuditLedger();
    });

    void loadServerAuditLedger();

    return () => {
      isActive = false;
      unsubscribeFromIdentityChanges();
    };
  }, []);

  function toggleDefault(label: string) {
    setEnabled((current) => {
      const nextValue = !current[label];
      setStatus(
        label === "Ask before AI processing" && !nextValue
          ? "Consent prompt paused for this workspace."
          : `${label} ${nextValue ? "enabled" : "paused"} for this workspace.`
      );
      return { ...current, [label]: nextValue };
    });
  }

  function handleDownloadPrivacyLog() {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      localAuditLog: auditLog,
      serverAuditLedger
    };

    if (
      typeof document !== "undefined" &&
      typeof Blob !== "undefined" &&
      typeof URL !== "undefined" &&
      typeof URL.createObjectURL === "function"
    ) {
      const url = URL.createObjectURL(new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" }));
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `toolars-privacy-log-${new Date().toISOString().slice(0, 10)}.json`;
      downloadLink.click();
      URL.revokeObjectURL(url);
    }

    const localEventLabel = auditLog.events.length === 1 ? "local event" : "local events";
    const serverRunCount = serverAuditLedger?.runs.length ?? 0;
    const serverRunLabel = serverRunCount === 1 ? "server run" : "server runs";
    setStatus(`Privacy log export prepared with ${auditLog.events.length} ${localEventLabel} and ${serverRunCount} ${serverRunLabel}.`);
  }

  async function handleDeleteAiHistory() {
    setAuditLog(clearAiConsentAuditLog());

    if (typeof fetch !== "function") {
      setServerAuditStatus("Server ledger unavailable");
      setStatus("AI history deleted locally; server deletion audit unavailable.");
      return;
    }

    try {
      const response = await fetch("/api/ai/consent-audit", {
        headers: buildWorkspaceAuditHeaders(),
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Server audit deletion failed");
      const payload = (await response.json()) as { auth?: ToolarsAuthContext; ledger?: ServerConsentAuditLedger };
      if (payload.ledger?.version !== 1) throw new Error("Invalid server audit ledger response");
      if (payload.auth) setServerAuthContext(payload.auth);
      setServerAuditLedger(payload.ledger);
      setServerAuditStatus("Server ledger synced");
      setStatus("AI history deleted locally; server deletion audit retained.");
    } catch {
      setServerAuditStatus("Server ledger unavailable");
      setStatus("AI history deleted locally; server deletion audit unavailable.");
    }
  }

  return (
    <div className="settings-subpage privacy-ai-settings-page" data-privacy-ai-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">Settings</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">Control consent, AI processing, local-first routing, retention, exports, and deletion policies for your workspace.</p>
          </span>
          <span className="settings-trust-note">
            <ShieldCheck size={15} aria-hidden="true" /> AI consent is on
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.consentDefaults")}</h2>
                <p className="tool-description">These defaults shape every AI workflow, uploaded file, and saved output in Toolars.</p>
              </span>
            </div>
            <div className="settings-toggle-list">
              {trustDefaults.map((item) => {
                const isEnabled = enabled[item.label];
                return (
                  <article className="privacy-toggle-row" key={item.label}>
                    <span className="icon-tile green">
                      <ShieldCheck size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <button
                      aria-label={item.label}
                      aria-pressed={isEnabled}
                      className={`privacy-switch-button ${isEnabled ? "is-on" : ""}`}
                      onClick={() => toggleDefault(item.label)}
                      type="button"
                    />
                  </article>
                );
              })}
            </div>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {status}
            </p>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.processingPolicy")}</h2>
            <div className="settings-row-list">
              {policyRows.map(([label, value, description]) => (
                <div className="settings-detail-row" key={label}>
                  <strong>{label}</strong>
                  <span>{description}</span>
                  <span className="badge local">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.providerRouting")}</h2>
                <p className="tool-description">Production routing shows the primary provider, fallback path, consent gate, and retention window before AI work leaves the workspace.</p>
              </span>
              <span className="badge ai">Consent required</span>
            </div>
            <div className="provider-route-matrix">
              {providerRouteRows.map(([label, value, detail]) => (
                <article className="provider-route-row" key={label}>
                  <strong>{label}</strong>
                  <code>{value}</code>
                  <span>{detail}</span>
                </article>
              ))}
            </div>
          </section>

          <div className="settings-two-card-grid">
            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <HardDrive size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.localFirst")}</h2>
              <p className="tool-description">Toolars ranks local calculators, converters, and browser workflows before tools that require uploads or AI processing.</p>
              <div className="privacy-route-strip">
                <span>Local</span>
                <span>Cloud</span>
                <span>AI</span>
              </div>
            </section>

            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Bot size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.trainingControls")}</h2>
              <p className="tool-description">Workspace content stays out of training by default. Team owners can require admin approval before any data-sharing policy changes.</p>
              <span className="badge local">Training opt-out active</span>
            </section>
          </div>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.consentPreview")}</h2>
            <div className="consent-preview-box">
              <strong>{t("labels.Before AI processing")}</strong>
              <p>This workflow wants to summarize one uploaded PDF using an AI model. Review extracted text, model provider, retention, and estimated credits before continuing.</p>
              <div className="settings-button-row">
                <button className="button button-solid" type="button">
                  Allow once
                </button>
                <button className="button button-outline-neutral" type="button">
                  Use local tool
                </button>
              </div>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.dataRetention")}</h2>
            <div className="settings-row-list compact">
              {retentionRows.map(([label, value]) => (
                <div className="settings-detail-row compact-row" key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                  <FileClock size={15} aria-hidden="true" />
                </div>
              ))}
            </div>
            <button className="button button-outline-neutral" onClick={handleDeleteAiHistory} type="button">
              <Trash2 size={15} aria-hidden="true" /> Delete AI history
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.privacyLog")}</h2>
            <p className="tool-description">Export a workspace audit of AI consent events, uploads, retention updates, and deletion requests.</p>
            <div className="privacy-audit-summary">
              <strong>
                {auditLog.events.length === 1
                  ? "1 AI consent event retained locally"
                  : `${auditLog.events.length} AI consent events retained locally`}
              </strong>
              {latestAuditEvent ? (
                <div className="settings-detail-row compact-row">
                  <strong>{latestAuditEvent.workflowTitle}</strong>
                  <span>{latestAuditEvent.providerLabel}</span>
                  <span className="badge ai">{latestAuditEvent.providerRouteId}</span>
                </div>
              ) : (
                <small>No approved AI provider routes have been recorded in this browser yet.</small>
              )}
            </div>
            <div className="privacy-audit-summary">
              <strong>{serverAuditStatus}</strong>
              {serverAuditLedger ? (
                <>
                  <small>
                    {serverAuditLedger.runs.length === 1
                      ? "1 server audit run with metadata"
                      : `${serverAuditLedger.runs.length} server audit runs with metadata`}
                  </small>
                  {serverDeletionCount > 0 ? (
                    <small>
                      {serverDeletionCount === 1
                        ? "1 deletion request retained in server ledger"
                        : `${serverDeletionCount} deletion requests retained in server ledger`}
                    </small>
                  ) : null}
                  {latestServerRun ? (
                    <div className="settings-detail-row compact-row">
                      <strong>{latestServerRun.runId}</strong>
                      <span>{latestServerRun.modelFamily}</span>
                      <span className="badge ai">{latestServerRun.status}</span>
                    </div>
                  ) : null}
                  {latestDeletion ? (
                    <div className="settings-detail-row compact-row">
                      <strong>{latestDeletion.scope}</strong>
                      <span>{latestDeletion.requestedAt}</span>
                      <span className="badge local">{latestDeletion.status}</span>
                    </div>
                  ) : null}
                </>
              ) : (
                <small>Server-side run metadata appears after the audit route responds.</small>
              )}
            </div>
            <button className="button button-outline-neutral" onClick={handleDownloadPrivacyLog} type="button">
              <Download size={15} aria-hidden="true" /> Download privacy log
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.auditTrail")}</h2>
            <div className="ai-audit-trail-list">
              <article>
                <span className="badge local">Identity</span>
                <strong>{serverIdentityLabel}</strong>
                <small>Run metadata is bound to workspace identity headers before account linking.</small>
                <div className="settings-detail-row compact-row">
                  <strong>{serverIdentityPrimary}</strong>
                  <span>{serverIdentitySecondary}</span>
                  <span className="badge local">{serverIdentitySource}</span>
                </div>
              </article>
              <article>
                <span className="badge ai">Run metadata</span>
                <strong>{latestServerRun ? "Latest server run" : "No server run recorded"}</strong>
                <small>{latestServerRun ? `Run id ${latestServerRun.runId} - ${latestServerRun.modelFamily} - ${latestServerRun.status}` : "Server runs appear after a consent-gated workflow completes."}</small>
              </article>
              <article>
                <span className="badge">Deletion</span>
                <strong>{latestDeletion?.scope ?? "No deletion request"}</strong>
                <small>{latestDeletion ? `${latestDeletion.status} at ${latestDeletion.requestedAt}` : "Deletion requests stay as ledger events even after local history is cleared."}</small>
              </article>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <span className="icon-tile green">
              <LockKeyhole size={18} aria-hidden="true" />
            </span>
            <h2>{t("sections.guardrails")}</h2>
            <p className="tool-description">Sensitive content requires an explicit consent step, and admins can inspect AI usage from the privacy log.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
