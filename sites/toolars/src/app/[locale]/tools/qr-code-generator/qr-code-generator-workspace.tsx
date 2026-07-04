"use client";

import { QrCode, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateQrCodeSvg, type QrCodeSvgResult, type QrErrorCorrectionLevel } from "@/lib/tools/qr-code-generator";

const levels: QrErrorCorrectionLevel[] = ["L", "M", "Q", "H"];

export function QrCodeGeneratorWorkspace() {
  const t = useTranslations("tools.qr-code-generator.workspace");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState("M" as QrErrorCorrectionLevel);
  const [result, setResult] = useState<QrCodeSvgResult | null>(null);

  const runGenerate = () => {
    setResult(
      generateQrCodeSvg({
        backgroundColor: "#ffffff",
        content,
        errorCorrectionLevel: level,
        foregroundColor: "#111111",
        size: 192
      })
    );
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.status === "ready" ? t("artifact.ready") : result ? t("artifact.blocked") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="qr-code-generator"
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
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <QrCode size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="qr-code-content">
            {t("contentLabel")}
            <textarea
              className="input"
              id="qr-code-content"
              onChange={(event) => {
                setContent(event.target.value);
                setResult(null);
              }}
              placeholder={t("contentPlaceholder")}
              rows={5}
              value={content}
            />
          </label>
          <label className="field-label" htmlFor="qr-code-level" style={{ marginTop: 16 }}>
            {t("levelLabel")}
            <select className="input" id="qr-code-level" onChange={(event) => setLevel(event.target.value as QrErrorCorrectionLevel)} value={level}>
              {levels.map((item) => (
                <option key={item} value={item}>
                  {t(`levels.${item}`)}
                </option>
              ))}
            </select>
          </label>
          <div className="button-row">
            <button className="button button-solid" onClick={runGenerate} type="button">
              {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultTitle")}</h2>
              <p className="tool-description">{result?.status === "ready" ? t("readySummary") : result ? t("blockedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result?.status === "ready" ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.status === "ready" ? t("badges.ready") : result ? t("badges.blocked") : t("badges.waiting")}
            </span>
          </div>
          <pre aria-label={t("outputLabel")} className="textarea prompt-textarea">
            {result?.status === "ready" ? result.output.svg : result?.validationIssues.join("\n") || t("emptyOutput")}
          </pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("trustTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.trustBoundary.note ?? t("trustCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
