import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StudentLoanCalculatorWorkspace } from "./student-loan-calculator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("student-loan-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function StudentLoanCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <ToolWorkspaceJsonLd slug="student-loan-calculator" />
      <StudentLoanCalculatorWorkspace />
    </ToolarsShell>
  );
}
