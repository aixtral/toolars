import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SavingsChallengeWorkspace } from "./savings-challenge-workspace";

export default function SavingsChallengePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SavingsChallengeWorkspace />
    </ToolarsShell>
  );
}
