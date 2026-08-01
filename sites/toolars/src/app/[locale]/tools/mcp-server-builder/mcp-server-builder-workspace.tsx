"use client";
import { useLocale, useTranslations } from "next-intl";

import { useMemo, useState } from "react";
import { Save, ServerCog } from "lucide-react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  buildMcpManifest,
  buildMcpServerDraft,
  defaultMcpServerDraft,
  stringifyMcpManifest,
  validateMcpServerDraft,
  type McpServerDraft
} from "@/lib/tools/mcp-server-builder";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const builderStages = [
  { number: "1", key: "defineTools", tone: "local" },
  { number: "2", key: "addResources", tone: "" },
  { number: "3", key: "testPayloads", tone: "" }
] as const;

const reviewCheckKeys = [
  "actionName",
  "schema",
  "auth"
] as const;

interface ManifestStats {
  [key: string]: string | number | Date;
  toolCount: number;
  resourceCount: number;
  payloadCount: number;
}

export function McpServerBuilderWorkspace() {
  const t = useTranslations("tools.mcp-server-builder.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [draft, setDraft] = useState(() => buildMcpServerDraft());
  const [manifestText, setManifestText] = useState("");
  const [manifestStats, setManifestStats] = useState(null as ManifestStats | null);
  const status = manifestStats ? t("status.generated", manifestStats) : t("status.waiting");

  const reviewChecks = useMemo(
    () =>
      validateMcpServerDraft(draft).map((check, index) => {
        const checkKey = reviewCheckKeys[index];
        return {
          ...check,
          label: checkKey ? t(`review.checks.${checkKey}.${check.tone}`) : check.label
        };
      }),
    [draft, t]
  );

  const updateDraft = <Key extends keyof McpServerDraft>(key: Key, value: McpServerDraft[Key]) => {
    setDraft((current) => ({
      ...current,
      [key]: value
    }));
  };

  const generateManifest = () => {
    const nextDraft = buildMcpServerDraft(draft);
    setManifestText(stringifyMcpManifest(buildMcpManifest(nextDraft)));
    setManifestStats({
      toolCount: 1,
      resourceCount: nextDraft.includeResourceIndex ? 1 : 0,
      payloadCount: nextDraft.includeTestPayload ? 1 : 0
    });
  };

  const { flashSaved, saved } = useSaveFeedback();
  const saveDraft = () => {
    window.localStorage.setItem("toolars.mcp-server-builder.draft", JSON.stringify(draft));
    flashSaved();
  };

  return (
    <AiLabWorkbenchShell
      artifactState={manifestStats ? t("shell.artifactReady") : t("shell.artifactDrafting")}
      providerRoute={t("shell.providerRoute")}
      runMode={t("shell.runMode")}
      toolSlug="mcp-server-builder"
    >
      <section className="workspace-panel mcp-overview-panel">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("stageTitle")}</h2>
        <div className="mcp-stage-list">
          {builderStages.map((stage) => (
            <article className="mcp-stage-row" key={stage.key}>
              <span className="mcp-stage-number">{stage.number}</span>
              <span>
                <strong>{t(`stages.${stage.key}.title`)}</strong>
                <small>{t(`stages.${stage.key}.description`)}</small>
              </span>
              <span className={`badge ${stage.tone}`}>{t(`stages.${stage.key}.status`)}</span>
            </article>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={localizedHref("/tools/mcp-server-builder/about")}>
            {t("detailsLink")}
          </a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("draftSection.title")}</h2>
              <p className="tool-description">{t("draftSection.description")}</p>
            </div>
            <span className="badge workflow">{t("draftSection.badge")}</span>
          </div>

          <div className="mcp-input-grid">
            <label className="field-label" htmlFor="mcp-server-name">
              {t("fields.serverName")}
              <input
                className="input"
                id="mcp-server-name"
                onChange={(event) => updateDraft("serverName", event.target.value)}
                value={draft.serverName}
              />
            </label>
            <label className="field-label" htmlFor="mcp-primary-tool">
              {t("fields.primaryTool")}
              <input
                className="input"
                id="mcp-primary-tool"
                onChange={(event) => updateDraft("primaryTool", event.target.value)}
                value={draft.primaryTool}
              />
            </label>
            <label className="field-label mcp-wide-field" htmlFor="mcp-tool-description">
              {t("fields.toolDescription")}
              <textarea
                className="textarea mcp-description"
                id="mcp-tool-description"
                onChange={(event) => updateDraft("toolDescription", event.target.value)}
                value={draft.toolDescription}
              />
            </label>
          </div>

          <div className="mcp-check-row">
            <label>
              <input
                checked={draft.includeJsonSchema}
                onChange={(event) => updateDraft("includeJsonSchema", event.target.checked)}
                type="checkbox"
              />
              {t("toggles.jsonSchema")}
            </label>
            <label>
              <input
                checked={draft.includeResourceIndex}
                onChange={(event) => updateDraft("includeResourceIndex", event.target.checked)}
                type="checkbox"
              />
              {t("toggles.resourceIndex")}
            </label>
            <label>
              <input
                checked={draft.includeOAuthNotes}
                onChange={(event) => updateDraft("includeOAuthNotes", event.target.checked)}
                type="checkbox"
              />
              {t("toggles.oauthNotes")}
            </label>
            <label>
              <input
                checked={draft.includeTestPayload}
                onChange={(event) => updateDraft("includeTestPayload", event.target.checked)}
                type="checkbox"
              />
              {t("toggles.testPayload")}
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveDraft}>
              <Save size={16} aria-hidden="true" /> {t("actions.saveDraft")}
            </button>
            {saved ? <span className="save-feedback" role="status">{tCommon("saved")}</span> : null}
            <button className="button button-solid" type="button" onClick={generateManifest}>
              <ServerCog size={16} aria-hidden="true" /> {t("actions.generateManifest")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("preview.title")}</h2>
              <p className="tool-description">{status}</p>
            </div>
          </div>
          {manifestText ? <pre className="code-output mcp-code-output">{manifestText}</pre> : null}
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="mcp-review-list">
          {reviewChecks.map((check) => (
            <div className="profile-row" key={check.label}>
              <span className={`badge ${check.tone === "ok" ? "local" : "warn"}`}>
                {check.tone === "ok" ? t("review.badges.ok") : t("review.badges.warn")}
              </span>
              <span>{check.label}</span>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>{t("recommendation.title")}</strong>
          <p>{t("recommendation.body")}</p>
        </div>
      </aside>
    </AiLabWorkbenchShell>
  );
}

export const mcpServerBuilderDefaults = defaultMcpServerDraft;
