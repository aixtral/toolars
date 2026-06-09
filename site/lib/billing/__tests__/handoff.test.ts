import { describe, expect, it } from 'vitest';
import type { ToolarsSession } from '@/lib/auth';
import {
  buildBillingCheckoutUrl,
  readBillingHandoffConfig,
  resolveSafeBillingUrl,
} from '@/lib/billing/handoff';

const session: ToolarsSession = {
  userId: 'user_123',
  email: 'founder@toolars.test',
  workspaceId: 'workspace_123',
  planId: 'free',
  role: 'owner',
  isAuthenticated: true,
};

describe('billing handoff helpers', () => {
  it('reads configured checkout and portal URLs from environment', () => {
    expect(
      readBillingHandoffConfig({
        TOOLARS_LEMONSQUEEZY_PRO_CHECKOUT_URL:
          'https://toolars.lemonsqueezy.com/checkout/buy/pro',
        TOOLARS_LEMONSQUEEZY_TEAM_CHECKOUT_URL:
          'https://toolars.lemonsqueezy.com/checkout/buy/team',
        TOOLARS_LEMONSQUEEZY_PORTAL_URL: 'https://toolars.lemonsqueezy.com/billing',
      }),
    ).toEqual({
      proCheckoutUrl: 'https://toolars.lemonsqueezy.com/checkout/buy/pro',
      teamCheckoutUrl: 'https://toolars.lemonsqueezy.com/checkout/buy/team',
      portalUrl: 'https://toolars.lemonsqueezy.com/billing',
    });
  });

  it('rejects missing, relative, and non-HTTPS billing redirect URLs', () => {
    expect(resolveSafeBillingUrl(undefined)).toBeNull();
    expect(resolveSafeBillingUrl('/billing')).toBeNull();
    expect(resolveSafeBillingUrl('http://toolars.lemonsqueezy.com/billing')).toBeNull();
    expect(
      resolveSafeBillingUrl('https://toolars.lemonsqueezy.com/billing'),
    )?.toBe('https://toolars.lemonsqueezy.com/billing');
  });

  it('decorates checkout URLs with workspace, user, email, and return context', () => {
    const checkoutUrl = buildBillingCheckoutUrl({
      baseUrl: 'https://toolars.lemonsqueezy.com/checkout/buy/pro?embed=1',
      session,
      returnPath: '/app/settings?tab=billing',
    });

    expect(checkoutUrl).toBe(
      'https://toolars.lemonsqueezy.com/checkout/buy/pro?embed=1' +
        '&checkout%5Bcustom%5D%5Bworkspace_id%5D=workspace_123' +
        '&checkout%5Bcustom%5D%5Buser_id%5D=user_123' +
        '&checkout%5Bcustom%5D%5Breturn_path%5D=%2Fapp%2Fsettings%3Ftab%3Dbilling' +
        '&checkout%5Bemail%5D=founder%40toolars.test',
    );
  });
});
