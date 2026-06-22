import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { McpToolLaunchWorkflow } from "./mcp-tool-launch-workflow";

export const metadata: Metadata = {
  title: "MCP Tool Launch workflow",
  description: "Build manifest, test payloads, and ship MCP docs in one workflow.",
  alternates: { canonical: "/workflows/mcp-tool-launch" },
  openGraph: {
    type: "website",
    title: "MCP Tool Launch — Toolars",
    description: "Define tools, build manifest, run MCP tests, and export docs.",
    url: "/workflows/mcp-tool-launch"
  }
};

export default function McpToolLaunchWorkflowPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <McpToolLaunchWorkflow />
    </ToolarsShell>
  );
}
