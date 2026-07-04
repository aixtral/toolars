"use client";

import { ClipboardCopy, Palette, ShieldCheck, SwatchBook } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertColor, type ColorConversionResult } from "@/lib/tools/color-converter";

const outputKeys = ["hex", "rgb", "hsl", "hsv", "cmyk"] as const;

export function ColorConverterWorkspace() {
  const t = useTranslations("tools.color-converter.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState((): ColorConversionResult | null => null);

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
  };

  const runConversion = () => {
    setResult(convertColor(input));
  };

  const convertedValues = result?.success ? {
    hex: result.css.hex,
    rgb: result.css.rgb,
    hsl: result.css.hsl,
    hsv: result.css.hsv,
    cmyk: result.css.cmyk
  } : null;
  let resultDetails: ReactNode;

  if (result?.success) {
    resultDetails = (
      <>
        <div
          aria-label={t("swatchLabel")}
          style={{
            background: result.hex,
            border: "1px solid var(--border)",
            borderRadius: 8,
            minHeight: 88
          }}
        />
        <div className="detail-row-list" style={{ marginTop: 20 }}>
          {outputKeys.map((key) => (
            <div className="detail-row" key={key}>
              <span className="badge">{t(`formats.${key}`)}</span>
              <span>{convertedValues?.[key]}</span>
            </div>
          ))}
        </div>
      </>
    );
  } else if (result) {
    resultDetails = (
      <div className="detail-row-list">
        <div className="detail-row">
          <span className="badge ai">{t("badges.error")}</span>
          <span>{t(`errors.${result.error?.type ?? "invalid-color"}`)}</span>
        </div>
      </div>
    );
  } else {
    resultDetails = <p className="detail-aside-note">{t("emptyOutput")}</p>;
  }

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="color-converter"
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
            <span>{t("formatCopy")}</span>
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
            <Palette size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="color-converter-input">
            {t("inputLabel")}
            <input
              className="input"
              id="color-converter-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              value={input}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!input.trim()} onClick={runConversion} type="button">
              <SwatchBook size={16} aria-hidden="true" /> {t("convertButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.success ? t("resultSummary", { format: result.inputFormat?.toUpperCase() ?? "AUTO" }) : result ? t("errorSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.converted") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>

          {resultDetails}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.invalid"), t("reviewItems.tokens"), t("reviewItems.contrast")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("handoffTitle")}</h2>
            <ClipboardCopy size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
