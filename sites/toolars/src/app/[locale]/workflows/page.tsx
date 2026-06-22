import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { WorkflowsIndexView } from "./workflows-index-view";

export const metadata: Metadata = {
  title: "Workflows — Multi-step tool chains for repeatable tasks",
  description:
    "Browse Toolars workflows: repeatable chains that combine PDF tools, AI tools, calculators, and developer utilities into a single run.",
  alternates: { canonical: "/workflows" },
  openGraph: {
    type: "website",
    title: "Workflows — Toolars",
    description: "Multi-step tool chains for repeatable tasks across PDF, data, writing, and development.",
    url: "/workflows"
  }
};

export default function WorkflowsPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <WorkflowsIndexView />
    </ToolarsShell>
  );
}
