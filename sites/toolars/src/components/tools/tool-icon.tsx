import {
  Archive,
  BadgeDollarSign,
  BarChart3,
  Binary,
  Brain,
  Braces,
  Calculator,
  CalendarClock,
  ChartNoAxesCombined,
  ClipboardList,
  Code2,
  CodeXml,
  Coins,
  Database,
  FileArchive,
  FileCheck2,
  FileCode2,
  FileCog,
  FileImage,
  FileJson,
  FileKey2,
  FilePenLine,
  FileSearch,
  FileSignature,
  FileText,
  Fingerprint,
  Gauge,
  Hash,
  Image as ImageIcon,
  KeyRound,
  Languages,
  Link2,
  ListTree,
  LockKeyhole,
  Mail,
  MessageSquareCode,
  Palette,
  QrCode,
  Regex,
  Ruler,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Type,
  WandSparkles,
  Weight,
  Workflow
} from "lucide-react";
import type { CSSProperties } from "react";
import type { ToolDefinition } from "@/data/registry";

type IconComponent = typeof Sparkles;

const iconRouteTokens = {
  slug: {
    barcode: "barcode",
    base64: "base64",
    bmi: "bmi",
    calculator: "calculator",
    certificate: "certificate",
    color: "color",
    converter: "converter",
    cron: "cron",
    csv: "csv",
    data: "data",
    diff: "diff",
    encoder: "encoder",
    env: "env",
    hash: "hash",
    html: "html",
    image: "image",
    jwt: "jwt",
    json: "json",
    lookup: "lookup",
    mcp: "mcp",
    nanoid: "nanoid",
    parser: "parser",
    password: "password",
    pdf: "pdf",
    prompt: "prompt",
    qr: "qr",
    regex: "regex",
    signer: "signer",
    injection: "injection",
    scanner: "scanner",
    cost: "cost",
    table: "table",
    token: "token",
    translator: "translator",
    tree: "tree",
    yaml: "yaml"
  },
  category: {
    ai: "AI",
    developer: "Developer"
  },
  processing: {
    aiConsent: "ai-consent" satisfies ToolDefinition["processing"][number]
  },
  type: {
    workflow: "workflow" satisfies ToolDefinition["type"]
  }
} as const;

const iconSize = 20;
const markCharacters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const iconTones = [
  { name: "emerald", bg: "#ecfdf5", fg: "#047857", ring: "#a7f3d0" },
  { name: "sky", bg: "#eff6ff", fg: "#1d4ed8", ring: "#bfdbfe" },
  { name: "violet", bg: "#f5f3ff", fg: "#6d28d9", ring: "#ddd6fe" },
  { name: "amber", bg: "#fffbeb", fg: "#b45309", ring: "#fde68a" },
  { name: "rose", bg: "#fff1f2", fg: "#be123c", ring: "#fecdd3" },
  { name: "cyan", bg: "#ecfeff", fg: "#0e7490", ring: "#a5f3fc" },
  { name: "lime", bg: "#f7fee7", fg: "#4d7c0f", ring: "#bef264" },
  { name: "slate", bg: "#f8fafc", fg: "#334155", ring: "#cbd5e1" }
] as const;

const iconRules: ReadonlyArray<{ key: string; token: string; Icon: IconComponent }> = [
  { key: "jwt", token: iconRouteTokens.slug.jwt, Icon: FileKey2 },
  { key: "password", token: iconRouteTokens.slug.password, Icon: KeyRound },
  { key: "certificate", token: iconRouteTokens.slug.certificate, Icon: FileCheck2 },
  { key: "signer", token: iconRouteTokens.slug.signer, Icon: FileSignature },
  { key: "barcode", token: iconRouteTokens.slug.barcode, Icon: Binary },
  { key: "qr", token: iconRouteTokens.slug.qr, Icon: QrCode },
  { key: "regex", token: iconRouteTokens.slug.regex, Icon: Regex },
  { key: "hash", token: iconRouteTokens.slug.hash, Icon: Hash },
  { key: "nanoid", token: iconRouteTokens.slug.nanoid, Icon: Fingerprint },
  { key: "base64", token: iconRouteTokens.slug.base64, Icon: Archive },
  { key: "image", token: iconRouteTokens.slug.image, Icon: FileImage },
  { key: "color", token: iconRouteTokens.slug.color, Icon: Palette },
  { key: "pdf", token: iconRouteTokens.slug.pdf, Icon: FileText },
  { key: "json", token: iconRouteTokens.slug.json, Icon: FileJson },
  { key: "yaml", token: iconRouteTokens.slug.yaml, Icon: FileCog },
  { key: "csv", token: iconRouteTokens.slug.csv, Icon: Table2 },
  { key: "html", token: iconRouteTokens.slug.html, Icon: CodeXml },
  { key: "env", token: iconRouteTokens.slug.env, Icon: SlidersHorizontal },
  { key: "cron", token: iconRouteTokens.slug.cron, Icon: CalendarClock },
  { key: "table", token: iconRouteTokens.slug.table, Icon: Table2 },
  { key: "tree", token: iconRouteTokens.slug.tree, Icon: ListTree },
  { key: "translator", token: iconRouteTokens.slug.translator, Icon: Languages },
  { key: "prompt", token: iconRouteTokens.slug.prompt, Icon: MessageSquareCode },
  { key: "injection", token: iconRouteTokens.slug.injection, Icon: ShieldCheck },
  { key: "scanner", token: iconRouteTokens.slug.scanner, Icon: ScanSearch },
  { key: "cost", token: iconRouteTokens.slug.cost, Icon: BadgeDollarSign },
  { key: "calculator", token: iconRouteTokens.slug.calculator, Icon: Calculator },
  { key: "data", token: iconRouteTokens.slug.data, Icon: Database },
  { key: "diff", token: iconRouteTokens.slug.diff, Icon: ChartNoAxesCombined },
  { key: "encoder", token: iconRouteTokens.slug.encoder, Icon: FileCode2 },
  { key: "parser", token: iconRouteTokens.slug.parser, Icon: FileSearch },
  { key: "lookup", token: iconRouteTokens.slug.lookup, Icon: FileSearch },
  { key: "token", token: iconRouteTokens.slug.token, Icon: Gauge },
  { key: "converter", token: iconRouteTokens.slug.converter, Icon: Ruler },
  { key: "bmi", token: iconRouteTokens.slug.bmi, Icon: Weight }
];

