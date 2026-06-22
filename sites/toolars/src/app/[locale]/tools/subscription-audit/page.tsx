import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SubscriptionAuditWorkspace } from "./subscription-audit-workspace";

export default function SubscriptionAuditPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SubscriptionAuditWorkspace />
    </ToolarsShell>
  );
}
