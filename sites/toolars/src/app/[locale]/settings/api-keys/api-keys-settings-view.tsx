"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Activity, CheckCircle2, Clipboard, Code2, KeyRound, LockKeyhole, Plus, ShieldCheck, Trash2 } from "lucide-react";

type ApiKey = {
  id: string;
  label: string;
  token: string;
  environment: string;
  scopes: string[];
  lastUsed: string;
  status: "active" | "revoked";
};

type ScopeRow = {
  scope: string;
  description: string;
};

type ActivityRow = {
  time: string;
  detail: string;
};

type SelectOption = {
  value: string;
  label: string;
};

export function ApiKeysSettingsView() {
  const t = useTranslations("settings.api-keys");
  const [keys, setKeys] = useState<ApiKey[]>(() => t.raw("inventory.keys") as ApiKey[]);
  const [feedback, setFeedback] = useState(() => t("feedback.initial"));
  const newKey = t.raw("inventory.newKey") as ApiKey;
  const scopeRows = t.raw("scopes.rows") as ScopeRow[];
  const activityRows = t.raw("activity.rows") as ActivityRow[];
  const checklistItems = t.raw("securityChecklist.items") as string[];
  const environmentOptions = t.raw("createForm.environments") as SelectOption[];
  const expirationOptions = t.raw("createForm.expirations") as SelectOption[];
  const activeKeyCount = keys.filter((key) => key.status === "active").length;

  function createKey() {
    setKeys((current) => {
      if (current.some((key) => key.id === newKey.id)) {
        return current;
      }
      return [...current, newKey];
    });
    setFeedback(t("feedback.created"));
  }

  function revokeKey(id: string, label: string) {
    setKeys((current) => current.map((key) => (key.id === id ? { ...key, status: "revoked" } : key)));
    setFeedback(t("feedback.revoked", { label }));
  }

  return (
    <div className="settings-subpage api-keys-settings-page" data-api-keys-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">{t("sections.eyebrow")}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">{t("hero.subtitle")}</p>
          </span>
          <button className="button button-solid" onClick={createKey} type="button">
            <Plus size={15} aria-hidden="true" /> {t("actions.create")}
          </button>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.inventory")}</h2>
                <p className="tool-description">{t("inventory.description")}</p>
              </span>
              <span className="badge local">{t("inventory.activeCount", { count: activeKeyCount })}</span>
            </div>
            <div className="api-key-list">
              {keys.map((key) => (
                <article className={`api-key-row ${key.status === "revoked" ? "is-revoked" : ""}`} key={key.id}>
                  <span className="icon-tile green">
                    <KeyRound size={18} aria-hidden="true" />
                  </span>
                  <div className="api-key-content">
                    <div className="api-key-head">
                      <strong>{key.label}</strong>
                      <span className={key.status === "active" ? "badge local" : "badge warn"}>{t(`statuses.${key.status}`)}</span>
                    </div>
                    <code>{key.token}</code>
                    <div className="api-key-meta">
                      <span>{key.environment}</span>
                      <span>{t("inventory.lastUsed", { value: key.lastUsed })}</span>
                      <span>{key.scopes.join(", ")}</span>
                    </div>
                  </div>
                  <div className="api-key-actions">
                    <button className="button button-outline-neutral" type="button">
                      <Clipboard size={15} aria-hidden="true" /> {t("actions.copy")}
                    </button>
                    {key.status === "active" ? (
                      <button className="button button-outline-neutral" onClick={() => revokeKey(key.id, key.label)} type="button">
                        <Trash2 size={15} aria-hidden="true" /> {t("actions.revoke", { label: key.label })}
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {feedback}
            </p>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.createKey")}</h2>
            <div className="api-create-grid">
              <label>
                {t("createForm.keyNameLabel")}
                <input defaultValue={t("createForm.keyNameDefault")} />
              </label>
              <label>
                {t("createForm.environmentLabel")}
                <select defaultValue={environmentOptions[0]?.value}>
                  {environmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("createForm.expirationLabel")}
                <select defaultValue={expirationOptions[1]?.value ?? expirationOptions[0]?.value}>
                  {expirationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="button button-outline-neutral" onClick={createKey} type="button">
              {t("actions.createScoped")}
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.scopes")}</h2>
            <div className="scope-grid">
              {scopeRows.map(({ scope, description }) => (
                <article key={scope}>
                  <Code2 size={16} aria-hidden="true" />
                  <strong>{scope}</strong>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.webhook")}</h2>
            <div className="settings-api-row">
              <LockKeyhole size={22} aria-hidden="true" />
              <span>
                <strong>{t("webhook.secret")}</strong>
                <small>{t("webhook.rotated")}</small>
              </span>
            </div>
            <button className="button button-outline-neutral" type="button">
              {t("actions.rotateSecret")}
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.activity")}</h2>
            <div className="key-activity-list">
              {activityRows.map(({ time, detail }) => (
                <article key={`${time}-${detail}`}>
                  <Activity size={15} aria-hidden="true" />
                  <span>
                    <strong>{time}</strong>
                    <small>{detail}</small>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.secChecklist")}</h2>
            <div className="settings-row-list compact">
              {checklistItems.map((item) => (
                <div className="settings-detail-row compact-row" key={item}>
                  <ShieldCheck size={15} aria-hidden="true" />
                  <span>{item}</span>
                  <span className="badge local">{t("securityChecklist.badge")}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
