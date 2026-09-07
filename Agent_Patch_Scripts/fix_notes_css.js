const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'NotesView.js');
let text = fs.readFileSync(p, 'utf8');

// We need to completely wipe out all the local CSS that is now shared.
// We'll replace the entire css`...` block in NotesView.js with a minimal one containing only what's strictly unique to Notes (like upload progress).

const minimalCss = `
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: transparent;
                color: var(--text-primary);
                font-family: var(--font);
                overflow: hidden;
            }

            .notes-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: var(--space-md);
                gap: var(--space-md);
                box-sizing: border-box;
            }

            .upload-progress-card {
                background: rgba(38, 40, 48, 0.6);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }
            .upload-progress-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .upload-progress-file {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                font-size: var(--font-size-sm);
                color: var(--text-primary);
                font-weight: 500;
            }
            .upload-progress-file svg {
                width: 16px;
                height: 16px;
                color: var(--accent);
            }
            .upload-progress-eta {
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }
            .upload-progress-track {
                height: 6px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 3px;
                overflow: hidden;
            }
            .upload-progress-fill {
                height: 100%;
                background: var(--accent);
                transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
`;

const regex = /css\`[\s\S]*?\`/s;
text = text.replace(regex, "css`" + minimalCss + "`");
fs.writeFileSync(p, text, 'utf8');
console.log("Stripped redundant CSS from NotesView.js!");
