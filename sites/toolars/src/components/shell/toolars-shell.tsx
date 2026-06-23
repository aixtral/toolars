import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  Box,
  Briefcase,
  Calculator,
  CheckCircle2,
  Code2,
  CircleHelp,
  Clock,
  CreditCard,
  FileText,
  Folder,
  GraduationCap,
  Grid2X2,
  Headphones,
  HardDrive,
  Heart,
  Home,
  Image as ImageIcon,
  Inbox,
  KeyRound,
  Link,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  Palette,
  PenLine,
  Plus,
  Plug,
  Save,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Share2,
  Sparkles,
  SquareTerminal,
  Star,
  Sun,
  Upload,
  User,
  Users,
  Wallet,
  Workflow
} from "lucide-react";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { CommandCenter } from "@/components/search/command-center";
import { categories } from "@/data/registry";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

/** Map a category label to its lucide icon for the sidebar. */
const categoryIcons: Record<string, typeof Grid2X2> = {
  "All": Grid2X2,
  "AI": Sparkles,
  "AI Security": ShieldCheck,
  "Developer": Code2,
  "RAG / MCP / Agent": Bot,
  "LLM Cost": Calculator,
  "Prompt Engineering": MessageSquare,
  "Frontend & Design": Palette,
  "PDF": FileText,
  "Image": ImageIcon,
  "Finance": Wallet,
  "Health": Heart,
  "Productivity": Briefcase,
  "Writing": PenLine,
  "Data": BarChart3
};

function getCategoryIcon(label: string) {
  return categoryIcons[label] ?? Grid2X2;
}

type Active = "explore" | "pdf" | "ai-developer" | "workflows" | "collections" | "my-tools" | "pricing" | "settings" | "admin";
type SidebarVariant = "tools" | "workflows" | "collections" | "workspace" | "pdf-workspace" | "billing" | "settings" | "admin" | "none";

const nav = [
  { labelKey: "nav.explore", label: "Explore", href: "/", key: "explore" },
  { labelKey: "nav.workflows", label: "Workflows", href: "/workflows", key: "workflows" },
  { labelKey: "nav.collections", label: "Collections", href: "/collections", key: "collections" },
  { labelKey: "nav.myTools", label: "My Tools", href: "/my-tools", key: "my-tools" }
];

const adminNav = [
  { label: "Queue", href: "/admin/review", key: "admin" },
  { label: "Tools", href: "/admin/review#tools", key: "admin-tools" },
  { label: "Workflows", href: "/admin/review#workflows", key: "admin-workflows" },
  { label: "Reports", href: "/admin/review#reports", key: "admin-reports" },
  { label: "Users", href: "/admin/review#users", key: "admin-users" },
  { label: "Settings", href: "/admin/review#settings", key: "admin-settings" }
];

const workflowCategories = [
  ["All workflows", "1,284", "WF", "/workflows"],
  ["PDF", "182", "PDF", "/workflows/pdf-summary"],
  ["Data", "213", "DAT", "/workflows#data"],
  ["Image", "156", "IMG", "/workflows#image"],
  ["Writing", "198", "WR", "/workflows#writing"],
  ["Developer", "129", "DEV", "/workflows#developer"],
  ["Marketing", "164", "MKT", "/workflows#marketing"],
  ["Finance", "132", "FIN", "/workflows#finance"],
  ["Health", "74", "HL", "/workflows#health"],
  ["AI", "112", "AI", "/workflows#ai"]
] as const;

const workflowFilters = ["Includes AI", "Local-first steps", "Team-ready", "Free to use"];

const collectionCategories = [
  ["Featured", "24", "ST", "/collections"],
  ["My saved", "18", "BK", "/collections#saved"],
  ["Team collections", "7", "TM", "/collections#team"],
  ["Productivity", "32", "PR", "/collections#productivity"],
  ["Developer", "28", "DEV", "/collections#developer"],
  ["Design", "23", "DS", "/collections#design"],
  ["Writing", "16", "WR", "/collections#writing"],
  ["PDF", "20", "PDF", "/collections/pdf-ops-kit"],
  ["Finance", "18", "FIN", "/collections#finance"],
  ["Health", "12", "HL", "/collections#health"]
] as const;

const collectionFilters = ["Public", "Team-ready", "Contains AI", "Local-first"];

