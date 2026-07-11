"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Bell, CheckCircle2, Clock, Mail, MessageSquare, Moon, Smartphone } from "lucide-react";

const alertDefaults = ["workflowCompletion", "reviewAlerts", "trialUsage", "productUpdates"] as const;
type AlertId = (typeof alertDefaults)[number];

const channels = [
  { Icon: Mail, id: "email" },
  { Icon: Bell, id: "inApp" },
  { Icon: Smartphone, id: "mobilePush" }
] as const;

type AlertStatus =
  | { kind: "allActive" }
  | { kind: "workflowCompletionPaused" }
  | { alertId: AlertId; enabled: boolean; kind: "changed" };

function buildInitialAlertState(): Record<AlertId, boolean> {
  const state = {} as Record<AlertId, boolean>;
  for (const alertId of alertDefaults) {
    state[alertId] = true;
  }
  return state;
}

export function NotificationsSettingsView() {
  const t = useTranslations("settings.notifications");
  const [enabled, setEnabled] = useState(buildInitialAlertState);
  const [status, setStatus] = useState({ kind: "allActive" } as AlertStatus);

  function toggleAlert(alertId: AlertId) {
    setEnabled((current) => {
      const nextValue = !current[alertId];
      setStatus(alertId === "workflowCompletion" && !nextValue ? { kind: "workflowCompletionPaused" } : { alertId, enabled: nextValue, kind: "changed" });
      return { ...current, [alertId]: nextValue };
    });
  }

  function statusMessage() {
    switch (status.kind) {
      case "allActive":
        return t("status.allActive");
      case "workflowCompletionPaused":
        return t("status.workflowCompletionPaused");
      case "changed":
        return t("status.changed", {
          label: t(`alerts.${status.alertId}.label`),
          state: t(status.enabled ? "status.enabled" : "status.paused")
        });
    }
  }

  return (
    <div className="settings-subpage notifications-settings-page" data-notifications-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">{t("sections.eyebrow")}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">{t("hero.subtitle")}</p>
          </span>
          <span className="settings-trust-note">
            <Bell size={15} aria-hidden="true" /> {t("hero.trustNote")}
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.deliveryChannels")}</h2>
            <div className="settings-stat-grid">
              {channels.map(({ Icon, id }) => (
                <article className="settings-stat-card" key={id}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{t(`channels.${id}.label`)}</span>
                  <small>{t(`channels.${id}.detail`)}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.workflowAlerts")}</h2>
            <div className="settings-toggle-list">
              {alertDefaults.map((alertId) => {
                const isEnabled = enabled[alertId];
                const label = t(`alerts.${alertId}.label`);
                return (
                  <article className="privacy-toggle-row" key={alertId}>
                    <span className="icon-tile green">
                      <Bell size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{label}</strong>
                      <small>{t(`alerts.${alertId}.description`)}</small>
                    </span>
                    <button
                      aria-label={label}
                      aria-pressed={isEnabled}
                      className={`privacy-switch-button ${isEnabled ? "is-on" : ""}`}
                      onClick={() => toggleAlert(alertId)}
                      type="button"
                    />
                  </article>
                );
              })}
            </div>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {statusMessage()}
            </p>
          </section>

          <div className="settings-two-card-grid">
            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Clock size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.digest")}</h2>
              <p className="tool-description">{t("digest.description")}</p>
              <span className="badge local">{t("digest.badge")}</span>
            </section>

            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Moon size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.quietHours")}</h2>
              <p className="tool-description">{t("quietHours.description")}</p>
              <span className="badge">{t("quietHours.badge")}</span>
            </section>
          </div>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.reviewRouting")}</h2>
            <p className="tool-description">{t("reviewRouting.description")}</p>
            <span className="badge local">{t("reviewRouting.badge")}</span>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.trialRouting")}</h2>
            <p className="tool-description">{t("trialRouting.description")}</p>
            <span className="badge local">{t("trialRouting.badge")}</span>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.releaseNotes")}</h2>
            <p className="tool-description">{t("releaseNotes.description")}</p>
            <span className="badge">{t("releaseNotes.badge")}</span>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.preview")}</h2>
            <div className="consent-preview-box">
              <strong>{t("preview.title")}</strong>
              <p>{t("preview.description")}</p>
              <button disabled className="button button-outline-neutral" type="button">
                <MessageSquare size={15} aria-hidden="true" /> {t("preview.action")}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
