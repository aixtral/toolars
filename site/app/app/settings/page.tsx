import type { Metadata } from 'next';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Workspace Settings | toolars',
  robots: { index: false, follow: false },
};

const sections = [
  ['Profile', 'Name, email, timezone, and workspace role.'],
  ['Subscription', 'Plan, renewal date, usage limits, and upgrade path.'],
  ['API keys', 'Provider keys and workspace-level secret management.'],
  ['Notifications', 'Generation, billing, and weekly digest preferences.'],
  ['Workspace', 'Team name, default model, brand defaults, and permissions.'],
  ['Danger zone', 'Export data, transfer ownership, or close workspace.'],
] as const;

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">Settings</Badge>
          <Badge>Account</Badge>
          <Badge variant="warning">Billing</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[44px] text-ink">
          Workspace Settings
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
          Manage profile, subscription, API keys, notifications, workspace
          defaults, and destructive account actions.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, copy]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{copy}</p>
              <button
                type="button"
                className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
              >
                Manage
              </button>
            </CardContent>
          </Card>
        ))}
      </section>
    </section>
  );
}