function hasRouteToken(value: string, token: string) {
  return value.includes(token);
}

function renderIcon(Icon: IconComponent) {
  return <Icon size={iconSize} aria-hidden="true" />;
}

function hashSlug(slug: string) {
  let hash = 0;
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function getToolIconMark(slug: string) {
  const hash = hashSlug(slug);
  const first = slug.replace(/[^a-z0-9]/gi, "").charAt(0).toUpperCase() || "T";
  const second = markCharacters[hash % markCharacters.length];
  const third = markCharacters[Math.floor(hash / markCharacters.length) % markCharacters.length];

  return `${first}${second}${third}`;
}

function getToolIconTone(slug: string) {
  return iconTones[hashSlug(slug) % iconTones.length];
}

function resolveToolIcon(tool: Pick<ToolDefinition, "slug" | "category" | "type" | "processing">) {
  const slugRule = iconRules.find((rule) => hasRouteToken(tool.slug, rule.token));
  if (slugRule) return slugRule;
  if (hasRouteToken(tool.slug, iconRouteTokens.slug.mcp) || tool.type === iconRouteTokens.type.workflow) {
    return { key: "workflow", token: iconRouteTokens.slug.mcp, Icon: Workflow };
  }
  if (hasRouteToken(tool.category, iconRouteTokens.category.ai)) return { key: "ai", token: iconRouteTokens.category.ai, Icon: Brain };
  if (tool.processing?.includes(iconRouteTokens.processing.aiConsent)) {
    return { key: "ai-consent", token: iconRouteTokens.processing.aiConsent, Icon: LockKeyhole };
  }
  if (hasRouteToken(tool.category, iconRouteTokens.category.developer)) {
    return { key: "developer", token: iconRouteTokens.category.developer, Icon: Code2 };
  }
  if (hasRouteToken(tool.category, "Finance")) return { key: "finance", token: "Finance", Icon: Coins };
  if (hasRouteToken(tool.category, "Data")) return { key: "data-category", token: "Data", Icon: BarChart3 };
  if (hasRouteToken(tool.category, "Writing")) return { key: "writing", token: "Writing", Icon: FilePenLine };
  if (hasRouteToken(tool.category, "Productivity")) return { key: "productivity", token: "Productivity", Icon: ClipboardList };
  if (hasRouteToken(tool.category, "Image")) return { key: "image-category", token: "Image", Icon: ImageIcon };
  if (hasRouteToken(tool.category, "Frontend")) return { key: "frontend", token: "Frontend", Icon: Braces };

  return { key: "default", token: "default", Icon: WandSparkles };
}

export function getToolIconSignature(tool: Pick<ToolDefinition, "slug" | "category" | "type" | "processing">) {
  const icon = resolveToolIcon(tool);
  const tone = getToolIconTone(tool.slug);

  return `${icon.key}:${tone.name}:${getToolIconMark(tool.slug)}`;
}

export function ToolIcon({ tool }: { tool: Pick<ToolDefinition, "slug" | "category" | "type" | "processing"> }) {
  const icon = resolveToolIcon(tool);
  const tone = getToolIconTone(tool.slug);
  const mark = getToolIconMark(tool.slug);
  const style = {
    "--tool-icon-bg": tone.bg,
    "--tool-icon-fg": tone.fg,
    "--tool-icon-ring": tone.ring
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      className="tool-icon"
      data-tool-icon-key={getToolIconSignature(tool)}
      data-tool-icon-mark={mark}
      style={style}
    >
      {renderIcon(icon.Icon)}
      <span className="tool-icon-mark">{mark}</span>
    </span>
  );
}
