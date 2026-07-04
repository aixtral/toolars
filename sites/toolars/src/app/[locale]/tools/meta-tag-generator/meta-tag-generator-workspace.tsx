"use client";

import { Code2, Tags } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateMetaTags, type MetaTagResult } from "@/lib/tools/meta-tag-generator";

export function MetaTagGeneratorWorkspace() {
  const t = useTranslations("tools.meta-tag-generator.workspace");
  const [title, setTitle] = useState("Toolars Launch");
  const [result, setResult] = useState<MetaTagResult>(generateMetaTags({ title, description: "Local-first tool workspace.", url: "https://toolars.app/tools", image: "https://toolars.app/og.png", siteName: "Toolars", twitterHandle: "@toolars" }));

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="meta-tag-generator">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Tags size={18} aria-hidden="true" /></div><label className="field-label" htmlFor="meta-title">{t("titleLabel")}<input className="input" id="meta-title" onChange={(event) => setTitle(event.target.value)} value={title} /></label><div className="button-row"><button className="button button-solid" onClick={() => setResult(generateMetaTags({ title, description: "Local-first tool workspace.", url: "https://toolars.app/tools", image: "https://toolars.app/og.png", siteName: "Toolars", twitterHandle: "@toolars" }))} type="button"><Tags size={16} aria-hidden="true" /> {t("generateButton")}</button></div></section>
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("resultTitle")}</h2><Code2 size={18} aria-hidden="true" /></div><pre aria-label={t("outputLabel")} className="textarea prompt-textarea">{result.html}</pre></section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{result.warnings[0] ?? t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
