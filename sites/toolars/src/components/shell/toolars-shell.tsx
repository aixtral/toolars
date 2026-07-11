import { useLocale, useTranslations } from "next-intl";
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
  Star,
  Sun,
  Upload,
  User,
  Users,
  Wallet,
  Workflow
} from "lucide-react";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import { ToolarsAccountActions } from "@/components/core/toolars-account-actions";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { CommandCenter } from "@/components/search/command-center";
import { ToolarsLogoMark } from "@/components/shell/toolars-logo";
import {
  collections,
  getCategoryHref,
  getCategoryLabelBySlug,
  getLaunchCertifiedToolsByCategory,
  launchCertifiedCategories,
  workflows
} from "@/data/registry";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { isFeatureEnabled } from "@/lib/product/feature-flags";

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

function getExploreCategorySlugFromHref(href: string | undefined) {
  const normalizedHref = href?.split(/[?#]/)[0] ?? "";
  const match = normalizedHref.match(/^\/explore\/([^/]+)$/);
  return match?.[1] ?? null;
}

type Active =
  | "none"
  | "explore"
  | "pdf"
  | "ai-developer"
  | "workflows"
  | "collections"
  | "my-tools"
  | "pricing"
  | "settings"
  | "admin";

type MobileLanguageMenuProps = {
  readonly active: Active;
  readonly label: string;
  readonly localizedHref: (href: string) => string;
  readonly showCategories?: boolean;
  readonly sidebarActiveHref?: string;
};

type SidebarVariant = "tools" | "workflows" | "collections" | "workspace" | "pdf-workspace" | "billing" | "settings" | "admin" | "none";

type ShellSidebarContentProps = {
  readonly active: Active;
  readonly freeTrialMode: boolean;
  readonly localizedHref: (href: string) => string;
  readonly sidebarActiveHref?: string;
  readonly sidebarVariant: SidebarVariant;
};

type ToolarsShellProps = {
  readonly active?: Active;
  readonly sidebarActiveHref?: string;
  readonly sidebarVariant?: SidebarVariant;
  readonly children: React.ReactNode;
};

function getCategoryActiveKey(label: string) {
  return label === "PDF" ? "pdf" : label === "AI" ? "ai-developer" : label.toLowerCase();
}

function MobileLanguageMenu({
  active,
  label,
  localizedHref,
  showCategories,
  sidebarActiveHref
}: MobileLanguageMenuProps) {
  const t = useTranslations();

  return (
    <details className="mobile-topbar-menu" data-mobile-menu="rustdesk-mobile-language-v1">
      <summary className="menu-button">{label}</summary>
      <div
        className="mobile-topbar-menu-panel"
        data-mobile-menu-panel="rustdesk-mobile-language-v1"
        style={{ maxHeight: "min(70vh, 560px)", overflowY: "auto" }}
      >
        {showCategories ? (
          <nav
            aria-label={t("shell.sidebar.categories")}
            className="mobile-menu-category-list"
            data-mobile-menu-section="categories"
            style={{ display: "grid", gap: 2, marginBottom: 6, paddingBottom: 6, borderBottom: "1px solid var(--border)" }}
          >
            {launchCertifiedCategories.map((category) => {
              const href = getCategoryHref(category.label);
              const isActive = sidebarActiveHref ? href === sidebarActiveHref : active === getCategoryActiveKey(category.label);

              return (
                <a
                  aria-current={isActive ? "page" : undefined}
                  className={`side-link ${isActive ? "is-active" : ""}`}
                  href={localizedHref(href)}
                  key={category.label}
                  style={{ display: "flex", width: "100%" }}
                >
                  <span>{t(`shell.toolCategories.${category.slug}`)}</span>
                  <span className="side-count">{category.count.toLocaleString()}</span>
                </a>
              );
            })}
          </nav>
        ) : null}
        <LanguageSwitcher variant="inline" />
      </div>
    </details>
  );
}

const nav = [
  { labelKey: "nav.explore", href: "/", key: "explore" },
  { labelKey: "nav.workflows", href: "/workflows", key: "workflows" },
  { labelKey: "nav.collections", href: "/collections", key: "collections" },
  { labelKey: "nav.myTools", href: "/my-tools", key: "my-tools" }
] as const;

const adminNav = [
  { labelKey: "shell.adminNav.queue", href: "/admin/review", key: "admin" },
  { labelKey: "shell.adminNav.tools", href: "/admin/review#tools", key: "admin-tools" },
  { labelKey: "shell.adminNav.workflows", href: "/admin/review#workflows", key: "admin-workflows" },
  { labelKey: "shell.adminNav.reports", href: "/admin/review#reports", key: "admin-reports" },
  { labelKey: "shell.adminNav.users", href: "/admin/review#users", key: "admin-users" },
  { labelKey: "shell.adminNav.settings", href: "/admin/review#settings", key: "admin-settings" }
] as const;

const workflowCategories = [
  { key: "allWorkflows", count: workflows.length, icon: Workflow, href: "/workflows" },
  { key: "pdf", count: workflows.filter((workflow) => workflow.category === "PDF").length, icon: FileText, href: "/workflows/pdf-summary" },
  { key: "data", count: getLaunchCertifiedToolsByCategory("Data").length, icon: BarChart3, href: "/explore/data" },
  { key: "image", count: getLaunchCertifiedToolsByCategory("Image").length, icon: ImageIcon, href: "/explore/image" },
  { key: "writing", count: getLaunchCertifiedToolsByCategory("Writing").length, icon: PenLine, href: "/explore/writing" },
  { key: "developer", count: getLaunchCertifiedToolsByCategory("Developer").length, icon: Code2, href: "/explore/developer" },
  { key: "marketing", count: workflows.length, icon: Share2, href: "/workflows#templates" },
  { key: "finance", count: getLaunchCertifiedToolsByCategory("Finance").length, icon: Wallet, href: "/explore/finance" },
  { key: "health", count: getLaunchCertifiedToolsByCategory("Health").length, icon: Heart, href: "/explore/health" },
  { key: "ai", count: getLaunchCertifiedToolsByCategory("AI").length, icon: Sparkles, href: "/explore/ai-developer" }
] as const;

const workflowFilters = ["includesAi", "localFirstSteps", "teamReady", "freeToUse"] as const;

const collectionCategories = [
  { key: "featured", count: collections.length, icon: Star, href: "/collections" },
  { key: "mySaved", count: collections.length, icon: Save, href: "/my-tools#collections" },
  { key: "teamCollections", count: 0, icon: Users, href: "/settings/team" },
  { key: "productivity", count: getLaunchCertifiedToolsByCategory("Productivity").length, icon: Briefcase, href: "/explore/productivity" },
  { key: "developer", count: getLaunchCertifiedToolsByCategory("Developer").length, icon: Code2, href: "/explore/developer" },
  { key: "design", count: getLaunchCertifiedToolsByCategory("Frontend & Design").length, icon: Palette, href: "/explore/frontend-design" },
  { key: "writing", count: getLaunchCertifiedToolsByCategory("Writing").length, icon: PenLine, href: "/explore/writing" },
  { key: "pdf", count: collections.filter((collection) => collection.slug.includes("pdf")).length, icon: FileText, href: "/collections/pdf-ops-kit" },
  { key: "finance", count: getLaunchCertifiedToolsByCategory("Finance").length, icon: Wallet, href: "/explore/finance" },
  { key: "health", count: getLaunchCertifiedToolsByCategory("Health").length, icon: Heart, href: "/explore/health" }
] as const;

const collectionFilters = ["public", "teamReady", "containsAi", "localFirst"] as const;

const workspaceLinks = [
  { labelKey: "shell.workspaceLinks.overview", href: "/my-tools", icon: Home },
  { labelKey: "shell.workspaceLinks.recentOutputs", href: "/my-tools#recent", icon: Clock },
  { labelKey: "shell.workspaceLinks.favorites", href: "/my-tools#favorites", icon: Star },
  { labelKey: "shell.workspaceLinks.collections", href: "/my-tools#collections", icon: Folder },
  { labelKey: "shell.workspaceLinks.workflows", href: "/my-tools#workflows", icon: Workflow },
  { labelKey: "shell.workspaceLinks.uploads", href: "/my-tools#uploads", icon: Upload },
  { labelKey: "shell.workspaceLinks.sharedLinks", href: "/my-tools#shared", icon: Link },
  { labelKey: "shell.workspaceLinks.settings", href: "/my-tools#settings", icon: Settings }
] as const;

const billingLinks = [
  { labelKey: "shell.billingLinks.plansPricing", href: "/pricing", icon: CreditCard },
  { labelKey: "shell.billingLinks.usage", href: "/settings/billing#usage", icon: Clock },
  { labelKey: "shell.billingLinks.paymentMethods", href: "/settings/billing#payment-methods", icon: Wallet },
  { labelKey: "shell.billingLinks.invoices", href: "/settings/billing#invoices", icon: FileText },
  { labelKey: "shell.billingLinks.teamPlans", href: "/settings/billing#team", icon: Users },
  { labelKey: "shell.billingLinks.upgradeGuide", href: "/pricing#upgrade-guide", icon: CircleHelp }
] as const;

const trialLinks = [
  { labelKey: "shell.trialLinks.trialUsage", href: "/settings/billing#usage", icon: Clock },
  { labelKey: "shell.trialLinks.aiTrialLog", href: "/settings/privacy-ai", icon: Bot },
  { labelKey: "shell.trialLinks.storageRetention", href: "/settings/storage", icon: HardDrive },
  { labelKey: "shell.trialLinks.accountSecurity", href: "/settings/security", icon: ShieldCheck }
] as const;

const settingsLinks = [
  { labelKey: "shell.settingsLinks.profile", href: "/settings", icon: User },
  { labelKey: "shell.settingsLinks.trialUsage", href: "/settings/billing", icon: CreditCard },
  { labelKey: "shell.settingsLinks.privacyAi", href: "/settings/privacy-ai", icon: Bot },
  { labelKey: "shell.settingsLinks.storage", href: "/settings/storage", icon: HardDrive },
  { labelKey: "shell.settingsLinks.team", href: "/settings/team", icon: Users },
  { labelKey: "shell.settingsLinks.apiKeys", href: "/settings/api-keys", icon: KeyRound },
  { labelKey: "shell.settingsLinks.notifications", href: "/settings/notifications", icon: Bell },
  { labelKey: "shell.settingsLinks.connectedApps", href: "/settings/connected-apps", icon: Plug },
  { labelKey: "shell.settingsLinks.security", href: "/settings/security", icon: ShieldCheck }
] as const;

const adminReviewLinks = [
  { labelKey: "shell.adminReviewLinks.newSubmissions", href: "/admin/review", count: "42", icon: Inbox },
  { labelKey: "shell.adminReviewLinks.needsSecurityReview", href: "/admin/review#security", count: "8", icon: ShieldAlert },
  { labelKey: "shell.adminReviewLinks.aiConsentReview", href: "/admin/review#ai-consent", count: "16", icon: Bot },
  { labelKey: "shell.adminReviewLinks.reportedListings", href: "/admin/review#reported", count: "5", icon: AlertTriangle },
  { labelKey: "shell.adminReviewLinks.updatesPending", href: "/admin/review#updates", count: "11", icon: Upload },
  { labelKey: "shell.adminReviewLinks.rejected", href: "/admin/review#rejected", count: "21", icon: CircleHelp },
  { labelKey: "shell.adminReviewLinks.published", href: "/admin/review#published", count: "1,248", icon: CheckCircle2 }
] as const;

const pdfWorkspaceLinks = [
  { labelKey: "shell.pdfWorkspace.links.workspace", href: "/my-tools", icon: Home, badgeKey: null },
  { labelKey: "shell.pdfWorkspace.links.pdfToolkit", href: "/tools/pdf-toolkit", icon: FileText, badgeKey: null },
  { labelKey: "shell.pdfWorkspace.links.imageTools", href: "/explore/image", icon: ImageIcon, badgeKey: null },
  { labelKey: "shell.pdfWorkspace.links.aiWriting", href: "/explore/ai-developer", icon: PenLine, badgeKey: "common.new" },
  { labelKey: "shell.pdfWorkspace.links.finance", href: "/explore/finance", icon: Wallet, badgeKey: null },
  { labelKey: "shell.pdfWorkspace.links.health", href: "/explore/health", icon: ShieldCheck, badgeKey: null },
  { labelKey: "shell.pdfWorkspace.links.developer", href: "/explore/ai-developer", icon: Code2, badgeKey: null },
  { labelKey: "shell.pdfWorkspace.links.moreTools", href: "/", icon: Grid2X2, badgeKey: null }
] as const;

const pdfRecentOutputs = [
  ["q2Marketing", "merged", "twoMinutes"],
  ["contractDraft", "compressed", "oneHour"],
  ["invoiceMarch", "converted", "yesterday"],
  ["productBrochure", "split", "twoDays"],
  ["researchPaper", "summarized", "threeDays"]
] as const;

function ShellSidebarContent({ active, freeTrialMode, localizedHref, sidebarActiveHref, sidebarVariant }: ShellSidebarContentProps) {
  const t = useTranslations();
  const proPlanFeatures = [
    t("shell.workspace.proPlanFeatures.aiCredits"),
    t("shell.workspace.proPlanFeatures.savedOutputs"),
    t("shell.workspace.proPlanFeatures.workflowRuns")
  ];
  const activeCategoryMissingFromSidebar =
    sidebarActiveHref && !launchCertifiedCategories.some((category) => getCategoryHref(category.label) === sidebarActiveHref);
  const activeCategoryFallbackSlug = activeCategoryMissingFromSidebar ? getExploreCategorySlugFromHref(sidebarActiveHref) : null;
  const activeCategoryFallbackLabel = activeCategoryFallbackSlug ? getCategoryLabelBySlug(activeCategoryFallbackSlug) : undefined;
  const activeCategoryFallbackCount = activeCategoryFallbackLabel ? getLaunchCertifiedToolsByCategory(activeCategoryFallbackLabel).length : 0;

  if (sidebarVariant === "workflows") {
    return (
      <>
        <section className="side-section">
          <p className="side-title">{t("shell.workflow.categoriesTitle")}</p>
          {workflowCategories.map(({ key, count, icon: Icon, href }) => (
            <a className={`side-link ${key === "allWorkflows" ? "is-active" : ""}`} href={localizedHref(href)} key={key}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} aria-hidden="true" />
                {t(`shell.workflow.categories.${key}`)}
              </span>
              <span className="side-count">{count.toLocaleString()}</span>
            </a>
          ))}
        </section>
        <section className="side-section">
          <p className="side-title">{t("shell.commonSidebars.filters")}</p>
          {workflowFilters.map((key) => (
            <label className="filter-check" key={key}>
              <input type="checkbox" />
              <span>{t(`shell.workflow.filters.${key}`)}</span>
            </label>
          ))}
        </section>
        <button disabled className="button button-outline-neutral workflow-clear-button" type="button">
          {t("shell.commonSidebars.clearFilters")}
        </button>
      </>
    );
  }

  if (sidebarVariant === "collections") {
    return (
      <>
        <section className="side-section">
          <p className="side-title">{t("shell.collections.categoriesTitle")}</p>
          {collectionCategories.map(({ key, count, icon: Icon, href }) => (
            <a className={`side-link ${key === "featured" ? "is-active" : ""}`} href={localizedHref(href)} key={key}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} aria-hidden="true" />
                {t(`shell.collections.categories.${key}`)}
              </span>
              <span className="side-count">{count.toLocaleString()}</span>
            </a>
          ))}
        </section>
        <section className="side-section">
          <p className="side-title">{t("shell.commonSidebars.filters")}</p>
          {collectionFilters.map((key) => (
            <label className="filter-check" key={key}>
              <input type="checkbox" />
              <span>{t(`shell.collections.filters.${key}`)}</span>
            </label>
          ))}
        </section>
        <section className="panel">
          <h3>
            <ShieldCheck size={16} aria-hidden="true" /> {t("shell.collections.trustTitle")}
          </h3>
          <p className="tool-description">{t("shell.collections.trustDescription")}</p>
        </section>
      </>
    );
  }

  if (sidebarVariant === "billing") {
    if (freeTrialMode) {
      return (
        <>
          <section className="side-section">
            <p className="side-title">{t("shell.billing.freeTrialTitle")}</p>
            {trialLinks.map(({ labelKey, href, icon: Icon }, index) => (
              <a className={`side-link ${index === 0 ? "is-active" : ""}`} href={localizedHref(href)} key={labelKey}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon size={14} aria-hidden="true" />
                  {t(labelKey)}
                </span>
              </a>
            ))}
          </section>
          <section className="panel workspace-upgrade-card">
            <h3>
              <Sparkles size={16} aria-hidden="true" /> {t("shell.billing.freeTrialModeTitle")}
            </h3>
            <p className="tool-description">{t("shell.billing.freeTrialModeDescription")}</p>
          </section>
          <section className="panel">
            <h3>
              <ShieldCheck size={16} aria-hidden="true" /> {t("shell.billing.freeBetaTrialTitle")}
            </h3>
            <p className="tool-description">{t("shell.billing.freeBetaTrialDescription")}</p>
          </section>
        </>
      );
    }

    return (
      <>
        <section className="side-section">
          <p className="side-title">{t("shell.billing.title")}</p>
          {billingLinks.slice(0, 4).map(({ labelKey, href, icon: Icon }, index) => (
            <a className={`side-link ${index === 0 ? "is-active" : ""}`} href={localizedHref(href)} key={labelKey}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} aria-hidden="true" />
                {t(labelKey)}
              </span>
            </a>
          ))}
        </section>
        <section className="side-section">
          <p className="side-title">{t("shell.billing.workspaceTitle")}</p>
          {billingLinks.slice(4).map(({ labelKey, href, icon: Icon }) => (
            <a className="side-link" href={localizedHref(href)} key={labelKey}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} aria-hidden="true" />
                {t(labelKey)}
              </span>
            </a>
          ))}
        </section>
        <section className="panel workspace-upgrade-card">
          <h3>
            <GraduationCap size={16} aria-hidden="true" /> {t("shell.billing.educationTitle")}
          </h3>
          <p className="tool-description">{t("shell.billing.educationDescription")}</p>
          <a className="text-link" href={localizedHref("/pricing#education")}>
            {t("shell.billing.verifyNow")}
          </a>
        </section>
        <section className="panel">
          <h3>
            <Headphones size={16} aria-hidden="true" /> {t("shell.billing.helpChoosingTitle")}
          </h3>
          <p className="tool-description">{t("shell.billing.helpChoosingDescription")}</p>
          <a className="text-link" href={localizedHref("/pricing#faq")}>
            {t("shell.billing.contactSupport")}
          </a>
        </section>
        <section className="panel">
          <h3>
            <ShieldCheck size={16} aria-hidden="true" /> {t("shell.billing.moneyBackTitle")}
          </h3>
          <p className="tool-description">{t("shell.billing.moneyBackDescription")}</p>
        </section>
      </>
    );
  }

  if (sidebarVariant === "settings") {
    return (
      <>
        <section className="side-section">
          <p className="side-title">{t("shell.settings.title")}</p>
          {settingsLinks.map(({ labelKey, href, icon: Icon }, index) => (
            <a
              aria-current={(sidebarActiveHref ? href === sidebarActiveHref : index === 0) ? "page" : undefined}
              className={`side-link ${(sidebarActiveHref ? href === sidebarActiveHref : index === 0) ? "is-active" : ""}`}
              href={localizedHref(href)}
              key={labelKey}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} aria-hidden="true" />
                {t(labelKey)}
              </span>
            </a>
          ))}
        </section>
        <section className="panel">
          <h3>
            <Box size={16} aria-hidden="true" /> {t("shell.settings.helpTitle")}
          </h3>
          <p className="tool-description">{t("shell.settings.helpDescription")}</p>
          <a className="text-link" href={localizedHref("/settings#support")}>
            {t("shell.settings.helpLink")}
          </a>
        </section>
      </>
    );
  }

  if (sidebarVariant === "admin") {
    return (
      <>
        <section className="side-section">
          <p className="side-title">{t("shell.admin.reviewQueuesTitle")}</p>
          {adminReviewLinks.map(({ labelKey, href, count, icon: Icon }, index) => (
            <a className={`side-link ${index === 0 ? "is-active" : ""}`} href={localizedHref(href)} key={labelKey}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} aria-hidden="true" />
                {t(labelKey)}
              </span>
              <span className="side-count">{count}</span>
            </a>
          ))}
        </section>
        <section className="side-section">
          <p className="side-title">{t("shell.commonSidebars.filters")}</p>
          {["ai", "traditional", "local", "cloud", "aiConsentRequired"].map((key, index) => (
            <label className="filter-check" key={key}>
              <input defaultChecked={index === 0} type="checkbox" />
              <span>{t(`shell.admin.filters.${key}`)}</span>
            </label>
          ))}
        </section>
        <section className="panel">
          <h3>
            <ListChecks size={16} aria-hidden="true" /> {t("shell.admin.slaTitle")}
          </h3>
          <p className="tool-description">{t("shell.admin.slaDescription")}</p>
          <a className="text-link" href={localizedHref("/admin/review#reports")}>
            {t("shell.admin.viewReport")}
          </a>
        </section>
      </>
    );
  }

  if (sidebarVariant === "pdf-workspace") {
    return (
      <>
        <section className="side-section pdf-workspace-menu">
          {pdfWorkspaceLinks.map(({ labelKey, href, icon: Icon, badgeKey }) => (
            <a
              aria-current={labelKey === "shell.pdfWorkspace.links.pdfToolkit" ? "page" : undefined}
              className={`side-link ${labelKey === "shell.pdfWorkspace.links.pdfToolkit" ? "is-active" : ""}`}
              href={localizedHref(href)}
              key={labelKey}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <Icon size={16} aria-hidden="true" />
                {t(labelKey)}
              </span>
              {badgeKey ? <span className="badge local">{t(badgeKey)}</span> : null}
            </a>
          ))}
        </section>
        <section className="side-section pdf-recent-outputs">
          <div className="side-section-head">
            <p className="side-title">{t("shell.pdfWorkspace.recentOutputs.title")}</p>
            <a href={localizedHref("/my-tools#recent")}>{t("common.viewAll")}</a>
          </div>
          {pdfRecentOutputs.map(([key, metaKey, timeKey]) => (
            <a className="pdf-recent-output" href={localizedHref("/my-tools#recent")} key={key}>
              <span className="pdf-mini-file">PDF</span>
              <span>
                <strong>{t(`shell.pdfWorkspace.recentOutputs.files.${key}`)}</strong>
                <small>{t(`shell.pdfWorkspace.recentOutputs.meta.${metaKey}`)}</small>
              </span>
              <small>{t(`shell.pdfWorkspace.recentOutputs.time.${timeKey}`)}</small>
            </a>
          ))}
        </section>
        <section className="panel pdf-plan-card">
          <div className="side-section-head">
            <strong>{freeTrialMode ? t("shell.pdfWorkspace.plan.trialUsage") : t("shell.pdfWorkspace.plan.freePlan")}</strong>
            {freeTrialMode ? <span className="badge local">{t("common.beta")}</span> : <a href={localizedHref("/pricing")}>{t("common.upgrade")}</a>}
          </div>
          <div className="workspace-meter" aria-label={t("shell.aria.pdfWorkspaceStorage")}>
            <span style={{ width: "42%" }} />
          </div>
          <div className="filter-row">
            <span>{t("shell.pdfWorkspace.plan.storageUsed")}</span>
            <span className="side-count">42%</span>
          </div>
          <div className="filter-row">
            <span>{t("shell.pdfWorkspace.plan.localPdfTools")}</span>
            <span className="side-count">{t("common.unlimited")}</span>
          </div>
          <div className="filter-row">
            <span>{freeTrialMode ? t("shell.pdfWorkspace.plan.aiTrialCredits") : t("shell.pdfWorkspace.plan.aiToolsMonthly")}</span>
            <span className="side-count">{freeTrialMode ? "1,250 / 2,000" : "10 / 20"}</span>
          </div>
          <div className="filter-row">
            <span>{t("shell.pdfWorkspace.plan.storage")}</span>
            <span className="side-count">{t("shell.pdfWorkspace.plan.storageQuota")}</span>
          </div>
        </section>
      </>
    );
  }

  if (sidebarVariant === "workspace") {
    return (
      <>
        <section className="side-section">
          <p className="side-title">{t("shell.workspace.title")}</p>
          {workspaceLinks.map(({ labelKey, href, icon: Icon }, index) => (
            <a className={`side-link ${index === 0 ? "is-active" : ""}`} href={localizedHref(href)} key={labelKey}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} aria-hidden="true" />
                {t(labelKey)}
              </span>
            </a>
          ))}
        </section>
        {freeTrialMode ? (
          <section className="panel workspace-upgrade-card">
            <h3>
              <Sparkles size={16} aria-hidden="true" /> {t("shell.workspace.freeTrialTitle")}
            </h3>
            <p className="tool-description">{t("shell.workspace.freeTrialDescription")}</p>
            <span className="badge local">{t("shell.billing.freeTrialModeTitle")}</span>
          </section>
        ) : (
          <section className="panel workspace-upgrade-card">
            <h3>
              <Sparkles size={16} aria-hidden="true" /> {t("shell.workspace.goProTitle")}
            </h3>
            <p className="tool-description">{t("shell.workspace.goProDescription")}</p>
            <CoreActionModalButton
              className="button button-solid"
              kind="upgrade"
              planFeatures={proPlanFeatures}
              planName={t("shell.workspace.proPlanName")}
              planPrice={t("shell.workspace.proPlanPrice")}
            >
              {t("shell.workspace.upgradeToPro")}
            </CoreActionModalButton>
          </section>
        )}
        <section className="side-section">
          <p className="side-title">{t("shell.workspace.storageTitle")}</p>
          <div className="workspace-meter" aria-label={t("shell.aria.storage")}>
            <span style={{ width: "24%" }} />
          </div>
          <p className="tool-description">{t("shell.workspace.storageUsed")}</p>
        </section>
        <section className="side-section">
          <p className="side-title">{t("shell.workspace.aiCreditsTitle")}</p>
          <div className="workspace-meter" aria-label={t("shell.aria.aiCredits")}>
            <span style={{ width: "62%" }} />
          </div>
          <p className="tool-description">{t("shell.workspace.aiCreditsUsed")}</p>
        </section>
      </>
    );
  }

  if (sidebarVariant === "none") {
    return null;
  }

  return (
    <>
      <section className="side-section">
        <p className="side-title">{t("shell.sidebar.categories")}</p>
        {launchCertifiedCategories.map((category) => {
          const key = getCategoryActiveKey(category.label);
          const href = getCategoryHref(category.label);
          const Icon = getCategoryIcon(category.label);
          const displayLabel = t(`shell.toolCategories.${category.slug}`);

          return (
            <a
              aria-current={(sidebarActiveHref ? href === sidebarActiveHref : active === key) ? "page" : undefined}
              className={`side-link ${(sidebarActiveHref ? href === sidebarActiveHref : active === key) ? "is-active" : ""}`}
              href={localizedHref(href)}
              key={category.label}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={14} aria-hidden="true" />
                {displayLabel}
              </span>
              <span className="side-count">{category.count.toLocaleString()}</span>
            </a>
          );
        })}
        {activeCategoryFallbackSlug && activeCategoryFallbackLabel && sidebarActiveHref ? (
          <a aria-current="page" className="side-link is-active" href={localizedHref(sidebarActiveHref)}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {(() => {
                const Icon = getCategoryIcon(activeCategoryFallbackLabel);
                return <Icon size={14} aria-hidden="true" />;
              })()}
              {t(`shell.toolCategories.${activeCategoryFallbackSlug}`)}
            </span>
            <span className="side-count">{activeCategoryFallbackCount.toLocaleString()}</span>
          </a>
        ) : null}
      </section>
      <section className="panel">
        <h3>
          <ShieldCheck size={16} aria-hidden="true" /> {t("shell.sidebar.localFirstTitle")}
        </h3>
        <p className="tool-description">{t("shell.sidebar.localFirstDescription")}</p>
      </section>
    </>
  );
}

