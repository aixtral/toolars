import { Code2, FileJson, ScanSearch, WalletCards, Workflow } from "lucide-react";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ResourceCard } from "@/components/tools/resource-card";
import { ToolCard } from "@/components/tools/tool-card";
import { aiDeveloperLabTools, sourceInventory, workflows } from "@/data/registry";

export default function AiDeveloperLabPage() {
  const labWorkflows = workflows.filter((workflow) => ["AI Security", "LLM Cost", "RAG / MCP / Agent"].includes(workflow.category));

  return (
    <ToolarsShell active="ai-developer">
      <div className="page-grid">
        <div>
          <section className="section">
            <span className="eyebrow">Aixtral Lab merged inventory</span>
            <h1 className="title">AI Developer Lab tools</h1>
            <p className="subtitle">Security, LLM cost, prompt engineering, RAG, MCP, agent, and developer utilities merged into Toolars as the professional tool family for builders.</p>
          </section>

          <section className="workflow-strip" aria-label="Lab metrics">
            <ResourceCard description="Merged from Aixtral Lab" href="#tools" icon={<Code2 size={20} aria-hidden="true" />} meta={`${aiDeveloperLabTools.length}`} title="Lab tools" />
            <ResourceCard description="Security to design utilities" href="#tools" icon={<ScanSearch size={20} aria-hidden="true" />} meta={`${Object.keys(sourceInventory.aixtralLab.categories).length}`} title="Categories" />
            <ResourceCard description="Run without upload where possible" href="#tools" icon={<FileJson size={20} aria-hidden="true" />} meta="82%" title="Local first" />
          </section>

          <section className="section" id="tools">
            <div className="tool-grid">
              {aiDeveloperLabTools.map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="right-rail">
          <section className="panel">
            <h2>Recommended playbooks</h2>
            <div className="resource-list">
              <ResourceCard description="Production-ready JSON payload." href="/tools/json-repair" icon={<FileJson size={20} aria-hidden="true" />} meta="Run" title="Repair and validate LLM JSON" />
              <ResourceCard description="Risk report and red-team variants." href="/workflows/ai-prompt-hardening" icon={<ScanSearch size={20} aria-hidden="true" />} meta="Run" title="Harden prompt surfaces" />
              <ResourceCard description="Cost plan for launch review." href="/workflows/llm-cost-review" icon={<WalletCards size={20} aria-hidden="true" />} meta="Run" title="Estimate model spend" />
            </div>
          </section>
          <section className="panel">
            <h2>Lab workflows</h2>
            <div className="resource-list">
              {labWorkflows.map((workflow) => (
                <ResourceCard description={`${workflow.estimatedMinutes} min · ${workflow.runCount}`} href={workflow.href} icon={<Workflow size={20} aria-hidden="true" />} key={workflow.slug} title={workflow.title} />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </ToolarsShell>
  );
}
