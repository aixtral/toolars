import { AlertTriangle, CheckCircle2, Download, FileCheck2, FileText, MoreHorizontal, ShieldCheck, UploadCloud } from "lucide-react";

const kpis = [
  ["Pending reviews", "42", "+6 since yesterday"],
  ["Security flags", "8", "2 high severity"],
  ["AI consent reviews", "16", "3 awaiting decision"],
  ["Published this month", "124", "+18 from last month"]
] as const;

const submissions = [
  ["AI Research Summarizer", "Writing / Research", "AI", "AI consent", "Freemium", "S. Kim", "New", "Medium", "10 min ago"],
  ["PDF Compressor Pro", "PDF", "Traditional", "Local", "Freemium", "Mark Chen", "New", "Low", "28 min ago"],
  ["CSV Chart Maker", "Data", "Traditional", "Cloud", "Free", "Jenna Lee", "Security review", "High", "1 hr ago"],
  ["Social Caption AI", "Social Media", "AI", "AI consent", "Freemium", "Rahul Patel", "AI review", "Medium", "2 hrs ago"],
  ["Mortgage Planner", "Finance", "Traditional", "Local", "Freemium", "Lisa Gomez", "New", "Low", "3 hrs ago"]
] as const;

const detailRows = [
  ["Submitted by", "Sarah Kim"],
  ["Submitted on", "May 18, 2026, 10:12 AM"],
  ["Last updated", "May 18, 2026, 10:12 AM"],
  ["Category", "Writing / Research"],
  ["Tool type", "AI-powered"],
  ["Processing", "AI consent required"],
  ["Pricing", "Freemium"]
] as const;

const automatedChecks = [
  ["URL reachable", "Pass", "ok"],
  ["Duplicate scan", "No matches", "ok"],
  ["Malware scan", "Clean", "ok"],
  ["Privacy policy found", "Not detected", "warn"],
  ["AI disclosure present", "Detected", "ok"]
] as const;

const checklist = [
  ["Functionality works as described", true],
  ["Accurate category & tags", true],
  ["Pricing information clear", true],
  ["Privacy policy available", false],
  ["AI disclosure & consent clear", true],
  ["No misleading claims", false]
] as const;

export function AdminReviewView() {
  return (
    <div className="admin-review-page" data-admin-review-page="true">
      <section className="section admin-review-hero">
        <div>
          <span className="eyebrow">Internal console</span>
          <h1 className="title">Review queue</h1>
          <p className="subtitle">Review submitted tools, inspect automated checks, request changes, and approve listings.</p>
        </div>
        <a className="button button-outline-neutral" href="/submit">
          Open submit form
        </a>
      </section>

      <section className="admin-kpi-grid" aria-label="Review summary">
        {kpis.map(([label, value, detail]) => (
          <article className="panel admin-kpi-card" key={label}>
            <span className="icon-tile green">
              <FileCheck2 size={20} aria-hidden="true" />
            </span>
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{detail}</small>
            </div>
          </article>
        ))}
      </section>

      <div className="admin-review-layout">
        <main className="admin-review-main">
          <section className="panel admin-queue-panel">
            <div className="admin-toolbar">
              <label className="input-like" htmlFor="admin-search">
                Search submissions...
              </label>
              <button className="button button-outline-neutral" type="button">
                Sort: Newest first
              </button>
              <button className="button button-outline-neutral" type="button">
                All statuses
              </button>
              <button className="button button-outline-neutral" type="button">
                Filters
              </button>
              <button className="button button-outline-neutral" type="button">
                <Download size={15} aria-hidden="true" /> Export CSV
              </button>
            </div>

            <div className="admin-submission-table" aria-label="Submission table">
              <div className="admin-submission-head">
                <strong>Tool</strong>
                <strong>Category</strong>
                <strong>Type</strong>
                <strong>Processing</strong>
                <strong>Pricing</strong>
                <strong>Status</strong>
                <strong>Risk</strong>
                <strong>Updated</strong>
                <strong>Actions</strong>
              </div>
              {submissions.map(([tool, category, type, processing, pricing, submittedBy, status, risk, updated], index) => (
                <article className={`admin-submission-row ${index === 0 ? "is-selected" : ""}`} key={tool}>
                  <span>
                    <strong>{tool}</strong>
                    <small>Submitted by {submittedBy}</small>
                  </span>
                  <span>{category}</span>
                  <span className="badge">{type}</span>
                  <span className={processing === "AI consent" ? "badge warning" : "badge local"}>{processing}</span>
                  <span>{pricing}</span>
                  <span className="badge local">{status}</span>
                  <span className={`admin-risk ${risk.toLowerCase()}`}>{risk}</span>
                  <span>{updated}</span>
                  <button aria-label={`Review ${tool}`} className="icon-button" type="button">
                    <MoreHorizontal size={16} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-bottom-grid">
            <article className="panel">
              <h2>Audit trail</h2>
              <div className="admin-timeline">
                <span>Submission created</span>
                <span>Automated scan completed</span>
                <span>Assigned to reviewer</span>
              </div>
            </article>
            <article className="panel">
              <h2>Internal comments</h2>
              <div className="admin-comment">
                <strong>Admin</strong>
                <p>Great tool. Missing privacy policy, please request it from the developer.</p>
              </div>
              <div className="input-like">Add internal comment...</div>
            </article>
            <article className="panel">
              <h2>Attachments</h2>
              <div className="admin-attachment">
                <UploadCloud size={18} aria-hidden="true" />
                <span>screenshot-1.png</span>
              </div>
              <div className="admin-attachment">
                <FileText size={18} aria-hidden="true" />
                <span>demo-recording.mp4</span>
              </div>
            </article>
          </section>
        </main>

        <aside className="admin-detail-panel panel">
          <h2>Submission details</h2>
          <div className="admin-submission-card">
            <span className="icon-tile green">
              <FileCheck2 size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>AI Research Summarizer</h3>
              <p>Summarize research papers, reports, and articles with citations and key insights using AI.</p>
              <div className="tag-list">
                <span>#AI</span>
                <span>#Research</span>
                <span>#Summarization</span>
              </div>
            </div>
          </div>

          <div className="settings-row-list compact">
            {detailRows.map(([label, value]) => (
              <div className="settings-detail-row" key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>

          <section className="admin-check-section">
            <h2>Automated checks</h2>
            {automatedChecks.map(([label, value, tone]) => (
              <div className="admin-check-row" key={label}>
                {tone === "ok" ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                <strong>{label}</strong>
                <span className={tone === "ok" ? "admin-pass" : "admin-warn"}>{value}</span>
              </div>
            ))}
          </section>

          <section className="admin-check-section">
            <div className="landing-section-head">
              <h2>Review checklist</h2>
              <span className="pricing-note">4/6 complete</span>
            </div>
            {checklist.map(([label, checked]) => (
              <label className="filter-check" key={label}>
                <input defaultChecked={checked} type="checkbox" />
                <span>{label}</span>
              </label>
            ))}
          </section>

          <div className="admin-action-row">
            <button className="button button-solid" type="button">
              <ShieldCheck size={15} aria-hidden="true" /> Approve
            </button>
            <button className="button button-outline-neutral" type="button">
              Request changes
            </button>
            <button className="button button-danger" type="button">
              Reject
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
