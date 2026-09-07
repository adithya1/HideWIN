const { _electron: electron } = require('playwright');
const path = require('path');
const assert = require('assert');

async function testResponsiveLayout() {
    console.log('====================================================');
    console.log('  Running Responsive UI/UX Tests (Mobile, Tab, PC)');
    console.log('====================================================\n');

    let electronApp;
    try {
        electronApp = await electron.launch({
            args: [path.join(__dirname, '../src/index.js')],
        });

        const window = await electronApp.firstWindow();
        await window.waitForLoadState('domcontentloaded');
        
        // Wait for app to exist
        await window.waitForFunction(() => !!document.querySelector('hide-win-app'));

        // Bypass onboarding if it's active
        console.log('Bypassing onboarding...');
        await window.evaluate(async () => {
            const app = document.querySelector('hide-win-app');
            if (app && app.handleOnboardingComplete) {
                app.handleOnboardingComplete();
            }
        });

        console.log('Waiting for main-view component to render...');
        // Wait for Lit components to render
        await window.waitForFunction(() => {
            const app = document.querySelector('hide-win-app');
            return app && app.shadowRoot && app.shadowRoot.querySelector('main-view');
        });

        const getStyles = async (selector, isMainView = false) => {
            return await window.evaluate(({ selector, isMainView }) => {
                const app = document.querySelector('hide-win-app');
                if (!app || !app.shadowRoot) return null;
                
                let el;
                if (isMainView) {
                    const mainView = app.shadowRoot.querySelector('main-view');
                    if (!mainView || !mainView.shadowRoot) return null;
                    el = mainView.shadowRoot.querySelector(selector);
                } else {
                    el = app.shadowRoot.querySelector(selector);
                }
                
                if (!el) return null;
                const computed = window.getComputedStyle(el);
                return {
                    display: computed.display,
                    flexDirection: computed.flexDirection,
                    position: computed.position,
                    width: computed.width,
                    maxWidth: computed.maxWidth,
                    padding: computed.padding,
                    overflowY: computed.overflowY
                };
            }, { selector, isMainView });
        };

        const setSize = async (width, height) => {
            await electronApp.evaluate(async ({ BrowserWindow }, { width, height }) => {
                const win = BrowserWindow.getAllWindows()[0];
                win.setSize(width, height);
            }, { width, height });
            // Wait for resize observer and CSS to apply
            await window.waitForTimeout(500);
        };

        console.log('[1/3] Testing PC UI/UX (1280x720) ...');
        await setSize(1280, 720);
        
        let topToolbarPC = await getStyles('.top-toolbar', false);
        assert.strictEqual(topToolbarPC.flexDirection, 'row', 'PC Top Toolbar should be horizontal');
        assert.notStrictEqual(topToolbarPC.position, 'absolute', 'PC Top Toolbar should not be absolute drawer');
        
        let homeContainerPC = await getStyles('.home-container', true);
        assert.strictEqual(homeContainerPC.overflowY, 'auto', 'PC Home Container should be scrollable');
        
        let formWrapperPC = await getStyles('.form-wrapper', true);
        assert.strictEqual(formWrapperPC.maxWidth, '420px', 'PC Form Wrapper should have max-width 420px');

        console.log('   dYZ% PC UI/UX tests passed (Horizontal Navigation, Centered 420px Form, Scrollable Container)');


        console.log('\n[2/3] Testing Tablet UI/UX (800x1024) ...');
        await setSize(800, 1024);
        
        let topToolbarTab = await getStyles('.top-toolbar', false);
        assert.strictEqual(topToolbarTab.flexDirection, 'row', 'Tablet Top Toolbar should remain horizontal');
        assert.notStrictEqual(topToolbarTab.position, 'absolute', 'Tablet Top Toolbar should not be drawer');
        
        let formWrapperTab = await getStyles('.form-wrapper', true);
        assert.strictEqual(formWrapperTab.maxWidth, '420px', 'Tablet Form Wrapper should have max-width 420px');

        console.log('   dYZ% Tablet UI/UX tests passed (Horizontal Navigation, Centered 420px Form)');


        console.log('\n[3/3] Testing Mobile UI/UX (400x800) ...');
        await setSize(400, 800);
        
        let topToolbarMobile = await getStyles('.top-toolbar', false);
        assert.strictEqual(topToolbarMobile.flexDirection, 'column', 'Mobile Top Toolbar should be vertical');
        assert.strictEqual(topToolbarMobile.position, 'absolute', 'Mobile Top Toolbar should be an absolute drawer');
        
        let formWrapperMobile = await getStyles('.form-wrapper', true);
        assert.strictEqual(formWrapperMobile.maxWidth, 'none', 'Mobile Form Wrapper should expand to 100% width');

        console.log('   dYZ% Mobile UI/UX tests passed (Vertical Drawer Navigation, Full-width Responsive Form)');

        console.log('\n====================================================');
        console.log('dYZ% RESPONSIVE UI/UX TEST SUITE PASSED SUCCESSFULLY!');
        console.log('====================================================\n');

    } catch (err) {
        console.error('\n?O PLAYWRIGHT TEST FAILED:', err);
        process.exit(1);
    } finally {
        if (electronApp) await electronApp.close();
    }
}

testResponsiveLayout();
