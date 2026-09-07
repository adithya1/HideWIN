const fs = require('fs');
const path = 'c:/Users/akula/Downloads/Hide-WIN/Hide-Win-Master/src/components/app/HideWinApp.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `<!-- Posh Gear Logo (Like Session Window) -->
                        <div style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); border-radius: 50%; color: rgba(255,255,255,0.9); margin-left: 2px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        </div>`;

const replaceStr = `<!-- App Logo (White for dark bg) -->
                        <div style="width: 26px; height: 26px; background-image: url('./assets/images/logo_white.png'); background-size: contain; background-position: center; background-repeat: no-repeat; margin-left: 6px; margin-right: 2px;">
                        </div>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully patched logo!");
} else {
    console.log("Could not find target string.");
}
