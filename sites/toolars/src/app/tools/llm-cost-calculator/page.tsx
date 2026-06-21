import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LlmCostCalculatorWorkspace } from "./llm-cost-calculator-workspace";

export default function LlmCostCalculatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <LlmCostCalculatorWorkspace />
    </ToolarsShell>
  );
}
