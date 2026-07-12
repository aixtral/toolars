import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { requireToolarsPageUser } from "@/lib/auth/toolars-page-access";
import { buildLocalizedPageMetadata } from "@/lib/seo/localized-page-metadata";
import { MyToolsDashboardView } from "./my-tools-dashboard-view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedPageMetadata({ locale, page: "myTools" });
}

export default async function MyToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireToolarsPageUser(locale);

  return (
    <ToolarsShell active="my-tools" sidebarVariant="workspace">
      <MyToolsDashboardView />
    </ToolarsShell>
  );
}
