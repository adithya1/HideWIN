const { chromium } = require('playwright');
const fs = require('fs');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  console.log("Navigating to login page...");
  await page.goto('http://localhost:5173/login');

  console.log("Taking baseline screenshot...");
  await page.screenshot({ path: '../scratch/signup_01_loaded.png' });

  console.log("Entering NEW email to send OTP...");
  await page.waitForSelector('input[type="email"]');
  // Use a completely new email that ends with @hidewin.app to trigger mock OTP
  const newEmail = `newuser_${Date.now()}@hidewin.app`;
  await page.fill('input[type="email"]', newEmail);
  await page.click('button:has-text("Continue with Email")');

  console.log("Waiting for OTP UI to appear...");
  await page.waitForSelector('input[placeholder="123456"]', { timeout: 10000 });
  await delay(500);
  await page.screenshot({ path: '../scratch/signup_02_otp_sent.png' });

  console.log("Entering OTP...");
  await page.fill('input[placeholder="123456"]', '123456');
  await page.screenshot({ path: '../scratch/signup_03_otp_entered.png' });

  console.log("Clicking Verify...");
  await page.click('button:has-text("Verify Code")');

  // We should be redirected or logged in
  await delay(2000);
  await page.screenshot({ path: '../scratch/signup_04_success.png' });

  console.log("All steps completed successfully!");
  await browser.close();
})();
