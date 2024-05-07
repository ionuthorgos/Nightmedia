import { test, expect } from '@playwright/test';

test('visual testing, check if the images and the list is correct', async ({ page }) => {
    await expect(page).toHaveScreenshot('image.png');
    // Navigating to the specified URL
    await page.goto('https://www.saucedemo.com');

    // Filling in the username field with 'visual_user'
    await page.fill('#user-name', 'visual_user');

    // Filling in the password field with 'secret_sauce'
    await page.fill('#password', 'secret_sauce');

    // Clicking the login button which has a class of 'btn_action'
    await page.click('.btn_action');

    // Checking if the title of the page matches the expected pattern using a regular expression
    await expect(page).toHaveTitle(/Swag Labs/);

    // Taking a screenshot of the current page state and expecting it to match a pre-existing screenshot named 'image.png'
    await expect(page).toHaveScreenshot('image.png');

});