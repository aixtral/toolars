import { defineConfig, devices } from '@playwright/test';

const localNoProxyHosts = ['127.0.0.1', 'localhost', '::1'];
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
  workers: process.env.CI ? 4 : 8,
  use: {
    baseURL: 'http://127.0.0.1:9088',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://127.0.0.1:9088',
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
