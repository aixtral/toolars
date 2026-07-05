import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
  const t = useTranslations('nav');

  const drawerLinks = [
    { title: t('allTools'), href: '/tools' },
    { title: t('aiTools'), href: '/ai' },
    { title: t('blog'), href: '/blog' },
    { title: t('health'), href: '/categories/health' },
    { title: t('finance'), href: '/categories/finance' },
    // TODO(phase-two): re-enable once /pricing and /login routes ship.
    // { title: 'Pricing', href: '/pricing' },
    // { title: 'Sign in', href: '/login' },
  ];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/30 lg:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('openNavigation')}
        className="ml-auto flex h-full w-[min(340px,calc(100vw-32px))] flex-col border-l border-neutral-200 bg-white shadow-lg"
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
          <Link href="/" className="text-xl font-semibold text-ink">
            {t('brand')}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('closeNavigation')}
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden="true" size={20} strokeWidth={2} />
          </Button>
        </div>

        <nav className="grid gap-2 p-4" aria-label={t('openNavigation')}>
          {drawerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 rounded-lg border border-neutral-200 px-3 py-2 text-base font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
