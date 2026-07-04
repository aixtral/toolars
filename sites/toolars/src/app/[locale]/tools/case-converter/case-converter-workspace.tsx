"use client";

import { Clipboard, ClipboardCheck, ClipboardList, ScanText, ShieldCheck, Sparkles, Type } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  caseConverterFormats,
  convertCaseText,
  type CaseConverterResult,
  type CaseConverterVariant
} from "@/lib/tools/case-converter";

export function CaseConverterWorkspace() {
  const t = useTranslations("tools.case-converter.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null as CaseConverterResult | null);
  const [copiedKey, setCopiedKey] = useState(null as string | null);
  const hasInput = input.trim().length > 0;
  const variants =
    result?.variants ??
    caseConverterFormats.map((format) => ({
      key: format.key,
      label: format.label,
      value: ""
    }));

  const runConversion = () => {
    setResult(convertCaseText(input));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopiedKey(null);
  };

  const copyVariant = (variant: CaseConverterVariant) => {
    if (!variant.value) {
      return;
    }

    void navigator.clipboard?.writeText(variant.value);
    setCopiedKey(variant.key);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="case-converter"
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
            <span className="badge">{t("badges.formats")}</span>
            <span>{t("formatsCopy")}</span>
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
            <Type size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="case-converter-input">
            {t("sourceLabel")}
            <textarea
              className="input"
              id="case-converter-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("sourcePlaceholder")}
              rows={8}
              value={input}
            />
          </label>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasInput} onClick={runConversion} type="button">
              <Sparkles size={16} aria-hidden="true" /> {t("convertButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? result.summary : t("emptyResult")}</p>
            </div>
            <ScanText size={18} aria-hidden="true" />
          </div>

          <div className="detail-resource-list">
            {variants.map((variant) => (
              <article className="detail-resource-row" key={variant.key}>
                <span className="icon-tile blue">
                  <Type size={16} aria-hidden="true" />
                </span>
                <span>
                  <strong>{variant.label}</strong>
                  <code>{variant.value || t("emptyVariant")}</code>
                </span>
                <button
                  aria-label={t("copyVariant", { label: variant.label })}
                  className="button"
                  disabled={!variant.value}
                  onClick={() => copyVariant(variant)}
                  type="button"
                >
                  {copiedKey === variant.key ? (
                    <ClipboardCheck size={16} aria-hidden="true" />
                  ) : (
                    <Clipboard size={16} aria-hidden="true" />
                  )}
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("wordsTitle")}</h2>
              <p className="tool-description">
                {result ? t("detectedWords", { count: result.words.length }) : t("waitingWords")}
              </p>
            </div>
            <ScanText size={18} aria-hidden="true" />
          </div>
          <div className="detail-row-list">
            {result?.words.length ? (
              result.words.map((word, index) => (
                <div className="detail-row" key={`${word}-${index}`}>
                  <span className="badge">{t("wordBadge")}</span>
                  <span>{word}</span>
                </div>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyWords")}</p>
            )}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.acronyms"), t("reviewItems.delimiters"), t("reviewItems.copy")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          {result ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge local">{t("badges.local")}</span>
                <span>{result.privacyNote}</span>
              </div>
            </div>
          ) : null}
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
