import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";

export const metadata: Metadata = {
  title: "Exercise Your Data Rights",
  description:
    "Submit a data subject request: access, delete, or export your personal data under GDPR and CCPA.",
  alternates: { canonical: "/data-rights" },
  robots: { index: true, follow: true }
};

const rights = [
  {
    title: "Access my data",
    description: "Receive a copy of the personal data we hold about you.",
    action: "Request data export",
    href: "mailto:privacy@toolars.app?subject=Data Access Request"
  },
  {
    title: "Delete my data",
    description: "Request permanent deletion of your personal data (right to be forgotten).",
    action: "Request deletion",
    href: "mailto:privacy@toolars.app?subject=Data Deletion Request"
  },
  {
    title: "Do Not Sell or Share (CCPA)",
    description: "Opt out of the sale or sharing of your personal information under California law.",
    action: "Submit opt-out request",
    href: "mailto:privacy@toolars.app?subject=Do Not Sell My Personal Information"
  },
  {
    title: "Data portability",
    description: "Receive your data in a structured, machine-readable format.",
    action: "Request portable export",
    href: "mailto:privacy@toolars.app?subject=Data Portability Request"
  }
];

export default function DataRightsPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="none">
      <div className="page-grid data-rights-page">
        <article className="legal-document">
          <header className="legal-document-header">
            <h1 className="title">Exercise Your Data Rights</h1>
            <p className="legal-intro">
              Depending on your location (EEA, UK, California, or other jurisdictions), you may have
              the right to access, correct, delete, or export your personal data. Submit a request
              below and we will respond within 30 days.
            </p>
          </header>

          <div className="data-rights-grid">
            {rights.map((right) => (
              <section className="data-rights-card" key={right.title}>
                <h2>{right.title}</h2>
                <p className="tool-description">{right.description}</p>
                <a className="button button-outline" href={right.href}>
                  {right.action}
                </a>
              </section>
            ))}
          </div>

          <section className="legal-section">
            <h2>What to expect</h2>
            <p>
              After submitting a request, we verify your identity using the email associated with your
              Toolars account. Data access and portability requests are fulfilled within 30 days.
              Deletion requests permanently remove your data within 30 days of verification.
            </p>
            <p>
              You can also manage your data directly from{" "}
              <a href="/settings">Settings → Privacy &amp; AI</a>, including AI consent history
              export and session cleanup.
            </p>
          </section>
        </article>
      </div>
    </ToolarsShell>
  );
}
