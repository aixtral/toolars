"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CheckCircle2, Crown, Folder, ShieldCheck, UserPlus, Users } from "lucide-react";

const members = [
  { id: "alexChen", roleId: "owner" },
  { id: "minaLi", roleId: "admin" },
  { id: "raviSingh", roleId: "member" }
] as const;

type MemberId = (typeof members)[number]["id"];

const roles = ["owner", "admin", "member"] as const;
const sharedCollections = ["pdfOpsKit", "aiDeveloperLab", "financeCalculators"] as const;
const activityRows = ["sharingUpdated", "memberJoined"] as const;

type InviteStatus =
  | { kind: "emptyEmail" }
  | { kind: "initial" }
  | { email: string; kind: "queued" };

const initialInviteStatus: InviteStatus = { kind: "initial" };

export function TeamSettingsView() {
  const t = useTranslations("settings.team");
  const [email, setEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState(() => [t("pendingInvites.initialEmail")]);
  const [status, setStatus] = useState(initialInviteStatus);

  function sendInvite() {
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ kind: "emptyEmail" });
      return;
    }
    setPendingInvites((current) => (current.includes(trimmed) ? current : [...current, trimmed]));
    setStatus({ email: trimmed, kind: "queued" });
    setEmail("");
  }

  function statusMessage() {
    switch (status.kind) {
      case "initial":
        return t("status.initial");
      case "emptyEmail":
        return t("status.emptyEmail");
      case "queued":
        return t("status.queued", { email: status.email });
    }
  }

  function memberInitials(memberId: MemberId) {
    return t(`members.${memberId}.name`)
      .split(" ")
      .map((part) => part[0])
      .join("");
  }

  return (
    <div className="settings-subpage team-settings-page" data-team-settings-page="true">
      <section className="section landing-hero settings-subpage-hero">
        <span className="eyebrow">{t("sections.eyebrow")}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">{t("hero.subtitle")}</p>
          </span>
          <span className="settings-trust-note">
            <Users size={15} aria-hidden="true" /> {t("hero.trustNote")}
          </span>
        </div>
      </section>

      <div className="settings-subpage-layout">
        <div className="settings-subpage-main">
          <section className="panel settings-subpage-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.members")}</h2>
                <p className="tool-description">{t("membersCard.description")}</p>
              </span>
              <span className="badge local">{t("membersCard.badge")}</span>
            </div>
            <div className="team-member-list">
              {members.map(({ id, roleId }) => (
                <article className="team-member-row" key={id}>
                  <span className="settings-avatar-row single">
                    <span>{memberInitials(id)}</span>
                  </span>
                  <span>
                    <strong>{t(`members.${id}.name`)}</strong>
                    <small>{t(`members.${id}.contact`)}</small>
                  </span>
                  <span className="badge local">{t(`roles.${roleId}.label`)}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.inviteMembers")}</h2>
            <div className="team-invite-form">
              <label htmlFor="team-invite-email">
                {t("invite.emailLabel")}
                <input id="team-invite-email" onChange={(event) => setEmail(event.target.value)} placeholder={t("invite.emailPlaceholder")} value={email} />
              </label>
              <button className="button button-solid" onClick={sendInvite} type="button">
                <UserPlus size={15} aria-hidden="true" /> {t("invite.sendInvite")}
              </button>
            </div>
            <p className="settings-status-note" aria-live="polite">
              <CheckCircle2 size={15} aria-hidden="true" /> {statusMessage()}
            </p>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.rolesPermissions")}</h2>
            <div className="scope-grid">
              {roles.map((roleId) => (
                <article key={roleId}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  <strong>{t(`roles.${roleId}.label`)}</strong>
                  <p>{t(`roles.${roleId}.description`)}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="settings-subpage-side">
          <section className="panel settings-subpage-card">
            <h2>{t("sections.pendingInvites")}</h2>
            <div className="settings-row-list compact">
              {pendingInvites.map((invite) => (
                <div className="settings-detail-row compact-row" key={invite}>
                  <UserPlus size={15} aria-hidden="true" />
                  <span>{invite}</span>
                  <span className="badge">{t("pendingInvites.badge")}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.sharedCollections")}</h2>
            <div className="settings-row-list compact">
              {sharedCollections.map((collectionId) => (
                <div className="settings-detail-row compact-row" key={collectionId}>
                  <Folder size={15} aria-hidden="true" />
                  <span>{t(`sharedCollections.${collectionId}.name`)}</span>
                  <span className="badge local">{t(`sharedCollections.${collectionId}.detail`)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.activityLog")}</h2>
            <div className="key-activity-list">
              {activityRows.map((activityId) => (
                <article key={activityId}>
                  {activityId === "sharingUpdated" ? <Users size={15} aria-hidden="true" /> : <UserPlus size={15} aria-hidden="true" />}
                  <span>
                    <strong>{t(`activity.${activityId}.time`)}</strong>
                    <small>{t(`activity.${activityId}.detail`)}</small>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel settings-subpage-card">
            <h2>{t("sections.ownership")}</h2>
            <p className="tool-description">{t("ownership.description")}</p>
            <button disabled className="button button-outline-neutral" type="button">
              <Crown size={15} aria-hidden="true" /> {t("ownership.transferOwnership")}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
