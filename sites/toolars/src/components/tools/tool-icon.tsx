import {
  Brain,
  Calculator,
  Code2,
  FileJson,
  FileText,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import type { ToolDefinition } from "@/data/registry";

export function ToolIcon({ tool }: { tool: Pick<ToolDefinition, "slug" | "category" | "type" | "processing"> }) {
  const size = 20;
  if (tool.slug.includes("json")) return <FileJson size={size} aria-hidden="true" />;
  if (tool.slug.includes("pdf")) return <FileText size={size} aria-hidden="true" />;
  if (tool.slug.includes("mcp") || tool.type === "workflow") return <Workflow size={size} aria-hidden="true" />;
  if (tool.slug.includes("prompt") || tool.slug.includes("injection")) return <ShieldCheck size={size} aria-hidden="true" />;
  if (tool.slug.includes("scanner")) return <ScanSearch size={size} aria-hidden="true" />;
  if (tool.slug.includes("cost") || tool.slug.includes("calculator")) return <Calculator size={size} aria-hidden="true" />;
  if (tool.category.includes("AI")) return <Brain size={size} aria-hidden="true" />;
  if (tool.processing?.includes("ai-consent")) return <LockKeyhole size={size} aria-hidden="true" />;
  if (tool.category.includes("Developer")) return <Code2 size={size} aria-hidden="true" />;
  return <Sparkles size={size} aria-hidden="true" />;
}
