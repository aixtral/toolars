"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Archive, CheckCircle2, Clock, Download, FileArchive, FileText, HardDrive, Sparkles, Trash2, Upload } from "lucide-react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

type UsageCard = {
  label: string;
  value: string;
  detail: string;
};

type RecentUpload = {
  name: string;
  type: string;
  size: string;
  status: "temporary" | "saved";
};

type FileTypeLimit = {
  type: string;
  limit: string;
};

type RetentionRow = {
  id: "temporary" | "archive" | "saved";
  label: string;
  value: string;
};

const retentionIcons = {
  temporary: Clock,
  archive: Archive,
  saved: FileArchive
} as const;

export function StorageSettingsView() {
  const t = useTranslations("settings.storage");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const usageCards = t.raw("usage.cards") as UsageCard[];
  const recentUploads = t.raw("recentUploads.items") as RecentUpload[];
  const fileTypes = t.raw("fileTypes.items") as FileTypeLimit[];
  const retentionRows = t.raw("retention.rows") as RetentionRow[];
  const [temporaryFiles, setTemporaryFiles] = useState(6);
  const [status, setStatus] = useState(() => t("cleanup.statusInitial"));

  function clearTemporaryUploads() {
    setTemporaryFiles(0);
    setStatus(t("cleanup.statusCleared"));
  }

  return (
    <div className="settings-subpage storage-settings-page" data-storage-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">{t("sections.eyebrow")}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">{t("hero.subtitle")}</p>
          </span>
          <a className="button button-solid" href={localizePath("/settings/billing#usage", localeCode)}>
            {t("actions.viewTrialUsage")}
          </a>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.storageUsage")}</h2>
                <p className="tool-description">{t("usage.description")}</p>
              </span>
              <span className="badge local">{t("usage.badge")}</span>
            </div>
            <div className="workspace-meter large" aria-label={t("aria.storageUsage")}>
              <span style={{ width: "42%" }} />
            </div>
            <div className="settings-stat-grid">
              {usageCards.map(({ label, value, detail }) => (
                <article className="settings-stat-card" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                  <small>{detail}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.recentUploads")}</h2>
            <div className="settings-row-list">
              {recentUploads.map(({ name, type, size, status }) => (
                <div className="settings-detail-row" key={name}>
                  <strong>{name}</strong>
                  <span>
                    {type} · {size}
                  </span>
                  <span className={status === "saved" ? "badge local" : "badge warn"}>{t(`statuses.${status}`)}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="settings-two-card-grid">
            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Upload size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.cleanupPolicy")}</h2>
              <p className="tool-description">{t("cleanup.temporaryFiles", { count: temporaryFiles })}</p>
              <button className="button button-outline-neutral" onClick={clearTemporaryUploads} type="button">
                <Trash2 size={15} aria-hidden="true" /> {t("actions.clearTemporaryUploads")}
              </button>
              <p className="settings-status-note" aria-live="polite">
                <CheckCircle2 size={15} aria-hidden="true" /> {status}
              </p>
            </section>

            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <h2>{t("sections.automation")}</h2>
              <p className="tool-description">{t("automation.description")}</p>
              <span className="badge local">{t("automation.badge")}</span>
            </section>
          </div>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.fileTypes")}</h2>
            <div className="settings-row-list compact">
              {fileTypes.map(({ type, limit }) => (
                <div className="settings-detail-row compact-row" key={type}>
                  <FileText size={15} aria-hidden="true" />
                  <span>{type}</span>
                  <span className="badge local">{limit}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.exportArchive")}</h2>
            <p className="tool-description">{t("exportArchive.description")}</p>
            <button disabled className="button button-outline-neutral" type="button">
              <Download size={15} aria-hidden="true" /> {t("actions.prepareArchive")}
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.retentionWindow")}</h2>
            <div className="settings-row-list compact">
              {retentionRows.map(({ id, label, value }) => {
                const Icon = retentionIcons[id];
                return (
                  <div className="settings-detail-row compact-row" key={id}>
                    <Icon size={15} aria-hidden="true" />
                    <span>{label}</span>
                    <span className={id === "saved" ? "badge local" : "badge"}>{value}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
