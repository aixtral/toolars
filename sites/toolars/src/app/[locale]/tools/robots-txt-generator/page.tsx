import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RobotsTxtGeneratorWorkspace } from "./robots-txt-generator-workspace";

export default function RobotsTxtGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RobotsTxtGeneratorWorkspace />
    </ToolarsShell>
  );
}
