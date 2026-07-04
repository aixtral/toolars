"use client";

import { ClipboardCheck, ClipboardCopy, Link2, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  getFileSizeUnitSet,
  summarizeFileSizeConversion,
  type FileSizeConversionResult,
  type FileSizeMode,
  type FileSizeUnit
} from "@/lib/tools/file-size-converter";

export function FileSizeConverterWorkspace() {
  const t = useTranslations("tools.file-size-converter.workspace");
  const [value, setValue] = useState("");
  const [mode, setMode] = useState("decimal" as FileSizeMode);
  const [fromUnit, setFromUnit] = useState("B" as FileSizeUnit);
  const [result, setResult] = useState(null as FileSizeConversionResult | null);
  const [copied, setCopied] = useState(false);
  const units = getFileSizeUnitSet(mode);

  const runConversion = () => {
    setCopied(false);
    setResult(summarizeFileSizeConversion({ value: Number(value), fromUnit, mode }));
  };

  const updateValue = (nextValue: string) => {
    setValue(nextValue);
    setResult(null);
    setCopied(false);
  };

  const updateMode = (nextMode: string) => {
    const normalized = nextMode as FileSizeMode;
    setMode(normalized);
    setFromUnit("B");
    setResult(null);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!result?.success || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(result.rows.map((row) => `${row.unit}: ${row.formatted}`).join("\n"));
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="file-size-converter"
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
            <span className="badge">{t("badges.units")}</span>
            <span>{t("unitCopy")}</span>
          </div>
        </div>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <Link2 size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="file-size-value">
            {t("valueLabel")}
            <input
              className="input"
              id="file-size-value"
              inputMode="decimal"
              onChange={(event) => updateValue(event.target.value)}
              placeholder={t("valuePlaceholder")}
              value={value}
            />
          </label>
          <label className="field-label" htmlFor="file-size-mode" style={{ marginTop: 16 }}>
            {t("modeLabel")}
            <select className="input" id="file-size-mode" onChange={(event) => updateMode(event.target.value)} value={mode}>
              <option value="decimal">{t("modes.decimal")}</option>
              <option value="binary">{t("modes.binary")}</option>
            </select>
          </label>
          <label className="field-label" htmlFor="file-size-unit" style={{ marginTop: 16 }}>
            {t("unitLabel")}
            <select className="input" id="file-size-unit" onChange={(event) => setFromUnit(event.target.value as FileSizeUnit)} value={fromUnit}>
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!value.trim()} onClick={runConversion} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("convertButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getFileSizeSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.converted") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>
          <div className="llm-metric-grid">
            {result?.rows.slice(0, 3).map((row) => (
              <article className="llm-metric" key={row.unit}>
                <strong>{row.formatted}</strong>
                <span>{row.unit}</span>
              </article>
            )) ?? (
              <article className="llm-metric">
                <strong>0</strong>
                <span>{t("bytesLabel")}</span>
              </article>
            )}
          </div>
          {result && !result.success ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t("errors.invalid-size")}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("tableTitle")}</h2>
              <p className="tool-description">{t("tableDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result?.success} onClick={copyOutput} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <div className="detail-row-list">
            {result?.rows.map((row) => (
              <div className="detail-row" key={row.unit}>
                <span className="badge">{row.unit}</span>
                <span>{row.formatted}</span>
              </div>
            )) ?? <p className="detail-aside-note">{t("emptyTable")}</p>}
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("reviewTitle")}</h2>
              <p className="tool-description">{t("reviewDescription")}</p>
            </div>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.mode"), t("reviewItems.rounding"), t("reviewItems.copy")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("validationTitle")}</h2>
            <TriangleAlert size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : result ? t("invalidCopy") : t("waitingValidation")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getFileSizeSummary(result: FileSizeConversionResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return t("convertedSummary", {
    value: result.input.value,
    unit: result.input.fromUnit,
    mode: result.input.mode
  });
}
