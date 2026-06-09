import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UpgradePrompt, UsagePlanCard } from '@/components/billing';

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
    render(<UsagePlanCard planId="pro" remainingGenerations={48} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText(/48 AI generations left/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF and CSV exports/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage billing/i })).toHaveAttribute(
      'href',
      '/api/billing/portal',
    );
  });
});
