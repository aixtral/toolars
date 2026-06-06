import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToolPage from '@/app/tools/[slug]/page';

describe('CalculatorDetailPage', () => {
  it('renders title-level actions and SEO/GEO support sections', async () => {
    const page = await ToolPage({
      params: Promise.resolve({ slug: 'bmi-calculator' }),
    });

    render(page);

    const actions = screen.getByRole('region', { name: /calculator page actions/i });
    expect(
      within(actions).getByRole('button', { name: /save bmi calculator to favorites/i }),
    ).toBeInTheDocument();
    expect(
      within(actions).getByRole('button', { name: /copy bmi calculator share link/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('region', { name: /calculator formula preview/i }),
    ).toHaveTextContent(/bmi = weight/i);
    expect(
      screen.getByRole('heading', { name: /how the calculation works/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /calculator faq/i })).toBeInTheDocument();
  });
});
