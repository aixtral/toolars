import { Download, FileText, Table2, Workflow } from "lucide-react";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ResourceCard } from "@/components/tools/resource-card";
import { ToolCard } from "@/components/tools/tool-card";
import { pdfTools } from "@/data/registry";

export default function PdfDirectoryPage() {
  return (
    <ToolarsShell active="pdf">
      <div className="page-grid pdf-directory-page" data-pdf-directory-layout="desktop-market-v2">
        <div>
          <section className="section">
            <p className="subtitle">Explore / PDF</p>
            <h1 className="title">PDF tools and AI workflows</h1>
            <p className="subtitle">All the best PDF tools in one place. Perform fast local operations or use AI for summaries, data extraction, translation, and more.</p>

            <div className="directory-toolbar">
              <input className="input-like" defaultValue="pdf" aria-label="Search within PDF tools" />
              <select className="select-like" aria-label="Platform">
                <option>All platforms</option>
              </select>
              <select className="select-like" aria-label="Sort">
                <option>Sort by: Trending</option>
              </select>
              <button className="button button-outline" type="button">
                Filters
              </button>
            </div>

            <div className="chip-row">
              {["All PDF", "Merge & Split", "Compress", "Convert", "Summarize", "Extract data", "Sign & Protect"].map((label, index) => (
                <span className={`chip ${index === 0 ? "active" : ""}`} key={label}>
                  {label}
                </span>
              ))}
            </div>
          </section>

          <section className="workflow-strip pdf-directory-featured" aria-label="Featured PDF workflows">
            <div className="pdf-directory-featured-head">Featured workflows</div>
            <ResourceCard description="Summarize any PDF with AI and export key points." href="/workflows/pdf-summary" icon={<Workflow size={20} aria-hidden="true" />} meta="AI involved" title="Turn PDF into summary" />
            <ResourceCard description="Automatically extract tables and download as CSV." href="/workflows/pdf-summary" icon={<Table2 size={20} aria-hidden="true" />} meta="4 tools" title="Extract tables to CSV" />
            <ResourceCard description="Merge multiple PDFs, compress, and share." href="/tools/pdf-toolkit" icon={<Download size={20} aria-hidden="true" />} meta="No AI" title="Merge, compress, and share" />
          </section>

          <section className="section">
            <h2>128 tools found</h2>
            <div className="tool-grid pdf-directory-tool-grid">
              {pdfTools.map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="right-rail">
          <section className="panel">
            <h2>Recommended path</h2>
            <div className="resource-list">
              <ResourceCard description="Extract text and tables from your PDF." href="/tools/pdf-toolkit" icon={<FileText size={20} aria-hidden="true" />} meta="1" title="Extract content" />
              <ResourceCard description="Get an AI summary and key takeaways." href="/workflows/pdf-summary" icon={<Workflow size={20} aria-hidden="true" />} meta="2" title="AI summarize" />
              <ResourceCard description="Export results or create a shareable link." href="/tools/pdf-toolkit" icon={<Download size={20} aria-hidden="true" />} meta="3" title="Export & share" />
            </div>
          </section>
          <section className="panel">
            <h2>Your data, our priority</h2>
            <p className="tool-description">Local operations stay on your device whenever possible. AI features are optional and always require consent.</p>
          </section>
        </aside>
      </div>
    </ToolarsShell>
  );
}
