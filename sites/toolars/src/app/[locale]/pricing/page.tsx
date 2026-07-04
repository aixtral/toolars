import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { buildLocalizedPageMetadata } from "@/lib/seo/localized-page-metadata";
import { PricingView } from "./pricing-view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedPageMetadata({ locale, page: "pricing" });
}

export default function PricingPage() {
  return (
    <ToolarsShell active="pricing" sidebarVariant="billing">
      <PricingView />
    </ToolarsShell>
  );
}
