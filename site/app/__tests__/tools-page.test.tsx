import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToolsDirectoryPage from '@/app/[locale]/tools/page';

describe('ToolsDirectoryPage', () => {
  it('renders explicit filters and repeated-use quick access', async () => {
    render(await ToolsDirectoryPage({ params: Promise.resolve({ locale: 'en' }) }));

    expect(screen.getByRole('heading', { name: 'All Tools Directory' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /tool type/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort/i })).toBeInTheDocument();
    // Sidebar shows the localStorage-backed "Recently saved" surface instead of
    // a hard-coded "favorites and recently used" list.
    expect(
      screen.getByRole('heading', { name: /recently saved/i }),
    ).toBeInTheDocument();
  });
});
