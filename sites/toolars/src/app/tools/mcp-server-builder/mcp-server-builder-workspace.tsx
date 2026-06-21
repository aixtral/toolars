"use client";

import { useMemo, useState } from "react";
import { Clipboard, Save, ServerCog } from "lucide-react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  buildMcpManifest,
  buildMcpServerDraft,
  defaultMcpServerDraft,
  getMcpManifestStatus,
  stringifyMcpManifest,
  validateMcpServerDraft,
  type McpServerDraft
} from "@/lib/tools/mcp-server-builder";

const initialPreview = `{
  "name": "toolars-research-kit",
  "tools": []
}`;

const builderStages = [
  ["1", "Define tools", "Name, input schema, output contract", "Active", "local"],
  ["2", "Add resources", "Docs, prompts, datasets", "Next", ""],
  ["3", "Test payloads", "Validate agent-facing metadata", "Next", ""]
] as const;

export function McpServerBuilderWorkspace() {
  const [draft, setDraft] = useState<McpServerDraft>(() => buildMcpServerDraft());
  const [manifestText, setManifestText] = useState(initialPreview);
  const [status, setStatus] = useState("Waiting for generation.");

  const reviewChecks = useMemo(() => validateMcpServerDraft(draft), [draft]);

  const updateDraft = <Key extends keyof McpServerDraft>(key: Key, value: McpServerDraft[Key]) => {
    setDraft((current) => ({
      ...current,
      [key]: value
    }));
  };

  const generateManifest = () => {
    const nextDraft = buildMcpServerDraft(draft);
    setManifestText(stringifyMcpManifest(buildMcpManifest(nextDraft)));
    setStatus(getMcpManifestStatus(nextDraft));
  };

  const saveDraft = () => {
    window.localStorage.setItem("toolars.mcp-server-builder.draft", JSON.stringify(draft));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={status.startsWith("Manifest generated") ? "Manifest ready" : "Drafting"}
      providerRoute="Local manifest"
      runMode="Manifest draft"
      toolSlug="mcp-server-builder"
    >
      <section className="workspace-panel mcp-overview-panel">
        <span className="eyebrow">RAG / MCP / Agent</span>
        <h1>MCP Server Builder</h1>
        <p className="subtitle">Draft tool definitions, resources, and manifest notes for an agent-ready MCP server.</p>

        <h2 style={{ marginTop: 28 }}>Builder stages</h2>
        <div className="mcp-stage-list">
          {builderStages.map(([number, title, description, statusLabel, tone]) => (
            <article className="mcp-stage-row" key={title}>
              <span className="mcp-stage-number">{number}</span>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <span className={`badge ${tone}`}>{statusLabel}</span>
            </article>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/tools/mcp-server-builder/about">Tool details</a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Server draft</h2>
              <p className="tool-description">Describe the server and primary tool. The prototype updates a manifest preview.</p>
            </div>
            <span className="badge workflow">Workflow</span>
          </div>

          <div className="mcp-input-grid">
            <label className="field-label" htmlFor="mcp-server-name">
              Server name
              <input
                className="input"
                id="mcp-server-name"
                onChange={(event) => updateDraft("serverName", event.target.value)}
                value={draft.serverName}
              />
            </label>
            <label className="field-label" htmlFor="mcp-primary-tool">
              Primary tool
              <input
                className="input"
                id="mcp-primary-tool"
                onChange={(event) => updateDraft("primaryTool", event.target.value)}
                value={draft.primaryTool}
              />
            </label>
            <label className="field-label mcp-wide-field" htmlFor="mcp-tool-description">
              Tool description
              <textarea
                className="textarea mcp-description"
                id="mcp-tool-description"
                onChange={(event) => updateDraft("toolDescription", event.target.value)}
                value={draft.toolDescription}
              />
            </label>
          </div>

          <div className="mcp-check-row">
            <label>
              <input
                checked={draft.includeJsonSchema}
                onChange={(event) => updateDraft("includeJsonSchema", event.target.checked)}
                type="checkbox"
              />
              JSON schema
            </label>
            <label>
              <input
                checked={draft.includeResourceIndex}
                onChange={(event) => updateDraft("includeResourceIndex", event.target.checked)}
                type="checkbox"
              />
              Resource index
            </label>
            <label>
              <input
                checked={draft.includeOAuthNotes}
                onChange={(event) => updateDraft("includeOAuthNotes", event.target.checked)}
                type="checkbox"
              />
              OAuth notes
            </label>
            <label>
              <input
                checked={draft.includeTestPayload}
                onChange={(event) => updateDraft("includeTestPayload", event.target.checked)}
                type="checkbox"
              />
              Test payload
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveDraft}>
              <Save size={16} aria-hidden="true" /> Save draft
            </button>
            <button className="button button-solid" type="button" onClick={generateManifest}>
              <ServerCog size={16} aria-hidden="true" /> Generate manifest
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Manifest preview</h2>
              <p className="tool-description">{status}</p>
            </div>
            <button className="button button-outline" type="button">
              <Clipboard size={16} aria-hidden="true" /> Copy manifest
            </button>
          </div>
          <pre className="code-output mcp-code-output">{manifestText}</pre>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Launch review</span>
        <h2 style={{ marginTop: 12 }}>What Toolars checks</h2>
        <div className="mcp-review-list">
          {reviewChecks.map((check) => (
            <div className="profile-row" key={check.label}>
              <span className={`badge ${check.tone === "ok" ? "local" : "warn"}`}>{check.tone === "ok" ? "OK" : "Warn"}</span>
              <span>{check.label}</span>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>Suggested next tool</strong>
          <p>Open MCP Tester after export to validate responses and metadata.</p>
        </div>
      </aside>
    </AiLabWorkbenchShell>
  );
}

export const mcpServerBuilderDefaults = defaultMcpServerDraft;
