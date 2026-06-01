import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from '@/app/about/page';
import ComparePage from '@/app/compare/page';
import ContactPage from '@/app/contact/page';
import LoginPage from '@/app/login/page';
import PricingPage from '@/app/pricing/page';
import PrivacyPage from '@/app/privacy/page';
import RegisterPage from '@/app/register/page';

describe('public commercial routes', () => {
  it('renders pricing with free calculators and Pro AI boundaries', () => {
    render(<PricingPage />);

    expect(screen.getByRole('heading', { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /pricing plans/i })).toHaveTextContent(
      /free calculators/i,
    );
    expect(screen.getByRole('region', { name: /pricing plans/i })).toHaveTextContent(
      /ai tools subscription/i,
    );
    expect(screen.getAllByText(/pdf\/csv advanced exports/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /open ai workspace/i })).toHaveAttribute(
      'href',
      '/app/repurpose?preview=1',
    );
  });

  it('renders login and registration entry shells without backend side effects', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: /sign in to toolars/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create account/i })).toHaveAttribute(
      'href',
      '/register',
    );

    render(<RegisterPage />);

    expect(
      screen.getByRole('heading', { name: /create your toolars workspace/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ai tools are subscription-gated/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  it('renders compare as a local calculator workflow with Pro export boundaries', () => {
    render(<ComparePage />);

    expect(
      screen.getByRole('heading', { name: /compare saved calculator results/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /local comparison/i })).toHaveTextContent(
      /local-only/i,
    );
    expect(screen.getByText(/BMI Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Mortgage Calculator/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
  });

  it('renders trust pages with clear public context', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /about toolars/i })).toBeInTheDocument();
    expect(screen.getByText(/search-first calculators/i)).toBeInTheDocument();

    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /contact toolars/i })).toBeInTheDocument();
    expect(screen.getByText(/product, support, partnerships/i)).toBeInTheDocument();

    render(<PrivacyPage />);
    expect(screen.getByRole('heading', { name: /privacy/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/anonymous calculator inputs stay local/i)).toBeInTheDocument();
  });
});
