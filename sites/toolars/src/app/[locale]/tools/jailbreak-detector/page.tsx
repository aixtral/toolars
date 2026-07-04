import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JailbreakDetectorWorkspace } from "./jailbreak-detector-workspace";

export default function JailbreakDetectorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JailbreakDetectorWorkspace />
    </ToolarsShell>
  );
}
