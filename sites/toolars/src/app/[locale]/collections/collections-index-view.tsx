import { ArrowRight, Bookmark, FileText, FolderPlus, Globe2, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BookmarkImportModalButton, LocalDraftModalButton } from "@/components/core/local-draft-modal-button";
import { ToolIcon } from "@/components/tools/tool-icon";
import { collections, getToolBySlug, type CollectionDefinition, type ToolDefinition } from "@/data/registry";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const featuredCollectionSlugs = ["pdf-ops-kit", "ai-developer-lab"];
const mobileCollectionSlugs = featuredCollectionSlugs;
const collectionCopyKeys = {
  "pdf-ops-kit": "pdfOpsKit",
  "ai-developer-lab": "aiDeveloperLab"
} as const;

const mobileCollectionUpdatedKeys = {
  "pdf-ops-kit": "today",
  "ai-developer-lab": "twoHoursAgo"
} as const;

type CollectionCopyKey = (typeof collectionCopyKeys)[keyof typeof collectionCopyKeys];
type CollectionsTranslator = ReturnType<typeof useTranslations>;
type ToolPreview = ToolDefinition;
type UpdatedKey = "today" | "twoHoursAgo" | "threeHoursAgo" | "yesterday";

function collectionTone(collection: CollectionDefinition): string {
  if (collection.slug.includes("pdf")) return "rose";
  if (collection.slug.includes("ai")) return "purple";
  return "blue";
}

function getCollectionCopyKey(collection: CollectionDefinition): CollectionCopyKey {
  return collectionCopyKeys[collection.slug as keyof typeof collectionCopyKeys] ?? "pdfOpsKit";
}

function collectionSummary(collection: CollectionDefinition, t: CollectionsTranslator): string {
  const toolCount = collection.toolSlugs.length;
  const workflowCount = collection.workflowSlugs.length;
  const aiCount = collection.toolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((tool) => tool?.processing.includes("ai-consent")).length;

  return t("collectionSummary", { toolCount, workflowCount, aiCount });
}

function getCollectionIcon(collection: CollectionDefinition) {
  if (collection.slug.includes("pdf")) return FileText;
  if (collection.slug.includes("ai")) return Sparkles;
  return FolderPlus;
}

function updatedLabel(t: CollectionsTranslator, updatedKey: UpdatedKey): string {
  if (updatedKey === "today") return t("updatedToday");
  if (updatedKey === "twoHoursAgo") return t("updatedHoursAgo", { hours: 2 });
  if (updatedKey === "threeHoursAgo") return t("updatedHoursAgo", { hours: 3 });
  return t("updatedYesterday");
}

function getFeaturedCollection(slug: string) {
  return collections.find(function isMatchingCollection(collection) {
    return collection.slug === slug;
  });
}

function isCollectionDefinition(collection: CollectionDefinition | undefined): collection is CollectionDefinition {
  return Boolean(collection);
}

function isToolPreview(tool: ReturnType<typeof getToolBySlug>): tool is ToolPreview {
  return Boolean(tool);
}

