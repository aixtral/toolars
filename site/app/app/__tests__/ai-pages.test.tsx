import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AnalyticsPage from '@/app/app/analytics/page';
import BrandVoicePage from '@/app/app/brand-voice/page';
import HistoryPage from '@/app/app/history/page';
import RepurposePage from '@/app/app/repurpose/page';
import SettingsPage from '@/app/app/settings/page';
import TemplatesPage from '@/app/app/templates/page';
import { AI_PLATFORM_GROUPS, AI_PLATFORMS } from '@/data/ai-platforms';

describe('AI supporting pages', () => {
  it('renders the repurpose workspace header with plan and usage context', async () => {
    const page = await RepurposePage({
      searchParams: Promise.resolve({ preview: '1' }),
    });

    render(page);

    expect(screen.getByRole('region', { name: /ai workspace header/i })).toHaveTextContent(
      /ai content repurposer/i,
    );
    expect(screen.getByRole('region', { name: /usage limits/i })).toHaveTextContent(
      /ai generations left/i,
    );
    expect(screen.getByRole('region', { name: /ai repurpose workspace/i })).toBeInTheDocument();
  });

  it('renders the template library with required template card metadata', () => {
    render(<TemplatesPage />);

    expect(
      screen.getByRole('heading', { name: /template library/i }),
    ).toBeInTheDocument();
    for (const group of ['Social', 'Long-form', 'Email', 'Community']) {
      expect(screen.getAllByText(group).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByRole('button', { name: /use template/i }).length).toBeGreaterThan(3);
  });

  it('renders the brand voice manager with plan limits and default controls', () => {
    render(<BrandVoicePage />);

    expect(screen.getByRole('heading', { name: /brand voice/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create voice/i })).toBeInTheDocument();
    expect(screen.getByText(/free: 1 voice/i)).toBeInTheDocument();
    expect(screen.getByText(/pro: 10 voices/i)).toBeInTheDocument();
    expect(screen.getByText(/default voice/i)).toBeInTheDocument();
  });

  it('renders history search, filters, statuses, and regenerate actions', () => {
    render(<HistoryPage />);

    expect(screen.getByRole('heading', { name: /content history/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search history/i })).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Canceled')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /regenerate/i }).length).toBeGreaterThan(0);
  });

  it('renders analytics metrics, platform breakdown, tone breakdown, and activity', () => {
    render(<AnalyticsPage />);

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

  it('renders workspace settings sections', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: /workspace settings/i })).toBeInTheDocument();
    for (const section of ['Profile', 'Subscription', 'API keys', 'Notifications', 'Workspace', 'Danger zone']) {
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
