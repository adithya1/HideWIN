import re
import os

with open('mainview_styles.txt', 'r', encoding='utf-8') as f:
    styles = f.read()

# Replace any ::-webkit-scrollbar in the original styles to avoid duplicates
styles = re.sub(r'::-webkit-scrollbar\s*\{.*?\}', '', styles, flags=re.DOTALL)

# Add our custom layout locks to the styles
custom_layout_css = """
        /* Home Container Locks (No scroll on main window) */
        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 40px 60px;
            box-sizing: border-box;
            background: var(--bg-app);
            overflow: hidden !important; 
        }
        .pinned-shortcuts-wrapper {
            width: 100%;
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            margin-top: 8px;
        }
        .pinned-shortcuts-container {
            width: 100%;
            max-width: 100%;
            display: grid;
            gap: 16px;
            padding: 24px;
            border: 1px solid var(--border);
            border-radius: 16px;
            background: var(--bg-surface);
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            overflow-y: auto !important;
            flex: 1;
            align-content: start;
        }

        /* POSH LEAN SCROLLBAR (Exclusively for pinned-shortcuts-container) */
        ::-webkit-scrollbar { width: 6px !important; height: 6px !important; background-color: transparent !important; }
        ::-webkit-scrollbar-track { background: transparent !important; }
        ::-webkit-scrollbar-thumb { background-color: #d4d4d8 !important; border-radius: 10px !important; border: 2px solid transparent !important; background-clip: padding-box !important; }
        ::-webkit-scrollbar-thumb:hover { background-color: #a1a1aa !important; }
        ::-webkit-scrollbar-button:single-button:vertical:decrement { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1aa'><path d='M7 14l5-5 5 5z'/></svg>") !important; background-size: 8px !important; background-position: center !important; background-repeat: no-repeat !important; height: 12px !important; display: block !important; }
        ::-webkit-scrollbar-button:single-button:vertical:increment { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1aa'><path d='M7 10l5 5 5-5z'/></svg>") !important; background-size: 8px !important; background-position: center !important; background-repeat: no-repeat !important; height: 12px !important; display: block !important; }
"""

styles = styles + custom_layout_css

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the empty static styles = css`...` with the restored styles
code = re.sub(r'static styles = css`.*?`;', 'static styles = css`' + styles + '`;', code, flags=re.DOTALL)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("MainView CSS repaired and layout locked!")
