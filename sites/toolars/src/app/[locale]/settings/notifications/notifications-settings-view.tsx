"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Bell, CheckCircle2, Clock, Mail, MessageSquare, Moon, Smartphone } from "lucide-react";

const alertDefaults = [
  ["Workflow completion alerts", "Email me when long workflow runs finish."],
  ["Review alerts", "Notify me when submitted tools need changes."],
  ["Trial usage alerts", "Send beta credit, storage, and usage threshold updates."],
  ["Product updates", "Occasional updates about new collections and workflows."]
] as const;

const channels = [
  ["Email", "Primary delivery channel", Mail],
  ["In-app", "Command center and toast updates", Bell],
  ["Mobile push", "Critical workflow and trial usage alerts", Smartphone]
] as const;

export function NotificationsSettingsView() {
  const t = useTranslations("settings.notifications");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(alertDefaults.map(([label]) => [label, true]))
  );
  const [status, setStatus] = useState("All notification defaults are active.");

  function toggleAlert(label: string) {
    setEnabled((current) => {
      const nextValue = !current[label];
      setStatus(label === "Workflow completion alerts" && !nextValue ? "Workflow completion alerts paused." : `${label} ${nextValue ? "enabled" : "paused"}.`);
      return { ...current, [label]: nextValue };
    });
  }

  return (
    <div className="settings-subpage notifications-settings-page" data-notifications-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">Settings</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">Tune workflow, review, trial usage, digest, quiet-hour, and delivery channel preferences.</p>
          </span>
          <span className="settings-trust-note">
            <Bell size={15} aria-hidden="true" /> Alerts enabled
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <h2>Delivery channels</h2>
            <div className="settings-stat-grid">
              {channels.map(([label, detail, Icon]) => (
                <article className="settings-stat-card" key={label}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                  <small>{detail}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Workflow alerts</h2>
            <div className="settings-toggle-list">
              {alertDefaults.map(([label, description]) => {
                const isEnabled = enabled[label];
                return (
                  <article className="privacy-toggle-row" key={label}>
                    <span className="icon-tile green">
                      <Bell size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                    <button
                      aria-label={label}
                      aria-pressed={isEnabled}
                      className={`privacy-switch-button ${isEnabled ? "is-on" : ""}`}
                      onClick={() => toggleAlert(label)}
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

          <div className="settings-two-card-grid">
            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Clock size={18} aria-hidden="true" />
              </span>
              <h2>Digest schedule</h2>
              <p className="tool-description">Send a daily digest at 8:30 AM with completed workflows, submitted tool decisions, and shared collection changes.</p>
              <span className="badge local">Daily</span>
            </section>

            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Moon size={18} aria-hidden="true" />
              </span>
              <h2>Quiet hours</h2>
              <p className="tool-description">Pause non-critical notifications from 10:00 PM to 7:00 AM in your workspace timezone.</p>
              <span className="badge">Scheduled</span>
            </section>
          </div>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>Review routing</h2>
            <p className="tool-description">Submitted tool review decisions and required-change requests are sent immediately.</p>
            <span className="badge local">Enabled</span>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Trial usage routing</h2>
            <p className="tool-description">Beta credit, storage, and usage threshold warnings go to workspace owners.</p>
            <span className="badge local">Enabled</span>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Release notes</h2>
            <p className="tool-description">New workflows, collections, and Toolars release notes are grouped into the product digest.</p>
            <span className="badge">Digest only</span>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Notification preview</h2>
            <div className="consent-preview-box">
              <strong>PDF Summary Workflow finished</strong>
              <p>Your summary is ready. It used 18 AI credits and saved the output to PDF Ops Kit.</p>
              <button className="button button-outline-neutral" type="button">
                <MessageSquare size={15} aria-hidden="true" /> Preview message
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
