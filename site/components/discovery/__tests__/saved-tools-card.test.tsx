import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SavedToolsCard } from '@/components/discovery';
import { saveCalculatorResult } from '@/lib/storage';

describe('SavedToolsCard', () => {
  it('shows an empty-state call to action when nothing is saved locally', () => {
    render(<SavedToolsCard />);

    expect(
      screen.getByRole('heading', { name: /recently saved/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no saved results yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /browse calculators/i }),
    ).toHaveAttribute('href', '/tools');
  });

  it('lists recently saved calculator results deduplicated by slug, newest first', () => {
    saveCalculatorResult({
      slug: 'bmi-calculator',
      title: 'BMI Calculator',
      primaryLabel: 'BMI',
      primaryValue: 23.1,
      values: { category: 'Normal' },
    });
    saveCalculatorResult({
      slug: 'mortgage-calculator',
      title: 'Mortgage Calculator',
      primaryLabel: 'Monthly payment',
      primaryValue: 1798.65,
      values: { totalInterest: 247518 },
    });
    // Duplicate slug should be deduped — only the newest entry is kept.
    saveCalculatorResult({
      slug: 'bmi-calculator',
      title: 'BMI Calculator',
      primaryLabel: 'BMI',
      primaryValue: 24.0,
      values: { category: 'Normal' },
    });

    render(<SavedToolsCard />);

    const links = screen.getAllByRole('link').filter((link) =>
      link.getAttribute('href')?.startsWith('/tools/'),
    );

    // Newest first: bmi-calculator (saved last), then mortgage-calculator.
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/tools/bmi-calculator');
    expect(links[1]).toHaveAttribute('href', '/tools/mortgage-calculator');
  });

  it('hides the empty state once at least one result is saved', () => {
    saveCalculatorResult({
      slug: 'bmi-calculator',
      title: 'BMI Calculator',
      primaryLabel: 'BMI',
      primaryValue: 23.1,
      values: { category: 'Normal' },
    });

    render(<SavedToolsCard />);

    expect(screen.queryByText(/no saved results yet/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /bmi calculator/i }),
    ).toHaveAttribute('href', '/tools/bmi-calculator');
  });
});
