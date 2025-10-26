import { test, expect } from '@playwright/test';

test.describe('Filter and Search', () => {
  test('should allow a user to filter by category', async ({ page }) => {
    await page.goto('/shop');

    // Wait for the grid to be populated
    await page.waitForSelector('#product-grid a');
    const initialProductCount = await page.locator('#product-grid a').count();

    // 1. Click on a category filter
    await page.getByLabel('Blends').check();

    // 2. Wait for the URL to update
    await page.waitForURL('**/shop?page=1&category=Blends');

    // 3. Wait for the new products to load and verify
    // We expect the product count to change (or at least be re-rendered)
    // This is a basic check; a better one would check product titles
    await page.waitForSelector('#product-grid a');
    const filteredProductCount = await page.locator('#product-grid a').count();
    
    expect(filteredProductCount).toBeLessThanOrEqual(initialProductCount);
    
    // 4. Verify a "Blends" product is visible (this depends on mock data)
    // A more robust test would check all visible items
    await expect(page.getByText('JSM Kitchen King Masala').first()).toBeVisible();
  });
});