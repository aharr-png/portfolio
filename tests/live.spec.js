/**
 * Public accessibility tests — run after deploying to Vercel:
 *   PORTFOLIO_URL=https://augustharris.vercel.app npm run test:live
 */
import { test, expect } from '@playwright/test';

test.skip(!process.env.PORTFOLIO_URL, 'Set PORTFOLIO_URL to run live tests');

test('deployed site returns 200', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
});

test('deployed site has correct page title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/August/);
});

test('deployed site loads all sections', async ({ page }) => {
  await page.goto('/');
  for (const id of ['hero', 'about', 'skills', 'projects', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test('deployed site shows full name in hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-name')).toContainText('August Timothy Harris');
});

test('Finance Flow GitHub link is reachable', async ({ request }) => {
  const response = await request.get('https://github.com/CS196Illinois/SP26-Group7');
  expect([200, 301, 302]).toContain(response.status());
});
