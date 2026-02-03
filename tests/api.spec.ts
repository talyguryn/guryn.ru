import { test, expect } from '@playwright/test';

test('mock api response', async ({ page }) => {
  // Intercept the API request and provide a mock response
  await page.route('**/api/get-telegram-subscribers-count**', async route => {
    const response = await route.fetch();
    const json = await response.json();

    json.subscribers = 123;

    route.fulfill({ response, json });
  });

  await page.goto('/notes/get-telegram-subs-count');

  let button = page.getByRole('button', { name: 'Показать количество подписчиков' });

  await button.click();
  await expect(page.getByText('123')).toBeVisible();


  const input = page.getByRole('textbox');
  await input.fill('');
  button = page.getByRole('button', { name: 'Обновить количество подписчиков' });
  await button.click();
  await expect(page.getByText('Missing channel parameter')).toBeVisible();


  await input.fill('talyguryn');
  button = page.getByRole('button', { name: 'Обновить количество подписчиков' });
  await button.click();
  await expect(page.getByText('123')).toBeVisible();
});