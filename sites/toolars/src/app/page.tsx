import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Calculator,
  ChevronRight,
  Code2,
  Compass,
  FileJson,
  FileText,
  Flame,
  Heart,
  ImageIcon,
  Lock,
  Mail,
  Menu,
  Mic,
  Monitor,
  Network,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Tag,
  User,
  Workflow
} from "lucide-react";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ResourceCard } from "@/components/tools/resource-card";
import { ToolCard } from "@/components/tools/tool-card";
import { aiDeveloperLabTools, tools, workflows } from "@/data/registry";

const homeQuickTasks = [
  { label: "Compress image", href: "/tools/pdf-toolkit", icon: ImageIcon, tone: "green" },
  { label: "Summarize PDF", href: "/workflows/pdf-summary", icon: FileText, tone: "red" },
  { label: "Write email", href: "/tools/json-repair", icon: Mail, tone: "blue" },
  { label: "Calculate loan", href: "/tools/loan-calculator", icon: Calculator, tone: "orange" }
] as const;

const homeContinueItems = [
  { title: "Image Compressor", detail: "Compressed 3 images", meta: "2h ago", icon: ImageIcon, tone: "green" },
  { title: "PDF summary", detail: "AI summary · 6 pages", meta: "Yesterday", icon: FileText, tone: "red" }
] as const;

const homePicks = [
  {
    title: "AI Research Summarizer",
    description: "Summarize long articles and papers instantly with AI.",
    href: "/tools/prompt-injection-scanner",
    icon: FileText,
    tone: "green",
    badges: ["AI", "Free"]
  },
  {
    title: "PDF Toolkit",
    description: "Merge, split, compress, convert and protect PDFs.",
    href: "/tools/pdf-toolkit",
    icon: FileText,
    tone: "red",
    badges: ["Traditional", "Free"]
  },
  {
    title: "Image Cleaner",
    description: "Remove background, erase objects, enhance image quality.",
    href: "/tools/json-repair",
    icon: ImageIcon,
    tone: "blue",
    badges: ["AI", "Freemium"]
  }
] as const;

const homeCategories = [
  { label: "AI", href: "/explore/ai-developer", icon: Sparkles },
  { label: "PDF", href: "/explore/pdf", icon: FileText },
  { label: "Image", href: "/tools/pdf-toolkit", icon: ImageIcon },
  { label: "Writing", href: "/tools/json-repair", icon: PenLine },
  { label: "Code", href: "/explore/ai-developer", icon: Code2 },
  { label: "Finance", href: "/tools/loan-calculator", icon: Calculator },
  { label: "Health", href: "/tools/bmi-calculator", icon: Heart },
  { label: "Data", href: "/tools/json-repair", icon: BarChart3 }
] as const;

const homeWorkflowRows = [
  { title: "Turn PDF into summary", detail: "PDF Toolkit + AI Summarizer", href: "/workflows/pdf-summary", icon: FileText, tone: "green", heat: "24.6K" },
  { title: "Clean CSV then chart", detail: "Data Cleaner + Chart Builder", href: "/workflows/llm-cost-review", icon: BarChart3, tone: "purple", heat: "18.1K" },
  { title: "Resize image for social", detail: "Image Resizer + Format Converter", href: "/workflows/mcp-tool-launch", icon: ImageIcon, tone: "blue", heat: "15.3K" }
] as const;

const homeTabs = [
  { label: "Explore", href: "/", icon: Compass, active: true },
  { label: "Workflows", href: "/workflows", icon: Network, active: false },
  { label: "Collections", href: "/collections", icon: Heart, active: false },
  { label: "My tools", href: "/my-tools", icon: BriefcaseBusiness, active: false }
] as const;

