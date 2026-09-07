const fs = require('fs');
const path = require('path');

const sharedPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'sharedPageStyles.js');
let shared = fs.readFileSync(sharedPath, 'utf8');

const unifiedCSS = `
    /* Unified Toolbar Styles for Notes, Profiles, History */
    .notes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: var(--space-sm) var(--space-md); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5); flex-wrap: wrap; color: #0f172a; margin-bottom: var(--space-md); }
    .toolbar-actions { display: flex; align-items: center; gap: 8px; }
    .notes-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 12px; font-size: var(--font-size-xs); font-weight: 600; cursor: pointer; border: 1px solid rgba(59, 130, 246, 0.2); background: #ffffff; color: #0f172a; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05); }
    .notes-btn:hover { background: #f8fafc; border-color: #3b82f6; transform: translateY(-1px); }
    .notes-btn.primary { background: #185fc4; color: white; border: none; box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4); }
    .notes-btn.primary:hover { background: #1550a6; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(24, 95, 196, 0.6) !important; }
    .notes-btn.danger:hover { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); color: #f87171; }
    .notes-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s; }
    .icon-btn:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .icon-btn.active { background: #ffffff; border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
    .icon-btn svg { width: 18px; height: 18px; }
    .search-box { display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05); border-radius: 12px; padding: 4px 10px; min-width: 180px; transition: all 0.2s; height: 42px; box-sizing: border-box; flex: 1; }
    .search-box:focus-within { border-color: #3b82f6; background: #ffffff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05); }
    .search-box svg { width: 14px; height: 14px; color: #64748b; flex-shrink: 0; }
    .search-input { background: transparent; border: none; color: #0f172a; width: 100%; font-size: var(--font-size-sm); outline: none; box-shadow: none; padding: 0; }
    .search-input::placeholder { color: #94a3b8; }
    .grid-viewport { flex: 1; overflow-y: auto; padding-right: 4px; }
    .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: var(--space-md); padding-bottom: 20px; }
    .notes-list { display: flex; flex-direction: column; gap: var(--space-sm); overflow-y: auto; }
    `;

if (!shared.includes('.notes-toolbar { display: flex;')) {
    shared = shared.replace('.page-header {', unifiedCSS + '\n    .page-header {');
    fs.writeFileSync(sharedPath, shared, 'utf8');
    console.log("Injected unified CSS into sharedPageStyles.js!");
}
