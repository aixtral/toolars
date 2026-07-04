import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { buildLocalizedPageMetadata } from "@/lib/seo/localized-page-metadata";
import { WorkflowsIndexView } from "./workflows-index-view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedPageMetadata({ locale, page: "workflows" });
}

export default function WorkflowsPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <WorkflowsIndexView />
    </ToolarsShell>
  );
}
