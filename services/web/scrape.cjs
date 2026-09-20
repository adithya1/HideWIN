
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://app.huddlemate.ai/dashboard', { waitUntil: 'networkidle' });
  const content = await page.content();
  console.log('URL after navigation:', page.url());
  const title = await page.title();
  console.log('Title:', title);
  
  const texts = await page.evaluate(() => document.body.innerText);
  console.log('Body Text (first 500 chars):', texts.substring(0, 500));
  
  await browser.close();
})();

