import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Navigate to the site and log in before each test
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('.btn_action');
    await expect(page).toHaveTitle(/Swag Labs/);
});

test('Order process', async ({ page }) => {
    // Select random a product from the inventory
    let items = await page.$$('[data-test="inventory-item-description"]')
    let randomIndex = Math.floor(Math.random() * items.length);
    let selectedItem = items[randomIndex];

    // Extract the price, removing any non-numeric characters (assuming price is in format $123)
    let selectedPrice = (await (await selectedItem.$('[data-test="inventory-item-price"]'))?.innerText())?.substring(1)

    // Click the 'Add to Cart' button for the selected item
    let selectAddToCart = await selectedItem.$('.btn_primary.btn_small.btn_inventory');
    await selectAddToCart?.click();

    // Go to the shopping cart
    await page.click('[data-test="shopping-cart-link"]');

    // Verify that the selected item's price is as expected in the cart
    if (selectedPrice !== undefined) {
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText("$" + await selectedPrice);
    } else {
        console.error('selectedPrice is undefined');
    }

    // Proceed with the checkout process
    await page.click('[name="checkout"]');

    // Fill in the required fields
    await page.fill('[name="firstName"]', 'ionut test');
    await page.fill('[name="lastName"]', 'Horgos test');
    await page.fill('[name="postalCode"]', '124124');
    await page.click('[data-test="continue"]');

    // Confirm you're on the checkout overview page
    await expect(page.url()).toBe('https://www.saucedemo.com/checkout-step-two.html');

    // Verify the shipping information and total price
    await expect(page.locator('[data-test="shipping-info-label"]')).toHaveText('Shipping Information:');
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');

    // Assert the presence of the price total label
    await expect(page.locator('[data-test="total-info-label"]')).toHaveText('Price Total');

    // Assert the item price is correctly displayed on the checkout overview page
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText(`Item total: $${await selectedPrice}`);

    // I don't see how I can calculate the tax fees in order to have a validation for the Total price

    // Finish the checkout action
    await page.click('[data-test="finish"]');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await page.click('[data-test="back-to-products"]');

    // Confirm you're on the checkout overview page
    await expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
});

test('prices are sorted in ascending order', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('Price (low to high)'); // Click to open the dropdown

    let prices = await page.$$('[data-test="inventory-item-price"]')
    let priceTexts = await Promise.all(prices.map(async price => {
        const text = await price.innerText();
        return text.substring(1); // Removes the first character
    }));

    let priceNumbers = priceTexts.map(price => parseFloat(price))

    console.log(priceTexts);
    // Check if an array is sorted ascending
    function isSortedAscending(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i - 1] > arr[i]) {
                return false;
            }
        }
        return true;
    }

    let sorted = isSortedAscending(priceNumbers)
    expect(sorted).toBe(true);
});

test('prices are sorted in descending order', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('Price (high to low)');

    let prices = await page.$$('[data-test="inventory-item-price"]')
    let priceTexts = await Promise.all(prices.map(async price => {
        const text = await price.innerText();
        return text.substring(1); // Removes the first character
    }));

    let priceNumbers = priceTexts.map(price => parseFloat(price))

    // Check if an array is sorted descending
    function isSortedDescending(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i - 1] < arr[i]) {
                return false;
            }
        }
        return true;
    }

    const isSorted = isSortedDescending(priceNumbers);
    expect(isSorted).toBe(true);
});


// More scenarious that can be added are:
// 1. Add to card -> Navigate to Your Cart -> Remove button
// 2. Sort by Name (A to Z)
// 3. Sort by Name (Z to A)