import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/[locale]/page';

describe('HomePage', () => {
  it('renders the toolars search-first dashboard shell', async () => {
    render(await HomePage({ params: Promise.resolve({ locale: 'en' }) }));

    expect(
      screen.getByRole('region', { name: /tool discovery dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /search 73 calculators and ai tools/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('searchbox', { name: /search tools/i }),
    ).toHaveAttribute('placeholder', 'Search 73 calculators and AI tools...');
    expect(
      screen.getByRole('heading', { name: 'AI Content Repurposer' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Popular Tools' }),
    ).toBeInTheDocument();
    // The "recently saved" surface is a client component reading localStorage;
    // on first render it shows the empty-state CTA rather than a hard-coded list.
    expect(
      screen.getByRole('heading', { name: /recently saved/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no saved results yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /comparison mode/i }),
    ).toHaveTextContent(/compare saved calculator results locally/i);
  });
});
