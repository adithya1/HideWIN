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
  await page.screenshot({ path: '../scratch/otp_01_login_loaded.png' });

  console.log("Entering email to send OTP...");
  await page.waitForSelector('input[type="email"]');
  // Use our test account which has the hardcoded 123456 OTP in the backend
  await page.fill('input[type="email"]', 'playwrightadmin@hidewin.app');
  await page.click('button:has-text("Continue with Email")');

  console.log("Waiting for OTP UI to appear...");
  await page.waitForSelector('input[placeholder="123456"]', { timeout: 10000 });
  await delay(500);
  await page.screenshot({ path: '../scratch/otp_02_otp_sent.png' });

  console.log("Entering OTP...");
  await page.fill('input[placeholder="123456"]', '123456');
  await page.screenshot({ path: '../scratch/otp_03_otp_entered.png' });

  console.log("Clicking Verify...");
  await page.click('button:has-text("Verify Code")');

  // We should be redirected or logged in
  await delay(2000);
  await page.screenshot({ path: '../scratch/otp_04_login_success.png' });

  console.log("All steps completed!");
  await browser.close();
})();
