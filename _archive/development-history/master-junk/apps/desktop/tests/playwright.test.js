const { _electron: electron } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
    console.log('====================================================');
    console.log('  Running Playwright Launch & Window Test');
    console.log('====================================================\n');

    try {
        console.log('[1/4] Launching Electron app with Playwright...');
        const electronApp = await electron.launch({
            args: [path.join(__dirname, '../src/index.js')],
        });

        const window = await electronApp.firstWindow();
        
        console.log('   ✓ Window created. Title:', await window.title());

        await window.waitForLoadState('domcontentloaded');

        // Test 1: Check initial window visibility
        console.log('[2/4] Verifying initial window visibility...');
        const isVisibleInitial = await electronApp.evaluate(async ({ BrowserWindow }) => {
            const win = BrowserWindow.getAllWindows()[0];
            return win ? win.isVisible() : false;
        });
        console.log('   ✓ Window initial visibility state:', isVisibleInitial);
        assert.strictEqual(isVisibleInitial, true, 'Window should be visible initially');

        // Test 2: Verify custom element <hide-win-app> is loaded
        console.log('[3/4] Verifying application element <hide-win-app>...');
        const initialView = await window.evaluate(() => {
            const app = document.querySelector('hide-win-app');
            return app ? app.currentView : null;
        });
        console.log('   ✓ Application current view:', initialView);
        assert.ok(initialView === 'main' || initialView === 'onboarding', 'App view should be main or onboarding');

        // Test 3: Toggle visibility (Hide)
        console.log('[4/4] Testing toggle-window-visibility (Hide)...');
        await window.evaluate(async () => {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('toggle-window-visibility');
        });

        const isVisibleHidden = await electronApp.evaluate(async ({ BrowserWindow }) => {
            const win = BrowserWindow.getAllWindows()[0];
            return win ? win.isVisible() : false;
        });
        console.log('   ✓ Window visibility state after hide:', isVisibleHidden);
        assert.strictEqual(isVisibleHidden, false, 'Window should be hidden after toggle-window-visibility');

        console.log('\n====================================================');
        console.log('🎉 PLAYWRIGHT ELECTRON WINDOW TEST PASSED SUCCESSFULLY!');
        console.log('====================================================\n');

        await electronApp.close();
        process.exit(0);
    } catch (err) {
        console.error('\n❌ PLAYWRIGHT TEST FAILED:', err);
        process.exit(1);
    }
})();
