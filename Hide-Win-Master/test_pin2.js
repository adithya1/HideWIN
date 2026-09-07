const { _electron: electron } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

(async () => {
    try {
        console.log("Launching Electron app via Playwright...");
        const app = await electron.launch({
            args: ['.'],
            cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master'
        });

        const window = await app.firstWindow();
        await window.waitForLoadState('domcontentloaded');
        console.log("App loaded. Navigating to Notes...");

        // Inject a script to click the Notes navigation button
        await window.evaluate(() => {
            const app = document.querySelector('hide-win-app');
            app.navigate('notes');
        });
        
        await window.waitForTimeout(2000); // let notes load

        console.log("Checking Notes UI...");
        
        // Let's create a note via evaluate just to be sure we have one
        await window.evaluate(() => {
            const app = document.querySelector('hide-win-app');
            app.navigate('notes');
            const notesView = app.shadowRoot.querySelector('notes-view');
            // Mock a note in storage
            if (notesView) {
                notesView.notes = [
                    { id: 'test-playwright-123', title: 'Playwright Test Note', content: 'hello', createdAt: new Date().toLocaleString(), pinned: false }
                ];
                notesView.requestUpdate();
            }
        });
        
        await window.waitForTimeout(1000);

        console.log("Clicking Pin button...");
        // Now click the pin button via evaluate
        await window.evaluate(() => {
            const app = document.querySelector('hide-win-app');
            const notesView = app.shadowRoot.querySelector('notes-view');
            const btn = notesView.shadowRoot.querySelector('button[title="Pin to Home"]');
            if (btn) btn.click();
            else console.log("PIN BUTTON NOT FOUND");
        });
        
        await window.waitForTimeout(2000); // Wait for IPC and PowerShell to run

        // Check if shortcut was created
        const desktopPath = path.join(os.homedir(), 'OneDrive', 'Desktop');
        const files = fs.readdirSync(desktopPath);
        const lnkFiles = files.filter(f => f.startsWith('HideWin Note - Playwright Test Note') && f.endsWith('.lnk'));
        
        console.log(`Found ${lnkFiles.length} HideWin shortcuts on Desktop:`, lnkFiles);

        if (lnkFiles.length === 0) {
            console.error("FAILED: Desktop shortcut was NOT created!");
        } else {
            console.log("SUCCESS: Desktop shortcut WAS created!");
        }

        console.log("Navigating to Home to check pinned shortcuts...");
        await window.evaluate(() => {
            const app = document.querySelector('hide-win-app');
            app.navigate('main');
        });
        await window.waitForTimeout(1000);

        const pinnedExists = await window.evaluate(() => {
            const app = document.querySelector('hide-win-app');
            const mainView = app.shadowRoot.querySelector('main-view');
            const card = mainView.shadowRoot.querySelector('.pinned-shortcut-card');
            return !!card;
        });
        
        if (!pinnedExists) {
            console.error("FAILED: Note did not appear in Home window Pinned Shortcuts!");
        } else {
            console.log("SUCCESS: Note appeared in Home window Pinned Shortcuts!");
        }

        await app.close();
        console.log("Test finished.");
    } catch (e) {
        console.error("Test error:", e);
    }
})();
