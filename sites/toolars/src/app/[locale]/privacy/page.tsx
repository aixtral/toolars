import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { getLegalDocument } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Toolars collects, uses, and protects your information. Local-first processing, explicit AI consent, and your GDPR and CCPA data rights.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "article",
    title: "Privacy Policy — Toolars",
    description: "Local-first processing, explicit AI consent, and your GDPR and CCPA data rights.",
    url: "/privacy"
  }
};

export default async function PrivacyPage() {
  const document = await getLegalDocument("privacy-policy");
  if (!document) return null;
  return (
    <ToolarsShell active="explore" sidebarVariant="none">
      <div className="page-grid legal-page">
        <LegalDocumentView document={document} />
      </div>
    </ToolarsShell>
  );
}
