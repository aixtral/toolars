import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/product/feature-flags";

/**
 * Submit tool page. Feature is gated behind FEATURE_FLAGS.submit.
 * When disabled, redirects to home. The view component is preserved
 * for when the feature is re-enabled.
 */
export default function SubmitPage() {
  if (!isFeatureEnabled("submit")) {
    redirect("/");
  }

  // Lazy import only when feature is enabled (code preserved but not bundled in main chunk)
  const { SubmitToolView } = require("./submit-tool-view");
  const { ToolarsShell } = require("@/components/shell/toolars-shell");

  return (
    <ToolarsShell active="explore" sidebarVariant="none">
      <SubmitToolView />
    </ToolarsShell>
  );
}
