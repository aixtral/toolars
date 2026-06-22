export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  slug: "privacy-policy" | "terms-of-service";
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export const PRIVACY_POLICY_LAST_UPDATED = "2026-06-21";
export const TERMS_OF_SERVICE_LAST_UPDATED = "2026-06-21";

const privacyPolicy: LegalDocument = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  lastUpdated: PRIVACY_POLICY_LAST_UPDATED,
  intro:
    "This Privacy Policy explains what information Toolars collects, how we use it, and the choices you have. Toolars is built local-first: traditional calculators and PDF tools run in your browser and do not upload your input unless an AI or cloud step is explicitly enabled.",
  sections: [
    {
      heading: "Information we collect",
      paragraphs: [
        "Account information. When you sign in with Google, we receive your Google account ID, name, and email address as returned by Google. We use these to identify your workspace and sync your saved collections, history, and settings.",
        "Content you process. Traditional calculators (BMI, mortgage, loan, retirement, and all VitalCalc tools) process your input entirely in your browser. The values you enter never leave your device. PDF tools marked Local process files in your browser; when an AI summarize or cloud step is enabled, the relevant content is sent to the configured provider only after you grant explicit AI consent.",
        "Usage data. We collect aggregated, anonymized analytics about which tools are used and errors encountered, so we can improve reliability. We do not sell or rent this data.",
        "Cookies and local storage. We use a minimal set of cookies and local storage entries: a session cookie when you are signed in, an AI consent preference, a cookie consent choice, and your theme/appearance preference. See the Cookies section below."
      ]
    },
    {
      heading: "How we use your information",
      paragraphs: [
        "To provide the tools and features you request, including saving your workspace history and collections to your account.",
        "To operate AI steps that you explicitly enable, sending only the content required for that step to the configured AI provider.",
        "To maintain the security and integrity of the service, detect abuse, and comply with legal obligations.",
        "We do not use your information to train AI models, and we do not sell or rent your personal data to third parties."
      ]
    },
    {
      heading: "AI consent and data processing",
      paragraphs: [
        "Toolars labels every step as Local, Cloud, or AI. Steps marked Local never transmit your data. Steps marked AI or Cloud require your explicit consent before any content is sent to a provider.",
        "Your AI consent choice is recorded per workspace. You can review and revoke AI consent at any time from Settings → Privacy & AI. Revoking consent disables AI and cloud steps until you re-enable them."
      ]
    },
    {
      heading: "Cookies",
      paragraphs: [
        "Toolars uses the following categories of cookies and local storage:",
        "Strictly necessary. The signed session cookie (when signed in) is required for authentication and cannot be disabled.",
        "Preferences. Your AI consent choice, cookie consent choice, and appearance preference are stored locally so the site remembers them on your next visit.",
        "Analytics. Optional, anonymized analytics run only if you accept them in the cookie consent banner. You can withdraw analytics consent at any time.",
        "You can clear preferences and analytics storage at any time using your browser settings or from Settings → Privacy & AI."
      ]
    },
    {
      heading: "Data retention",
      paragraphs: [
        "We retain your account information and workspace data for as long as your account is active. If you delete your account, we remove your personal data within 30 days.",
        "AI consent and run logs are retained to provide an auditable record of your consent choices, as required for accountability under GDPR Article 7(1). You can export these logs from Settings → Privacy & AI."
      ]
    },
    {
      heading: "Your privacy rights",
      paragraphs: [
        "Depending on your location, you may have the following rights over your personal data:",
        "Access. Request a copy of the personal data we hold about you.",
        "Rectification. Ask us to correct inaccurate or incomplete data.",
        "Erasure. Request deletion of your personal data (the 'right to be forgotten').",
        "Restriction and objection. Ask us to restrict or stop processing your data.",
        "Data portability. Receive your data in a structured, machine-readable format.",
        "Withdraw consent. Withdraw your AI, analytics, or cookie consent at any time without affecting processing carried out before withdrawal.",
        "To exercise any of these rights, contact us at the address below. We respond within 30 days. If you are in the European Economic Area, United Kingdom, or California, these rights are guaranteed under the GDPR and CCPA respectively."
      ]
    },
    {
      heading: "International data transfers",
      paragraphs: [
        "When you enable an AI or cloud step, your content may be processed by providers located outside your country of residence, including the United States. We rely on standard contractual clauses and provider data processing agreements to ensure appropriate safeguards for such transfers."
      ]
    },
    {
      heading: "Children's privacy",
      paragraphs: [
        "Toolars is not directed at children under 13 (or the equivalent minimum age in your jurisdiction) and we do not knowingly collect personal data from them. If you believe a child has provided us with personal data, contact us and we will delete it."
      ]
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The 'last updated' date at the top reflects the most recent change. Material changes will be highlighted on the site at least seven days before they take effect."
      ]
    },
    {
      heading: "Contact us",
      paragraphs: [
        "If you have questions about this Privacy Policy or want to exercise your data rights, email privacy@toolars.app. Include 'Privacy Request' in the subject line."
      ]
    }
  ]
};

