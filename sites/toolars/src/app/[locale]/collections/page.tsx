import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { buildLocalizedPageMetadata } from "@/lib/seo/localized-page-metadata";
import { CollectionsIndexView } from "./collections-index-view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedPageMetadata({ locale, page: "collections" });
}

export default function CollectionsPage() {
  return (
    <ToolarsShell active="collections" sidebarVariant="collections">
      <CollectionsIndexView />
    </ToolarsShell>
  );
}
