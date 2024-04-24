import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Navigate to the site and log in before each test
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'error_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('.btn_action');
    await expect(page).toHaveTitle(/Swag Labs/);
});

test('Catch Error in order process', async ({ page }) => {
    // Select random a product from the products
    let items = await page.$$('[data-test="inventory-item-description"]')
    let randomIndex = Math.floor(Math.random() * items.length);

    // Assign the randomly selected item to a variable
    let selectedItem = items[randomIndex];

    // Find the 'Add to Cart' button for the selected item
    let selectAddToCart = await selectedItem.$('.btn_primary.btn_small.btn_inventory');

    try {
        // Attempt to click the 'Add to Cart' button
        await selectAddToCart?.click();

        // Verify that the shopping cart badge now displays '1'
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    } catch {
        // If the button click fails, throw an error
        throw new Error('Add to Cart button is not clickable');
    }

    // Find the 'Remove' button for the selected item
    let removeSelectedCart = await selectedItem.$('.btn btn_secondary btn_small btn_inventory');

    try {
        // Attempt to click the 'Remove' button
        await removeSelectedCart?.click();

        // Assert that the shopping cart badge now displays '0'
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('0');
    } catch {
        
        // If the button click fails, throw an error
        throw new Error('Failed to remove item from cart');
    }
});