import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ── Section presence ──────────────────────────────────────────────────────────

test('all required sections are present', async ({ page }) => {
  await expect(page.locator('#hero')).toBeVisible();
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('#skills')).toBeVisible();
  await expect(page.locator('#projects')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
});

test('navbar links point to all sections', async ({ page }) => {
  const isMobile = page.viewportSize()?.width < 768;

  if (isMobile) {
    // On mobile the links are behind the hamburger — open it first
    await page.locator('#navToggle').click();
  }

  const links = ['#about', '#skills', '#projects', '#contact'];
  for (const href of links) {
    await expect(page.locator(`.nav-links a[href="${href}"]`)).toBeVisible();
  }
});

// ── Hero / intro ──────────────────────────────────────────────────────────────

test('hero shows full name', async ({ page }) => {
  await expect(page.locator('.hero-name')).toContainText('August Timothy Harris');
});

test('hero shows role', async ({ page }) => {
  await expect(page.locator('.hero-role')).not.toBeEmpty();
  await expect(page.locator('.hero-role')).not.toContainText('Lorem');
});

test('hero has View My Work and Contact Me buttons', async ({ page }) => {
  await expect(page.locator('a.btn-primary')).toContainText('View My Work');
  await expect(page.locator('a.btn-outline')).toContainText('Contact Me');
});

// ── About ─────────────────────────────────────────────────────────────────────

test('about section has real content', async ({ page }) => {
  const text = await page.locator('.about-card p').innerText();
  expect(text.trim().length).toBeGreaterThan(50);
});

test('about section has at least 3 sentences', async ({ page }) => {
  const text = await page.locator('.about-card p').innerText();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  expect(sentences.length).toBeGreaterThanOrEqual(3);
});

test('about mentions August by name', async ({ page }) => {
  await expect(page.locator('.about-card')).toContainText('August');
});

// ── Skills ────────────────────────────────────────────────────────────────────

test('skills section has at least 4 skill chips', async ({ page }) => {
  const chips = page.locator('.skill-chip');
  await expect(chips).toHaveCount(6);
});

test('skills include Python and Java', async ({ page }) => {
  const skills = await page.locator('.skill-chip').allInnerTexts();
  expect(skills).toContain('Python');
  expect(skills).toContain('Java');
});

// ── Projects ──────────────────────────────────────────────────────────────────

test('at least one project card exists', async ({ page }) => {
  await expect(page.locator('.project-card')).toHaveCount(1);
});

test('Finance Flow card has title', async ({ page }) => {
  await expect(page.locator('.project-title')).toContainText('Finance Flow');
});

test('Finance Flow card has a description', async ({ page }) => {
  const desc = await page.locator('.project-description').innerText();
  expect(desc.trim().length).toBeGreaterThan(30);
});

test('Finance Flow card has technology badges', async ({ page }) => {
  const badges = page.locator('.tech-badge');
  const count = await badges.count();
  expect(count).toBeGreaterThanOrEqual(3);
});

test('Finance Flow card has a GitHub link', async ({ page }) => {
  const link = page.locator('.project-link');
  await expect(link).toBeVisible();
  const href = await link.getAttribute('href');
  expect(href).toContain('github.com');
});

// ── Contact ───────────────────────────────────────────────────────────────────

test('contact section shows email link', async ({ page }) => {
  const email = page.locator('a[href^="mailto:"]');
  await expect(email).toBeVisible();
  await expect(email).toContainText('augustharris2007@gmail.com');
});

test('contact section shows GitHub link', async ({ page }) => {
  const github = page.locator('#contact a[href*="github.com"]');
  await expect(github).toBeVisible();
  await expect(github).toContainText('aharr-png');
});

// ── No placeholder text ───────────────────────────────────────────────────────

test('page contains no placeholder text', async ({ page }) => {
  const body = await page.locator('body').innerText();
  const forbidden = ['Lorem ipsum', 'placeholder', 'Coming soon', 'TODO', 'FIXME', '[Your'];
  for (const phrase of forbidden) {
    expect(body).not.toContain(phrase);
  }
});

// ── Page metadata ─────────────────────────────────────────────────────────────

test('page title contains the name', async ({ page }) => {
  await expect(page).toHaveTitle(/August/);
});

// ── Mobile responsiveness ─────────────────────────────────────────────────────

test('all sections are visible on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const id of ['hero', 'about', 'skills', 'projects', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test('no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(375);
});
