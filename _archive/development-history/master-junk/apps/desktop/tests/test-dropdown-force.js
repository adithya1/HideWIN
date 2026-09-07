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

    console.log('Force clicking Mode dropdown...');
    await window.evaluate(() => {
        function findElementDeep(root, selector) {
            if (!root) return null;
            let el = root.querySelector(selector);
            if (el) return el;
            
            const children = Array.from(root.children).filter(c => c.shadowRoot || c.tagName.includes('-'));
            for (let child of children) {
                if (child.shadowRoot) {
                    el = findElementDeep(child.shadowRoot, selector);
                    if (el) return el;
                }
                el = findElementDeep(child, selector);
                if (el) return el;
            }
            return null;
        }
        const dropdown = findElementDeep(document.body, '.pill-dropdown-wrapper');
        if (dropdown) dropdown.click();
    });
    await window.waitForTimeout(1000);

    const screenshotPath = 'C:\\Users\\akula\\.gemini\\antigravity\\brain\\212ef657-5e3a-4e07-a36e-79cca9f7fb5c\\screenshot_dropdown2.png';
    await window.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to ' + screenshotPath);

    await electronApp.close();
    process.exit(0);
})();
