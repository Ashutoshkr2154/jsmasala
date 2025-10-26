import { test, expect } from '@playwright/test';

test.describe('Add to Cart Flow', () => {
  test('should allow a user to add a product to the cart from the product page', async ({ page }) => {
    // 1. Go to the shop page
    await page.goto('/shop');

    // 2. Wait for products to load and click the first one
    await page.waitForSelector('a[href^="/product/"]');
    await page.locator('a[href^="/product/"]').first().click();

    // 3. On the PDP, wait for details and click "Add to Cart"
    await page.waitForSelector('h1'); // Wait for product title
    const productName = await page.locator('h1').textContent();
    expect(productName).toBeTruthy();

    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // 4. The cart drawer should open. Verify the item is inside.
    await page.waitForSelector('div[role="dialog"]'); // Wait for drawer
    const cartDrawer = page.locator('div[role="dialog"]');
    
    // Check if the product name in the cart matches the one from the page
    await expect(cartDrawer.locator('h3')).toHaveText(productName!);

    // 5. Verify the "Checkout" button is visible
    await expect(cartDrawer.getByRole('link', { name: 'Checkout' })).toBeVisible();
  });
});