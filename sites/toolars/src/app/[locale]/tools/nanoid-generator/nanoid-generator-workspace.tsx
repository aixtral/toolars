"use client";

import { Fingerprint, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateNanoIds, nanoidPresets, type NanoidGeneratorResult } from "@/lib/tools/nanoid-generator";

const defaultAlphabet: string = nanoidPresets.urlSafe;

export function NanoidGeneratorWorkspace() {
  const t = useTranslations("tools.nanoid-generator.workspace");
  const [length, setLength] = useState(21);
  const [quantity, setQuantity] = useState(1);
  const [alphabet, setAlphabet] = useState(defaultAlphabet);
  const [result, setResult] = useState<NanoidGeneratorResult | null>(null);

  const generate = () => setResult(generateNanoIds({ length, quantity, alphabet }));

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="nanoid-generator"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("settingsTitle")}</h2>
              <p className="tool-description">{t("settingsDescription")}</p>
            </div>
            <Fingerprint size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="nanoid-length">
            {t("lengthLabel")}
            <input
              className="input"
              id="nanoid-length"
              max={256}
              min={1}
              onChange={(event) => {
                setLength(Number(event.target.value) || 21);
                setResult(null);
              }}
              type="number"
              value={length}
            />
          </label>
          <label className="field-label" htmlFor="nanoid-quantity">
            {t("quantityLabel")}
            <input
              className="input"
              id="nanoid-quantity"
              max={100}
              min={1}
              onChange={(event) => {
                setQuantity(Number(event.target.value) || 1);
                setResult(null);
              }}
              type="number"
              value={quantity}
            />
          </label>
          <label className="field-label" htmlFor="nanoid-alphabet">
            {t("alphabetLabel")}
            <input
              className="input"
              id="nanoid-alphabet"
              onChange={(event) => {
                setAlphabet(event.target.value);
                setResult(null);
              }}
              value={alphabet}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" onClick={generate} type="button">
              {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.success ? t("generatedSummary", { count: result.ids.length }) : result?.error?.message ?? t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : "badge"}>{result?.success ? t("badges.ready") : t("badges.waiting")}</span>
          </div>
          <div className="detail-row-list">
            {result?.ids.map((id, index) => (
              <div className="detail-row" key={`${id}-${index}`}>
                <span className="badge">{index + 1}</span>
                <code data-testid="nanoid-output">{id}</code>
              </div>
            )) ?? <p className="detail-aside-note">{t("emptyIds")}</p>}
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
