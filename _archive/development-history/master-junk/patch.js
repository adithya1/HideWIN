const fs = require('fs');
const pCur = 'c:/Users/akula/Downloads/Hide-WIN/Hide-Win-Master/src/components/app/HideWinApp.js';
const pBkp = 'C:/Users/akula/Downloads/HW-BKP/Hide-Win-Master - Copy 12 - aug - 2026/src/components/app/HideWinApp.js';

let cur = fs.readFileSync(pCur, 'utf8');
let bkp = fs.readFileSync(pBkp, 'utf8');

const cssStart = bkp.indexOf('/* Stealth mode: force arrow cursor');
const cssEnd = bkp.indexOf('/* --- Global Variables --- */');
const css = bkp.substring(cssStart, cssEnd);

const jsStart = bkp.indexOf('            this._boundStealthMove = (_, pos) => {');
const jsEnd = bkp.indexOf('            ipcRenderer.on(\'click-through-toggled\',');
const js = bkp.substring(jsStart, jsEnd);

const curCssStart = cur.indexOf('/* Stealth mode: force arrow cursor');
if (curCssStart > -1) {
    const curCssEnd = cur.indexOf('/* --- Global Variables --- */');
    cur = cur.substring(0, curCssStart) + css + cur.substring(curCssEnd);
} else {
    const curVars = cur.indexOf('/* --- Global Variables --- */');
    cur = cur.substring(0, curVars) + css + cur.substring(curVars);
}

const curJsStart = cur.indexOf('            this._boundStealthMove = (_, pos) => {');
if (curJsStart > -1) {
    const curJsEnd = cur.indexOf('            ipcRenderer.on(\'stealth-click-at\'');
    // In current, there's stealth-click-at, we should replace down to that or click-through-toggled
    const endBlock = curJsEnd > -1 ? curJsEnd : cur.indexOf('            ipcRenderer.on(\'click-through-toggled\',');
    cur = cur.substring(0, curJsStart) + js + cur.substring(endBlock);
}

if (!cur.includes('class=\"fake-cursor\"')) {
    cur = cur.replace('<div class=\"app-shell', '<div class=\"fake-cursor\"></div>\\n            <div class=\"app-shell');
}

if (!cur.includes('document.body.classList.add(\'stealth-cursor\')')) {
    const helpers = cur.indexOf('// ?? Helpers ??');
    if (helpers > -1) {
        const bkpHelpers = bkp.indexOf('// ?? Helpers ??');
        const bkpUpdStart = bkp.indexOf('// Toggle stealth cursor: in live mode');
        const upd = bkp.substring(bkpUpdStart, bkpHelpers);
        cur = cur.substring(0, helpers) + upd + cur.substring(helpers);
    }
}

fs.writeFileSync(pCur, cur, 'utf8');
console.log('Patch complete!');
