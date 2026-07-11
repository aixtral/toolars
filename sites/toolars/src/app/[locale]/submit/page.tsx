import { redirect } from "next/navigation";
import { isLaunchLocale, localizePath } from "@/lib/i18n";
import { isFeatureEnabled } from "@/lib/product/feature-flags";

/**
 * Submit tool page. Feature is gated behind FEATURE_FLAGS.submit.
 * When disabled, redirects to home. The view component is preserved
 * for when the feature is re-enabled.
 */
export function getDisabledSubmitRedirectPath(locale: string) {
  return isLaunchLocale(locale) ? localizePath("/", locale) : "/";
}

export default async function SubmitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isFeatureEnabled("submit")) {
    redirect(getDisabledSubmitRedirectPath(locale));
  }

  // Lazy import only when feature is enabled (code preserved but not bundled in main chunk)
  const { SubmitToolView } = require("./submit-tool-view");
  const { ToolarsShell } = require("@/components/shell/toolars-shell");

  return (
    <ToolarsShell active="none" sidebarVariant="none">
      <SubmitToolView />
    </ToolarsShell>
  );
}
