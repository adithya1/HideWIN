const fs = require('fs');
const file = 'src/components/app/HideWinApp.js';
let text = fs.readFileSync(file, 'utf8');

const search1 = `            // Force dark theme for the minimized panel (stealth mode)
            document.documentElement.setAttribute('data-theme', 'dark');
            // Enable stealth mode (click-through)
            await ipcRenderer.invoke('set-ignore-mouse-events', true, { forward: true });
        }
    }`;

const replace1 = `            // Force dark theme for the minimized panel (stealth mode)
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }`;

const search2 = `                <div class="live-bar" 
                     @mouseenter=\${() => { if (window.require) window.require('electron').ipcRenderer.invoke('set-ignore-mouse-events', false); }}
                     @mouseleave=\${() => { if (window.require) window.require('electron').ipcRenderer.invoke('set-ignore-mouse-events', true, { forward: true }); }}
                     style="display: flex; justify-content: stretch; align-items: stretch; padding: 4px; background: transparent; position: relative; width: 100%; height: 100%; -webkit-app-region: drag; cursor: grab; box-sizing: border-box;">`;

const replace2 = `                <div class="live-bar" 
                     style="display: flex; justify-content: stretch; align-items: stretch; padding: 4px; background: transparent; position: relative; width: 100%; height: 100%; -webkit-app-region: drag; cursor: grab; box-sizing: border-box;">`;

const search3 = `                            \${this.startTime != null ? html\`
                                <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; -webkit-app-region: drag;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        \${this.renderStatusDot()}
                                        <span style="color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: 0.5px;">
                                            \${this.getElapsedTime()}
                                        </span>
                                    </div>
                                    <span style="color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Session Active</span>
                                </div>
                            \` : ''}`;

const replace3 = `                            \${this.startTime != null ? html\`
                                <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; -webkit-app-region: drag;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        \${this.renderStatusDot()}
                                        <span style="color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: 0.5px;">
                                            \${this.getElapsedTime()}
                                        </span>
                                    </div>
                                    <span style="color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Session Active</span>
                                </div>
                            \` : html\`
                                <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; -webkit-app-region: drag;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #64748b; box-shadow: 0 0 8px rgba(100,116,139,0.4);"></div>
                                        <span style="color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: 0.5px;">
                                            Ready
                                        </span>
                                    </div>
                                    <span style="color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">No Active Session</span>
                                </div>
                            \`}`;

const normalizeCRLF = str => str.replace(/\r\n/g, '\n');

if (normalizeCRLF(text).includes(normalizeCRLF(search1))) {
    text = normalizeCRLF(text).replace(normalizeCRLF(search1), replace1);
    console.log('Replaced search1');
} else { console.log('Search1 not found'); }

if (normalizeCRLF(text).includes(normalizeCRLF(search2))) {
    text = normalizeCRLF(text).replace(normalizeCRLF(search2), replace2);
    console.log('Replaced search2');
} else { console.log('Search2 not found'); }

if (normalizeCRLF(text).includes(normalizeCRLF(search3))) {
    text = normalizeCRLF(text).replace(normalizeCRLF(search3), replace3);
    console.log('Replaced search3');
} else { console.log('Search3 not found'); }

fs.writeFileSync(file, text);
console.log('Done');
