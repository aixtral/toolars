import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from '@/components/layout/header';

describe('Header navigation', () => {
  it('renders the search-first header and opens the Tools mega menu by click and Esc', async () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: 'toolars' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('searchbox', { name: /search tools/i })).toHaveAttribute(
      'placeholder',
      'Search 73 calculators and AI tools...',
    );
    expect(screen.getByRole('button', { name: /open tools menu/i })).toHaveClass(
      'min-h-11',
    );

    fireEvent.click(screen.getByRole('button', { name: /open tools menu/i }));

    const menu = screen.getByRole('region', { name: /tools menu/i });
    expect(within(menu).getByText('Popular Calculators')).toBeInTheDocument();
    expect(within(menu).getByText('Categories')).toBeInTheDocument();
    expect(within(menu).getByText('Solutions')).toBeInTheDocument();
    expect(within(menu).getByText('Resources')).toBeInTheDocument();
    expect(within(menu).getByText('Press ⌘K to search anything')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: /tools menu/i })).not.toBeInTheDocument();
  });

  it('opens the mobile navigation drawer with account and directory links', async () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));

    const drawer = screen.getByRole('dialog', { name: /navigation menu/i });
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(within(drawer).getByRole('link', { name: 'All Tools' })).toHaveAttribute(
      'href',
      '/tools',
    );
    expect(within(drawer).getByRole('link', { name: 'AI Tools' })).toHaveAttribute(
      'href',
      '/ai',
    );
    expect(within(drawer).getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});

describe('Command palette', () => {
  it('opens with Cmd/Ctrl+K, focuses search, navigates with arrows, and closes with Esc', async () => {
    render(<Header />);

    fireEvent.keyDown(document, { key: 'k', metaKey: true });

    const dialog = screen.getByRole('dialog', { name: /search tools/i });
    const searchInput = within(dialog).getByRole('searchbox', {
      name: /search 73 calculators and ai tools/i,
    });
    expect(searchInput).toHaveFocus();

    fireEvent.change(searchInput, { target: { value: 'mortgage payment' } });
    expect(within(dialog).getByRole('link', { name: /mortgage calculator/i })).toHaveAttribute(
      'href',
      '/tools/mortgage-calculator',
    );

    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    expect(searchInput).toHaveAttribute('aria-activedescendant', 'command-result-0');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /search tools/i })).not.toBeInTheDocument();
  });

  it('shows helpful empty state suggestions', async () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('searchbox', { name: /search tools/i }));
    const dialog = screen.getByRole('dialog', { name: /search tools/i });
    fireEvent.change(
      within(dialog).getByRole('searchbox', { name: /search 73 calculators and ai tools/i }),
      { target: { value: 'not-a-real-tool' } },
    );

    expect(within(dialog).getByText('No results found')).toBeInTheDocument();
    expect(within(dialog).getByText(/check spelling/i)).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: 'Browse all calculators' })).toHaveAttribute(
      'href',
      '/tools',
    );
  });
});
