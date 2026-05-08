import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',

  projects: [
    {
      name: 'local',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3000' },
      testIgnore: '**/live.spec.js',
    },
    {
      name: 'local-mobile',
      use: { ...devices['Pixel 5'], baseURL: 'http://localhost:3000' },
      testMatch: '**/portfolio.spec.js',
    },
    {
      name: 'live',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.PORTFOLIO_URL || 'http://localhost:3000',
      },
      testMatch: '**/live.spec.js',
    },
  ],

  webServer: {
    command: 'npx serve . -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