function CollectionCard({ collection, featured = false, localizedHref }: { collection: CollectionDefinition; featured?: boolean; localizedHref: (href: string) => string }) {
  const t = useTranslations("collectionsPage");
  const tone = collectionTone(collection);
  const Icon = getCollectionIcon(collection);
  const copyKey = getCollectionCopyKey(collection);
  const title = t(`registryCollections.${copyKey}.title`);
  const description = t(`registryCollections.${copyKey}.description`);
  const previewTools = collection.toolSlugs.map(getToolBySlug).filter(isToolPreview).slice(0, 4);

  return (
    <a className={`collection-index-card ${featured ? "is-featured" : ""}`} href={localizedHref(collection.href)}>
      <span className={`icon-tile ${tone}`} data-collection-card-icon={collection.slug}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className="collection-preview-icons" aria-label={t("previewToolsAriaLabel", { title })}>
        {previewTools.map((tool) => (
          <span className="collection-preview-icon" key={tool.slug}>
            <ToolIcon tool={tool} />
          </span>
        ))}
      </span>
      <span className="tag-list">
        <span className="badge workflow">{t(`visibility.${collection.visibility}`)}</span>
        <span className="badge">{collectionSummary(collection, t)}</span>
      </span>
      <span className="collection-card-footer">
        <span className="badge local">{t("curatedBy", { curator: collection.curator })}</span>
        <span className="open-link">
          {t("openWorkflow")} <ArrowRight size={14} aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}

export function CollectionsIndexView() {
  const t = useTranslations("collectionsPage");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const featuredCollections = featuredCollectionSlugs.map(getFeaturedCollection).filter(isCollectionDefinition);
  const mobileCollections = mobileCollectionSlugs.map(getFeaturedCollection).filter(isCollectionDefinition);
  const aiDeveloperCollection = getFeaturedCollection("ai-developer-lab");

  function localizedHref(href: string) {
    return href.startsWith("#") ? href : localizePath(href, localeCode);
  }

  return (
    <div
      className="page-grid collections-index-page"
      data-collections-density="mobile-v2"
      data-collections-index="true"
      data-collections-mobile-layout="directory-cards"
    >
      <div>
        <section className="section landing-hero">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="title collections-title-desktop">{t("heroTitleDesktop")}</h1>
          <h1 className="title collections-title-mobile">{t("heroTitleMobile")}</h1>
          <p className="subtitle collections-copy-desktop">{t("heroCopyDesktop")}</p>
          <p className="subtitle collections-copy-mobile">{t("heroCopyMobile")}</p>
          <LocalDraftModalButton
            className="button button-solid collections-mobile-primary-action"
            draftKind="collection"
            icon={<FolderPlus size={16} aria-hidden="true" />}
            label={t("createPrivate")}
            storageKey="toolars.local-collections:v1"
          />
          <div className="landing-action-row">
            <LocalDraftModalButton
              className="button button-solid"
              draftKind="collection"
              icon={<FolderPlus size={16} aria-hidden="true" />}
              label={t("createCollection")}
              storageKey="toolars.local-collections:v1"
            />
            <BookmarkImportModalButton className="button button-outline-neutral" label={t("importBookmarks")} storageKey="toolars.imported-bookmarks:v1" />
            <a className="button button-outline-neutral" href="#all-collections">
              <Globe2 size={16} aria-hidden="true" /> {t("browsePublic")}
            </a>
          </div>
        </section>

        <section className="collections-mobile-stack" aria-label={t("mobileDirectoryAriaLabel")}>
          {mobileCollections.map((collection) => {
            const tone = collectionTone(collection);
            const Icon = getCollectionIcon(collection);
            const copyKey = getCollectionCopyKey(collection);
            const updatedKey = mobileCollectionUpdatedKeys[collection.slug as keyof typeof mobileCollectionUpdatedKeys] ?? "yesterday";

            return (
            <article className="collection-mobile-card" data-tone={tone} key={collection.slug}>
              <span className={`icon-tile ${tone}`} data-collection-mobile-icon={collection.slug}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>{t(`registryCollections.${copyKey}.title`)}</strong>
                <small>{t(`registryCollections.${copyKey}.description`)}</small>
              </span>
              <span className="tag-list">
                <span className="badge workflow">{t(`visibility.${collection.visibility}`)}</span>
                <span className="badge">{t("workflowCount", { count: collection.workflowSlugs.length })}</span>
                <span className="badge local">{updatedLabel(t, updatedKey)}</span>
              </span>
            </article>
            );
          })}
        </section>

        <section className="section">
          <div className="landing-section-head">
            <h2>{t("featured")}</h2>
            <a className="text-link" href="#all-collections">
              {t("viewAllFeatured")} <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="collection-feature-grid">
            {featuredCollections.map((collection) => (
              <CollectionCard collection={collection} featured key={collection.slug} localizedHref={localizedHref} />
            ))}
          </div>
        </section>

        <section className="section" id="all-collections">
          <div className="landing-section-head">
            <h2>{t("allCollections")}</h2>
            <span className="badge">{t("sortByPopular")}</span>
          </div>
          <div className="collection-grid">
            {collections.map((collection) => (
              <CollectionCard collection={collection} key={collection.slug} localizedHref={localizedHref} />
            ))}
          </div>
        </section>
      </div>

      <aside className="right-rail">
        <section className="panel">
          <div className="landing-section-head">
            <h2>{t("recentlyUpdated")}</h2>
            <a className="text-link" href="#all-collections">
              {t("viewAll")}
            </a>
          </div>
          <div className="collection-update-list">
            {collections.map((collection, index) => {
              const Icon = getCollectionIcon(collection);

              return (
              <a className="collection-update-row" href={localizedHref(collection.href)} key={collection.slug}>
                <span className={`icon-tile ${collectionTone(collection)}`} data-collection-update-icon={collection.slug}>
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span>
                  <strong>{t(`registryCollections.${getCollectionCopyKey(collection)}.title`)}</strong>
                  <small>{updatedLabel(t, index === 0 ? "threeHoursAgo" : "yesterday")}</small>
                </span>
                <Bookmark size={16} aria-hidden="true" />
              </a>
              );
            })}
          </div>
        </section>

        <section className="panel landing-suggested-card">
          <h2>{t("suggested")}</h2>
          <p className="tool-description">{t("suggestedDescription")}</p>
          <div className="detail-row-list">
            <a className="detail-row" href={localizedHref("/collections/ai-developer-lab")}>
              <span className="badge workflow">{t("suggestedLinks.aiDeveloperLab.badge")}</span>
              <span>{t("suggestedLinks.aiDeveloperLab.label", { workflowCount: t("workflowCount", { count: aiDeveloperCollection?.workflowSlugs.length ?? 0 }) })}</span>
            </a>
            <a className="detail-row" href={localizedHref("/collections/pdf-ops-kit")}>
              <span className="badge local">{t("suggestedLinks.pdfOpsKit.badge")}</span>
              <span>{t("suggestedLinks.pdfOpsKit.label")}</span>
            </a>
          </div>
        </section>

        <section className="panel landing-private-card">
          <span className="icon-tile green">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <h2>{t("createPrivateTitle")}</h2>
          <p className="tool-description">{t("createPrivateDescription")}</p>
          <LocalDraftModalButton
            className="button button-solid"
            draftKind="collection"
            label={t("createPrivate")}
            storageKey="toolars.local-collections:v1"
          />
        </section>

        <section className="panel">
          <h2>{t("syncTitle")}</h2>
          <p className="tool-description">{t("syncDescription")}</p>
        </section>
      </aside>
    </div>
  );
}
