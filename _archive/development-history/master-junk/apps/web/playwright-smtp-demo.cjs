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
  await page.screenshot({ path: '../scratch/smtp_01_settings_loaded.png' });

  console.log("Filling SMTP Configuration...");
  // Clear and fill the inputs
  // SMTP Host
  await page.fill('input[placeholder="e.g., smtp.sendgrid.net"]', 'smtp.fake-provider.com');
  // SMTP Port
  await page.fill('input[placeholder="e.g., 587"]', '465');
  // SMTP Username
  await page.fill('input[placeholder="Email address or API Key"]', 'testuser@fake-provider.com');
  // SMTP Password
  await page.fill('input[placeholder="App Password or API Secret"]', 'super-secret-smtp-password');
  
  await delay(500);
  await page.screenshot({ path: '../scratch/smtp_02_filled_config.png' });

  console.log("Saving Configuration...");
  await page.click('button:has-text("Save Configuration")');
  
  // Wait for success message (Configuration saved successfully!)
  await page.waitForSelector('text="Configuration saved successfully!"');
  await page.screenshot({ path: '../scratch/smtp_03_saved_success.png' });
  await delay(1000);

  console.log("Testing Configuration...");
  await page.fill('input[placeholder="Enter an email to verify settings"]', 'admin@hidewin.app');
  await page.click('button:has-text("Send Test Email")');

  // It should show sending...
  await delay(200);
  await page.screenshot({ path: '../scratch/smtp_04_sending_test.png' });

  // It should show an error after a few seconds because it's a fake SMTP server
  console.log("Waiting for error response...");
  await page.waitForSelector('text=Failed to send email', { timeout: 10000 });
  await page.screenshot({ path: '../scratch/smtp_05_test_error.png' });

  console.log("All steps completed!");
  await browser.close();
})();
