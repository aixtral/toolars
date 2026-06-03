import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/layout';

describe('Footer', () => {
  it('renders crawlable product, trust, and account links', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo', { name: /site footer/i });

    expect(within(footer).getByText(/free calculators, account-gated ai/i)).toBeInTheDocument();
    expect(within(footer).getByRole('link', { exact: true, name: 'All tools' })).toHaveAttribute(
      'href',
      '/tools',
    );
    expect(within(footer).getByRole('link', { name: /ai tools/i })).toHaveAttribute(
      'href',
      '/ai',
    );
    expect(within(footer).getByRole('link', { name: /pricing/i })).toHaveAttribute(
      'href',
      '/pricing',
    );
    expect(within(footer).getByRole('link', { name: /contact/i })).toHaveAttribute(
      'href',
      '/contact',
    );
    expect(within(footer).getByRole('link', { name: /privacy/i })).toHaveAttribute(
      'href',
      '/privacy',
    );
    expect(within(footer).getByRole('link', { name: /open app/i })).toHaveAttribute(
      'href',
      '/app/repurpose',
    );
  });
});
