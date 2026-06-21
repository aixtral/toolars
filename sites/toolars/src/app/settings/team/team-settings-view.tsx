"use client";

import { useState } from "react";
import { CheckCircle2, Crown, Folder, ShieldCheck, UserPlus, Users } from "lucide-react";

const members = [
  ["Alex Chen", "Owner", "alex.chen@acme.com"],
  ["Mina Li", "Admin", "mina@acme.com"],
  ["Ravi Singh", "Member", "ravi@acme.com"]
] as const;

const roles = [
  ["Owner", "Billing, deletion, API keys, and transfer controls"],
  ["Admin", "Invite teammates, manage collections, and approve workflows"],
  ["Member", "Run tools, save outputs, and edit shared collections"]
] as const;

const sharedCollections = [
  ["PDF Ops Kit", "6 tools"],
  ["AI Developer Lab", "3 tools"],
  ["Finance calculators", "8 tools"]
] as const;

export function TeamSettingsView() {
  const [email, setEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState(["ops@example.com"]);
  const [status, setStatus] = useState("Invite teammates with role-scoped access to shared Toolars workflows.");

  function sendInvite() {
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("Enter an email before sending an invite.");
      return;
    }
    setPendingInvites((current) => (current.includes(trimmed) ? current : [...current, trimmed]));
    setStatus(`Invite queued for ${trimmed}.`);
    setEmail("");
  }

  return (
    <div className="settings-subpage team-settings-page" data-team-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">Settings</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">Team workspace</h1>
            <p className="subtitle">Manage members, roles, seats, shared collections, pending invites, and ownership controls.</p>
          </span>
          <span className="settings-trust-note">
            <Users size={15} aria-hidden="true" /> 3 of 8 seats used
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>Members</h2>
                <p className="tool-description">Active workspace members and their current access level.</p>
              </span>
              <span className="badge local">Seat usage</span>
            </div>
            <div className="team-member-list">
              {members.map(([name, role, contact]) => (
                <article className="team-member-row" key={contact}>
                  <span className="settings-avatar-row single">
                    <span>{name.split(" ").map((part) => part[0]).join("")}</span>
                  </span>
                  <span>
                    <strong>{name}</strong>
                    <small>{contact}</small>
                  </span>
                  <span className="badge local">{role}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Invite members</h2>
            <div className="team-invite-form">
              <label htmlFor="team-invite-email">
                Invite email
                <input id="team-invite-email" onChange={(event) => setEmail(event.target.value)} placeholder="teammate@example.com" value={email} />
              </label>
              <button className="button button-solid" onClick={sendInvite} type="button">
                <UserPlus size={15} aria-hidden="true" /> Send invite
              </button>
            </div>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {status}
            </p>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Roles and permissions</h2>
            <div className="scope-grid">
              {roles.map(([role, description]) => (
                <article key={role}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  <strong>{role}</strong>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>Pending invites</h2>
            <div className="settings-row-list compact">
              {pendingInvites.map((invite) => (
                <div className="settings-detail-row compact-row" key={invite}>
                  <UserPlus size={15} aria-hidden="true" />
                  <span>{invite}</span>
                  <span className="badge">Pending</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Shared collections</h2>
            <div className="settings-row-list compact">
              {sharedCollections.map(([name, detail]) => (
                <div className="settings-detail-row compact-row" key={name}>
                  <Folder size={15} aria-hidden="true" />
                  <span>{name}</span>
                  <span className="badge local">{detail}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Activity log</h2>
            <div className="key-activity-list">
              <article>
                <Users size={15} aria-hidden="true" />
                <span>
                  <strong>Today</strong>
                  <small>Mina updated PDF Ops Kit sharing.</small>
                </span>
              </article>
              <article>
                <UserPlus size={15} aria-hidden="true" />
                <span>
                  <strong>Yesterday</strong>
                  <small>Ravi joined the workspace.</small>
                </span>
              </article>
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>Ownership</h2>
            <p className="tool-description">Only the current owner can transfer billing, deletion, and API key authority.</p>
            <button className="button button-outline-neutral" type="button">
              <Crown size={15} aria-hidden="true" /> Transfer ownership
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
