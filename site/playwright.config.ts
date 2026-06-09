import { defineConfig, devices } from '@playwright/test';

const localNoProxyHosts = ['127.0.0.1', 'localhost', '::1'];
const localBaseURL = 'http://127.0.0.1:9088';
const runStagingAuthRehearsal =
  process.env.TOOLARS_RUN_STAGING_AUTH_REHEARSAL === 'true';
const stagingBaseURL = process.env.TOOLARS_STAGING_BASE_URL?.replace(/\/$/, '');
const existingNoProxy = process.env.NO_PROXY ?? process.env.no_proxy ?? '';
const noProxyHosts = new Set(
  existingNoProxy
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean),
);

for (const host of localNoProxyHosts) {
  noProxyHosts.add(host);
}

process.env.NO_PROXY = [...noProxyHosts].join(',');
process.env.no_proxy = process.env.NO_PROXY;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: runStagingAuthRehearsal ? 1 : process.env.CI ? 4 : 8,
  use: {
    baseURL: runStagingAuthRehearsal ? (stagingBaseURL ?? localBaseURL) : localBaseURL,
    trace: 'on-first-retry',
  },
  webServer: runStagingAuthRehearsal ? undefined : {
    command: 'pnpm dev',
    url: localBaseURL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
