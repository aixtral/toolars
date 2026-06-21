import {
  ArrowRight,
  Bookmark,
  Clock,
  FileText,
  Folder,
  Link,
  Puzzle,
  Sparkles,
  Star,
  Workflow
} from "lucide-react";

const kpis = [
  { label: "Recent outputs", value: "24", note: "+6 from yesterday", tone: "green" },
  { label: "Favorite tools", value: "18", note: "View your favorites", tone: "amber" },
  { label: "Saved workflows", value: "9", note: "+2 this week", tone: "teal" },
  { label: "AI credits remaining", value: "1,250", note: "Resets in 14 days", tone: "purple" }
] as const;

const recentOutputs = [
  { title: "Q2 PDF summary", tool: "PDF Toolkit + AI Summarizer", href: "/tools/pdf-toolkit", time: "2h ago", status: "Completed" },
  { title: "Image compression batch", tool: "Image Compressor", href: "/tools/pdf-toolkit", time: "5h ago", status: "Processing" },
  { title: "Mortgage scenario", tool: "Mortgage Calculator", href: "/", time: "Yesterday", status: "Completed" },
  { title: "CSV cleanup", tool: "Data Cleaner", href: "/tools/json-repair", time: "2 days ago", status: "Completed" }
] as const;

const favoriteTools = [
  { title: "PDF Toolkit", description: "All-in-one PDF utility", href: "/tools/pdf-toolkit", badge: "Traditional" },
  { title: "JSON Repair", description: "Format and validate JSON", href: "/tools/json-repair", badge: "Local" },
  { title: "AI Email Writer", description: "Write emails in seconds", href: "/explore/ai-developer", badge: "AI" },
  { title: "LLM Cost Calculator", description: "Estimate AI launch spend", href: "/tools/llm-cost-calculator", badge: "Local" }
] as const;

const savedCollections = [
  { title: "PDF Ops Kit", meta: "4 tools · 1 workflow", href: "/collections/pdf-ops-kit" },
  { title: "AI Developer Lab", meta: "4 tools · 3 workflows", href: "/collections/ai-developer-lab" },
  { title: "Marketing Sprint", meta: "12 tools · 3 workflows", href: "/collections" }
] as const;

const nextWorkflows = [
  { title: "Turn PDF into summary", meta: "PDF Toolkit · AI Summarizer", href: "/workflows/pdf-summary" },
  { title: "LLM Cost Review", meta: "Calculator · Budget memo", href: "/workflows/llm-cost-review" },
  { title: "MCP Tool Launch", meta: "MCP Builder · Docs export", href: "/workflows/mcp-tool-launch" }
] as const;

const sharedLinks = [
  "Q2_Marketing_Report.pdf",
  "Cleaned_Data_May.csv",
  "Social_Post_1080x1080.png"
] as const;

