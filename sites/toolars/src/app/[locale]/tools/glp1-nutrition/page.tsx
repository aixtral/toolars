import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Glp1NutritionWorkspace } from "./glp1-nutrition-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("glp1-nutrition");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function Glp1NutritionPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ToolWorkspaceJsonLd slug="glp1-nutrition" />
      <Glp1NutritionWorkspace />
    </ToolarsShell>
  );
}
