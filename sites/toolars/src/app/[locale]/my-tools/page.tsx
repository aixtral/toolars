import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MyToolsDashboardView } from "./my-tools-dashboard-view";

export const metadata: Metadata = {
  title: "My Tools",
  description: "Your Toolars workspace: pinned tools, recent outputs, favorites, collections, and workflows.",
  robots: { index: false, follow: false }
};

export default function MyToolsPage() {
  return (
    <ToolarsShell active="my-tools" sidebarVariant="workspace">
      <MyToolsDashboardView />
    </ToolarsShell>
  );
}
