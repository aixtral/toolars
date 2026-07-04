import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PasswordGeneratorWorkspace } from "./password-generator-workspace";

export default function PasswordGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <PasswordGeneratorWorkspace />
    </ToolarsShell>
  );
}
