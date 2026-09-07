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

  console.log("Navigating to admin login page...");
  await page.goto('http://localhost:5173/admin_hw');

  // Login
  await page.waitForSelector('input[type="email"]');
  await page.fill('input[type="email"]', 'playwrightadmin@hidewin.app');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button:has-text("Log In")');

  console.log("Waiting for dashboard to load...");
  await page.waitForSelector('text="Users"', { timeout: 10000 });
  await delay(1000);

  // Go to Settings Tab
  console.log("Navigating to Settings...");
  await page.click('button:has-text("Settings")');
  await delay(1000);

  // Go to Security & Auth
  await page.click('button:has-text("Security & Auth")');
  await delay(1000);
  
  console.log("Taking baseline screenshot...");
  await page.screenshot({ path: '../scratch/gmail_01_settings_loaded.png' });

  console.log("Clicking Test Environment (Gmail) button...");
  await page.click('button:has-text("Test Environment (Gmail)")');
  await delay(500);

  console.log("Taking screenshot of auto-filled Gmail settings...");
  await page.screenshot({ path: '../scratch/gmail_02_button_clicked.png' });

  console.log("All steps completed!");
  await browser.close();
})();
