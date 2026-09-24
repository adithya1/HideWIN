import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Update the responsive CSS block to make the action bar totally minimalist on small screens
responsive_css = '''
            .action-bar-wrapper {
                flex-wrap: nowrap !important;
                justify-content: flex-start !important;
                padding: 4px 0 !important;
                gap: 4px !important;
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
            }
            .action-dropdown { flex: 0 1 auto !important; min-width: 0 !important; max-width: 140px !important; }
            .action-dropdown-content { padding: 4px 8px !important; gap: 4px !important; border-radius: 6px; }
            .action-dropdown-content:hover { background: var(--bg-hover); }
            /* Hide the large circular SVG in mode select on small screens */
            .action-dropdown-content svg:not([viewBox="0 0 24 24"]) { display: none !important; } 
            
            .action-dropdown-content span { font-size: 13px !important; }
            .mouse-toggle-wrapper { transform: scale(0.75); transform-origin: center right; margin-left: auto !important; margin-right: 4px; }
            
            .divider { display: none !important; }
            
            /* Pinned shortcuts tiny mode */
            .pinned-shortcuts-container { 
                padding: 8px !important; 
                gap: 8px !important; 
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
            }
            .pinned-shortcut-card { 
                width: 36px !important; 
                height: 36px !important; 
                padding: 0 !important; 
                border-radius: 8px !important; 
                justify-content: center !important; 
            }
            .pinned-shortcut-card > svg { margin-bottom: 0 !important; }
            .pinned-shortcut-card > span, .pinned-shortcut-card > .timestamp { display: none !important; }
'''
content = re.sub(
    r'\.action-bar-wrapper \{\s*flex-wrap: wrap !important;\s*justify-content: center;\s*padding: 6px 8px !important;\s*gap: 8px !important;\s*\}[\s\S]*?\.divider \{ display: none !important; \}',
    responsive_css,
    content
)

# Apply action-dropdown-content to the Profile Select
content = content.replace(
    '<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; cursor: pointer; width: 100%; gap: 8px;">',
    '<div class="action-dropdown-content">'
)

# Also ensure pinned shortcut cards have a title attribute for hover tooltips
# Let's add title to the existing template
content = re.sub(
    r'(<div class="pinned-shortcut-card" @click=\{\$[^}]+\}\([^)]+\)\} style="[^"]+")',
    r'\1 title=""',
    content
)
content = re.sub(
    r'(<div class="pinned-shortcut-card" @click=\{\$[^}]+\}\([^)]+\)\} style="[^"]+")',
    r'\1 title="New Note"',
    content,
    count=1 # The first one is the "Add Note" button
)


with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MainView.js for extremely small minimalist layout.")
