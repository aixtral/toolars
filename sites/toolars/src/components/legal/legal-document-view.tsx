import { useTranslations } from "next-intl";
import type { LegalDocument } from "@/data/legal";

interface LegalDocumentViewProps {
  document: LegalDocument;
}

/**
 * Renders a legal document (Privacy Policy / Terms of Service) with an
 * accessible heading hierarchy. Server-rendered so the full text is in the
 * initial HTML for SEO and accessibility.
 */
export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  const t = useTranslations("legal");
  return (
    <article className="legal-document">
      <header className="legal-document-header">
        <p className="subtitle">{document.title}</p>
        <h1 className="title">{document.title}</h1>
        <p className="legal-last-updated">{t("lastUpdated", { date: document.lastUpdated })}</p>
        <p className="legal-intro">{document.intro}</p>
      </header>

      {document.sections.map((section) => (
        <section key={section.heading} className="legal-section">
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
