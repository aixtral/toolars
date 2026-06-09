import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  it('renders branded recovery actions for unknown routes', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { name: /we could not find that tool/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/search the directory or return to a known workspace/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse all tools/i })).toHaveAttribute(
      'href',
      '/tools',
    );
    expect(screen.getByRole('link', { name: /open ai tools/i })).toHaveAttribute(
      'href',
      '/ai',
    );
    expect(screen.getByRole('link', { name: /contact toolars/i })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});
