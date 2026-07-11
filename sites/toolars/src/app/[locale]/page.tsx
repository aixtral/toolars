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
  Mic,
  Monitor,
  Network,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Workflow
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { ResourceCard } from "@/components/tools/resource-card";
import { ToolCard } from "@/components/tools/tool-card";
import { getAllArticlesSync as getAllArticles } from "@/data/blog";
import { aiDeveloperLabTools, launchCertifiedTools, workflows } from "@/data/registry";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { buildGraph, buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo/json-ld";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

const homeQuickTasks = [
  { key: "compressImage", href: "/tools/pdf-toolkit", icon: ImageIcon, tone: "green" },
  { key: "summarizePdf", href: "/workflows/pdf-summary", icon: FileText, tone: "red" },
  { key: "writeEmail", href: "/tools/json-repair", icon: Mail, tone: "blue" },
  { key: "calculateLoan", href: "/tools/loan-calculator", icon: Calculator, tone: "orange" }
] as const;

const homeContinueItems = [
  { key: "imageCompressor", icon: ImageIcon, tone: "green" },
  { key: "pdfSummary", icon: FileText, tone: "red" }
] as const;

const homePicks = [
  {
    key: "aiResearchSummarizer",
    href: "/tools/prompt-injection-scanner",
    icon: FileText,
    tone: "green",
    badges: ["ai", "free"]
  },
  {
    key: "pdfToolkit",
    href: "/tools/pdf-toolkit",
    icon: FileText,
    tone: "red",
    badges: ["traditional", "free"]
  },
  {
    key: "imageCleaner",
    href: "/tools/json-repair",
    icon: ImageIcon,
    tone: "blue",
    badges: ["ai", "freemium"]
  }
] as const;

const homeCategories = [
  { key: "ai", href: "/explore/ai-developer", icon: Sparkles },
  { key: "pdf", href: "/explore/pdf", icon: FileText },
  { key: "image", href: "/tools/pdf-toolkit", icon: ImageIcon },
  { key: "writing", href: "/tools/json-repair", icon: PenLine },
  { key: "code", href: "/explore/ai-developer", icon: Code2 },
  { key: "finance", href: "/tools/loan-calculator", icon: Calculator },
  { key: "health", href: "/tools/bmi-calculator", icon: Heart },
  { key: "data", href: "/tools/json-repair", icon: BarChart3 }
] as const;

const homeWorkflowRows = [
  { key: "pdfSummary", href: "/workflows/pdf-summary", icon: FileText, tone: "green" },
  { key: "csvChart", href: "/workflows/llm-cost-review", icon: BarChart3, tone: "purple" },
  { key: "socialImage", href: "/workflows/mcp-tool-launch", icon: ImageIcon, tone: "blue" }
] as const;

const homeWorkflowIcons = {
  "pdf-summary": FileText,
  "ai-prompt-hardening": ShieldCheck,
  "llm-cost-review": Calculator,
  "mcp-tool-launch": Network
} as const;

const homeTabs = [
  { key: "explore", href: "/", icon: Compass, active: true },
  { key: "workflows", href: "/workflows", icon: Network, active: false },
  { key: "collections", href: "/collections", icon: Heart, active: false },
  { key: "myTools", href: "/my-tools", icon: BriefcaseBusiness, active: false }
] as const;

const homeBadgeClassNames = {
  ai: "badge local",
  traditional: "badge cloud",
  free: "badge local",
  freemium: "badge warn"
} as const;

type HomeWorkflowCopy = {
  title: string;
  description: string;
};

type HomeWorkflowCopyMap = {
  [slug: string]: HomeWorkflowCopy;
};

function getHomeWorkflowCopy(
  workflow: (typeof workflows)[number],
  messages: HomeWorkflowCopyMap
): HomeWorkflowCopy {
  return messages[workflow.slug] ?? {
    title: workflow.title,
    description: workflow.description
  };
}

function getHomeWorkflowIcon(slug: string) {
  return homeWorkflowIcons[slug as keyof typeof homeWorkflowIcons] ?? Workflow;
}

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => {
    return localizeHomeHref(href, localeCode);
  };
  const popularTools = launchCertifiedTools.filter((tool) => {
    return ["json-repair", "mortgage-calculator", "llm-cost-calculator", "pdf-toolkit", "prompt-injection-scanner", "mcp-server-builder"].includes(tool.slug);
  });
  const workflowMessages = t.raw("workflowsPage.workflowCards") as HomeWorkflowCopyMap;
  const articles = getAllArticles(localeCode);

  const baseUrl = getSiteBaseUrl();
  const siteSchema = buildGraph(buildOrganizationSchema(baseUrl), buildWebSiteSchema(baseUrl));

  return (
    <>
      <JsonLd schema={siteSchema} />
      <ToolarsShell active="explore">
      <MobileHomeApp />
      <div className="page-grid home-desktop-layout" data-home-desktop-layout="marketplace-v2">
        <div>
          <section className="section">
            <h1 className="title">{t("home.heroDesktop.title")}</h1>
            <p className="subtitle">{t("home.heroDesktop.subtitle")}</p>
            <div className="search-panel">
              <div className="hero-input">
                <Sparkles size={18} aria-hidden="true" />
                <span>{t("home.heroDesktop.inputLabel")}</span>
                <a className="open-link" href={localizedHref("/explore/pdf")} aria-label={t("home.aria.search")}>
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
              <div className="chip-row">
                <span className="chip active">{t("home.chips.traditionalTools")}</span>
                <span className="chip">{t("home.chips.aiTools")}</span>
                <span className="chip">{t("home.chips.workflows")}</span>
                <span className="chip">{t("home.chips.localFirst")}</span>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="home-section-head">
              <h2>{t("home.sections.toolarsPicks")} <span className="badge local">{t("home.badges.verifiedByToolars")}</span></h2>
              <a className="text-link" href={localizedHref("/collections")}>
                {t("home.actions.viewAllPicks")} <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="home-desktop-pick-grid">
              {homePicks.map(({ key, href, icon: Icon, tone, badges }) => {
                const title = t(`home.picks.${key}.title`);
                const description = t(`home.picks.${key}.description`);

                return (
                  <a className="home-desktop-pick-card" data-tone={tone} href={localizedHref(href)} key={key}>
                    <span>
                      <strong>{title}</strong>
                      <small>{description}</small>
                      <em>{t(`home.badges.${badges[0]}`)}</em>
                    </span>
                    <span className="home-desktop-pick-art">
                      <Icon size={48} aria-hidden="true" />
                    </span>
                    <span className="home-desktop-pick-footer">
                      {badges.map((badge) => (
                        <span className="chip" key={badge}>{t(`home.badges.${badge}`)}</span>
                      ))}
                      <span className="badge local">{badges.some((badge) => badge === "freemium") ? t("home.badges.freemium") : t("home.badges.free")}</span>
                      <span className="button button-solid">{t("home.actions.open")}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="section">
            <h2>{t("home.sections.popularTools")}</h2>
            <div className="tool-grid">
              {popularTools.map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>

          <section className="section">
            <h2>{t("home.sections.aiDeveloperLab")}</h2>
            <p className="subtitle">{t("home.aiDeveloperLab.subtitle")}</p>
            <div className="tool-grid" style={{ marginTop: 14 }}>
              {aiDeveloperLabTools.slice(0, 6).map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="right-rail">
          <section className="panel">
            <h2>{t("home.sections.popularWorkflows")}</h2>
            <div className="resource-list">
              {workflows.map((workflow) => {
                const copy = getHomeWorkflowCopy(workflow, workflowMessages);
                const Icon = getHomeWorkflowIcon(workflow.slug);

                return (
                  <ResourceCard
                    description={copy.description}
                    href={localizedHref(workflow.href)}
                    icon={<Icon size={20} aria-hidden="true" />}
                    key={workflow.slug}
                    meta={t("home.units.minutesShort", { minutes: workflow.estimatedMinutes })}
                    title={copy.title}
                  />
                );
              })}
            </div>
          </section>
          <section className="panel">
            <h2>{t("home.curated.title")}</h2>
            <ResourceCard
              description={t("home.curated.subtitle")}
              href={localizedHref("/collections")}
              icon={<ShieldCheck size={20} aria-hidden="true" />}
              title={t("home.curated.qualityReview")}
            />
          </section>
          <section className="panel">
            <h2>{t("home.sections.startFast")}</h2>
            <div className="resource-list">
              <ResourceCard description={t("home.startFast.pdfToolsDescription")} href={localizedHref("/explore/pdf")} icon={<FileText size={20} aria-hidden="true" />} title={t("home.startFast.pdfToolsTitle")} />
              <ResourceCard description={t("home.startFast.jsonRepairDescription")} href={localizedHref("/tools/json-repair")} icon={<FileJson size={20} aria-hidden="true" />} title={t("home.startFast.jsonRepairTitle")} />
            </div>
          </section>
          <section className="panel">
            <h2>{t("home.sections.fromTheBlog")}</h2>
            <div className="resource-list">
              {articles.slice(0, 3).map((article) => (
                <ResourceCard
                  description={article.description}
                  href={localizedHref(`/blog/${article.slug}`)}
                  icon={<FileText size={20} aria-hidden="true" />}
                  key={article.slug}
                  meta={t("home.units.minutesShort", { minutes: article.readTimeMinutes })}
                  title={article.title}
                />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </ToolarsShell>
    </>
  );
}

function MobileHomeApp() {
  const t = useTranslations();
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => {
    return localizeHomeHref(href, localeCode);
  };
  return (
    <div className="home-mobile-app" data-home-asset-parity="icon-font-v5" data-home-mobile-layout="explore-app">
      <main className="home-mobile-main">
        <section className="home-mobile-hero">
          <h1>{t("home.heroMobile.title")}</h1>
          <p>{t("home.heroMobile.subtitle")}</p>
          <a className="home-mobile-search" href={localizedHref("/explore/pdf")}>
            <Search size={26} aria-hidden="true" />
            <span>{t("home.heroMobile.placeholder")}</span>
            <Mic size={24} aria-hidden="true" />
            <span className="home-mobile-search-go">
              <ArrowRight size={22} aria-hidden="true" />
            </span>
          </a>
          <div className="home-mobile-quick-row" aria-label={t("home.aria.suggestedTasks")}>
            {homeQuickTasks.map(({ key, href, icon: Icon, tone }) => {
              const label = t(`home.quickTasks.${key}`);

              return (
                <a className="home-mobile-quick-chip" data-tone={tone} href={localizedHref(href)} key={key}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                </a>
              );
            })}
          </div>
          <div className="home-mobile-segmented" role="group" aria-label={t("home.aria.toolType")}>
            <button disabled aria-pressed="true" type="button">
              <Monitor size={18} aria-hidden="true" /> {t("home.toolTypes.traditional")}
            </button>
            <button disabled aria-pressed="false" type="button">
              <Sparkles size={18} aria-hidden="true" /> {t("home.toolTypes.ai")}
            </button>
            <button disabled aria-pressed="false" type="button">
              <Workflow size={18} aria-hidden="true" /> {t("home.toolTypes.workflow")}
            </button>
          </div>
        </section>

        <section className="home-mobile-section">
          <div className="home-mobile-section-head">
            <h2>{t("home.sections.continue")}</h2>
            <a href={localizedHref("/my-tools")}>
              {t("home.actions.viewAll")} <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="home-mobile-list-card">
            {homeContinueItems.map(({ key, icon: Icon, tone }) => (
              <a className="home-mobile-continue-row" href={localizedHref("/my-tools")} key={key}>
                <span className="home-mobile-soft-icon" data-tone={tone}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span>
                  <strong>{t(`home.continueItems.${key}.title`)}</strong>
                  <small>{t(`home.continueItems.${key}.detail`)}</small>
                </span>
                <em>{t(`home.continueItems.${key}.meta`)}</em>
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="home-mobile-section">
          <div className="home-mobile-section-head">
            <h2>{t("home.sections.toolarsPicks")}</h2>
            <a href={localizedHref("/explore/pdf")}>
              {t("home.actions.seeAll")} <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="home-mobile-pick-list">
            {homePicks.map(({ key, href, icon: Icon, tone, badges }) => {
              const title = t(`home.picks.${key}.title`);
              const description = t(`home.picks.${key}.description`);

              return (
                <a className="home-mobile-pick-row" href={localizedHref(href)} key={key}>
                  <span className="home-mobile-pick-icon" data-tone={tone}>
                    <Icon size={36} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                  <span className="home-mobile-pick-badges">
                    {badges.map((badge) => (
                      <span className={homeBadgeClassNames[badge]} key={badge}>
                        {t(`home.badges.${badge}`)}
                      </span>
                    ))}
                  </span>
                  <span className="home-mobile-open">{t("home.actions.open")}</span>
                </a>
              );
            })}
          </div>
        </section>

        <nav className="home-mobile-category-rail" aria-label={t("home.aria.homeCategories")}>
          {homeCategories.map(({ key, href, icon: Icon }) => (
            <a href={localizedHref(href)} key={key}>
              <span>
                <Icon size={26} aria-hidden="true" />
              </span>
              {t(`home.categories.${key}`)}
            </a>
          ))}
        </nav>

        <section className="home-mobile-section">
          <div className="home-mobile-section-head">
            <h2>{t("home.sections.popularWorkflows")}</h2>
            <a href={localizedHref("/workflows")}>
              {t("home.actions.seeAll")} <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="home-mobile-list-card">
            {homeWorkflowRows.map(({ key, href, icon: Icon, tone }) => (
              <a className="home-mobile-workflow-row" href={localizedHref(href)} key={key}>
                <span className="home-mobile-soft-icon" data-tone={tone}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span>
                  <strong>{t(`home.workflowRows.${key}.title`)}</strong>
                  <small>{t(`home.workflowRows.${key}.detail`)}</small>
                </span>
                <em>
                  <Flame size={11} aria-hidden="true" /> {t(`home.workflowRows.${key}.heat`)}
                </em>
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <div className="home-mobile-trust-strip" aria-label={t("home.aria.trustNotes")}>
          <span>
            <ShieldCheck size={18} aria-hidden="true" /> {t("home.trust.localWhenPossible")}
          </span>
          <span>
            <Lock size={18} aria-hidden="true" /> {t("home.trust.noSignInForBasics")}
          </span>
          <span>
            <Tag size={18} aria-hidden="true" /> {t("home.trust.aiClearlyLabeled")}
          </span>
        </div>
      </main>

      <nav className="home-mobile-bottom-tabs" aria-label={t("home.aria.mobileHomeTabs")}>
        {homeTabs.map(({ key, href, icon: Icon, active }) => (
          <a aria-current={active ? "page" : undefined} href={localizedHref(href)} key={key}>
            <Icon size={25} aria-hidden="true" />
            <span>{t(`home.tabs.${key}`)}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

function localizeHomeHref(href: string, locale: LocaleCode) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  return localizePath(href, locale);
}