const termsOfService: LegalDocument = {
  slug: "terms-of-service",
  title: "Terms of Service",
  lastUpdated: TERMS_OF_SERVICE_LAST_UPDATED,
  intro:
    "These Terms of Service govern your use of Toolars. By accessing or using the site, you agree to these terms. If you do not agree, do not use the service.",
  sections: [
    {
      heading: "Use of the service",
      paragraphs: [
        "You may use Toolars for lawful personal and commercial purposes. Traditional calculators and PDF tools are free to use during the beta.",
        "You are responsible for the content you process and for ensuring you have the rights to use any files you upload for AI or cloud steps."
      ]
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "You agree not to: use the service for any unlawful purpose; upload content that infringes the rights of others; attempt to access, disrupt, or reverse-engineer systems you are not authorized to access; use automated means to scrape or overload the service; or submit malicious files or prompts designed to exploit the AI features.",
        "Violations may result in suspension of your account and, where applicable, referral to the relevant authorities."
      ]
    },
    {
      heading: "AI features and consent",
      paragraphs: [
        "AI and cloud steps are optional and require your explicit consent before any content is processed by a third-party provider. You are responsible for reviewing which steps are AI-assisted before enabling them.",
        "AI-generated output may be inaccurate. You are responsible for verifying AI results before relying on them. Toolars is not liable for decisions made based on AI output."
      ]
    },
    {
      heading: "Your content",
      paragraphs: [
        "You retain ownership of the content you process with Toolars. By using cloud or AI steps, you grant the configured provider a license to process that content solely to provide the step you requested.",
        "Traditional calculator and local PDF tool inputs remain on your device and are not licensed to Toolars or any provider."
      ]
    },
    {
      heading: "Accounts",
      paragraphs: [
        "You are responsible for safeguarding the account credentials provided by your chosen sign-in method and for all activity under your account. Notify us immediately at security@toolars.app if you suspect unauthorized access."
      ]
    },
    {
      heading: "Fees and beta",
      paragraphs: [
        "Traditional tools are free during the beta. AI and cloud steps may consume credits or incur charges when paid plans launch. Material changes to pricing will be announced at least 14 days in advance."
      ]
    },
    {
      heading: "Disclaimer of warranties",
      paragraphs: [
        "The service is provided 'as is' and 'as available' without warranties of any kind, whether express or implied. Calculator results are provided for informational purposes and are not medical, financial, or legal advice. Always consult a qualified professional for such advice."
      ]
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, Toolars shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising out of your use of the service."
      ]
    },
    {
      heading: "Indemnification",
      paragraphs: [
        "You agree to indemnify and hold Toolars harmless from claims, damages, and expenses arising from your misuse of the service or your violation of these Terms."
      ]
    },
    {
      heading: "Changes to these terms",
      paragraphs: [
        "We may update these Terms from time to time. The 'last updated' date at the top reflects the most recent change. Continued use of the service after changes take effect constitutes acceptance of the updated Terms."
      ]
    },
    {
      heading: "Contact us",
      paragraphs: [
        "Questions about these Terms can be sent to legal@toolars.app."
      ]
    }
  ]
};

const documents: LegalDocument[] = [privacyPolicy, termsOfService];

/**
 * Resolve the legal document set for a locale. Falls back to English when no
 * translation file exists for the locale. Translated legal content should be
 * professionally reviewed before publishing.
 */
async function resolveDocumentsForLocale(locale: string): Promise<LegalDocument[]> {
  // Translated legal documents (es/zh) will be added here once professionally
  // reviewed. Until then, all locales render the English source.
  return documents;
}

export async function getLegalDocument(slug: string, locale = "en"): Promise<LegalDocument | undefined> {
  const docs = await resolveDocumentsForLocale(locale);
  return docs.find((document) => document.slug === slug);
}

export async function getAllLegalDocuments(locale = "en"): Promise<LegalDocument[]> {
  return resolveDocumentsForLocale(locale);
}
