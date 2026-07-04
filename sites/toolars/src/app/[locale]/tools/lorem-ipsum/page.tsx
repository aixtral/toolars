import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LoremIpsumWorkspace } from "./lorem-ipsum-workspace";

export default function LoremIpsumPage() {
  return (
    <ToolarsShell active="ai-developer">
      <LoremIpsumWorkspace />
    </ToolarsShell>
  );
}
