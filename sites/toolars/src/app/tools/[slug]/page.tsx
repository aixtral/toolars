import { notFound } from "next/navigation";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { allDetailSlugs, getToolDetailBySlug, type ToolDetailDefinition } from "@/data/tool-details";
import { ToolWorkspaceShellView } from "./tool-workspace-shell-view";

export function generateStaticParams() {
  return allDetailSlugs.map((slug) => ({ slug }));
}

export function getWorkspaceShellActive(detail: ToolDetailDefinition): "ai-developer" | "explore" | "pdf" {
  if (detail.tool.group === "AI Developer Lab") return "ai-developer";
  if (detail.tool.category === "PDF") return "pdf";
  return "explore";
}

export default async function ToolWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getToolDetailBySlug(slug);

  if (!detail) notFound();

  return (
    <ToolarsShell active={getWorkspaceShellActive(detail)}>
      <ToolWorkspaceShellView detail={detail} />
    </ToolarsShell>
  );
}
