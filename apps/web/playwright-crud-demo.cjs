const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = 'C:\\Users\\akula\\.gemini\\antigravity\\brain\\8534ce1f-a9b0-41bc-9b01-8477b556d572\\scratch';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log("Navigating to admin login page...");
  await page.goto('http://localhost:5173/admin_hw');
  
  await page.waitForSelector('input[type="email"]');
  await page.fill('input[type="email"]', 'playwrightadmin@hidewin.app');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button:has-text("Log In")');

  console.log("Waiting for dashboard to load...");
  await page.waitForSelector('text="Users"', { timeout: 10000 });
  await delay(1000);

  // Go to Users Tab
  await page.click('button:has-text("Users")');
  await delay(500);
  
  console.log("Taking baseline screenshot...");
  await page.screenshot({ path: path.join(outDir, '01_before_add.png') });

  // 1. ADD USER
  console.log("Adding user...");
  await page.click('button:has-text("+ Add User")');
  await delay(500);
  await page.screenshot({ path: path.join(outDir, '02_add_modal.png') });

  await page.fill('input[type="email"]', 'playwright@test.com');
  await page.fill('input[type="password"]', 'playwright123');
  await page.click('button:has-text("Save Changes")');
  await delay(1500);
  await page.screenshot({ path: path.join(outDir, '03_user_added.png') });

  // 2. UPDATE USER
  console.log("Updating user...");
  // Find the row for playwright@test.com
  const rowLocator = page.locator('tr', { hasText: 'playwright@test.com' });
  await rowLocator.locator('button[title="Edit User"]').click();
  await delay(500);
  await page.screenshot({ path: path.join(outDir, '04_edit_modal.png') });

  await page.selectOption('select.select-field', 'ADMIN');
  await page.click('button:has-text("Save Changes")');
  await delay(1500);
  await page.screenshot({ path: path.join(outDir, '05_user_updated.png') });

  // 3. DELETE USER
  console.log("Deleting user...");
  await rowLocator.locator('button[title="Delete User"]').click();
  await delay(500);
  await page.screenshot({ path: path.join(outDir, '06_delete_modal.png') });

  await page.click('button:has-text("Delete Permanently")');
  await delay(1500);
  await page.screenshot({ path: path.join(outDir, '07_user_deleted.png') });

  console.log("All steps completed!");
  await browser.close();
})();
