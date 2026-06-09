import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToolsDirectoryPage from '@/app/tools/page';

async function renderToolsDirectory(searchParams: Record<string, string | undefined> = {}) {
  const page = await ToolsDirectoryPage({
    searchParams: Promise.resolve(searchParams),
  } as never);

  render(page);
}

describe('ToolsDirectoryPage', () => {
  it('renders explicit filters and repeated-use quick access', async () => {
    await renderToolsDirectory();

    expect(screen.getByRole('heading', { name: 'All Tools Directory' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search all tools/i })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /tool type/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /quick access/i })).toHaveTextContent(
      /favorites and recently used/i,
    );
  });

  it('renders query-driven results from the tools search parameter', async () => {
    await renderToolsDirectory({ search: 'inflation' });

    expect(screen.getByRole('searchbox', { name: /search all tools/i })).toHaveValue('inflation');
    expect(screen.getByText(/showing results for "inflation"/i)).toBeInTheDocument();
    const results = within(screen.getByRole('region', { name: /search results/i }));

    expect(results.getByRole('link', { name: /inflation calculator/i })).toBeInTheDocument();
    expect(results.queryByRole('link', { name: /bmi calculator/i })).not.toBeInTheDocument();
  });
});
