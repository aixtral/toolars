"use client";

import { KeyRound, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { decodeJwt, type JwtDecoded } from "@/lib/tools/jwt-decoder";

export function JwtDecoderWorkspace() {
  const t = useTranslations("tools.jwt-decoder.workspace");
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null as JwtDecoded | null);

  function decodeToken() {
    setResult(decodeJwt(token));
  }

  return (
    <AiLabWorkbenchShell
      artifactState={result?.valid ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="jwt-decoder"
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
            <span className="badge ai">{t("badges.decodeOnly")}</span>
            <span>{t("decodeOnlyCopy")}</span>
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
            <KeyRound size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="jwt-decoder-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="jwt-decoder-input"
              onChange={(event) => {
                setToken(event.target.value);
                setResult(null);
              }}
              placeholder={t("inputPlaceholder")}
              rows={6}
              value={token}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!token.trim()} onClick={decodeToken} type="button">
              {t("decodeButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
            </div>
            <span className={result?.valid ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.valid ? t("badges.decoded") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.metadata.algorithm || "-"}</strong>
              <span>{t("algorithmLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.verified === false ? t("decodeOnlyLabel") : "-"}</strong>
              <span>{t("verificationLabel")}</span>
            </article>
          </div>

          <pre className="input" style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
            {result?.valid ? JSON.stringify(result.payload, null, 2) : result?.error?.message ?? t("emptyPayload")}
          </pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldAlert size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
