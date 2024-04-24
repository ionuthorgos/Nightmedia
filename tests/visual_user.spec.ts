import { test, expect } from '@playwright/test';

test('visual testing, check if the images and the list is correct', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'visual_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('.btn_action');
    await expect(page).toHaveTitle(/Swag Labs/);

    await expect(page).toHaveScreenshot('image.png');

});