"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Cloud, Globe2, Link2, Plug, RefreshCw, ShieldCheck, Unplug } from "lucide-react";
import { useDialogFocus } from "@/components/core/use-dialog-focus";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";

type IntegrationStatus = "Connected" | "Active" | "Disconnected";

type Integration = {
  name: string;
  description: string;
  scopes: string[];
  status: IntegrationStatus;
  lastSync: string;
};

const initialIntegrations: Integration[] = [
  {
    name: "Google Drive",
    description: "Import PDFs, spreadsheets, and shared documents into local-first workflows.",
    scopes: ["files.read", "exports.write"],
    status: "Connected",
    lastSync: "18 minutes ago"
  },
  {
    name: "Browser extension",
    description: "Send selected page text to Toolars tools with explicit AI consent gates.",
    scopes: ["activeTab", "clipboard.write"],
    status: "Active",
    lastSync: "Live"
  },
  {
    name: "Notion",
    description: "Save summaries, prompts, and workflow outputs back to team knowledge pages.",
    scopes: ["pages.read", "pages.write"],
    status: "Connected",
    lastSync: "Yesterday"
  }
];

const activityRows = [
  ["18 minutes ago", "Google Drive synced quarterly-report.pdf"],
  ["2 hours ago", "Browser extension sent a page excerpt to JSON Repair"],
  ["Yesterday", "Notion saved PDF Summary Workflow output"]
] as const;

const healthRows = [
  ["OAuth tokens", "Healthy"],
  ["Extension version", "Current"],
  ["Sync queue", "0 pending"]
] as const;

