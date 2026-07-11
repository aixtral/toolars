"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Cloud, Globe2, Link2, Plug, RefreshCw, ShieldCheck, Unplug } from "lucide-react";
import { useDialogFocus } from "@/components/core/use-dialog-focus";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";

type IntegrationId = "googleDrive" | "browserExtension" | "notion";
type IntegrationStatus = "connected" | "active" | "disconnected";

type Integration = {
  id: IntegrationId;
  scopes: string[];
  status: IntegrationStatus;
};

const initialIntegrations: Integration[] = [
  {
    id: "googleDrive",
    scopes: ["files.read", "exports.write"],
    status: "connected"
  },
  {
    id: "browserExtension",
    scopes: ["activeTab", "clipboard.write"],
    status: "active"
  },
  {
    id: "notion",
    scopes: ["pages.read", "pages.write"],
    status: "connected"
  }
];

const activityRows = ["googleDriveSync", "browserJsonRepair", "notionPdfSummary"] as const;
type ActivityRowId = (typeof activityRows)[number];

const healthRows = ["oauthTokens", "extensionVersion", "syncQueue"] as const;
type HealthRowId = (typeof healthRows)[number];

type StatusNote =
  | { kind: "initial" }
  | { kind: "disconnected"; id: IntegrationId }
  | { kind: "reconnected"; id: IntegrationId };