export function MyToolsDashboardView() {
  return (
    <div className="my-tools-page" data-my-tools-page="true">
      <section className="section landing-hero">
        <span className="eyebrow">Personal workspace</span>
        <h1 className="title">Welcome back, Alex</h1>
        <p className="subtitle">Continue recent outputs, reopen favorites, manage saved collections, and track AI credits.</p>
        <div className="search-panel landing-search-panel my-tools-command">
          <div className="hero-input">
            <Sparkles size={18} aria-hidden="true" />
            <span>What do you want to do next?</span>
            <a className="open-link" href="/workflows/pdf-summary" aria-label="Run next workflow">
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="chip-row">
            <span className="chip active">All</span>
            <span className="chip">Tools</span>
            <span className="chip">Workflows</span>
            <span className="chip">Outputs</span>
          </div>
        </div>
      </section>

      <div className="workspace-kpi-grid">
        {kpis.map((kpi) => (
          <article className="workspace-kpi-card" key={kpi.label}>
            <span className={`icon-tile ${kpi.tone}`}>{kpi.value.slice(0, 2)}</span>
            <span>
              <small>{kpi.label}</small>
              <strong>{kpi.value}</strong>
              <em>{kpi.note}</em>
            </span>
          </article>
        ))}
      </div>

      <div className="my-tools-grid">
        <section className="panel" id="recent">
          <div className="landing-section-head">
            <h2>Continue where you left off</h2>
            <a className="text-link" href="#recent">
              View all history <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="workspace-timeline">
            {recentOutputs.map((item) => (
              <a className="workspace-timeline-row" href={item.href} key={item.title}>
                <span className="timeline-dot" />
                <span className="icon-tile rose">
                  <FileText size={16} aria-hidden="true" />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.tool}</small>
                </span>
                <span>
                  <small>{item.time}</small>
                  <em>{item.status}</em>
                </span>
                <span className="button button-outline-neutral">Open</span>
              </a>
            ))}
          </div>
        </section>

        <aside className="workspace-side-stack">
          <section className="panel" id="collections">
            <div className="landing-section-head">
              <h2>Saved collections</h2>
              <a className="text-link" href="/collections">
                View all <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="detail-resource-list">
              {savedCollections.map((collection) => (
                <a className="detail-resource-row" href={collection.href} key={collection.title}>
                  <span className="icon-tile amber">
                    <Folder size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{collection.title}</strong>
                    <small>{collection.meta}</small>
                  </span>
                  <Bookmark size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

          <section className="panel" id="workflows">
            <div className="landing-section-head">
              <h2>Recommended next workflows</h2>
              <a className="text-link" href="/workflows">
                View all <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="detail-resource-list">
              {nextWorkflows.map((workflow) => (
                <a className="detail-resource-row" href={workflow.href} key={workflow.title}>
                  <span className="icon-tile purple">
                    <Workflow size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{workflow.title}</strong>
                    <small>{workflow.meta}</small>
                  </span>
                  <span className="badge local">Use</span>
                </a>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="my-tools-grid">
        <section className="panel" id="favorites">
          <div className="landing-section-head">
            <h2>Your favorite tools</h2>
            <a className="text-link" href="#favorites">
              Manage <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="favorite-tool-grid">
            {favoriteTools.map((tool) => (
              <a className="favorite-tool-card" href={tool.href} key={tool.title}>
                <span className="icon-tile green">
                  <Star size={16} aria-hidden="true" />
                </span>
                <span>
                  <strong>{tool.title}</strong>
                  <small>{tool.description}</small>
                </span>
                <span className="badge">{tool.badge}</span>
                <span className="open-link">Open</span>
              </a>
            ))}
          </div>
        </section>

        <aside className="workspace-side-stack">
          <section className="panel" id="shared">
            <div className="landing-section-head">
              <h2>Recent shared links</h2>
              <a className="text-link" href="#shared">
                View all <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="detail-row-list">
              {sharedLinks.map((name) => (
                <div className="detail-row" key={name}>
                  <span className="badge">
                    <Link size={13} aria-hidden="true" /> Link
                  </span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel workspace-usage-card">
            <h2>Storage</h2>
            <div className="workspace-meter large">
              <span style={{ width: "24%" }} />
            </div>
            <p className="tool-description">2.4 GB / 10 GB used</p>
            <h2 style={{ marginTop: 18 }}>Install Toolars Extension</h2>
            <p className="tool-description">Access tools, save outputs, and use your favorites from anywhere.</p>
            <button className="button button-outline-neutral" type="button">
              <Puzzle size={16} aria-hidden="true" /> Install extension
            </button>
          </section>
        </aside>
      </div>

      <div className="workspace-bottom-strip">
        <span className="icon-tile green">
          <Clock size={18} aria-hidden="true" />
        </span>
        <span>
          <strong>Team workspace not enabled</strong>
          <small>Collaborate with your team, share collections, and manage permissions in a shared workspace.</small>
        </span>
        <button className="button button-outline-neutral" type="button">
          Upgrade to Team
        </button>
      </div>
    </div>
  );
}
