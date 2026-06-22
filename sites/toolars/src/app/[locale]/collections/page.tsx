import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CollectionsIndexView } from "./collections-index-view";

export const metadata: Metadata = {
  title: "Collections — Curated tool and workflow bundles",
  description:
    "Explore curated Toolars collections: hand-picked bundles of calculators, AI tools, and workflows for productivity, development, design, and finance tasks.",
  alternates: { canonical: "/collections" },
  openGraph: {
    type: "website",
    title: "Collections — Toolars",
    description: "Curated bundles of tools and workflows for every kind of task.",
    url: "/collections"
  }
};

export default function CollectionsPage() {
  return (
    <ToolarsShell active="collections" sidebarVariant="collections">
      <CollectionsIndexView />
    </ToolarsShell>
  );
}
