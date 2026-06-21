import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AdminReviewView } from "./admin-review-view";

export default function AdminReviewPage() {
  return (
    <ToolarsShell active="admin" sidebarVariant="admin">
      <AdminReviewView />
    </ToolarsShell>
  );
}
