import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the solid blue header with a premium glassy header
old_header_css = """            .mobile-app-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                height: 60px;
                background: #3b82f6;
                padding: 0 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 100;
                flex-shrink: 0;
            }
            .mobile-header-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                cursor: pointer;
                background: transparent;
            }
            .mobile-header-title {
                color: #ffffff;
                font-size: 18px;
                font-weight: 600;
                letter-spacing: 0.5px;
                flex: 1;
                text-align: center;
            }"""

new_header_css = """            .mobile-app-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                height: 60px;
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                padding: 0 16px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                z-index: 100;
                flex-shrink: 0;
            }
            :host-context(html[data-theme='dark']) .mobile-app-header,
            html[data-theme='dark'] .mobile-app-header {
                background: rgba(30, 41, 59, 0.7);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .mobile-header-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-primary);
                cursor: pointer;
                background: transparent;
                transition: background 0.2s ease;
            }
            .mobile-header-btn:active {
                background: rgba(0, 0, 0, 0.05);
            }
            .mobile-header-title {
                color: var(--text-primary);
                font-size: 17px;
                font-weight: 600;
                letter-spacing: 0.3px;
                flex: 1;
                text-align: center;
            }"""

if old_header_css in code:
    code = code.replace(old_header_css, new_header_css)
    print("Replaced mobile-app-header CSS.")
else:
    print("Could not find old mobile-app-header CSS.")

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)
