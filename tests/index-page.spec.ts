import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Виталий Гурын/);
});

test('get CTA link', async ({ page }) => {
  await page.goto('');

  const pagePromise = page.context().waitForEvent('page');

  // Click the get started link.
  await page.getByRole('link', { name: 'Написать мне' }).click();

  const newPage = await pagePromise;

  // Expect to open a new page in a tab with a URL to be t.me/talyguryn
  expect(newPage.url()).toBe('https://t.me/guryn');
});