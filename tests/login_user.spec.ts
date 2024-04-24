import { test, expect } from '@playwright/test';

test('Verify error handling ', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    // Complete only the user field
    await page.fill('#user-name', 'invalid user');
    await page.click('.btn_action');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');

    // Complete only the passweord field
    await page.fill('#user-name', '');
    await page.fill('#password', 'invalidPassword');
    await page.click('.btn_action');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
    await page.fill('#password', '');

    // Complete with incorect user or password
    await page.fill('#user-name', 'invalid user');
    await page.fill('#password', 'invalidPassword');
    await page.click('.btn_action');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
});

test('login performance process', async ({ page }) => {
    // Function to measure execution time
    const measureTime = async (action) => {
        // Record the current time in milliseconds
        const startTime = performance.now();
        // Wait for the passed asynchronous action to complete
        await action();
        // Record the current time again after the action has completed
        const endTime = performance.now();
        // Return the difference between end time and start time
        return endTime - startTime;
    };

    // Navigate to the website
    await page.goto('https://www.saucedemo.com');

    // Measure the time of the login process
    const duration = await measureTime(async () => {
        await page.fill('#user-name', 'performance_glitch_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('.btn_action');
    });

    expect(duration).toBeLessThan(200.000)
    // Expect the url to contain '/inventory'
    expect(page.url()).toContain('/inventory');
});




