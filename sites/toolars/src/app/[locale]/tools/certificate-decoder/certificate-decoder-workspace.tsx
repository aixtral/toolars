"use client";

import { FileKey, KeyRound, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  decodeCertificatePem,
  type CertificateDecodeResult
} from "@/lib/tools/certificate-decoder";

export function CertificateDecoderWorkspace() {
  const t = useTranslations("tools.certificate-decoder.workspace");
  const [pem, setPem] = useState("");
  const [result, setResult] = useState<CertificateDecodeResult | null>(null);

  const decode = async () => {
    setResult(await decodeCertificatePem(pem));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="certificate-decoder"
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
            <FileKey size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="certificate-pem">
            {t("pemLabel")}
            <textarea
              className="input"
              id="certificate-pem"
              onChange={(event) => {
                setPem(event.target.value);
                setResult(null);
              }}
              rows={10}
              value={pem}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!pem.trim()} onClick={decode} type="button">
              <KeyRound size={16} aria-hidden="true" /> {t("decodeButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.success ? result.summary : result?.error ?? t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>{result?.success ? t("badges.decoded") : result ? t("badges.error") : t("badges.waiting")}</span>
          </div>
          {result?.success ? (
            <>
              <div className="llm-metric-grid">
                <article className="llm-metric">
                  <strong>{result.subject.CN ?? "-"}</strong>
                  <span>{t("subjectLabel")}</span>
                </article>
                <article className="llm-metric">
                  <strong>{t(`status.${result.validity.status}`)}</strong>
                  <span>{t("statusLabel")}</span>
                </article>
                <article className="llm-metric">
                  <strong>{result.publicKey.type}</strong>
                  <span>{t("keyTypeLabel")}</span>
                </article>
              </div>
              <div className="detail-row-list" style={{ marginTop: 20 }}>
                <div className="detail-row">
                  <span className="badge">{t("issuerLabel")}</span>
                  <span>{result.issuer.CN ?? "-"}</span>
                </div>
                <div className="detail-row">
                  <span className="badge">{t("serialLabel")}</span>
                  <span>{result.serialNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="badge local">{t("badges.local")}</span>
                  <span>{result.privacyNote}</span>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("validityTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          {result?.success ? (
            <div className="detail-row-list">
              <div className="detail-row">
                <span className="badge">{t("notBeforeLabel")}</span>
                <span>{result.validity.notBefore}</span>
              </div>
              <div className="detail-row">
                <span className="badge">{t("notAfterLabel")}</span>
                <span>{result.validity.notAfter}</span>
              </div>
              <div className="detail-row">
                <span className="badge">{t("fingerprintLabel")}</span>
                <span>{result.fingerprints.sha256}</span>
              </div>
            </div>
          ) : (
            <p className="detail-aside-note">{t("waitingValidity")}</p>
          )}
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
