"use client";

import { Fingerprint, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateHashes, type HashGeneratorResult } from "@/lib/tools/hash-generator";

export function HashGeneratorWorkspace() {
  const t = useTranslations("tools.hash-generator.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<HashGeneratorResult | null>(null);

  const runHashing = async () => {
    setResult(await generateHashes(input));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="hash-generator"
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
        </div>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <Fingerprint size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="hash-generator-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="hash-generator-input"
              onChange={(event) => {
                setInput(event.target.value);
                setResult(null);
              }}
              placeholder={t("inputPlaceholder")}
              rows={7}
              value={input}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!input} onClick={runHashing} type="button">
              {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : "badge"}>{result?.success ? t("badges.ready") : t("badges.waiting")}</span>
          </div>
          <div className="detail-row-list">
            {(["md5", "sha1", "sha256", "sha512"] as const).map((algorithm) => (
              <div className="detail-row" key={algorithm}>
                <span className="badge">{algorithm.toUpperCase()}</span>
                <code>{result?.hashes[algorithm] ?? "-"}</code>
              </div>
            ))}
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