const workspaceLinks = [
  { label: "Overview", href: "/my-tools", icon: Home },
  { label: "Recent outputs", href: "/my-tools#recent", icon: Clock },
  { label: "Favorites", href: "/my-tools#favorites", icon: Star },
  { label: "Collections", href: "/my-tools#collections", icon: Folder },
  { label: "Workflows", href: "/my-tools#workflows", icon: Workflow },
  { label: "Uploads", href: "/my-tools#uploads", icon: Upload },
  { label: "Shared links", href: "/my-tools#shared", icon: Link },
  { label: "Settings", href: "/my-tools#settings", icon: Settings }
] as const;

const billingLinks = [
  { label: "Plans & pricing", href: "/pricing", icon: CreditCard },
  { label: "Usage", href: "/settings/billing#usage", icon: Clock },
  { label: "Payment methods", href: "/settings/billing#payment-methods", icon: Wallet },
  { label: "Invoices", href: "/settings/billing#invoices", icon: FileText },
  { label: "Team plans", href: "/settings/billing#team", icon: Users },
  { label: "Upgrade guide", href: "/pricing#upgrade-guide", icon: CircleHelp }
] as const;

const trialLinks = [
  { label: "Trial usage", href: "/settings/billing#usage", icon: Clock },
  { label: "AI trial log", href: "/settings/privacy-ai", icon: Bot },
  { label: "Storage retention", href: "/settings/storage", icon: HardDrive },
  { label: "Account security", href: "/settings/security", icon: ShieldCheck }
] as const;

const settingsLinks = [
  { label: "Profile", href: "/settings", icon: User },
  { label: "Trial usage", href: "/settings/billing", icon: CreditCard },
  { label: "Privacy & AI", href: "/settings/privacy-ai", icon: Bot },
  { label: "Storage", href: "/settings/storage", icon: HardDrive },
  { label: "Team", href: "/settings/team", icon: Users },
  { label: "API keys", href: "/settings/api-keys", icon: KeyRound },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Connected apps", href: "/settings/connected-apps", icon: Plug },
  { label: "Security", href: "/settings/security", icon: ShieldCheck }
] as const;

const adminReviewLinks = [
  { label: "New submissions", href: "/admin/review", count: "42", icon: Inbox },
  { label: "Needs security review", href: "/admin/review#security", count: "8", icon: ShieldAlert },
  { label: "AI consent review", href: "/admin/review#ai-consent", count: "16", icon: Bot },
  { label: "Reported listings", href: "/admin/review#reported", count: "5", icon: AlertTriangle },
  { label: "Updates pending", href: "/admin/review#updates", count: "11", icon: Upload },
  { label: "Rejected", href: "/admin/review#rejected", count: "21", icon: CircleHelp },
  { label: "Published", href: "/admin/review#published", count: "1,248", icon: CheckCircle2 }
] as const;

const pdfWorkspaceLinks = [
  { label: "Workspace", href: "/my-tools", icon: Home, badge: null },
  { label: "PDF Toolkit", href: "/tools/pdf-toolkit", icon: FileText, badge: null },
  { label: "Image Tools", href: "/explore/image", icon: ImageIcon, badge: null },
  { label: "AI Writing", href: "/explore/ai-developer", icon: PenLine, badge: "New" },
  { label: "Finance", href: "/#finance", icon: Wallet, badge: null },
  { label: "Health", href: "/#health", icon: ShieldCheck, badge: null },
  { label: "Developer", href: "/explore/ai-developer", icon: Code2, badge: null },
  { label: "More Tools", href: "/", icon: Grid2X2, badge: null }
] as const;

const pdfRecentOutputs = [
  ["Q2_Marketing_Report_2024...", "Merged PDF · 2.4 MB", "2m ago"],
  ["Contract_Draft_v3.pdf", "Compressed · 1.1 MB", "1h ago"],
  ["Invoice_Mar_2024.pdf", "Converted to TXT · 98 KB", "Yesterday"],
  ["Product_Brochure.pdf", "Split · 6 files", "2 days ago"],
  ["Research_Paper.pdf", "Summarized · 12 pages", "3 days ago"]
] as const;