export function ConnectedAppsSettingsView() {
  const t = useTranslations("settings.connected-apps");
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [status, setStatus] = useState("All connected apps are scoped and monitored.");
  const [pendingDisconnect, setPendingDisconnect] = useState<string | null>(null);
  const {
    dialogRef: disconnectDialogRef,
    rememberTrigger: rememberDisconnectTrigger,
    restoreTriggerFocus: restoreDisconnectTriggerFocus
  } = useDialogFocus(Boolean(pendingDisconnect));

  function openDisconnectDialog(event: ReactMouseEvent<HTMLButtonElement>, name: string) {
    rememberDisconnectTrigger(event.currentTarget);
    setPendingDisconnect(name);
  }

  function closeDisconnectDialog() {
    setPendingDisconnect(null);
    restoreDisconnectTriggerFocus();
  }

  function handleDisconnectDialogKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      closeDisconnectDialog();
    }
  }

  function disconnectApp(name: string) {
    setIntegrations((current) => current.map((app) => (app.name === name ? { ...app, status: "Disconnected" } : app)));
    setStatus(`${name} disconnected.`);
    closeDisconnectDialog();
  }

  function reconnectApp(name: string) {
    setIntegrations((current) => current.map((app) => (app.name === name ? { ...app, status: "Connected" } : app)));
    setStatus(`${name} reconnected.`);
  }

  return (
    <div className="settings-subpage connected-apps-settings-page" data-connected-apps-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">Settings</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">Manage app integrations, scopes, sync policy, extension status, and integration health.</p>
          </span>
          <span className="settings-trust-note">
            <Plug size={15} aria-hidden="true" /> 3 integrations monitored
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.integrations")}</h2>
                <p className="tool-description">Review connection state, last sync, and granted access before routing content into workflows.</p>
              </span>
              <span className="badge local">OAuth scoped</span>
            </div>
            <div className="integration-app-list">
              {integrations.map((app) => (
                <article className={`integration-app-row ${app.status === "Disconnected" ? "is-disconnected" : ""}`} key={app.name}>
                  <span className="icon-tile green">
                    {app.status === "Disconnected" ? <Unplug size={18} aria-hidden="true" /> : <Plug size={18} aria-hidden="true" />}
                  </span>
                  <div className="integration-app-content">
                    <div className="api-key-head">
                      <strong>{app.name}</strong>
                      <span className={app.status === "Disconnected" ? "badge warn" : "badge local"}>{app.status}</span>
                    </div>
                    <p>{app.description}</p>
                    <div className="api-key-meta">
                      <span>Last sync {app.lastSync}</span>
                      <span>{app.scopes.join(", ")}</span>
                    </div>
                  </div>
                  <div className="integration-app-actions">
                    {app.status === "Disconnected" ? (
                      <button className="button button-outline-neutral" onClick={() => reconnectApp(app.name)} type="button">
                        <RefreshCw size={15} aria-hidden="true" /> Reconnect {app.name}
                      </button>
                    ) : (
                      <button className="button button-outline-neutral" onClick={(event) => openDisconnectDialog(event, app.name)} type="button">
                        <Unplug size={15} aria-hidden="true" /> Disconnect {app.name}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {status}
            </p>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.connectionScopes")}</h2>
            <div className="scope-grid">
              <article>
                <Cloud size={16} aria-hidden="true" />
                <strong>{t("labels.Drive imports")}</strong>
                <p>Read selected files only when a workflow step asks for external content.</p>
              </article>
              <article>
                <Globe2 size={16} aria-hidden="true" />
                <strong>{t("labels.Browser capture")}</strong>
                <p>Send selected page text to local tools and request consent before AI processing.</p>
              </article>
              <article>
                <Link2 size={16} aria-hidden="true" />
                <strong>{t("labels.Output exports")}</strong>
                <p>Write approved summaries and saved outputs back to chosen workspace destinations.</p>
              </article>
              <article>
                <ShieldCheck size={16} aria-hidden="true" />
                <strong>{t("labels.Security review")}</strong>
                <p>Rotate tokens, review scope changes, and disconnect apps from one place.</p>
              </article>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.connectNew")}</h2>
            <p className="tool-description">Add Slack, Linear, Dropbox, or a private MCP connector after reviewing the requested scopes.</p>
            <div className="settings-button-row">
              <button className="button button-solid" type="button">
                <Plug size={15} aria-hidden="true" /> Connect Slack
              </button>
              <button className="button button-outline-neutral" type="button">
                Request private connector
              </button>
            </div>
          </section>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.syncPolicy")}</h2>
            <div className="settings-row-list compact">
              <div className="settings-detail-row compact-row">
                <RefreshCw size={15} aria-hidden="true" />
                <span>Manual review before AI workflows</span>
                <span className="badge local">On</span>
              </div>
              <div className="settings-detail-row compact-row">
                <ShieldCheck size={15} aria-hidden="true" />
                <span>Auto-expire unused tokens</span>
                <span className="badge local">90 days</span>
              </div>
              <div className="settings-detail-row compact-row">
                <Cloud size={15} aria-hidden="true" />
                <span>File sync mode</span>
                <span className="badge">Selected files</span>
              </div>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.appActivity")}</h2>
            <div className="key-activity-list">
              {activityRows.map(([time, detail]) => (
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
            <h2>{t("sections.integrationHealth")}</h2>
            <div className="settings-row-list compact">
              {healthRows.map(([label, value]) => (
                <div className="settings-detail-row compact-row" key={label}>
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{label}</span>
                  <span className="badge local">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
      {pendingDisconnect ? (
        <div className="settings-confirmation-overlay" role="presentation">
          <section
            ref={disconnectDialogRef}
            aria-labelledby="disconnect-app-title"
            aria-modal="true"
            className="settings-confirmation-dialog"
            onKeyDown={handleDisconnectDialogKeyDown}
            role="dialog"
            tabIndex={-1}
          >
            <span className="icon-tile amber">
              <AlertTriangle size={20} aria-hidden="true" />
            </span>
            <h2 id="disconnect-app-title">Disconnect {pendingDisconnect}?</h2>
            <p>{pendingDisconnect} will stop syncing saved workflow outputs until you reconnect it.</p>
            <div className="states-alert amber">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>Existing saved Toolars outputs stay in your workspace.</span>
            </div>
            <div className="settings-button-row">
              <button className="button button-outline-neutral" onClick={closeDisconnectDialog} type="button">
                Cancel
              </button>
              <button className="button button-danger" onClick={() => disconnectApp(pendingDisconnect)} type="button">
                Disconnect app
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
