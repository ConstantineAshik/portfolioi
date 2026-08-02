import { expect, test } from '@playwright/test';

for (const locale of ['en']) {
  test(`${locale} portfolio loads its core assets and navigation`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('img[alt*="Ashik"]').last()).toBeVisible();
    await expect(page.locator('a[href="/md-ashik-resume.pdf"]').first()).toBeVisible();
    await page.locator('a[href="#contact"]').first().click();
    await expect(page).toHaveURL(/#contact$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });
}

test('mobile menu supports keyboard dismissal and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
  const button = page.getByRole('button', { name: /menu/i });
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(button).toBeFocused();
});
