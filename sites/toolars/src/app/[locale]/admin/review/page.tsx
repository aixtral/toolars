import { ToolarsShell } from "@/components/shell/toolars-shell";
import { requireToolarsAdminPageUser } from "@/lib/auth/toolars-page-access";
import { AdminReviewView } from "./admin-review-view";

export default async function AdminReviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireToolarsAdminPageUser(locale);

  return (
    <ToolarsShell active="admin" sidebarVariant="admin">
      <AdminReviewView />
    </ToolarsShell>
  );
}