export function ConnectedAppsSettingsView() {
  const t = useTranslations("settings.connected-apps");
  const integrationCopy = {
    googleDrive: {
      name: t("integrations.googleDrive.name"),
      description: t("integrations.googleDrive.description"),
      lastSync: t("integrations.googleDrive.lastSync")
    },
    browserExtension: {
      name: t("integrations.browserExtension.name"),
      description: t("integrations.browserExtension.description"),
      lastSync: t("integrations.browserExtension.lastSync")
    },
    notion: {
      name: t("integrations.notion.name"),
      description: t("integrations.notion.description"),
      lastSync: t("integrations.notion.lastSync")
    }
  } satisfies Record<IntegrationId, { name: string; description: string; lastSync: string }>;
  const activityCopy = {
    googleDriveSync: {
      time: t("activity.googleDriveSync.time"),
      detail: t("activity.googleDriveSync.detail")
    },
    browserJsonRepair: {
      time: t("activity.browserJsonRepair.time"),
      detail: t("activity.browserJsonRepair.detail")
    },
    notionPdfSummary: {
      time: t("activity.notionPdfSummary.time"),
      detail: t("activity.notionPdfSummary.detail")
    }
  } satisfies Record<ActivityRowId, { time: string; detail: string }>;
  const healthCopy = {
    oauthTokens: {
      label: t("health.oauthTokens.label"),
      value: t("health.oauthTokens.value")
    },
    extensionVersion: {
      label: t("health.extensionVersion.label"),
      value: t("health.extensionVersion.value")
    },
    syncQueue: {
      label: t("health.syncQueue.label"),
      value: t("health.syncQueue.value")
    }
  } satisfies Record<HealthRowId, { label: string; value: string }>;
  const [integrations, setIntegrations] = useState(initialIntegrations as Integration[]);
  const [status, setStatus] = useState({ kind: "initial" } as StatusNote);
  const [pendingDisconnect, setPendingDisconnect] = useState(null as IntegrationId | null);
  const {
    dialogRef: disconnectDialogRef,
    rememberTrigger: rememberDisconnectTrigger,
    restoreTriggerFocus: restoreDisconnectTriggerFocus
  } = useDialogFocus(Boolean(pendingDisconnect));

  function openDisconnectDialog(event: ReactMouseEvent<HTMLButtonElement>, id: IntegrationId) {
    rememberDisconnectTrigger(event.currentTarget);
    setPendingDisconnect(id);
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

  function disconnectApp(id: IntegrationId) {
    setIntegrations((current) => current.map((app) => (app.id === id ? { ...app, status: "disconnected" } : app)));
    setStatus({ kind: "disconnected", id });
    closeDisconnectDialog();
  }

  function reconnectApp(id: IntegrationId) {
    setIntegrations((current) => current.map((app) => (app.id === id ? { ...app, status: "connected" } : app)));
    setStatus({ kind: "reconnected", id });
  }

  function statusLabel(statusValue: IntegrationStatus) {
    switch (statusValue) {
      case "active":
        return t("statusLabels.active");
      case "connected":
        return t("statusLabels.connected");
      case "disconnected":
        return t("statusLabels.disconnected");
    }
  }

  function statusMessage() {
    switch (status.kind) {
      case "disconnected":
        return t("statusMessages.disconnected", { name: integrationCopy[status.id].name });
      case "reconnected":
        return t("statusMessages.reconnected", { name: integrationCopy[status.id].name });
      case "initial":
        return t("statusMessages.initial");
    }
  }

  const pendingDisconnectName = pendingDisconnect ? integrationCopy[pendingDisconnect].name : "";

  return (
    <div className="settings-subpage connected-apps-settings-page" data-connected-apps-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">{t("sections.eyebrow")}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">{t("hero.subtitle")}</p>
          </span>
          <span className="settings-trust-note">
            <Plug size={15} aria-hidden="true" /> {t("trustNote", { count: integrations.length })}
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.integrations")}</h2>
                <p className="tool-description">{t("integrationsCard.description")}</p>
              </span>
              <span className="badge local">{t("integrationsCard.badge")}</span>
            </div>
            <div className="integration-app-list">
              {integrations.map((app) => {
                const copy = integrationCopy[app.id];
                const isDisconnected = app.status === "disconnected";

                return (
                  <article className={`integration-app-row ${isDisconnected ? "is-disconnected" : ""}`} key={app.id}>
                    <span className="icon-tile green">
                      {isDisconnected ? <Unplug size={18} aria-hidden="true" /> : <Plug size={18} aria-hidden="true" />}
                    </span>
                    <div className="integration-app-content">
                      <div className="api-key-head">
                        <strong>{copy.name}</strong>
                        <span className={isDisconnected ? "badge warn" : "badge local"}>{statusLabel(app.status)}</span>
                      </div>
                      <p>{copy.description}</p>
                      <div className="api-key-meta">
                        <span>{t("metadata.lastSync", { time: copy.lastSync })}</span>
                        <span>{app.scopes.join(", ")}</span>
                      </div>
                    </div>
                    <div className="integration-app-actions">
                      {isDisconnected ? (
                        <button className="button button-outline-neutral" onClick={() => reconnectApp(app.id)} type="button">
                          <RefreshCw size={15} aria-hidden="true" /> {t("actions.reconnect", { name: copy.name })}
                        </button>
                      ) : (
                        <button className="button button-outline-neutral" onClick={(event) => openDisconnectDialog(event, app.id)} type="button">
                          <Unplug size={15} aria-hidden="true" /> {t("actions.disconnect", { name: copy.name })}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {statusMessage()}
            </p>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.connectionScopes")}</h2>
            <div className="scope-grid">
              <article>
                <Cloud size={16} aria-hidden="true" />
                <strong>{t("scopeCards.driveImports.title")}</strong>
                <p>{t("scopeCards.driveImports.description")}</p>
              </article>
              <article>
                <Globe2 size={16} aria-hidden="true" />
                <strong>{t("scopeCards.browserCapture.title")}</strong>
                <p>{t("scopeCards.browserCapture.description")}</p>
              </article>
              <article>
                <Link2 size={16} aria-hidden="true" />
                <strong>{t("scopeCards.outputExports.title")}</strong>
                <p>{t("scopeCards.outputExports.description")}</p>
              </article>
              <article>
                <ShieldCheck size={16} aria-hidden="true" />
                <strong>{t("scopeCards.securityReview.title")}</strong>
                <p>{t("scopeCards.securityReview.description")}</p>
              </article>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.connectNew")}</h2>
            <p className="tool-description">{t("connectNew.description")}</p>
            <div className="settings-button-row">
              <button disabled className="button button-solid" type="button">
                <Plug size={15} aria-hidden="true" /> {t("connectNew.connectSlack")}
              </button>
              <button disabled className="button button-outline-neutral" type="button">
                {t("connectNew.requestPrivateConnector")}
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
                <span>{t("syncPolicy.manualReview.label")}</span>
                <span className="badge local">{t("syncPolicy.manualReview.value")}</span>
              </div>
              <div className="settings-detail-row compact-row">
                <ShieldCheck size={15} aria-hidden="true" />
                <span>{t("syncPolicy.tokenExpiry.label")}</span>
                <span className="badge local">{t("syncPolicy.tokenExpiry.value")}</span>
              </div>
              <div className="settings-detail-row compact-row">
                <Cloud size={15} aria-hidden="true" />
                <span>{t("syncPolicy.fileSync.label")}</span>
                <span className="badge">{t("syncPolicy.fileSync.value")}</span>
              </div>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.appActivity")}</h2>
            <div className="key-activity-list">
              {activityRows.map((activityId) => (
                <article key={activityId}>
                  <Activity size={15} aria-hidden="true" />
                  <span>
                    <strong>{activityCopy[activityId].time}</strong>
                    <small>{activityCopy[activityId].detail}</small>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.integrationHealth")}</h2>
            <div className="settings-row-list compact">
              {healthRows.map((healthId) => (
                <div className="settings-detail-row compact-row" key={healthId}>
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{healthCopy[healthId].label}</span>
                  <span className="badge local">{healthCopy[healthId].value}</span>
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
            <h2 id="disconnect-app-title">{t("dialog.title", { name: pendingDisconnectName })}</h2>
            <p>{t("dialog.description", { name: pendingDisconnectName })}</p>
            <div className="states-alert amber">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>{t("dialog.retention")}</span>
            </div>
            <div className="settings-button-row">
              <button className="button button-outline-neutral" onClick={closeDisconnectDialog} type="button">
                {t("dialog.cancel")}
              </button>
              <button className="button button-danger" onClick={() => disconnectApp(pendingDisconnect)} type="button">
                {t("dialog.confirm")}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
