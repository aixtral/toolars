import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PricingView } from "./pricing-view";

export const metadata: Metadata = {
  title: "Pricing — Free tools, AI credits, and team plans",
  description:
    "Toolars pricing: free traditional tools and calculators forever, AI credits for cloud steps, and team plans for shared workflows. No card required to start.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    title: "Pricing — Toolars",
    description: "Free tools forever. AI credits and team plans available when you need them.",
    url: "/pricing"
  }
};

export default function PricingPage() {
  return (
    <ToolarsShell active="pricing" sidebarVariant="billing">
      <PricingView />
    </ToolarsShell>
  );
}
