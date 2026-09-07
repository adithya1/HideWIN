const { _electron: electron } = require('playwright-core');

(async () => {
    console.log('Launching Electron app...');
    const electronApp = await electron.launch({
        args: ['.'],
        cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master'
    });

    console.log('Waiting for app to start...');
    const window = await electronApp.firstWindow();
    await window.waitForLoadState('networkidle');

    console.log('Clicking Mode dropdown...');
    await window.click('.pill-dropdown-wrapper:first-child');
    await window.waitForTimeout(500);

    const screenshotPath = 'C:\\Users\\akula\\.gemini\\antigravity\\brain\\212ef657-5e3a-4e07-a36e-79cca9f7fb5c\\screenshot_dropdown.png';
    await window.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to ' + screenshotPath);

    await electronApp.close();
    process.exit(0);
})();
