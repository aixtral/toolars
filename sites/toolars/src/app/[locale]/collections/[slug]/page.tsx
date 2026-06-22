import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { collectionDetailSlugs, getCollectionDetailBySlug } from "@/data/collection-details";
import { CollectionDetailView } from "./collection-detail-view";

export function generateStaticParams() {
  return collectionDetailSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = getCollectionDetailBySlug(slug);
  if (!detail) return {};
  const { collection } = detail;
  return {
    title: collection.title,
    description: collection.description,
    keywords: [...collection.tags, collection.title],
    alternates: { canonical: collection.href },
    openGraph: {
      type: "website",
      title: `${collection.title} — Toolars`,
      description: collection.description,
      url: collection.href
    }
  };
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getCollectionDetailBySlug(slug);

  if (!detail) notFound();

  return (
    <ToolarsShell active="collections" sidebarVariant="collections">
      <CollectionDetailView detail={detail} />
    </ToolarsShell>
  );
}
