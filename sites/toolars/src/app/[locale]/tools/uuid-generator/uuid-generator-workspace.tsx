"use client";

import { ClipboardCheck, ClipboardList, Copy, Hash, KeyRound, ListChecks, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateUUIDBatch, type UUIDBatchResult } from "@/lib/tools/uuid-generator";

export function UUIDGeneratorWorkspace() {
  const t = useTranslations("tools.uuid-generator.workspace");
  const [count, setCount] = useState(5);
  const [result, setResult] = useState(null as UUIDBatchResult | null);
  const [copiedUuid, setCopiedUuid] = useState(null as string | null);
  const hasOutput = Boolean(result?.output);

  const generateBatch = () => {
    setResult(generateUUIDBatch(count));
    setCopiedUuid(null);
  };

  const updateCount = (value: string) => {
    setCount(Number(value));
    setResult(null);
    setCopiedUuid(null);
  };

  const clearWorkspace = () => {
    setCount(5);
    setResult(null);
    setCopiedUuid(null);
  };

  const copyUuid = (uuid: string) => {
    void navigator.clipboard?.writeText(uuid);
    setCopiedUuid(uuid);
  };

  const copyAll = () => {
    if (!result?.output) return;

    void navigator.clipboard?.writeText(result.output);
    setCopiedUuid("all");
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="uuid-generator"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row">
            <span className="badge local">{t("badges.local")}</span>
            <span>{t("localCopy")}</span>
          </div>
          <div className="detail-row">
            <span className="badge">{t("badges.bulk")}</span>
            <span>{t("bulkCopy")}</span>
          </div>
        </div>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("optionsTitle")}</h2>
              <p className="tool-description">{t("optionsDescription")}</p>
            </div>
            <KeyRound size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="uuid-generator-count">
            {t("countLabel")}
            <input
              className="input"
              id="uuid-generator-count"
              max={1000}
              min={1}
              onChange={(event) => updateCount(event.target.value)}
              type="number"
              value={Number.isFinite(count) ? count : ""}
            />
          </label>

          <div className="button-row">
            <button className="button button-solid" onClick={generateBatch} type="button">
              <Sparkles size={16} aria-hidden="true" /> {t("generateButton")}
            </button>
            <button className="button" disabled={!result} onClick={clearWorkspace} type="button">
              <Trash2 size={16} aria-hidden="true" /> {t("clearButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? result.summary : t("emptyResult")}</p>
            </div>
            <ListChecks size={18} aria-hidden="true" />
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.uuids.length ?? 0}</strong>
              <span>{t("generatedCountLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{t("versionValue")}</strong>
              <span>{t("versionLabel")}</span>
            </article>
          </div>

          <div className="detail-resource-list" style={{ marginTop: 20 }}>
            {result?.uuids.length ? (
              result.uuids.map((uuid, index) => (
                <article className="detail-resource-row" key={uuid}>
                  <span className="icon-tile violet">
                    <Hash size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{t("uuidRow", { index: index + 1 })}</strong>
                    <code>{uuid}</code>
                  </span>
                  <button aria-label={t("copyUuid", { index: index + 1 })} className="button" onClick={() => copyUuid(uuid)} type="button">
                    {copiedUuid === uuid ? <ClipboardCheck size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  </button>
                </article>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyResult")}</p>
            )}
          </div>

          <div className="button-row">
            <button className="button" disabled={!hasOutput} onClick={copyAll} type="button">
              {copiedUuid === "all" ? <ClipboardCheck size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} {t("copyAllButton")}
            </button>
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("formatTitle")}</h2>
              <p className="tool-description">{t("formatDescription")}</p>
            </div>
            <Hash size={18} aria-hidden="true" />
          </div>
          <div className="detail-row-list">
            <div className="detail-row">
              <span className="badge">{t("badges.version")}</span>
              <span>{t("versionValue")}</span>
            </div>
            <div className="detail-row">
              <span className="badge">{t("badges.variant")}</span>
              <span>{t("variantValue")}</span>
            </div>
            <div className="detail-row">
              <span className="badge">{t("badges.range")}</span>
              <span>{t("rangeCopy")}</span>
            </div>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.quantity"), t("reviewItems.copy"), t("reviewItems.fixtures")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className="detail-row-list" style={{ marginTop: 20 }}>
            <div className="detail-row">
              <span className="badge local">{t("badges.local")}</span>
              <span>{t("privacyNote")}</span>
            </div>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("handoffTitle")}</h2>
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
