const { _electron: electron } = require('playwright-core');

(async () => {
    const electronApp = await electron.launch({ args: ['.'], cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master' });
    const window = await electronApp.firstWindow();
    await window.waitForLoadState('networkidle');

    const loc = window.locator('.pill-dropdown-wrapper').first();
    const box = await loc.boundingBox();
    console.log('Bounding Box:', box);

    const style = await loc.evaluate(el => {
        const comp = window.getComputedStyle(el);
        return { display: comp.display, visibility: comp.visibility, width: comp.width, height: comp.height, opacity: comp.opacity };
    });
    console.log('Computed Style:', style);

    await electronApp.close();
    process.exit(0);
})();
