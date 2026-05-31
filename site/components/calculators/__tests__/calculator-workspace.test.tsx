import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CalculatorWorkspace } from '@/components/calculators';
import { CALCULATOR_TOOLS } from '@/data/calculators';

const tool = CALCULATOR_TOOLS.find((item) => item.slug === 'bmi-calculator');

if (!tool) {
  throw new Error('BMI calculator fixtures must be available.');
}

describe('CalculatorWorkspace', () => {
  it('calculates a public BMI result without requiring an account', () => {
    render(<CalculatorWorkspace relatedTools={[]} slug="bmi-calculator" tool={tool} />);

    expect(screen.getByLabelText(/height/i)).toHaveValue(170);
    expect(screen.getByLabelText(/weight/i)).toHaveValue(66);
    expect(
      screen.getByText(/calculators stay free and private/i),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '75' } });
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    const resultPanel = screen.getByRole('region', { name: /^result$/i });
    expect(within(resultPanel).getByText('BMI')).toBeInTheDocument();
    expect(within(resultPanel).getByText('23.1')).toBeInTheDocument();
    expect(within(resultPanel).getByText(/bmi = weight/i)).toBeInTheDocument();
    expect(within(resultPanel).getByText(/normal/i)).toBeInTheDocument();
  });

  it('keeps invalid values in the form and announces validation errors', () => {
    render(<CalculatorWorkspace relatedTools={[]} slug="bmi-calculator" tool={tool} />);

    fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '-1' } });
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/height must be greater than 0/i);
    expect(screen.queryByText('23.1')).not.toBeInTheDocument();
  });

  it('offers local save, compare, and share actions after calculation', () => {
    render(<CalculatorWorkspace relatedTools={[]} slug="bmi-calculator" tool={tool} />);

    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    fireEvent.click(screen.getByRole('button', { name: /save result/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/saved locally/i);

    fireEvent.click(screen.getByRole('button', { name: /add to compare/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/added to compare/i);

    fireEvent.click(screen.getByRole('button', { name: /copy share link/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/share link copied/i);
  });

  it('renders the commercial calculator detail sections from the design spec', () => {
    render(<CalculatorWorkspace relatedTools={[tool]} slug="bmi-calculator" tool={tool} />);

    expect(
      screen.getByRole('region', { name: /bmi calculator workspace/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('form', { name: /calculator inputs/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /^result$/i })).toBeInTheDocument();

    const detailTabs = screen.getByRole('tablist', {
      name: /result detail sections/i,
    });
    expect(within(detailTabs).getByRole('tab', { name: /breakdown/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(detailTabs).getByRole('tab', { name: /formula/i })).toBeInTheDocument();
    expect(within(detailTabs).getByRole('tab', { name: /faq/i })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: /breakdown/i })).toHaveTextContent(
      /result breakdown/i,
    );

    expect(screen.getByRole('region', { name: /related tools/i })).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: /sponsored placement/i }),
    ).toHaveTextContent(/after the calculator/i);
  });
});
