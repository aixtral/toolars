"use client";

import { useState } from "react";
import { Activity, CheckCircle2, Clipboard, Code2, KeyRound, LockKeyhole, Plus, ShieldCheck, Trash2 } from "lucide-react";

type ApiKey = {
  label: string;
  token: string;
  environment: string;
  scopes: string[];
  lastUsed: string;
  status: "Active" | "Revoked";
};

const initialKeys: ApiKey[] = [
  {
    label: "Production key",
    token: "tk_live_••••••••••••9f3a",
    environment: "Production",
    scopes: ["tools:read", "workflows:run", "collections:write"],
    lastUsed: "2 hours ago",
    status: "Active"
  },
  {
    label: "Development key",
    token: "tk_test_••••••••••••4a21",
    environment: "Sandbox",
    scopes: ["tools:read", "workflows:run"],
    lastUsed: "Yesterday",
    status: "Active"
  }
];

const scopeRows = [
  ["tools:read", "Read public tool metadata and saved workspace tools."],
  ["workflows:run", "Run approved local-first and AI workflow templates."],
  ["collections:write", "Create and update shared tool collections."],
  ["billing:read", "Read usage totals without changing payment settings."]
] as const;

const activityRows = [
  ["2 hours ago", "Production key ran PDF Summary Workflow"],
  ["Yesterday", "Development key listed AI Developer Lab tools"],
  ["Jun 12, 2026", "Webhook signing secret rotated"]
] as const;

export function ApiKeysSettingsView() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [feedback, setFeedback] = useState("API keys are masked by default. Copy the key after creation and store it securely.");

  function createKey() {
    setKeys((current) => {
      if (current.some((key) => key.label === "New local key")) {
        return current;
      }
      return [
        ...current,
        {
          label: "New local key",
          token: "tk_live_new_••••7f4",
          environment: "Production",
          scopes: ["tools:read", "workflows:run"],
          lastUsed: "Just now",
          status: "Active"
        }
      ];
    });
    setFeedback("New local key created.");
  }

  function revokeKey(label: string) {
    setKeys((current) => current.map((key) => (key.label === label ? { ...key, status: "Revoked" } : key)));
    setFeedback(`${label} revoked.`);
  }

  return (
    <div className="settings-subpage api-keys-settings-page" data-api-keys-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">Settings</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">API keys</h1>
            <p className="subtitle">Create scoped keys for Toolars automations, inspect usage, and revoke access without leaving account settings.</p>
          </span>
          <button className="button button-solid" onClick={createKey} type="button">
            <Plus size={15} aria-hidden="true" /> Create key
          </button>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>Key inventory</h2>
                <p className="tool-description">Keys stay masked after creation. Use scoped permissions and revoke unused credentials quickly.</p>
              </span>
              <span className="badge local">2 active</span>
            </div>
            <div className="api-key-list">
              {keys.map((key) => (
                <article className={`api-key-row ${key.status === "Revoked" ? "is-revoked" : ""}`} key={key.label}>
                  <span className="icon-tile green">
                    <KeyRound size={18} aria-hidden="true" />
                  </span>
                  <div className="api-key-content">
                    <div className="api-key-head">
                      <strong>{key.label}</strong>
                      <span className={key.status === "Active" ? "badge local" : "badge warn"}>{key.status}</span>
                    </div>
                    <code>{key.token}</code>
                    <div className="api-key-meta">
                      <span>{key.environment}</span>
                      <span>Last used {key.lastUsed}</span>
                      <span>{key.scopes.join(", ")}</span>
                    </div>
                  </div>
                  <div className="api-key-actions">
                    <button className="button button-outline-neutral" type="button">
                      <Clipboard size={15} aria-hidden="true" /> Copy
                    </button>
                    {key.status === "Active" ? (
                      <button className="button button-outline-neutral" onClick={() => revokeKey(key.label)} type="button">
                        <Trash2 size={15} aria-hidden="true" /> Revoke {key.label}
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
            <h2>Create API key</h2>
            <div className="api-create-grid">
              <label>
                Key name
                <input defaultValue="Production automation" />
              </label>
              <label>
                Environment
                <select defaultValue="Production">
                  <option>Production</option>
                  <option>Sandbox</option>
                </select>
              </label>
              <label>
                Expiration
                <select defaultValue="90 days">
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>1 year</option>
                </select>
              </label>
            </div>
            <button className="button button-outline-neutral" onClick={createKey} type="button">
              Create scoped key
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Scopes</h2>
            <div className="scope-grid">
              {scopeRows.map(([scope, description]) => (
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
            <h2>Webhook signing secret</h2>
            <div className="settings-api-row">
              <LockKeyhole size={22} aria-hidden="true" />
              <span>
                <strong>whsec_••••••••98f</strong>
                <small>Rotated Jun 12, 2026</small>
              </span>
            </div>
            <button className="button button-outline-neutral" type="button">
              Rotate secret
            </button>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Key activity</h2>
            <div className="key-activity-list">
              {activityRows.map(([time, detail]) => (
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
            <h2>Security checklist</h2>
            <div className="settings-row-list compact">
              {["Use one key per environment", "Rotate production keys every 90 days", "Never expose keys in client bundles", "Revoke keys that have not run this month"].map((item) => (
                <div className="settings-detail-row compact-row" key={item}>
                  <ShieldCheck size={15} aria-hidden="true" />
                  <span>{item}</span>
                  <span className="badge local">On</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
