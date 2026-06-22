import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AiPromptHardeningWorkflow } from "./ai-prompt-hardening-workflow";

export const metadata: Metadata = {
  title: "AI Prompt Hardening workflow",
  description: "Scan, redact, and strengthen prompt surfaces before launch in one workflow.",
  alternates: { canonical: "/workflows/ai-prompt-hardening" },
  openGraph: {
    type: "website",
    title: "AI Prompt Hardening — Toolars",
    description: "Scan injection, detect PII, review risks, and export a security report.",
    url: "/workflows/ai-prompt-hardening"
  }
};

export default function AiPromptHardeningWorkflowPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <AiPromptHardeningWorkflow />
    </ToolarsShell>
  );
}
