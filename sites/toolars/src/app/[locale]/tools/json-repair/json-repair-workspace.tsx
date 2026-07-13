"use client";
import { useLocale, useTranslations } from "next-intl";

import { useMemo, useState } from "react";
import { Copy, FileJson, ShieldCheck } from "lucide-react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { repairJson, type JsonRepairResult } from "@/lib/tools/json-repair";

export function JsonRepairWorkspace() {
  const t = useTranslations("tools.json-repair.workspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null as JsonRepairResult | null);
  const [copied, setCopied] = useState(false);

  const issueSummary = useMemo(() => {
    const next = repairJson(input);
    const types = new Set(next.fixes.map((fix) => fix.type));
    return [
      { key: "unquotedObjectKeys", count: types.has("unquoted_keys") ? 3 : 0 },
      { key: "singleQuotes", count: types.has("single_quotes") ? 2 : 0 },
      { key: "trailingComma", count: types.has("trailing_commas") ? 1 : 0 }
    ];
  }, [input]);

  const runRepair = () => {
    setCopied(false);
    setResult(repairJson(input));
  };

  const copyOutput = async () => {
    if (!result?.formatted) return;
    await navigator.clipboard.writeText(result.formatted);
    setCopied(true);
  };

  const artifactState = result ? (result.success ? t("shell.validatedJson") : t("shell.manualReview")) : t("shell.waiting");
  const outputDescription = result
    ? result.success
      ? t("result.readyDescription")
      : t("result.reviewDescription")
    : t("result.emptyDescription");
  const emptyOutput = `{\n  "status": "${t("result.emptyOutput.status")}",\n  "message": "${t("result.emptyOutput.message")}"\n}`;

  return (
    <AiLabWorkbenchShell
      artifactState={artifactState}
      providerRoute={t("shell.providerRoute")}
      runMode={t("shell.runMode")}
      toolSlug="json-repair"
    >
      <section className="workspace-panel">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
        <h2 style={{ marginTop: 28 }}>{t("issuesTitle")}</h2>
        {issueSummary.map((issue) => (
          <div className="issue-row" key={issue.key}>
            <span className="issue-number">{issue.count}</span>
            <span>{t(`issues.${issue.key}`)}</span>
          </div>
        ))}
        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={localizedHref("/explore/ai-developer")}>
            {t("actions.backToLab")}
          </a>
          <a className="button button-outline" href={localizedHref("/tools/json-repair/about")}>
            {t("actions.details")}
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("input.title")}</h2>
          <p className="tool-description">{t("input.description")}</p>
          <span className="badge local" style={{ marginTop: 12 }}>
            {t("badges.local")}
          </span>
          <label style={{ display: "block", marginTop: 18, marginBottom: 8, fontWeight: 800 }} htmlFor="json-input">
            {t("input.label")}
          </label>
          <textarea id="json-input" className="textarea" value={input} onChange={(event) => setInput(event.target.value)} />
          <div className="button-row">
            <button className="button button-solid" type="button" onClick={runRepair}>
              <FileJson size={16} aria-hidden="true" /> {t("actions.repair")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <h2>{t("result.title")}</h2>
          <p className="tool-description">{outputDescription}</p>
          {result?.success ? <div className="status-success">{t("result.successMessage", { count: result.fixes.length })}</div> : null}
          {result && !result.success ? <div className="status-error">{result.error}</div> : null}
          <pre className="code-output">{result?.formatted ?? emptyOutput}</pre>
          <div className="button-row">
            <button className="button button-outline" type="button" onClick={copyOutput} disabled={!result?.formatted}>
              <Copy size={16} aria-hidden="true" /> {copied ? t("actions.copied") : t("actions.copy")}
            </button>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("next.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("next.title")}</h2>
        <p className="subtitle">{t("next.subtitle")}</p>
        <div className="next-row">
          <span className="icon-tile"><ShieldCheck size={18} aria-hidden="true" /></span>
          <span>
            <strong>{t("next.schemaValidator.title")}</strong>
            <br />
            <span className="tool-description">{t("next.schemaValidator.description")}</span>
          </span>
        </div>
        <div className="next-row">
          <span className="icon-tile"><FileJson size={18} aria-hidden="true" /></span>
          <span>
            <strong>{t("next.functionCallBuilder.title")}</strong>
            <br />
            <span className="tool-description">{t("next.functionCallBuilder.description")}</span>
          </span>
        </div>
      </aside>
    </AiLabWorkbenchShell>
  );
}
