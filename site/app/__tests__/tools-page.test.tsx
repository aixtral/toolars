import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToolsDirectoryPage from '@/app/tools/page';

describe('ToolsDirectoryPage', () => {
  it('renders explicit filters and repeated-use quick access', () => {
    render(<ToolsDirectoryPage />);

    expect(screen.getByRole('heading', { name: 'All Tools Directory' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /tool type/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /quick access/i })).toHaveTextContent(
      /favorites and recently used/i,
    );
  });
});
