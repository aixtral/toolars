import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BodyRecompositionWorkspace } from "./body-recomposition-workspace";

export default function BodyRecompositionPage() {
  return (
    <ToolarsShell active="explore">
      <BodyRecompositionWorkspace />
    </ToolarsShell>
  );
}
