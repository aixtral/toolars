import { notFound } from "next/navigation";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { allDetailSlugs, getToolDetailBySlug, type ToolDetailDefinition } from "@/data/tool-details";
import { ToolDetailView } from "./tool-detail-view";

export function generateStaticParams() {
  return allDetailSlugs.map((slug) => ({ slug }));
}

export function getDetailShellActive(detail: ToolDetailDefinition): "ai-developer" | "explore" {
  return detail.tool.group === "AI Developer Lab" ? "ai-developer" : "explore";
}

export default async function ToolAboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getToolDetailBySlug(slug);

  if (!detail) notFound();

  return (
    <ToolarsShell active={getDetailShellActive(detail)}>
      <ToolDetailView detail={detail} />
    </ToolarsShell>
  );
}
