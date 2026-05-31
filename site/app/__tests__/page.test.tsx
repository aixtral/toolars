import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders the toolars search-first dashboard shell', () => {
    render(<HomePage />);

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
    expect(
      screen.getByRole('heading', { name: /continue where you left off/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /favorites/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /comparison mode/i }),
    ).toHaveTextContent(/compare saved calculator results locally/i);
  });
});
