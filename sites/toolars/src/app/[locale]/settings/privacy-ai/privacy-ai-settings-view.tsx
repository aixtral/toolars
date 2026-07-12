"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Download, FileClock, HardDrive, LockKeyhole, ShieldCheck, Trash2 } from "lucide-react";
import { clearAiConsentAuditLog, loadAiConsentAuditLog } from "@/lib/ai/consent-audit-storage";
import { selectAiProviderRoute } from "@/lib/ai/provider-routing";
import type { ServerConsentAuditLedger } from "@/lib/ai/server-consent-audit-ledger";
import type { ToolarsAuthContext } from "@/lib/auth/toolars-auth-context";

const trustDefaults = [
  { key: "askBeforeAi" },
  { key: "autoDeleteUploads" },
  { key: "preferLocalTools" },
  { key: "saveOutputHistory" }
] as const;

type TrustDefaultKey = (typeof trustDefaults)[number]["key"];

const policyRows = ["consentGate", "routingOrder", "modelTraining"] as const;

const retentionRows = ["uploads", "aiPrompts", "generatedOutputs", "auditEvents"] as const;

type ServerAuditStatus = "pending" | "synced" | "unavailable";
const initialServerAuditStatus: ServerAuditStatus = "pending";
const initialServerAuthContext = null as ToolarsAuthContext | null;
const initialServerAuditLedger = null as ServerConsentAuditLedger | null;

const defaultProviderRoute = selectAiProviderRoute({
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary"
});

function buildInitialTrustDefaults(): Record<TrustDefaultKey, boolean> {
  const defaults = {} as Record<TrustDefaultKey, boolean>;
  for (const item of trustDefaults) {
    defaults[item.key] = true;
  }

  return defaults;
}

