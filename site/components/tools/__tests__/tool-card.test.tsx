import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToolCard } from '@/components/tools/tool-card';
import type { CalculatorDefinition } from '@/data/types';

const bmiTool: CalculatorDefinition = {
  badges: ['Free', 'No login'],
  category: 'body',
  description: 'Calculate Body Mass Index from height and weight.',
  formulaStatus: 'ported',
  icon: 'bmi',
  isPopular: true,
  requiresAccount: false,
  route: '/tools/bmi-calculator',
  seo: {
    description: 'BMI calculator',
    title: 'BMI Calculator',
  },
  slug: 'bmi-calculator',
  sourceSlug: 'bmi-calculator',
  title: 'BMI Calculator',
  type: 'calculator',
};

describe('ToolCard', () => {
  it('renders required utility metadata and accessible actions', () => {
    render(<ToolCard tool={bmiTool} />);

    expect(screen.getByRole('heading', { name: 'BMI Calculator' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText(/under 2 min/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open tool/i })).toHaveAttribute(
      'href',
      '/tools/bmi-calculator',
    );

    const favorite = screen.getByRole('button', {
      name: /save bmi calculator to favorites/i,
    });
    fireEvent.click(favorite);
    expect(
      screen.getByRole('button', { name: /remove bmi calculator from favorites/i }),
    ).toBeInTheDocument();
  });
});
