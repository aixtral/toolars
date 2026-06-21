import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CollectionsIndexView } from "./collections-index-view";

export default function CollectionsPage() {
  return (
    <ToolarsShell active="collections" sidebarVariant="collections">
      <CollectionsIndexView />
    </ToolarsShell>
  );
}
