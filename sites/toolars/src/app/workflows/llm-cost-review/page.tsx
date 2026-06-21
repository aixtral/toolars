import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LlmCostReviewWorkflow } from "./llm-cost-review-workflow";

export default function LlmCostReviewWorkflowPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <LlmCostReviewWorkflow />
    </ToolarsShell>
  );
}
