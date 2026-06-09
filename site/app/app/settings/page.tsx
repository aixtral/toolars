import type { Metadata } from 'next';
import { Bell, Building2, CreditCard, Download, KeyRound, Shield, UserRound } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Workspace Settings | toolars',
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: 'Profile',
    copy: 'Name, email, timezone, and workspace role.',
    action: 'Manage profile',
    icon: UserRound,
  },
  {
    title: 'Subscription',
    copy: 'Plan, renewal date, usage limits, and upgrade path.',
    action: 'Manage subscription',
    icon: CreditCard,
  },
  {
    title: 'API keys',
    copy: 'Provider keys and workspace-level secret management.',
    action: 'Manage API keys',
    icon: KeyRound,
  },
  {
    title: 'Notifications',
    copy: 'Generation, billing, and weekly digest preferences.',
    action: 'Manage notifications',
    icon: Bell,
  },
  {
    title: 'Workspace',
    copy: 'Team name, default model, brand defaults, and permissions.',
    action: 'Manage workspace',
    icon: Building2,
  },
  {
    title: 'Danger zone',
    copy: 'Export data, transfer ownership, or close workspace.',
    action: 'Review danger zone',
    icon: Shield,
  },
] as const;

export default function SettingsPage() {
  return (
    <section aria-label="Settings operations" className="space-y-5">
      <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="ai">Settings</Badge>
          <Badge>Account</Badge>
          <Badge variant="warning">Billing</Badge>
          <Badge variant="success">Pro workspace</Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold leading-10 text-ink sm:text-4xl sm:leading-[44px]">
              Workspace Settings
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-neutral-600">
              Manage profile, subscription, API keys, notifications, workspace
              defaults, and destructive account actions for the Pro workspace.
            </p>
          </div>
          <Button size="sm" variant="secondary">
            <Download aria-hidden="true" size={16} />
            Export workspace data
          </Button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="grid gap-4 md:grid-cols-2">
          {sections.map(({ title, copy, action, icon: Icon }) => (
            <Card key={title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-accent-ai">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <CardTitle>{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{copy}</p>
                <Button size="sm" variant="secondary">
                  {action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card aria-label="Security and billing">
          <CardHeader>
            <CardTitle className="text-lg leading-6">Security and billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-xs font-bold uppercase text-neutral-500">API key vault</p>
              <p className="mt-2 font-semibold text-ink">
                Provider keys stay scoped to the workspace and are never required for free
                calculator pages.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <p className="text-xs font-bold uppercase text-neutral-500">Billing state</p>
              <p className="mt-2 text-sm font-semibold text-neutral-700">
                Pro plan active, renewal preview enabled, and usage limits shown before
                premium exports or batch generation.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
