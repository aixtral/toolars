"use client";

import { ClipboardCheck, ClipboardCopy, Link2, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { calculateSubnet, type SubnetResult } from "@/lib/tools/ipv4-subnet-calculator";

export function Ipv4SubnetCalculatorWorkspace() {
  const t = useTranslations("tools.ipv4-subnet-calculator.workspace");
  const [ip, setIp] = useState("");
  const [prefix, setPrefix] = useState("24");
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState(false);

  const runCalculation = () => {
    setCopied(false);
    const nextResult = calculateSubnet(ip, Number(prefix));
    setResult(nextResult);
    setInvalid(!nextResult);
  };

  const updateIp = (value: string) => {
    setIp(value);
    setResult(null);
    setInvalid(false);
    setCopied(false);
  };

  const updatePrefix = (value: string) => {
    setPrefix(value);
    setResult(null);
    setInvalid(false);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!result || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(
      [
        `network: ${result.networkAddress}`,
        `broadcast: ${result.broadcastAddress}`,
        `mask: ${result.subnetMask}`,
        `usable hosts: ${result.usableHosts}`
      ].join("\n")
    );
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : invalid ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="ipv4-subnet-calculator"
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
            <span className="badge">{t("badges.cidr")}</span>
            <span>{t("cidrCopy")}</span>
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
          <label className="field-label" htmlFor="ipv4-address">
            {t("ipLabel")}
            <input
              className="input"
              id="ipv4-address"
              onChange={(event) => updateIp(event.target.value)}
              placeholder={t("ipPlaceholder")}
              value={ip}
            />
          </label>
          <label className="field-label" htmlFor="ipv4-prefix" style={{ marginTop: 16 }}>
            {t("prefixLabel")}
            <input
              className="input"
              id="ipv4-prefix"
              inputMode="numeric"
              onChange={(event) => updatePrefix(event.target.value)}
              placeholder={t("prefixPlaceholder")}
              value={prefix}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!ip.trim()} onClick={runCalculation} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("calculateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getSubnetSummary(result, t) : invalid ? t("failedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result ? "badge local" : invalid ? "badge ai" : "badge"}>
              {result ? t("badges.calculated") : invalid ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.networkAddress || "-"}</strong>
              <span>{t("networkLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.broadcastAddress || "-"}</strong>
              <span>{t("broadcastLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.usableHosts.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("usableHostsLabel")}</span>
            </article>
          </div>
          {invalid ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t("errors.invalid-subnet")}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("detailsTitle")}</h2>
              <p className="tool-description">{t("detailsDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result} onClick={copyOutput} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <div className="detail-row-list">
            {result ? (
              [
                [t("fields.mask"), result.subnetMask],
                [t("fields.wildcard"), result.wildcardMask],
                [t("fields.firstHost"), result.firstHost],
                [t("fields.lastHost"), result.lastHost],
                [t("fields.total"), result.totalAddresses.toLocaleString("en-US")]
              ].map(([label, value]) => (
                <div className="detail-row" key={label}>
                  <span className="badge">{label}</span>
                  <span>{value}</span>
                </div>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyDetails")}</p>
            )}
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
            {[t("reviewItems.boundaries"), t("reviewItems.usable"), t("reviewItems.binary")].map((item, index) => (
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
          <p className="detail-aside-note">{result ? result.privacyNote : invalid ? t("invalidCopy") : t("waitingValidation")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getSubnetSummary(result: SubnetResult, t: ReturnType<typeof useTranslations>): string {
  return t("calculatedSummary", {
    prefix: result.prefixLength,
    hosts: result.usableHosts
  });
}
