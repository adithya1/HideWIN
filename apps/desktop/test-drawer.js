const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    const userDataDir = path.join(__dirname, 'electron-profile');
    
    // Launch electron app via playwright
    const browser = await chromium.launchPersistentContext(userDataDir, {
        executablePath: require('electron/index.js'),
        args: ['.'],
        headless: false
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    let mainPage = null;
    for (const page of browser.pages()) {
        const url = page.url();
        if (url.includes('index.html') && !url.includes('stealth')) {
            mainPage = page;
            break;
        }
    }
    
    if (!mainPage) {
        console.error("Main page not found!");
        process.exit(1);
    }

    // Set mobile viewport
    await mainPage.setViewportSize({ width: 400, height: 800 });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click hamburger button
    await mainPage.evaluate(() => {
        const app = document.querySelector('hide-win-app');
        if (app) {
            const btn = app.shadowRoot.querySelector('.hamburger-btn');
            if (btn) btn.click();
        }
    });
    
    await new Promise(r => setTimeout(r, 1000)); // wait for drawer animation
    
    await mainPage.screenshot({ path: 'C:\\Users\\akula\\.gemini\\antigravity\\brain\\212ef657-5e3a-4e07-a36e-79cca9f7fb5c\\screenshot_drawer.png' });
    
    await browser.close();
    console.log("Drawer screenshot taken!");
})();
