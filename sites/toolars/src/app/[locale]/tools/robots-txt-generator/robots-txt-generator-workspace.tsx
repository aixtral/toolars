"use client";

import { Bot, Code2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateRobotsTxt, type RobotsTxtResult } from "@/lib/tools/robots-txt-generator";

export function RobotsTxtGeneratorWorkspace() {
  const t = useTranslations("tools.robots-txt-generator.workspace");
  const [disallow, setDisallow] = useState("/admin");
  const [result, setResult] = useState<RobotsTxtResult>(generateRobotsTxt({ rules: [{ userAgent: "*", allow: ["/"], disallow: ["/admin"] }], sitemap: "https://toolars.app/sitemap.xml", crawlDelay: 10 }));

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="robots-txt-generator">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Bot size={18} aria-hidden="true" /></div><label className="field-label" htmlFor="robots-disallow">{t("disallowLabel")}<textarea className="textarea prompt-textarea" id="robots-disallow" onChange={(event) => setDisallow(event.target.value)} value={disallow} /></label><div className="button-row"><button className="button button-solid" onClick={() => setResult(generateRobotsTxt({ rules: [{ userAgent: "*", allow: ["/"], disallow: disallow.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean) }], sitemap: "https://toolars.app/sitemap.xml", crawlDelay: 10 }))} type="button"><Bot size={16} aria-hidden="true" /> {t("generateButton")}</button></div></section>
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("resultTitle")}</h2><Code2 size={18} aria-hidden="true" /></div><pre aria-label={t("outputLabel")} className="textarea prompt-textarea">{result.text}</pre></section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{result.warnings[0] ?? t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
