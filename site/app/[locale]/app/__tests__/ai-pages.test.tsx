import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AnalyticsPage from '@/app/[locale]/app/analytics/page';
import BrandVoicePage from '@/app/[locale]/app/brand-voice/page';
import HistoryPage from '@/app/[locale]/app/history/page';
import SettingsPage from '@/app/[locale]/app/settings/page';
import TemplatesPage from '@/app/[locale]/app/templates/page';
import { AI_PLATFORM_GROUPS, AI_PLATFORMS } from '@/data/ai-platforms';

const params = () => ({ params: Promise.resolve({ locale: 'en' }) });

describe('AI supporting pages', () => {
  it('renders the template library with required template card metadata', async () => {
    render(await TemplatesPage(params()));

    expect(
      screen.getByRole('heading', { name: /template library/i }),
    ).toBeInTheDocument();
    for (const group of ['Social', 'Long-form', 'Email', 'Community']) {
      expect(screen.getAllByText(group).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByRole('button', { name: /use template/i }).length).toBeGreaterThan(3);
  });

  it('renders the brand voice manager with reusable voices and controls', async () => {
    render(await BrandVoicePage(params()));

    expect(screen.getByRole('heading', { name: /brand voice/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create voice/i })).toBeInTheDocument();
    // v1: plan-limit cards ("Free: 1 voice" / "Pro: 10 voices") are removed;
    // the manager shows the reusable voice profiles instead.
    expect(screen.getByText('Founder operator')).toBeInTheDocument();
    expect(screen.getByText('Educator')).toBeInTheDocument();
    expect(screen.getByText('Product team')).toBeInTheDocument();
  });

  it('renders history search, filters, statuses, and regenerate actions', async () => {
    render(await HistoryPage(params()));

    expect(screen.getByRole('heading', { name: /content history/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search history/i })).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Canceled')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /regenerate/i }).length).toBeGreaterThan(0);
  });

  it('renders analytics metrics, platform breakdown, tone breakdown, and activity', async () => {
    render(await AnalyticsPage(params()));

    expect(
      screen.getByRole('heading', { name: /performance analytics/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Total tool uses')).toBeInTheDocument();
    expect(screen.getByText('AI outputs generated')).toBeInTheDocument();
    expect(screen.getByText('Credits used')).toBeInTheDocument();
    expect(screen.getByText(/platform breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/tone breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
  });

  it('renders workspace settings sections', async () => {
    render(await SettingsPage(params()));

    expect(screen.getByRole('heading', { name: /workspace settings/i })).toBeInTheDocument();
    // v1: "Subscription" section is removed in favour of neutral workspace/data
    // sections; billing surfaces return with phase-two Stripe integration.
    for (const section of ['Profile', 'Workspace', 'API keys', 'Notifications', 'Data export', 'Danger zone']) {
      expect(screen.getByText(section)).toBeInTheDocument();
    }
  });
});

describe('AI platform data', () => {
  it('keeps the complete required platform inventory grouped for app pages', () => {
    expect(AI_PLATFORMS.map((platform) => platform.label)).toEqual([
      'Twitter Thread',
      'LinkedIn Post',
      'Newsletter',
      'Medium Article',
      'Reddit Post',
      'Instagram Post',
      'YouTube Script',
      'Facebook Post',
      'Hacker News Post',
      'Indie Hackers Post',
      'WeChat Article',
      'Xiaohongshu Post',
      'Jike Post',
      'Zhihu Answer',
    ]);

    const socialGroup = AI_PLATFORM_GROUPS.find((group) => group.label === 'Social');
    expect(socialGroup).toBeDefined();
    if (!socialGroup) return;

    expect(socialGroup.platforms).toContain('twitter-thread');
    expect(socialGroup.platforms).toContain('linkedin-post');
  });
});
