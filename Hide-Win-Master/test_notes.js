const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching app...');
  const electronApp = await electron.launch({ args: ['.'] });

  console.log('Waiting for first window...');
  const window = await electronApp.firstWindow();
  
  console.log('Taking startup screenshot...');
  await window.waitForTimeout(3000);
  await window.screenshot({ path: 'startup.png' });

  console.log('Navigating to notes...');
  // Find the hide-win-app element and set its currentView to 'notes'
  await window.evaluate(() => {
    const app = document.querySelector('hide-win-app');
    if (app) {
      app.currentView = 'notes';
      app.requestUpdate();
    }
  });

  await window.waitForTimeout(2000);
  await window.screenshot({ path: 'notes_view.png' });

  console.log('Clicking a note...');
  await window.evaluate(() => {
    const app = document.querySelector('hide-win-app');
    const notesView = app.shadowRoot ? app.shadowRoot.querySelector('notes-view') : document.querySelector('notes-view');
    if (notesView) {
      // If there are no notes, create one
      if (notesView.notes.length === 0) {
        notesView.createNote();
      } else {
        // Open the first note
        notesView.openNoteTab(notesView.notes[0].id);
      }
    }
  });

  await window.waitForTimeout(2000);
  await window.screenshot({ path: 'note_opened.png' });
  
  console.log('Closing app...');
  await electronApp.close();
  console.log('Done.');
})();
