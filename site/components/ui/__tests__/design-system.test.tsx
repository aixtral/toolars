import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import tailwindConfig from '@/tailwind.config';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

describe('design system primitives', () => {
  it('maps the canonical toolars design tokens into Tailwind', () => {
    expect(tailwindConfig.theme?.extend?.colors).toMatchObject({
      ink: '#0F172A',
      porcelain: '#FAFAFC',
      brand: {
        500: '#14B8A6',
        600: '#0D9488',
        700: '#0F766E',
        900: '#0B1220',
      },
      accent: {
        ai: '#2563EB',
        finance: '#F59E0B',
        health: '#22C55E',
      },
    });
    expect(tailwindConfig.theme?.extend?.borderRadius).toMatchObject({
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
    });
    expect(tailwindConfig.theme?.extend?.maxWidth).toMatchObject({
      content: '1240px',
    });
  });

  it('renders accessible 44px minimum Button and Input controls', () => {
    render(
      <>
        <Button>Calculate</Button>
        <label htmlFor="amount">Amount</label>
        <Input id="amount" placeholder="Loan amount" />
      </>,
    );

    expect(screen.getByRole('button', { name: 'Calculate' })).toHaveClass(
      'min-h-11',
      'rounded-lg',
      'bg-brand-500',
      'focus-visible:ring-2',
    );
    expect(screen.getByLabelText('Amount')).toHaveClass(
      'min-h-11',
      'rounded-lg',
      'focus-visible:ring-2',
    );
  });

  it('renders border-first cards, badges, and the 1240px content container', () => {
    render(
      <Container data-testid="container">
        <Card>
          <CardHeader>
            <Badge variant="ai">AI</Badge>
            <CardTitle>AI Content Repurposer</CardTitle>
          </CardHeader>
          <CardContent>Turn one source into many formats.</CardContent>
        </Card>
      </Container>,
    );

    expect(screen.getByTestId('container')).toHaveClass('max-w-content');
    expect(screen.getByText('AI')).toHaveClass('border', 'text-accent-ai');
    expect(screen.getByText('AI Content Repurposer').closest('section')).toHaveClass(
      'rounded-lg',
      'border',
      'border-neutral-200',
    );
  });
});
