import { AlertTriangle, LoaderCircle, Search, Trash2, WifiOff } from "lucide-react";

const toastRows = [
  ["saved", "Saved to PDF power user kit", "Undo"],
  ["consent", "AI consent required before summarizing", "Review"],
  ["failed", "Upload failed. File exceeds 50 MB.", "Retry"],
  ["shared", "Share link copied", "Dismiss"]
] as const;

export function StatesBoardView() {
  return (
    <div className="states-board-page" data-states-board-page="true" data-states-density="mobile-v2" data-states-mobile-layout="state-gallery">
      <section className="section states-board-hero">
        <span className="eyebrow">System states</span>
        <h1 className="title">States and overlays</h1>
        <p className="subtitle">Prototype-ready states for empty screens, loading skeletons, upload failures, offline mode, toast feedback, validation, mobile navigation, delete confirmation, and mobile command search.</p>
        <button className="button button-outline-neutral" type="button">
          Show toast
        </button>
      </section>

      <section className="states-grid" aria-label="States and overlays board">
        <article className="panel states-card">
          <span className="states-label">Empty</span>
          <span className="icon-tile green">+</span>
          <h2>No saved outputs yet</h2>
          <p className="tool-description">Start with a tool or workflow, then saved results will appear here.</p>
          <div className="settings-button-row">
            <a className="button button-solid" href="/tools/pdf-toolkit">
              Open PDF Toolkit
            </a>
            <button className="button button-outline-neutral" type="button">
              Import bookmarks
            </button>
          </div>
        </article>

        <article className="panel states-card">
          <span className="states-label">Loading</span>
          <LoaderCircle size={22} aria-hidden="true" />
          <div className="states-skeleton wide" />
          <div className="states-skeleton" />
          <div className="states-skeleton medium" />
          <div className="states-skeleton short" />
        </article>

        <article className="panel states-card">
          <span className="states-label">Upload error</span>
          <div className="states-alert red">
            <AlertTriangle size={18} aria-hidden="true" />
            <span>
              <strong>File too large</strong>
              <small>Toolars can process files up to 50 MB for this workflow.</small>
            </span>
          </div>
          <div className="settings-button-row">
            <button className="button button-solid" type="button">
              Retry upload
            </button>
            <button className="button button-outline-neutral" type="button">
              View requirements
            </button>
          </div>
        </article>

        <article className="panel states-card">
          <span className="states-label">Offline mode</span>
          <div className="states-alert blue">
            <WifiOff size={18} aria-hidden="true" />
            <span>
              <strong>Local tools are still available</strong>
              <small>AI and cloud tools are paused until your connection returns.</small>
            </span>
          </div>
          <a className="button button-outline-neutral" href="/">
            Open local tools
          </a>
        </article>

        <article className="panel states-card states-card-wide">
          <span className="states-label">Toast stack</span>
          <div className="states-toast-stack">
            {toastRows.map(([tone, text, action]) => (
              <div className={`states-toast ${tone}`} key={text}>
                <span className="states-dot" />
                <strong>{text}</strong>
                <button type="button">{action}</button>
              </div>
            ))}
          </div>
        </article>

        <article className="panel states-card states-card-wide">
          <span className="states-label">Form validation</span>
          <label className="states-field">
            <span>Website URL <strong>Verified</strong></span>
            <input readOnly value="https://exampletool.com" />
          </label>
          <label className="states-field warn">
            <span>Screenshot <strong>Required for review</strong></span>
            <input readOnly value="No screenshot uploaded" />
          </label>
          <label className="states-field error">
            <span>Description <strong>12 characters over limit</strong></span>
            <input readOnly value="An AI tool that summarizes documents, PDFs, and reports..." />
          </label>
        </article>

        <article className="panel states-card">
          <span className="states-label">Mobile drawer</span>
          <div className="states-mobile-drawer">
            <div>
              <strong>Toolars</strong>
              <span>Close</span>
            </div>
            {["Explore", "Workflows", "Collections", "My tools", "Submit tool", "Settings"].map((item, index) => (
              <span className={index === 0 ? "is-active" : ""} key={item}>{item}</span>
            ))}
          </div>
        </article>

        <article className="panel states-card">
          <span className="states-label">Delete confirmation</span>
          <div className="states-modal">
            <Trash2 size={20} aria-hidden="true" />
            <h2>Delete saved output?</h2>
            <p>This will remove the PDF summary from your history. Shared links to this output will stop working.</p>
            <div className="states-alert amber">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>This action cannot be undone</span>
            </div>
            <div className="settings-button-row">
              <button className="button button-outline-neutral" type="button">
                Cancel
              </button>
              <button className="button button-danger" type="button">
                Delete output
              </button>
            </div>
          </div>
        </article>

        <article className="panel states-card states-card-wide">
          <span className="states-label">Mobile command overlay</span>
          <div className="states-command-overlay">
            <div className="states-command-input">
              <Search size={16} aria-hidden="true" />
              <span>summarize pdf</span>
              <button type="button">Close command</button>
            </div>
            <strong>Suggested</strong>
            <span className="is-active">AI PDF Summarizer</span>
            <span>PDF Toolkit</span>
            <span>Turn PDF into summary</span>
            <span>Recent: Q2 report summary</span>
          </div>
        </article>
      </section>
    </div>
  );
}
