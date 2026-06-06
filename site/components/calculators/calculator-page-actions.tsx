'use client';

import { Share2, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui';

interface CalculatorPageActionsProps {
  route: string;
  title: string;
}

export function CalculatorPageActions({ route, title }: CalculatorPageActionsProps) {
  const [favorite, setFavorite] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const favoriteLabel = favorite
    ? `Remove ${title} from favorites`
    : `Save ${title} to favorites`;

  function handleFavorite() {
    setFavorite((current) => {
      const next = !current;
      setStatusMessage(next ? 'Saved to local favorites.' : 'Removed from local favorites.');
      return next;
    });
  }

  function handleShare() {
    const href = new URL(route, window.location.origin).toString();
    void navigator.clipboard?.writeText(href).catch(() => undefined);
    setStatusMessage('Share link copied.');
  }

  return (
    <section
      aria-label="Calculator page actions"
      className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-2">
        <Button
          aria-label={favoriteLabel}
          aria-pressed={favorite}
          className="min-w-0"
          onClick={handleFavorite}
          size="sm"
          type="button"
          variant="secondary"
        >
          <Star
            aria-hidden="true"
            className={favorite ? 'fill-brand-500 text-brand-600' : undefined}
            size={16}
            strokeWidth={2}
          />
          <span>{favorite ? 'Saved' : 'Favorite'}</span>
        </Button>
        <Button
          aria-label={`Copy ${title} share link`}
          className="min-w-0"
          onClick={handleShare}
          size="sm"
          type="button"
          variant="secondary"
        >
          <Share2 aria-hidden="true" size={16} strokeWidth={2} />
          <span>Share</span>
        </Button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs font-semibold text-brand-700">
        {statusMessage}
      </p>
    </section>
  );
}
