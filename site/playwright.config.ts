import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Pre-compile every route the specs touch before parallel workers fork.
  // `next dev` compiles lazily on first hit, and concurrent cold compiles
  // transiently 500. globalSetup warms the graph once, sequentially.
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: 'http://127.0.0.1:9088',
    trace: 'on-first-retry',
  },
  webServer: {
    // Launch Next directly (pnpm isn't always on PATH in CI/sandbox). The dev
    // port matches package.json's `dev` script (127.0.0.1:9088).
    command: 'node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 9088',
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