export function PrivacyAiSettingsView() {
  const t = useTranslations("settings.privacy-ai");
  const [enabled, setEnabled] = useState(buildInitialTrustDefaults);
  const [auditLog, setAuditLog] = useState(() => loadAiConsentAuditLog(null));
  const [serverAuthContext, setServerAuthContext] = useState(initialServerAuthContext);
  const [serverAuditLedger, setServerAuditLedger] = useState(initialServerAuditLedger);
  const [serverAuditStatus, setServerAuditStatus] = useState(initialServerAuditStatus);
  const [status, setStatus] = useState(() => t("status.allActive"));
  const latestAuditEvent = auditLog.events[auditLog.events.length - 1];
  const latestServerRun = serverAuditLedger?.runs[serverAuditLedger.runs.length - 1];
  const serverDeletionCount = serverAuditLedger?.deletions?.length ?? 0;
  const latestDeletion = serverDeletionCount > 0 ? serverAuditLedger?.deletions[serverDeletionCount - 1] : undefined;
  const serverIdentityLabel = serverAuthContext?.isAuthenticated ? t("audit.identity.accountLedgerConnected") : t("audit.identity.anonymousWorkspaceLedger");
  const serverIdentityPrimary = serverAuthContext?.accountId ?? serverAuthContext?.workspaceId ?? t("audit.identity.workspaceScopedLocalIdentity");
  const serverIdentitySecondary = serverAuthContext?.accountEmail ?? serverAuthContext?.workspaceId ?? t("audit.identity.runMetadataBeforeLinking");
  const serverIdentitySource = serverAuthContext?.source ?? t("audit.identity.anonymousSource");
  const providerRouteRows = [
    {
      detail: t("providerRouteRows.primary.detail"),
      key: "primary",
      value: defaultProviderRoute.providerRouteId
    },
    {
      detail: t("providerRouteRows.fallback.detail"),
      key: "fallback",
      value: defaultProviderRoute.fallbackRouteId
    },
    {
      detail: defaultProviderRoute.modelFamily,
      key: "retention",
      value: t("providerRouteRows.retention.value", { days: defaultProviderRoute.retentionDays })
    }
  ] as const;

  useEffect(() => {
    setAuditLog(loadAiConsentAuditLog());

    let isActive = true;

    async function loadServerAuditLedger() {
      if (typeof fetch !== "function") return;

      try {
        const response = await fetch("/api/ai/consent-audit");
        if (!response.ok) throw new Error("Server audit ledger request failed");
        const payload = (await response.json()) as { auth?: ToolarsAuthContext; ledger?: ServerConsentAuditLedger };
        if (!isActive || payload.ledger?.version !== 1) return;
        if (payload.auth) setServerAuthContext(payload.auth);
        setServerAuditLedger(payload.ledger);
        setServerAuditStatus("synced");
      } catch {
        if (isActive) setServerAuditStatus("unavailable");
      }
    }

    void loadServerAuditLedger();

    return () => {
      isActive = false;
    };
  }, []);

  function toggleDefault(key: TrustDefaultKey) {
    const label = t(`trustDefaults.${key}.label`);
    setEnabled((current) => {
      const nextValue = !current[key];
      setStatus(
        key === "askBeforeAi" && !nextValue
          ? t("status.consentPromptPaused")
          : t("status.defaultChanged", {
              label,
              state: t(nextValue ? "status.enabled" : "status.paused")
            })
      );
      return { ...current, [key]: nextValue };
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

    const serverRunCount = serverAuditLedger?.runs.length ?? 0;
    setStatus(t("status.exportPrepared", { localEvents: auditLog.events.length, serverRuns: serverRunCount }));
  }

  async function handleDeleteAiHistory() {
    setAuditLog(clearAiConsentAuditLog());

    if (typeof fetch !== "function") {
      setServerAuditStatus("unavailable");
      setStatus(t("status.deleteUnavailable"));
      return;
    }

    try {
      const response = await fetch("/api/ai/consent-audit", {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Server audit deletion failed");
      const payload = (await response.json()) as { auth?: ToolarsAuthContext; ledger?: ServerConsentAuditLedger };
      if (payload.ledger?.version !== 1) throw new Error("Invalid server audit ledger response");
      if (payload.auth) setServerAuthContext(payload.auth);
      setServerAuditLedger(payload.ledger);
      setServerAuditStatus("synced");
      setStatus(t("status.deleteRetained"));
    } catch {
      setServerAuditStatus("unavailable");
      setStatus(t("status.deleteUnavailable"));
    }
  }

  return (
    <div className="settings-subpage privacy-ai-settings-page" data-privacy-ai-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">{t("sections.eyebrow")}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">{t("hero.subtitle")}</p>
          </span>
          <span className="settings-trust-note">
            <ShieldCheck size={15} aria-hidden="true" /> {t("hero.consentOn")}
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.consentDefaults")}</h2>
                <p className="tool-description">{t("copy.consentDefaultsDescription")}</p>
              </span>
            </div>
            <div className="settings-toggle-list">
              {trustDefaults.map((item) => {
                const isEnabled = enabled[item.key];
                const label = t(`trustDefaults.${item.key}.label`);
                return (
                  <article className="privacy-toggle-row" key={item.key}>
                    <span className="icon-tile green">
                      <ShieldCheck size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{label}</strong>
                      <small>{t(`trustDefaults.${item.key}.description`)}</small>
                    </span>
                    <button
                      aria-label={label}
                      aria-pressed={isEnabled}
                      className={`privacy-switch-button ${isEnabled ? "is-on" : ""}`}
                      onClick={() => toggleDefault(item.key)}
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
              {policyRows.map((key) => (
                <div className="settings-detail-row" key={key}>
                  <strong>{t(`policyRows.${key}.label`)}</strong>
                  <span>{t(`policyRows.${key}.description`)}</span>
                  <span className="badge local">{t(`policyRows.${key}.value`)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.providerRouting")}</h2>
                <p className="tool-description">{t("copy.providerRoutingDescription")}</p>
              </span>
              <span className="badge ai">{t("badges.consentRequired")}</span>
            </div>
            <div className="provider-route-matrix">
              {providerRouteRows.map((row) => (
                <article className="provider-route-row" key={row.key}>
                  <strong>{t(`providerRouteRows.${row.key}.label`)}</strong>
                  <code>{row.value}</code>
                  <span>{row.detail}</span>
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
              <p className="tool-description">{t("copy.localFirstDescription")}</p>
              <div className="privacy-route-strip">
                <span>{t("routeStrip.local")}</span>
                <span>{t("routeStrip.cloud")}</span>
                <span>{t("routeStrip.ai")}</span>
              </div>
            </section>

            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Bot size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.trainingControls")}</h2>
              <p className="tool-description">{t("copy.trainingControlsDescription")}</p>
              <span className="badge local">{t("badges.trainingOptOutActive")}</span>
            </section>
          </div>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.consentPreview")}</h2>
            <div className="consent-preview-box">
              <strong>{t("labels.beforeAiProcessing")}</strong>
              <p>{t("copy.consentPreviewDescription")}</p>
              <div className="settings-button-row">
                <button disabled className="button button-solid" type="button">
                  {t("actions.allowOnce")}
                </button>
                <button disabled className="button button-outline-neutral" type="button">
                  {t("actions.useLocalTool")}
                </button>
              </div>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.dataRetention")}</h2>
            <div className="settings-row-list compact">
              {retentionRows.map((key) => (
                <div className="settings-detail-row compact-row" key={key}>
                  <strong>{t(`retentionRows.${key}.label`)}</strong>
                  <span>{t(`retentionRows.${key}.value`)}</span>
                  <FileClock size={15} aria-hidden="true" />
                </div>
              ))}
            </div>
            <button className="button button-outline-neutral" onClick={handleDeleteAiHistory} type="button">
              <Trash2 size={15} aria-hidden="true" /> {t("actions.deleteAiHistory")}
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.privacyLog")}</h2>
            <p className="tool-description">{t("copy.privacyLogDescription")}</p>
            <div className="privacy-audit-summary">
              <strong>{t("audit.localEvents", { count: auditLog.events.length })}</strong>
              {latestAuditEvent ? (
                <div className="settings-detail-row compact-row">
                  <strong>{latestAuditEvent.workflowTitle}</strong>
                  <span>{latestAuditEvent.providerLabel}</span>
                  <span className="badge ai">{latestAuditEvent.providerRouteId}</span>
                </div>
              ) : (
                <small>{t("audit.noApprovedRoutes")}</small>
              )}
            </div>
            <div className="privacy-audit-summary">
              <strong>{t(`audit.serverStatus.${serverAuditStatus}`)}</strong>
              {serverAuditLedger ? (
                <>
                  <small>{t("audit.serverRuns", { count: serverAuditLedger.runs.length })}</small>
                  {serverDeletionCount > 0 ? (
                    <small>{t("audit.serverDeletionRequests", { count: serverDeletionCount })}</small>
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
                <small>{t("audit.serverMetadataPending")}</small>
              )}
            </div>
            <button className="button button-outline-neutral" onClick={handleDownloadPrivacyLog} type="button">
              <Download size={15} aria-hidden="true" /> {t("actions.downloadPrivacyLog")}
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.auditTrail")}</h2>
            <div className="ai-audit-trail-list">
              <article>
                <span className="badge local">{t("badges.identity")}</span>
                <strong>{serverIdentityLabel}</strong>
                <small>{t("audit.identity.description")}</small>
                <div className="settings-detail-row compact-row">
                  <strong>{serverIdentityPrimary}</strong>
                  <span>{serverIdentitySecondary}</span>
                  <span className="badge local">{serverIdentitySource}</span>
                </div>
              </article>
              <article>
                <span className="badge ai">{t("badges.runMetadata")}</span>
                <strong>{latestServerRun ? t("audit.latestRun.title") : t("audit.latestRun.emptyTitle")}</strong>
                <small>
                  {latestServerRun
                    ? t("audit.latestRun.description", {
                        modelFamily: latestServerRun.modelFamily,
                        runId: latestServerRun.runId,
                        status: latestServerRun.status
                      })
                    : t("audit.latestRun.emptyDescription")}
                </small>
              </article>
              <article>
                <span className="badge">{t("badges.deletion")}</span>
                <strong>{latestDeletion?.scope ?? t("audit.deletion.emptyTitle")}</strong>
                <small>
                  {latestDeletion
                    ? t("audit.deletion.description", {
                        requestedAt: latestDeletion.requestedAt,
                        status: latestDeletion.status
                      })
                    : t("audit.deletion.emptyDescription")}
                </small>
              </article>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <span className="icon-tile green">
              <LockKeyhole size={18} aria-hidden="true" />
            </span>
            <h2>{t("sections.guardrails")}</h2>
            <p className="tool-description">{t("copy.guardrailsDescription")}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
