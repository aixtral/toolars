'use client';

import Link from 'next/link';
import { ChevronDown, CircleUser, Globe, Menu, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CommandPalette } from '@/components/search';
import { MegaMenu, MobileDrawer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }

      if (event.key === 'Escape') {
        setMenuOpen(false);
        setDrawerOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.toggleAttribute('data-drawer-open', drawerOpen);
    return () => document.body.removeAttribute('data-drawer-open');
  }, [drawerOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-16 w-full max-w-content grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[auto_minmax(420px,560px)_auto] lg:gap-6 lg:px-8">
          <Button
            className="col-start-1 row-start-1 lg:hidden"
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu aria-hidden="true" size={20} strokeWidth={2} />
          </Button>

          <Link
            href="/"
            className="col-start-2 row-start-1 justify-self-center text-2xl font-semibold text-ink lg:col-start-1 lg:justify-self-start"
            aria-label="toolars"
          >
            toolars
          </Link>

          <div className="col-start-2 row-start-1 hidden w-full justify-self-center lg:block">
            <label className="sr-only" htmlFor="global-search">
              Search tools
            </label>
            <Input
              id="global-search"
              type="search"
              aria-label="Search tools"
              placeholder="Search 73 calculators and AI tools..."
              readOnly
              onFocus={() => setCommandOpen(true)}
              onClick={() => setCommandOpen(true)}
            />
          </div>

          <div ref={menuRef} className="relative col-start-3 row-start-1 hidden items-center gap-4 justify-self-end lg:flex xl:gap-6">
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={menuOpen}
              aria-controls="tools-mega-menu"
              aria-label="Open tools menu"
              onClick={() => setMenuOpen((current) => !current)}
            >
              Tools
              <ChevronDown aria-hidden="true" size={16} strokeWidth={2} />
            </Button>
            <Link className="min-h-11 px-1 py-3 text-sm font-semibold text-neutral-700 hover:text-ink" href="/ai">
              AI Tools
            </Link>
            <Link className="min-h-11 px-1 py-3 text-sm font-semibold text-neutral-700 hover:text-ink" href="/blog">
              Blog
            </Link>
            <Link
              className="min-h-11 px-1 py-3 text-sm font-semibold text-neutral-700 hover:text-ink"
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="inline-flex min-h-11 items-center gap-1 px-1 py-3 text-sm font-semibold text-neutral-700 hover:text-ink"
              href="/en"
              aria-label="Language English"
            >
              <Globe aria-hidden="true" size={16} strokeWidth={2} />
              EN
            </Link>
            <Link className="min-h-11 px-1 py-3 text-sm font-semibold text-neutral-700 hover:text-ink" href="/login">
              Sign in
            </Link>
            <Link
              className="min-h-11 rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600"
              href="/app/repurpose"
            >
              Open app
            </Link>
            {menuOpen ? <MegaMenu /> : null}
          </div>

          <div className="col-start-3 row-start-1 flex items-center justify-end gap-2 lg:hidden">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCommandOpen(true)}
              aria-label="Open search"
            >
              <Search aria-hidden="true" size={20} strokeWidth={2} />
            </Button>
            <Link
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-ink"
              href="/login"
              aria-label="Sign in"
            >
              <CircleUser aria-hidden="true" size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
