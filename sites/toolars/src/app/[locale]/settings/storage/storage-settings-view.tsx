"use client";

import { useState } from "react";
import { Archive, CheckCircle2, Clock, Download, FileArchive, FileText, HardDrive, Sparkles, Trash2, Upload } from "lucide-react";

const usageCards = [
  ["Used storage", "4.2 GB", "of 10 GB included"],
  ["Temporary uploads", "6 files", "cleared after session"],
  ["Saved outputs", "284", "PDF, image, and text files"],
  ["Shared links", "35", "active exports"]
] as const;

const recentUploads = [
  ["quarterly-report.pdf", "PDF", "18 MB", "Temporary"],
  ["invoice-batch.zip", "Archive", "42 MB", "Saved"],
  ["hero-crop.png", "Image", "6 MB", "Saved"]
] as const;

const fileTypes = [
  ["PDF", "100 MB per file"],
  ["Images", "25 MB per file"],
  ["Archives", "250 MB per file"],
  ["CSV / JSON", "50 MB per file"]
] as const;

export function StorageSettingsView() {
  const [temporaryFiles, setTemporaryFiles] = useState(6);
  const [status, setStatus] = useState("Temporary uploads will be removed when the active session ends.");

  function clearTemporaryUploads() {
    setTemporaryFiles(0);
    setStatus("Temporary uploads cleared.");
  }

  return (
    <div className="settings-subpage storage-settings-page" data-storage-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">Settings</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">Storage</h1>
            <p className="subtitle">Review workspace storage, upload retention, file limits, archive exports, and beta trial usage.</p>
          </span>
          <a className="button button-solid" href="/settings/billing#usage">
            View trial usage
          </a>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>Storage usage</h2>
                <p className="tool-description">Your beta trial workspace is using 42% of the included storage allocation.</p>
              </span>
              <span className="badge local">4.2 GB / 10 GB</span>
            </div>
            <div className="workspace-meter large" aria-label="Storage usage">
              <span style={{ width: "42%" }} />
            </div>
            <div className="settings-stat-grid">
              {usageCards.map(([label, value, detail]) => (
                <article className="settings-stat-card" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                  <small>{detail}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Recent uploads</h2>
            <div className="settings-row-list">
              {recentUploads.map(([name, type, size, state]) => (
                <div className="settings-detail-row" key={name}>
                  <strong>{name}</strong>
                  <span>
                    {type} · {size}
                  </span>
                  <span className={state === "Saved" ? "badge local" : "badge warn"}>{state}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="settings-two-card-grid">
            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Upload size={18} aria-hidden="true" />
              </span>
              <h2>Upload cleanup policy</h2>
              <p className="tool-description">{temporaryFiles} temporary files</p>
              <button className="button button-outline-neutral" onClick={clearTemporaryUploads} type="button">
                <Trash2 size={15} aria-hidden="true" /> Clear temporary uploads
              </button>
              <p className="settings-status-note" aria-live="polite">
                <CheckCircle2 size={15} aria-hidden="true" /> {status}
              </p>
            </section>

            <section className="panel settings-subpage-card">
              <span className="icon-tile green">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <h2>Storage automation</h2>
              <p className="tool-description">Automatically compress image outputs, delete expired temp uploads, and warn before workflows exceed storage limits.</p>
              <span className="badge local">Automation active</span>
            </section>
          </div>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>File types</h2>
            <div className="settings-row-list compact">
              {fileTypes.map(([type, limit]) => (
                <div className="settings-detail-row compact-row" key={type}>
                  <FileText size={15} aria-hidden="true" />
                  <span>{type}</span>
                  <span className="badge local">{limit}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Export archive</h2>
            <p className="tool-description">Download saved outputs, uploaded files, workflow metadata, and collection exports as one archive.</p>
            <button className="button button-outline-neutral" type="button">
              <Download size={15} aria-hidden="true" /> Prepare archive
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Retention window</h2>
            <div className="settings-row-list compact">
              <div className="settings-detail-row compact-row">
                <Clock size={15} aria-hidden="true" />
                <span>Temporary uploads</span>
                <span className="badge">Session</span>
              </div>
              <div className="settings-detail-row compact-row">
                <Archive size={15} aria-hidden="true" />
                <span>Archive exports</span>
                <span className="badge">7 days</span>
              </div>
              <div className="settings-detail-row compact-row">
                <FileArchive size={15} aria-hidden="true" />
                <span>Saved outputs</span>
                <span className="badge local">Until removed</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
