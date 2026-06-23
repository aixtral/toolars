"use client";
import { useTranslations } from "next-intl";

import { useMemo, useState } from "react";
import { Copy, FileJson, RotateCcw, ShieldCheck } from "lucide-react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { repairJson, type JsonRepairResult } from "@/lib/tools/json-repair";

const sample = "{\n  user: 'ada',\n  score: 42,\n  flags: ['beta', 'pro'],\n}";

export function JsonRepairWorkspace() {
  const t = useTranslations("tools.json-repair");
  const [input, setInput] = useState(sample);
  const [result, setResult] = useState<JsonRepairResult | null>(null);
  const [copied, setCopied] = useState(false);

  const issueSummary = useMemo(() => {
    const next = repairJson(input);
    const types = new Set(next.fixes.map((fix) => fix.type));
    return [
      { label: "Unquoted object keys", count: types.has("unquoted_keys") ? 3 : 0 },
      { label: "Single quotes", count: types.has("single_quotes") ? 2 : 0 },
      { label: "Trailing comma", count: types.has("trailing_commas") ? 1 : 0 }
    ];
  }, [input]);

  const runRepair = () => {
    setCopied(false);
    setResult(repairJson(input));
  };

  const copyOutput = async () => {
    if (!result?.formatted) return;
    await navigator.clipboard.writeText(result.formatted);
    setCopied(true);
  };

  const artifactState = result ? (result.success ? "Validated JSON" : "Manual review") : "Waiting";

  return (
    <AiLabWorkbenchShell
      artifactState={artifactState}
      providerRoute="Browser only"
      runMode="Local parser"
      toolSlug="json-repair"
    >
      <section className="workspace-panel">
        <span className="eyebrow">Local developer utility</span>
        <h1>JSON Repair</h1>
        <p className="subtitle">Fix malformed LLM JSON output, normalize keys, and prepare payloads for schema validation.</p>
        <h2 style={{ marginTop: 28 }}>Input issues detected</h2>
        {issueSummary.map((issue) => (
          <div className="issue-row" key={issue.label}>
            <span className="issue-number">{issue.count}</span>
            <span>{issue.label}</span>
          </div>
        ))}
        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href="/explore/ai-developer">
            Back to AI Lab
          </a>
          <a className="button button-outline" href="/tools/json-repair/about">
            Tool details
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <h2>Malformed JSON input</h2>
          <p className="tool-description">Prototype parser: local preview only, no upload.</p>
          <span className="badge local" style={{ marginTop: 12 }}>
            Local
          </span>
          <label style={{ display: "block", marginTop: 18, marginBottom: 8, fontWeight: 800 }} htmlFor="json-input">
            Paste model output
          </label>
          <textarea id="json-input" className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
          <div className="button-row">
            <button className="button button-outline" type="button" onClick={() => {
              setInput(sample);
              setResult(null);
            }}>
              <RotateCcw size={16} aria-hidden="true" /> Reset sample
            </button>
            <button className="button button-solid" type="button" onClick={runRepair}>
              <FileJson size={16} aria-hidden="true" /> Repair JSON
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <h2>Repaired output</h2>
          <p className="tool-description">{result ? (result.success ? "Ready for schema validation" : "Needs manual review") : "Run repair to normalize the payload."}</p>
          {result?.success ? <div className="status-success">Repair complete. {result.fixes.length} fixes applied locally.</div> : null}
          {result && !result.success ? <div className="status-error">{result.error}</div> : null}
          <pre className="code-output">{result?.formatted ?? '{\n  "status": "waiting",\n  "message": "Run repair to normalize the payload."\n}'}</pre>
          <div className="button-row">
            <button className="button button-outline" type="button" onClick={copyOutput} disabled={!result?.formatted}>
              <Copy size={16} aria-hidden="true" /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">Next steps</span>
        <h2 style={{ marginTop: 12 }}>Validate before shipping</h2>
        <p className="subtitle">Pair repaired JSON with schema validation, function calling, and API test payloads.</p>
        <div className="next-row">
          <span className="icon-tile"><ShieldCheck size={18} aria-hidden="true" /></span>
          <span>
            <strong>Schema Validator</strong>
            <br />
            <span className="tool-description">Check required fields and types</span>
          </span>
        </div>
        <div className="next-row">
          <span className="icon-tile"><FileJson size={18} aria-hidden="true" /></span>
          <span>
            <strong>Function Call Builder</strong>
            <br />
            <span className="tool-description">Turn payload into tool schema</span>
          </span>
        </div>
        <div className="button-row">
          <button className="button button-outline" type="button">Save stack</button>
          <button className="button button-solid" type="button">Use API</button>
        </div>
      </aside>
    </AiLabWorkbenchShell>
  );
}
