const { _electron: electron } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

(async () => {
    console.log("Launching Electron app via Playwright...");
    const app = await electron.launch({
        args: ['.'],
        cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master'
    });

    const window = await app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    console.log("App loaded. Navigating to Notes...");

    // Click the Notes tab in the sidebar
    await window.click('button:has-text("Notes")');
    await window.waitForTimeout(1000); // let notes load

    console.log("Checking Notes UI...");
    const notesView = window.locator('notes-view');
    
    // Find the first pin button
    // It has the title "Pin to Home" or "Unpin from Home"
    // The selector needs to penetrate the shadow DOM if any, but in LitElement Playwright can sometimes pierce it automatically, or we use .locator()
    
    // Playwright locator engine pierces shadow DOM automatically!
    const pinButton = window.locator('button[title="Pin to Home"], button[title="Unpin from Home"]').first();
    
    const count = await pinButton.count();
    if (count === 0) {
        console.log("No pin buttons found! Creating a note first...");
        // Click Add Note
        await window.click('button:has-text("New Note")');
        await window.waitForTimeout(500);
        await window.fill('textarea', 'Test Note for Playwright');
        await window.click('button:has-text("Save")');
        await window.waitForTimeout(1000);
    }

    console.log("Clicking Pin button...");
    await pinButton.click();
    await window.waitForTimeout(2000); // Wait for IPC and PowerShell to run

    // Check if shortcut was created
    const desktopPath = path.join(os.homedir(), 'OneDrive', 'Desktop');
    const files = fs.readdirSync(desktopPath);
    const lnkFiles = files.filter(f => f.startsWith('HideWin Note') && f.endsWith('.lnk'));
    
    console.log(`Found ${lnkFiles.length} HideWin shortcuts on Desktop:`, lnkFiles);

    if (lnkFiles.length === 0) {
        console.error("FAILED: Desktop shortcut was NOT created!");
    } else {
        console.log("SUCCESS: Desktop shortcut WAS created!");
    }

    console.log("Navigating to Home to check pinned shortcuts...");
    await window.click('button:has-text("Home")');
    await window.waitForTimeout(1000);

    const pinnedCard = window.locator('.pinned-shortcut-card').nth(1); // 0 is "Add"
    const pinnedCount = await pinnedCard.count();
    
    if (pinnedCount === 0) {
        console.error("FAILED: Note did not appear in Home window Pinned Shortcuts!");
    } else {
        console.log("SUCCESS: Note appeared in Home window Pinned Shortcuts!");
    }

    await app.close();
    console.log("Test finished.");
})();