export function ToolarsShell({
  active = "explore",
  sidebarActiveHref,
  sidebarVariant = "tools",
  children
}: Readonly<{
  active?: Active;
  sidebarActiveHref?: string;
  sidebarVariant?: SidebarVariant;
  children: React.ReactNode;
}>) {
  const freeTrialMode = isFreeTrialMode();
  const t = useTranslations();
  const visibleNav = active === "admin" ? adminNav : active === "pricing" && !freeTrialMode ? [...nav, { labelKey: "nav.pricing", label: "Pricing", href: "/pricing", key: "pricing" }] : nav;
  const brandName = active === "admin" ? "Toolars Admin" : "Toolars";
  const sidebarLabel =
    sidebarVariant === "pdf-workspace"
      ? "PDF workspace navigation"
      : sidebarVariant === "workspace"
      ? "Workspace navigation"
      : sidebarVariant === "billing"
        ? freeTrialMode
          ? "Trial navigation"
          : "Billing navigation"
        : sidebarVariant === "settings"
          ? "Settings navigation"
          : sidebarVariant === "admin"
            ? "Admin review navigation"
            : "Tool filters";

  return (
    <div className="app-shell">
      <header
        className={`topbar ${sidebarVariant === "pdf-workspace" ? "pdf-workspace-topbar" : ""}`}
        data-desktop-layout={sidebarVariant === "pdf-workspace" ? "pdf-workspace-v2" : undefined}
        data-mobile-layout="brand-menu-command-compact-v2"
      >
        <a className="brand" href={active === "admin" ? "/admin/review" : "/"} aria-label={active === "admin" ? "Toolars admin home" : "Toolars home"}>
          <span className="brand-mark">
            <SquareTerminal size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="brand-name">{brandName}</span>
            <span className="brand-tagline">All tools. One workspace.</span>
          </span>
        </a>
        {sidebarVariant === "pdf-workspace" ? (
          <div className="workspace-breadcrumb" aria-label="Breadcrumb">
            <span>Tools</span>
            <span aria-hidden="true">/</span>
            <strong>PDF Toolkit</strong>
          </div>
        ) : null}
        <CommandCenter />
        {sidebarVariant === "pdf-workspace" ? (
          <nav className="nav workspace-topbar-actions" aria-label="PDF workspace actions">
            <button className="button button-outline-neutral" type="button">
              <Save size={16} aria-hidden="true" /> Save
            </button>
            <button className="button button-outline-neutral" type="button">
              <Share2 size={16} aria-hidden="true" /> Share
            </button>
            <span className="topbar-auth">
              <CoreActionModalButton className="button button-outline" kind="sign-in">
                Sign in
              </CoreActionModalButton>
              <CoreActionModalButton className="button button-solid" kind="sign-up">
                Sign up
              </CoreActionModalButton>
              <LanguageSwitcher />
            </span>
            <button className="menu-button" type="button">
              Menu
            </button>
            <button aria-label="Appearance" className="button pdf-appearance-button" type="button">
              <Sun size={17} aria-hidden="true" />
            </button>
          </nav>
        ) : (
          <nav className="nav" aria-label="Primary navigation">
            {visibleNav.map((item) => (
              <a
                aria-current={active === item.key || (item.key === "explore" && ["pdf", "ai-developer"].includes(active)) ? "page" : undefined}
                href={item.href}
                key={item.key}
              >
                {"labelKey" in item && typeof item.labelKey === "string" ? t(item.labelKey) : item.label}
              </a>
            ))}
            {active === "admin" ? (
              <button className="button button-solid" type="button">
                {t("nav.admin")}
              </button>
            ) : (
              <span className="topbar-auth">
                <a className="topbar-text-link" href="/submit">
                  <Plus size={15} aria-hidden="true" /> {t("nav.submitTool")}
                </a>
                <CoreActionModalButton className="button button-outline" kind="sign-in">
                  {t("nav.signIn")}
                </CoreActionModalButton>
                <CoreActionModalButton className="button button-solid" kind="sign-up">
                  {t("nav.signUp")}
                </CoreActionModalButton>
                <LanguageSwitcher />
              </span>
            )}
            <button className="menu-button" type="button">
              {t("common.menu")}
            </button>
          </nav>
        )}
      </header>
      <div className={`shell-grid ${sidebarVariant === "none" ? "shell-grid-full" : ""}`} data-shell-layout={sidebarVariant === "pdf-workspace" ? "pdf-workspace-v2" : undefined}>
        {sidebarVariant === "none" ? null : (
          <aside className={`sidebar ${sidebarVariant === "pdf-workspace" ? "pdf-workspace-sidebar" : ""}`} aria-label={sidebarLabel}>
            {sidebarVariant === "workflows" ? (
            <>
              <section className="side-section">
                <p className="side-title">Workflow categories</p>
                {workflowCategories.map(([label, count, icon, href]) => (
                  <a className={`side-link ${label === "All workflows" ? "is-active" : ""}`} href={href} key={label}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span className="side-icon">{icon}</span>
                      {label}
                    </span>
                    <span className="side-count">{count}</span>
                  </a>
                ))}
              </section>
              <section className="side-section">
                <p className="side-title">Filters</p>
                {workflowFilters.map((label) => (
                  <label className="filter-check" key={label}>
                    <input type="checkbox" />
                    <span>{label}</span>
                  </label>
                ))}
              </section>
              <button className="button button-outline-neutral workflow-clear-button" type="button">
                Clear all filters
              </button>
            </>
          ) : sidebarVariant === "collections" ? (
            <>
              <section className="side-section">
                <p className="side-title">Collection categories</p>
                {collectionCategories.map(([label, count, icon, href]) => (
                  <a className={`side-link ${label === "Featured" ? "is-active" : ""}`} href={href} key={label}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span className="side-icon">{icon}</span>
                      {label}
                    </span>
                    <span className="side-count">{count}</span>
                  </a>
                ))}
              </section>
              <section className="side-section">
                <p className="side-title">Filters</p>
                {collectionFilters.map((label) => (
                  <label className="filter-check" key={label}>
                    <input type="checkbox" />
                    <span>{label}</span>
                  </label>
                ))}
              </section>
              <section className="panel">
                <h3>
                  <ShieldCheck size={16} aria-hidden="true" /> Collection trust
                </h3>
                <p className="tool-description">Collections group local-first tools, consent-gated AI steps, and reusable workflows.</p>
              </section>
            </>
          ) : sidebarVariant === "billing" ? (
            freeTrialMode ? (
              <>
                <section className="side-section">
                  <p className="side-title">Free trial</p>
                  {trialLinks.map(({ label, href, icon: Icon }, index) => (
                    <a className={`side-link ${index === 0 ? "is-active" : ""}`} href={href} key={label}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Icon size={14} aria-hidden="true" />
                        {label}
                      </span>
                    </a>
                  ))}
                </section>
                <section className="panel workspace-upgrade-card">
                  <h3>
                    <Sparkles size={16} aria-hidden="true" /> Free trial mode
                  </h3>
                  <p className="tool-description">Google sign-in unlocks beta trial credits, synced history, and upload handoff testing.</p>
                </section>
                <section className="panel">
                  <h3>
                    <ShieldCheck size={16} aria-hidden="true" /> Free beta trial
                  </h3>
                  <p className="tool-description">Plan comparison, invoices, and customer portal controls are parked for Phase 2.</p>
                </section>
              </>
            ) : (
              <>
                <section className="side-section">
                  <p className="side-title">Billing</p>
                  {billingLinks.slice(0, 4).map(({ label, href, icon: Icon }, index) => (
                    <a className={`side-link ${index === 0 ? "is-active" : ""}`} href={href} key={label}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Icon size={14} aria-hidden="true" />
                        {label}
                      </span>
                    </a>
                  ))}
                </section>
                <section className="side-section">
                  <p className="side-title">Workspace</p>
                  {billingLinks.slice(4).map(({ label, href, icon: Icon }) => (
                    <a className="side-link" href={href} key={label}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Icon size={14} aria-hidden="true" />
                        {label}
                      </span>
                    </a>
                  ))}
                </section>
                <section className="panel workspace-upgrade-card">
                  <h3>
                    <GraduationCap size={16} aria-hidden="true" /> Students & educators
                  </h3>
                  <p className="tool-description">Get 50% off Pro when you verify your learning workspace.</p>
                  <a className="text-link" href="/pricing#education">
                    Verify now
                  </a>
                </section>
                <section className="panel">
                  <h3>
                    <Headphones size={16} aria-hidden="true" /> Need help choosing?
                  </h3>
                  <p className="tool-description">Compare plans or talk to us before upgrading.</p>
                  <a className="text-link" href="/pricing#faq">
                    Contact support
                  </a>
                </section>
                <section className="panel">
                  <h3>
                    <ShieldCheck size={16} aria-hidden="true" /> 30-day money-back guarantee
                  </h3>
                  <p className="tool-description">Not satisfied? Get a full refund within 30 days of upgrading.</p>
                </section>
              </>
            )
          ) : sidebarVariant === "settings" ? (
            <>
              <section className="side-section">
                <p className="side-title">Settings</p>
                {settingsLinks.map(({ label, href, icon: Icon }, index) => (
                  <a
                    aria-current={(sidebarActiveHref ? href === sidebarActiveHref : index === 0) ? "page" : undefined}
                    className={`side-link ${(sidebarActiveHref ? href === sidebarActiveHref : index === 0) ? "is-active" : ""}`}
                    href={href}
                    key={label}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon size={14} aria-hidden="true" />
                      {label}
                    </span>
                  </a>
                ))}
              </section>
              <section className="panel">
                <h3>
                  <Box size={16} aria-hidden="true" /> Need help?
                </h3>
                <p className="tool-description">Visit our help center or contact support.</p>
                <a className="text-link" href="/settings#support">
                  Go to help center
                </a>
              </section>
            </>
          ) : sidebarVariant === "admin" ? (
            <>
              <section className="side-section">
                <p className="side-title">Review queues</p>
                {adminReviewLinks.map(({ label, href, count, icon: Icon }, index) => (
                  <a className={`side-link ${index === 0 ? "is-active" : ""}`} href={href} key={label}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon size={14} aria-hidden="true" />
                      {label}
                    </span>
                    <span className="side-count">{count}</span>
                  </a>
                ))}
              </section>
              <section className="side-section">
                <p className="side-title">Filters</p>
                {["AI", "Traditional", "Local", "Cloud", "AI consent required"].map((label, index) => (
                  <label className="filter-check" key={label}>
                    <input defaultChecked={index === 0} type="checkbox" />
                    <span>{label}</span>
                  </label>
                ))}
              </section>
              <section className="panel">
                <h3>
                  <ListChecks size={16} aria-hidden="true" /> Review SLA
                </h3>
                <p className="tool-description">New submissions should get a first decision within 24 hours.</p>
                <a className="text-link" href="/admin/review#reports">
                  View report
                </a>
              </section>
            </>
          ) : sidebarVariant === "pdf-workspace" ? (
            <>
              <section className="side-section pdf-workspace-menu">
                {pdfWorkspaceLinks.map(({ label, href, icon: Icon, badge }) => (
                  <a
                    aria-current={label === "PDF Toolkit" ? "page" : undefined}
                    className={`side-link ${label === "PDF Toolkit" ? "is-active" : ""}`}
                    href={href}
                    key={label}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <Icon size={16} aria-hidden="true" />
                      {label}
                    </span>
                    {badge ? <span className="badge local">{badge}</span> : null}
                  </a>
                ))}
              </section>
              <section className="side-section pdf-recent-outputs">
                <div className="side-section-head">
                  <p className="side-title">Recent Outputs</p>
                  <a href="/my-tools#recent">View all</a>
                </div>
                {pdfRecentOutputs.map(([title, meta, time]) => (
                  <a className="pdf-recent-output" href="/my-tools#recent" key={title}>
                    <span className="pdf-mini-file">PDF</span>
                    <span>
                      <strong>{title}</strong>
                      <small>{meta}</small>
                    </span>
                    <small>{time}</small>
                  </a>
                ))}
              </section>
              <section className="panel pdf-plan-card">
                <div className="side-section-head">
                  <strong>{freeTrialMode ? "Trial usage" : "Free Plan"}</strong>
                  {freeTrialMode ? <span className="badge local">Beta</span> : <a href="/pricing">Upgrade</a>}
                </div>
                <div className="workspace-meter" aria-label="PDF workspace storage">
                  <span style={{ width: "42%" }} />
                </div>
                <div className="filter-row">
                  <span>2.1 GB / 5 GB used</span>
                  <span className="side-count">42%</span>
                </div>
                <div className="filter-row">
                  <span>Local PDF tools</span>
                  <span className="side-count">Unlimited</span>
                </div>
                <div className="filter-row">
                  <span>{freeTrialMode ? "AI trial credits" : "AI tools (monthly)"}</span>
                  <span className="side-count">{freeTrialMode ? "1,250 / 2,000" : "10 / 20"}</span>
                </div>
                <div className="filter-row">
                  <span>Storage</span>
                  <span className="side-count">2.1 GB / 5 GB</span>
                </div>
              </section>
            </>
          ) : sidebarVariant === "workspace" ? (
            <>
              <section className="side-section">
                <p className="side-title">My workspace</p>
                {workspaceLinks.map(({ label, href, icon: Icon }, index) => (
                  <a className={`side-link ${index === 0 ? "is-active" : ""}`} href={href} key={label}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon size={14} aria-hidden="true" />
                      {label}
                    </span>
                  </a>
                ))}
              </section>
              {freeTrialMode ? (
                <section className="panel workspace-upgrade-card">
                  <h3>
                    <Sparkles size={16} aria-hidden="true" /> Free trial workspace
                  </h3>
                  <p className="tool-description">Google sign-in keeps trial history, saved collections, and AI usage in sync.</p>
                  <span className="badge local">Free trial mode</span>
                </section>
              ) : (
                <section className="panel workspace-upgrade-card">
                  <h3>
                    <Sparkles size={16} aria-hidden="true" /> Go Pro for more
                  </h3>
                  <p className="tool-description">Unlock more storage, AI credits, and shared workflow history.</p>
                  <CoreActionModalButton
                    className="button button-solid"
                    kind="upgrade"
                    planFeatures={["5,000 AI credits/month", "Saved outputs & history", "Workflow runs up to 500/month"]}
                    planName="Pro"
                    planPrice="$6.99 / month"
                  >
                    Upgrade to Pro
                  </CoreActionModalButton>
                </section>
              )}
              <section className="side-section">
                <p className="side-title">Storage</p>
                <div className="workspace-meter" aria-label="Storage">
                  <span style={{ width: "24%" }} />
                </div>
                <p className="tool-description">2.4 GB / 10 GB used</p>
              </section>
              <section className="side-section">
                <p className="side-title">AI credits</p>
                <div className="workspace-meter" aria-label="AI credits">
                  <span style={{ width: "62%" }} />
                </div>
                <p className="tool-description">1,250 / 2,000 credits</p>
              </section>
            </>
          ) : (
            <>
              <section className="side-section">
                <p className="side-title">Categories</p>
                {categories.map((category) => {
                  const key = category.label === "PDF" ? "pdf" : category.label === "AI" ? "ai-developer" : category.label.toLowerCase();
                  const href = category.label === "PDF" ? "/explore/pdf" : category.label === "AI" ? "/explore/ai-developer" : "/";
                  return (
                    <a className={`side-link ${active === key ? "is-active" : ""}`} href={href} key={category.label}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        {(() => { const Icon = getCategoryIcon(category.label); return <Icon size={14} aria-hidden="true" />; })()}
                        {category.label}
                      </span>
                      <span className="side-count">{category.count.toLocaleString()}</span>
                    </a>
                  );
                })}
              </section>
              <section className="side-section">
                <p className="side-title">Tool type</p>
                {[
                  ["Traditional", "1,325"],
                  ["AI-powered", "843"],
                  ["Workflow", "475"]
                ].map(([label, count]) => (
                  <div className="filter-row" key={label}>
                    <span>{label}</span>
                    <span className="side-count">{count}</span>
                  </div>
                ))}
              </section>
              <section className="side-section">
                <p className="side-title">Processing</p>
                {[
                  ["Local (on device)", "61"],
                  ["Cloud", "67"],
                  ["AI consent required", "29"]
                ].map(([label, count]) => (
                  <div className="filter-row" key={label}>
                    <span>{label}</span>
                    <span className="side-count">{count}</span>
                  </div>
                ))}
              </section>
              <section className="panel">
                <h3>
                  <ShieldCheck size={16} aria-hidden="true" /> Local-first
                </h3>
                <p className="tool-description">Tools clearly label what runs locally, what uses cloud, and what needs AI consent.</p>
              </section>
            </>
            )}
          </aside>
        )}
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
