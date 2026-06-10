import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UpgradePrompt, UsagePlanCard } from '@/components/billing';
import type { UsageSummary } from '@/lib/usage/summary';

const usageSummary: UsageSummary = {
  planId: 'pro',
  planName: 'Pro',
  period: {
    periodStart: '2026-06-01',
    periodEnd: '2026-07-01',
  },
  limits: {
    aiGenerations: 1000,
    exports: 200,
    batchRuns: 100,
  },
  used: {
    aiGenerations: 17,
    exports: 3,
    batchRuns: 2,
  },
  remaining: {
    aiGenerations: 983,
    exports: 197,
    batchRuns: 98,
  },
};

describe('billing components', () => {
  it('shows a blocking upgrade path for paid AI actions', () => {
    const onUpgrade = vi.fn();
    render(
      <UpgradePrompt
        feature="AI generation"
        reason="AI generation requires a Pro subscription."
        onUpgrade={onUpgrade}
      />,
    );

    expect(screen.getByRole('heading', { name: /upgrade to pro/i })).toBeInTheDocument();
    expect(screen.getByText(/requires a pro subscription/i)).toBeInTheDocument();
    expect(screen.getByRole('form', { name: /start pro checkout/i })).toHaveAttribute(
      'action',
      '/api/billing/checkout',
    );
    expect(screen.getByDisplayValue('pro')).toHaveAttribute('name', 'planId');
    fireEvent.submit(screen.getByRole('form', { name: /start pro checkout/i }));
    expect(onUpgrade).toHaveBeenCalledOnce();
  });

  it('summarizes plan entitlements for the active user', () => {
    render(<UsagePlanCard planId="pro" usageSummary={usageSummary} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText(/983 AI generations left/i)).toBeInTheDocument();
    expect(screen.getByText(/197 exports left/i)).toBeInTheDocument();
    expect(screen.getByText(/98 batch runs left/i)).toBeInTheDocument();
    expect(screen.getByText(/renews 2026-07-01/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage billing/i })).toHaveAttribute(
      'href',
      '/api/billing/portal',
    );
  });
});