export default function HomePage() {
  const popularTools = tools.filter((tool) => ["json-repair", "mortgage-calculator", "llm-cost-calculator", "pdf-toolkit", "prompt-injection-scanner", "mcp-server-builder"].includes(tool.slug));

  return (
    <ToolarsShell active="explore">
      <MobileHomeApp />
      <div className="page-grid home-desktop-layout" data-home-desktop-layout="marketplace-v2">
        <div>
          <section className="section">
            <h1 className="title">Explore tools for every task</h1>
            <p className="subtitle">Find the right tool, get things done faster, and build your best work across traditional utilities, AI tools, and repeatable workflows.</p>
            <div className="search-panel">
              <div className="hero-input">
                <Sparkles size={18} aria-hidden="true" />
                <span>What do you want to do today?</span>
                <a className="open-link" href="/explore/pdf" aria-label="Search">
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
              <div className="chip-row">
                <span className="chip active">Traditional Tools</span>
                <span className="chip">AI Tools</span>
                <span className="chip">Workflows</span>
                <span className="chip">Local-first</span>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="home-section-head">
              <h2>Toolars Picks <span className="badge local">Verified by Toolars</span></h2>
              <a className="text-link" href="/collections">
                View all picks <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="home-desktop-pick-grid">
              {homePicks.map(({ title, description, href, icon: Icon, tone, badges }) => (
                <a className="home-desktop-pick-card" data-tone={tone} href={href} key={title}>
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                    <em>{badges[0]}</em>
                  </span>
                  <span className="home-desktop-pick-art">
                    <Icon size={48} aria-hidden="true" />
                  </span>
                  <span className="home-desktop-pick-footer">
                    {badges.map((badge) => (
                      <span className="chip" key={badge}>{badge}</span>
                    ))}
                    <span className="badge local">{badges.some((badge) => badge === "Freemium") ? "Freemium" : "Free"}</span>
                    <span className="button button-solid">Open</span>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>Popular tools</h2>
            <div className="tool-grid">
              {popularTools.map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>

          <section className="section">
            <h2>AI Developer Lab</h2>
            <p className="subtitle">Aixtral Lab inventory merged into Toolars for security, cost, prompt engineering, RAG, MCP, and agent work.</p>
            <div className="tool-grid" style={{ marginTop: 14 }}>
              {aiDeveloperLabTools.slice(0, 6).map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="right-rail">
          <section className="panel">
            <h2>Popular workflows</h2>
            <div className="resource-list">
              {workflows.map((workflow) => (
                <ResourceCard
                  description={workflow.description}
                  href={workflow.href}
                  icon={<Workflow size={20} aria-hidden="true" />}
                  key={workflow.slug}
                  meta={`${workflow.estimatedMinutes} min`}
                  title={workflow.title}
                />
              ))}
            </div>
          </section>
          <section className="panel">
            <h2>Curated & Verified</h2>
            <ResourceCard
              description="Every tool is reviewed for quality, safety, and usability."
              href="/collections"
              icon={<ShieldCheck size={20} aria-hidden="true" />}
              title="Quality review"
            />
          </section>
          <section className="panel">
            <h2>Start fast</h2>
            <div className="resource-list">
              <ResourceCard description="Merge, compress, summarize, and export PDFs." href="/explore/pdf" icon={<FileText size={20} aria-hidden="true" />} title="PDF tools" />
              <ResourceCard description="Repair LLM JSON locally before validation." href="/tools/json-repair" icon={<FileJson size={20} aria-hidden="true" />} title="JSON Repair" />
            </div>
          </section>
        </aside>
      </div>
    </ToolarsShell>
  );
}

function MobileHomeApp() {
  return (
    <div className="home-mobile-app" data-home-asset-parity="icon-font-v5" data-home-mobile-layout="explore-app">
      <header className="home-mobile-topbar">
        <a className="home-mobile-brand" href="/" aria-label="Toolars home">
          <span className="home-mobile-brand-mark">
            <SquareTerminal size={26} aria-hidden="true" />
          </span>
          <span>Toolars</span>
        </a>
        <CoreActionModalButton className="button button-outline-neutral home-mobile-sign-in" kind="sign-in">
          <User size={18} aria-hidden="true" /> Sign in
        </CoreActionModalButton>
        <button className="home-mobile-menu" type="button" aria-label="Menu">
          <Menu size={28} aria-hidden="true" />
        </button>
      </header>

      <main className="home-mobile-main">
        <section className="home-mobile-hero">
          <h1>What do you want to do?</h1>
          <p>Find the right tool, AI or workflow in seconds.</p>
          <a className="home-mobile-search" href="/explore/pdf">
            <Search size={26} aria-hidden="true" />
            <span>Search or describe your task...</span>
            <Mic size={24} aria-hidden="true" />
            <span className="home-mobile-search-go">
              <ArrowRight size={22} aria-hidden="true" />
            </span>
          </a>
          <div className="home-mobile-quick-row" aria-label="Suggested tasks">
            {homeQuickTasks.map(({ label, href, icon: Icon, tone }) => (
              <a className="home-mobile-quick-chip" data-tone={tone} href={href} key={label}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <div className="home-mobile-segmented" role="group" aria-label="Tool type">
            <button aria-pressed="true" type="button">
              <Monitor size={18} aria-hidden="true" /> Traditional
            </button>
            <button aria-pressed="false" type="button">
              <Sparkles size={18} aria-hidden="true" /> AI
            </button>
            <button aria-pressed="false" type="button">
              <Workflow size={18} aria-hidden="true" /> Workflow
            </button>
          </div>
        </section>

        <section className="home-mobile-section">
          <div className="home-mobile-section-head">
            <h2>Continue</h2>
            <a href="/my-tools">
              View all <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="home-mobile-list-card">
            {homeContinueItems.map(({ title, detail, meta, icon: Icon, tone }) => (
              <a className="home-mobile-continue-row" href="/my-tools" key={title}>
                <span className="home-mobile-soft-icon" data-tone={tone}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </span>
                <em>{meta}</em>
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="home-mobile-section">
          <div className="home-mobile-section-head">
            <h2>Toolars Picks</h2>
            <a href="/explore/pdf">
              See all <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="home-mobile-pick-list">
            {homePicks.map(({ title, description, href, icon: Icon, tone, badges }) => (
              <a className="home-mobile-pick-row" href={href} key={title}>
                <span className="home-mobile-pick-icon" data-tone={tone}>
                  <Icon size={36} aria-hidden="true" />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <span className="home-mobile-pick-badges">
                  {badges.map((badge) => (
                    <span className={badge === "AI" ? "badge local" : badge === "Traditional" ? "badge cloud" : badge === "Freemium" ? "badge warn" : "badge local"} key={badge}>
                      {badge}
                    </span>
                  ))}
                </span>
                <span className="home-mobile-open">Open</span>
              </a>
            ))}
          </div>
        </section>

        <nav className="home-mobile-category-rail" aria-label="Home categories">
          {homeCategories.map(({ label, href, icon: Icon }) => (
            <a href={href} key={label}>
              <span>
                <Icon size={26} aria-hidden="true" />
              </span>
              {label}
            </a>
          ))}
        </nav>

        <section className="home-mobile-section">
          <div className="home-mobile-section-head">
            <h2>Popular workflows</h2>
            <a href="/workflows">
              See all <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="home-mobile-list-card">
            {homeWorkflowRows.map(({ title, detail, href, icon: Icon, tone, heat }) => (
              <a className="home-mobile-workflow-row" href={href} key={title}>
                <span className="home-mobile-soft-icon" data-tone={tone}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </span>
                <em>
                  <Flame size={11} aria-hidden="true" /> {heat}
                </em>
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <div className="home-mobile-trust-strip" aria-label="Toolars trust notes">
          <span>
            <ShieldCheck size={18} aria-hidden="true" /> Local when possible
          </span>
          <span>
            <Lock size={18} aria-hidden="true" /> No sign-in for basics
          </span>
          <span>
            <Tag size={18} aria-hidden="true" /> AI clearly labeled
          </span>
        </div>
      </main>

      <nav className="home-mobile-bottom-tabs" aria-label="Mobile home tabs">
        {homeTabs.map(({ label, href, icon: Icon, active }) => (
          <a aria-current={active ? "page" : undefined} href={href} key={label}>
            <Icon size={25} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
