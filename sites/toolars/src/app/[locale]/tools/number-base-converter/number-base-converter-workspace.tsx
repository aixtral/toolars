"use client";

import { ClipboardCheck, ClipboardCopy, Link2, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertNumberBase, type NumberBase, type NumberBaseResult } from "@/lib/tools/number-base-converter";

const bases: NumberBase[] = [2, 8, 10, 16];
const defaultFromBase: NumberBase = 10;

export function NumberBaseConverterWorkspace() {
  const t = useTranslations("tools.number-base-converter.workspace");
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(defaultFromBase);
  const [result, setResult] = useState<NumberBaseResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runConversion = () => {
    setCopied(false);
    setResult(convertNumberBase({ value: input, fromBase }));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const updateBase = (value: string) => {
    setFromBase(Number(value) as NumberBase);
    setResult(null);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!result?.success || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(Object.entries(result.outputs).map(([base, value]) => `${base}: ${value}`).join("\n"));
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="number-base-converter"
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
            <span className="badge">{t("badges.bases")}</span>
            <span>{t("baseCopy")}</span>
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
          <label className="field-label" htmlFor="number-base-input">
            {t("inputLabel")}
            <input
              className="input"
              id="number-base-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              value={input}
            />
          </label>
          <label className="field-label" htmlFor="number-base-source" style={{ marginTop: 16 }}>
            {t("baseLabel")}
            <select className="input" id="number-base-source" onChange={(event) => updateBase(event.target.value)} value={fromBase}>
              {bases.map((base) => (
                <option key={base} value={base}>
                  {t(`bases.${base}`)}
                </option>
              ))}
            </select>
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!input.trim()} onClick={runConversion} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("convertButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getNumberSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.converted") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>
          <div className="llm-metric-grid">
            {[
              ["binary", result?.outputs.binary],
              ["octal", result?.outputs.octal],
              ["decimal", result?.outputs.decimal],
              ["hexadecimal", result?.outputs.hexadecimal]
            ].map(([key, value]) => (
              <article className="llm-metric" key={key}>
                <strong>{value || "-"}</strong>
                <span>{t(`outputLabels.${key}`)}</span>
              </article>
            ))}
          </div>
          {result && !result.success ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t(`errors.${result.error?.type ?? "invalid-number"}`)}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("unicodeTitle")}</h2>
              <p className="tool-description">{t("unicodeDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result?.success} onClick={copyOutput} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <div className="detail-row-list">
            <div className="detail-row">
              <span className="badge">{t("unicodeBadge")}</span>
              <span>{result?.unicodeCharacter ?? t("unicodeEmpty")}</span>
            </div>
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
            {[t("reviewItems.base"), t("reviewItems.precision"), t("reviewItems.unicode")].map((item, index) => (
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

function getNumberSummary(result: NumberBaseResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return t("convertedSummary", {
    value: result.normalizedValue,
    base: result.fromBase
  });
}
