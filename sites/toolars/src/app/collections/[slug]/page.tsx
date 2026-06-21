import { notFound } from "next/navigation";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { collectionDetailSlugs, getCollectionDetailBySlug } from "@/data/collection-details";
import { CollectionDetailView } from "./collection-detail-view";

export function generateStaticParams() {
  return collectionDetailSlugs.map((slug) => ({ slug }));
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
