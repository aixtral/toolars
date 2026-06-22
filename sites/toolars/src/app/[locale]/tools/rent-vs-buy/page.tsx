import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RentVsBuyWorkspace } from "./rent-vs-buy-workspace";

export default function RentVsBuyPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <RentVsBuyWorkspace />
    </ToolarsShell>
  );
}