export function ToolarsShell({
  active = "explore",
  sidebarActiveHref,
  sidebarVariant = "tools",
  children
}: ToolarsShellProps) {
  const freeTrialMode = isFreeTrialMode();
  const t = useTranslations();
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizeShellHref(href, localeCode);
  const visibleNav = active === "admin" ? adminNav : active === "pricing" && !freeTrialMode ? [...nav, { labelKey: "nav.pricing", href: "/pricing", key: "pricing" }] : nav;
  const brandName = active === "admin" ? t("shell.brand.adminName") : t("shell.brand.name");
  const brandAriaLabel = active === "admin" ? t("shell.brand.adminHomeAria") : t("shell.brand.homeAria");
  const sidebarLabel =
    sidebarVariant === "pdf-workspace"
      ? t("shell.sidebarLabels.pdfWorkspace")
      : sidebarVariant === "workspace"
      ? t("shell.sidebarLabels.workspace")
      : sidebarVariant === "billing"
        ? freeTrialMode
          ? t("shell.sidebarLabels.trial")
          : t("shell.sidebarLabels.billing")
        : sidebarVariant === "settings"
          ? t("shell.sidebarLabels.settings")
          : sidebarVariant === "admin"
            ? t("shell.sidebarLabels.adminReview")
            : t("shell.sidebarLabels.toolFilters");

  return (
    <div className="app-shell">
      <header
        className={`topbar ${sidebarVariant === "pdf-workspace" ? "pdf-workspace-topbar" : ""}`}
        data-desktop-layout={sidebarVariant === "pdf-workspace" ? "pdf-workspace-v2" : undefined}
        data-mobile-layout="brand-menu-command-compact-v2"
      >
        <a className="brand" href={localizedHref(active === "admin" ? "/admin/review" : "/")} aria-label={brandAriaLabel}>
          <span>
            <ToolarsLogoMark label={brandName} />
            <span className="brand-tagline">{t("common.tagline")}</span>
          </span>
        </a>
        {sidebarVariant === "pdf-workspace" ? (
          <div className="workspace-breadcrumb" aria-label={t("shell.pdfWorkspace.breadcrumbLabel")}>
            <span>{t("shell.pdfWorkspace.tools")}</span>
            <span aria-hidden="true">/</span>
            <strong>{t("shell.pdfWorkspace.toolkit")}</strong>
          </div>
        ) : null}
        <CommandCenter />
        {sidebarVariant === "pdf-workspace" ? (
          <nav className="nav workspace-topbar-actions" aria-label={t("shell.pdfWorkspace.actionsLabel")}>
            <button disabled className="button button-outline-neutral" type="button">
              <Save size={16} aria-hidden="true" /> {t("common.save")}
            </button>
            <button disabled className="button button-outline-neutral" type="button">
              <Share2 size={16} aria-hidden="true" /> {t("common.share")}
            </button>
            <span className="topbar-actions-cluster" data-topbar-actions="account-language-v3">
              <ToolarsAccountActions />
              <LanguageSwitcher />
            </span>
            <MobileLanguageMenu
              active={active}
              label={t("common.menu")}
              localizedHref={localizedHref}
              sidebarActiveHref={sidebarActiveHref}
            />
            <button disabled aria-label={t("shell.pdfWorkspace.appearanceLabel")} className="button pdf-appearance-button" type="button">
              <Sun size={17} aria-hidden="true" />
            </button>
          </nav>
        ) : (
          <nav className="nav" aria-label={t("shell.aria.primaryNavigation")}>
            {visibleNav.map((item) => {
              const isActive = active === item.key || (item.key === "explore" && ["pdf", "ai-developer"].includes(active));
              return (
                <a
                  aria-current={isActive ? "page" : undefined}
                  className={`topbar-nav-link ${isActive ? "is-active" : ""}`}
                  href={localizedHref(item.href)}
                  key={item.key}
                >
                  {t(item.labelKey)}
                </a>
              );
            })}
            {active === "admin" ? (
              <button disabled className="button button-solid" type="button">
                {t("nav.admin")}
              </button>
            ) : (
              <span className="topbar-actions-cluster" data-topbar-actions="account-language-v3">
                {isFeatureEnabled("submit") ? (
                  <a className="topbar-submit-link" href={localizedHref("/submit")}>
                    <Plus size={15} aria-hidden="true" /> {t("nav.submitTool")}
                  </a>
                ) : null}
                <ToolarsAccountActions />
                <LanguageSwitcher />
              </span>
            )}
            <MobileLanguageMenu
              active={active}
              label={t("common.menu")}
              localizedHref={localizedHref}
              showCategories={sidebarVariant === "tools"}
              sidebarActiveHref={sidebarActiveHref}
            />
          </nav>
        )}
      </header>
      <div className={`shell-grid ${sidebarVariant === "none" ? "shell-grid-full" : ""}`} data-shell-layout={sidebarVariant === "pdf-workspace" ? "pdf-workspace-v2" : undefined}>
        {sidebarVariant === "none" ? null : (
          <aside className={`sidebar ${sidebarVariant === "pdf-workspace" ? "pdf-workspace-sidebar" : ""}`} aria-label={sidebarLabel}>
            <ShellSidebarContent
              active={active}
              freeTrialMode={freeTrialMode}
              localizedHref={localizedHref}
              sidebarActiveHref={sidebarActiveHref}
              sidebarVariant={sidebarVariant}
            />
          </aside>
        )}
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function localizeShellHref(href: string, locale: LocaleCode) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  return localizePath(href, locale);
}
