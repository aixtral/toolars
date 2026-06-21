import { ArrowRight, Bookmark, FolderPlus, Globe2, Import, Sparkles } from "lucide-react";
import { collections, getToolBySlug, workflows, type CollectionDefinition } from "@/data/registry";

const featuredCollectionSlugs = ["pdf-ops-kit", "ai-developer-lab"];

const mobileCollectionCards = [
  {
    title: "PDF Ops Kit",
    description: "A focused stack for merging, compressing, summarizing, and sharing business PDFs.",
    count: "4",
    tone: "rose",
    visibility: "Official",
    workflows: "1 workflow",
    updated: "Updated today"
  },
  {
    title: "AI Developer Lab",
    description: "Security, cost, prompt, RAG, MCP, and agent tools from the Aixtral Lab inventory.",
    count: "4",
    tone: "purple",
    visibility: "Official",
    workflows: "3 workflows",
    updated: "Updated 2 hours ago"
  },
  {
    title: "Finance Review",
    description: "Mortgage, ROI, budget, loan, and report workflows for practical financial decisions.",
    count: "1",
    tone: "blue",
    visibility: "Public",
    workflows: "1 workflow",
    updated: "Updated yesterday"
  },
  {
    title: "Health Basics",
    description: "BMI, sleep, hydration, and heart-rate tools for quick personal snapshots.",
    count: "1",
    tone: "amber",
    visibility: "Public",
    workflows: "1 workflow",
    updated: "Updated yesterday"
  }
] as const;

function collectionTone(collection: CollectionDefinition): string {
  if (collection.slug.includes("pdf")) return "rose";
  if (collection.slug.includes("ai")) return "purple";
  return "blue";
}

function collectionSummary(collection: CollectionDefinition): string {
  const toolCount = collection.toolSlugs.length;
  const workflowCount = collection.workflowSlugs.length;
  const aiCount = collection.toolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((tool) => tool?.processing.includes("ai-consent")).length;

  return `${toolCount} tools · ${workflowCount} workflows · ${aiCount} AI`;
}

function CollectionCard({ collection, featured = false }: { collection: CollectionDefinition; featured?: boolean }) {
  const tone = collectionTone(collection);
  const previewTools = collection.toolSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean).slice(0, 4);

  return (
    <a className={`collection-index-card ${featured ? "is-featured" : ""}`} href={collection.href}>
      <span className={`icon-tile ${tone}`}>{collection.toolSlugs.length}</span>
      <span>
        <strong>{collection.title}</strong>
        <small>{collection.description}</small>
      </span>
      <span className="collection-preview-icons" aria-label={`${collection.title} preview tools`}>
        {previewTools.map((tool) => (
          <span className="collection-preview-icon" key={tool?.slug}>
            {tool?.name.slice(0, 2).toUpperCase()}
          </span>
        ))}
      </span>
      <span className="tag-list">
        <span className="badge workflow">{collection.visibility === "official" ? "Official" : collection.visibility}</span>
        <span className="badge">{collectionSummary(collection)}</span>
      </span>
      <span className="collection-card-footer">
        <span className="badge local">Curated by {collection.curator}</span>
        <span className="open-link">
          Open <ArrowRight size={14} aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}

export function CollectionsIndexView() {
  const featuredCollections = featuredCollectionSlugs
    .map((slug) => collections.find((collection) => collection.slug === slug))
    .filter((collection): collection is CollectionDefinition => Boolean(collection));

  return (
    <div
      className="page-grid collections-index-page"
      data-collections-density="mobile-v2"
      data-collections-index="true"
      data-collections-mobile-layout="directory-cards"
    >
      <div>
        <section className="section landing-hero">
          <span className="eyebrow">Curated stacks</span>
          <h1 className="title collections-title-desktop">Collections for every kind of work</h1>
          <h1 className="title collections-title-mobile">Collections for repeated work</h1>
          <p className="subtitle collections-copy-desktop">Curated toolkits of the best tools and workflows for common jobs and goals.</p>
          <p className="subtitle collections-copy-mobile">Save tools and workflows into reusable kits for PDF operations, AI development, finance reviews, and health snapshots.</p>
          <button className="button button-solid collections-mobile-primary-action" type="button">
            <FolderPlus size={16} aria-hidden="true" /> Create private collection
          </button>
          <div className="landing-action-row">
            <button className="button button-solid" type="button">
              <FolderPlus size={16} aria-hidden="true" /> Create collection
            </button>
            <button className="button button-outline-neutral" type="button">
              <Import size={16} aria-hidden="true" /> Import bookmarks
            </button>
            <a className="button button-outline-neutral" href="#all-collections">
              <Globe2 size={16} aria-hidden="true" /> Browse public collections
            </a>
          </div>
        </section>

        <section className="collections-mobile-stack" aria-label="Collections directory">
          {mobileCollectionCards.map((collection) => (
            <article className="collection-mobile-card" data-tone={collection.tone} key={collection.title}>
              <span className={`icon-tile ${collection.tone}`}>{collection.count}</span>
              <span>
                <strong>{collection.title}</strong>
                <small>{collection.description}</small>
              </span>
              <span className="tag-list">
                <span className="badge workflow">{collection.visibility}</span>
                <span className="badge">{collection.workflows}</span>
                <span className="badge local">{collection.updated}</span>
              </span>
            </article>
          ))}
        </section>

        <section className="section">
          <div className="landing-section-head">
            <h2>Featured collections</h2>
            <a className="text-link" href="#all-collections">
              View all featured <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="collection-feature-grid">
            {featuredCollections.map((collection) => (
              <CollectionCard collection={collection} featured key={collection.slug} />
            ))}
          </div>
        </section>

        <section className="section" id="all-collections">
          <div className="landing-section-head">
            <h2>All collections</h2>
            <span className="badge">Sort by: Popular</span>
          </div>
          <div className="collection-grid">
            {collections.map((collection) => (
              <CollectionCard collection={collection} key={collection.slug} />
            ))}
          </div>
        </section>
      </div>

      <aside className="right-rail">
        <section className="panel">
          <div className="landing-section-head">
            <h2>Recently updated</h2>
            <a className="text-link" href="#all-collections">
              View all
            </a>
          </div>
          <div className="collection-update-list">
            {collections.map((collection, index) => (
              <a className="collection-update-row" href={collection.href} key={collection.slug}>
                <span className={`icon-tile ${collectionTone(collection)}`}>{index + 1}</span>
                <span>
                  <strong>{collection.title}</strong>
                  <small>{index === 0 ? "Updated 3 hours ago" : "Updated yesterday"}</small>
                </span>
                <Bookmark size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="panel landing-suggested-card">
          <h2>Suggested for you</h2>
          <p className="tool-description">Based on your saved tools</p>
          <div className="detail-row-list">
            <a className="detail-row" href="/collections/ai-developer-lab">
              <span className="badge workflow">AI</span>
              <span>AI Developer Lab · {workflows.length - 1} workflows</span>
            </a>
            <a className="detail-row" href="/collections/pdf-ops-kit">
              <span className="badge local">PDF</span>
              <span>PDF Ops Kit · local-first tools</span>
            </a>
          </div>
        </section>

        <section className="panel landing-private-card">
          <span className="icon-tile green">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <h2>Create a private collection</h2>
          <p className="tool-description">Build your own collection of tools and workflows. Keep it private or share with your team.</p>
          <button className="button button-solid" type="button">
            Create private collection
          </button>
        </section>

        <section className="panel">
          <h2>Collections sync across devices</h2>
          <p className="tool-description">Access your saved collections anywhere.</p>
        </section>
      </aside>
    </div>
  );
}
