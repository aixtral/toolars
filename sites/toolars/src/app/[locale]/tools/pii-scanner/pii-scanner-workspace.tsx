"use client";

import { FileText, Scan, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { scanPii, type PiiScanResult } from "@/lib/tools/pii-scanner";

export function PiiScannerWorkspace() {
  const t = useTranslations("tools.pii-scanner.workspace");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null as PiiScanResult | null);

  const runScan = () => {
    setResult(scanPii(text));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="pii-scanner"
    >
      <section className="workspace-panel prompt-overview-panel">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <FileText size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="pii-source">
            {t("sourceLabel")}
            <textarea className="input" id="pii-source" onChange={(event) => { setText(event.target.value); setResult(null); }} rows={9} value={text} />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!text.trim()} onClick={runScan} type="button">
              <Scan size={16} aria-hidden="true" /> {t("scanButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
            </div>
            <span className={result?.entities.length ? "badge ai" : "badge local"}>{result ? t(`riskLevels.${result.riskLevel}`) : t("badges.waiting")}</span>
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.entities.length ?? 0}</strong>
              <span>{t("entitiesLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.score ?? 0}</strong>
              <span>{t("scoreLabel")}</span>
            </article>
          </div>
          <div className="detail-resource-list" style={{ marginTop: 20 }}>
            {result?.entities.length ? result.entities.map((entity) => (
              <article className="detail-resource-row" key={`${entity.type}-${entity.start}`}>
                <span className="icon-tile amber"><ShieldCheck size={16} aria-hidden="true" /></span>
                <span>
                  <strong>{t(`entityTypes.${entity.type}`)}</strong>
                  <small>{entity.value}</small>
                </span>
                <code>{redactionFor(entity.type)}</code>
              </article>
            )) : <p className="detail-aside-note">{result ? t("noEntities") : t("waitingEntities")}</p>}
          </div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("redactedTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.redacted ?? t("emptyRedacted")}</pre>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function redactionFor(type: string): string {
  const key = type.toUpperCase().replace("CREDIT_CARD", "CREDIT_CARD").replace("IP_ADDRESS", "IP");
  if (type === "date_of_birth") return "[REDACTED_DOB]";
  if (type === "credit_card") return "[REDACTED_CREDIT_CARD]";
  if (type === "ip_address") return "[REDACTED_IP]";
  return `[REDACTED_${key}]`;
}
