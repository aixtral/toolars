import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { getLegalDocument } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Toolars: acceptable use, AI consent, your content, fees, and limitations.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "article",
    title: "Terms of Service — Toolars",
    description: "Acceptable use, AI consent, your content, fees, and limitations.",
    url: "/terms"
  }
};

export default async function TermsPage() {
  const document = await getLegalDocument("terms-of-service");
  if (!document) return null;
  return (
    <ToolarsShell active="explore" sidebarVariant="none">
      <div className="page-grid legal-page">
        <LegalDocumentView document={document} />
      </div>
    </ToolarsShell>
  );
}
