import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LlmCostReviewWorkflow } from "./llm-cost-review-workflow";

export const metadata: Metadata = {
  title: "LLM Cost Review workflow",
  description: "Estimate monthly model spend and compare launch options in one workflow.",
  alternates: { canonical: "/workflows/llm-cost-review" },
  openGraph: {
    type: "website",
    title: "LLM Cost Review — Toolars",
    description: "Estimate tokens, compare models, review budget, and export a plan.",
    url: "/workflows/llm-cost-review"
  }
};

export default function LlmCostReviewWorkflowPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <LlmCostReviewWorkflow />
    </ToolarsShell>
  );
}
