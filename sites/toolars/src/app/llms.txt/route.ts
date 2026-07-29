import { launchCertifiedTools, workflows } from "@/data/registry";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export const dynamic = "force-static";

/**
 * llms.txt — machine-readable site guide for AI engines (llms-txt.org).
 * Generated from the registry so the tool list stays in sync with the catalog.
 */
export function GET() {
  const baseUrl = getSiteBaseUrl();
  const lines: string[] = [
    "# Toolars",
    "",
    "> All tools. One workspace. Free local-first online tools with consent-audited AI workflows.",
    "",
    "Toolars provides free calculator, developer, PDF, finance, and health tools that run locally in the browser with no upload and no account required. AI-powered workflow steps execute only after explicit user consent, with a per-account usage audit trail. Content is available in English, Spanish, Simplified Chinese, and Traditional Chinese.",
    "",
    "## Tools",
    ""
  ];

  for (const tool of launchCertifiedTools) {
    lines.push(`- [${tool.name}](${baseUrl}${tool.href}): ${tool.description}`);
  }

  lines.push("", "## Workflows", "");
  for (const workflow of workflows) {
    lines.push(`- [${workflow.title}](${baseUrl}${workflow.href}): ${workflow.description}`);
  }

  lines.push(
    "",
    "## Blog",
    "",
    `- [Toolars Blog](${baseUrl}/blog): Guides for PDF workflows, JSON repair, prompt injection testing, calculators, and AI tool usage.`,
    "",
    "## Policies",
    "",
    `- [Privacy](${baseUrl}/privacy): Local-first processing and data handling.`,
    `- [Data Rights](${baseUrl}/data-rights): Data retention and deletion policy.`
  );

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}
