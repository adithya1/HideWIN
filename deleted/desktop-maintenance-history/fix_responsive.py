import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS rules
css_rules = '''
        .primary-action-btn {
            border-radius: 8px;
            padding: 10px 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border: none;
            outline: none;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: all 0.2s;
            background: var(--accent);
            color: #ffffff;
            white-space: nowrap;
        }
        .primary-action-btn:hover {
            background: var(--accent-hover);
        }
        .primary-action-btn.active {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid var(--accent);
            color: var(--accent);
            box-shadow: none;
        }

        .action-dropdown-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 0;
            cursor: pointer;
            width: 100%;
        }

        .mouse-toggle-wrapper {
            margin-left: auto;
            display: flex;
            align-items: center;
        }

        .action-buttons-wrapper {
            display: flex;
            gap: 12px;
            margin-left: 12px;
        }

        /* Very Small Window Responsive Rules */
        @media (max-width: 750px) {
            :host { padding: var(--space-md) var(--space-sm) !important; }
            .home-container { padding: 8px !important; }
            
            .action-bar-wrapper {
                flex-direction: row !important;
                padding: 6px 8px !important;
                gap: 6px !important;
                border-radius: 6px !important;
            }
            .action-bar-wrapper > .divider {
                margin: 0 8px !important;
            }

            .action-dropdown-content { gap: 4px !important; }
            .action-dropdown-content svg { width: 14px; height: 14px; }
            .action-dropdown-content span { font-size: 13px !important; }
            
            .mouse-toggle-wrapper { transform: scale(0.85); transform-origin: right center; margin-left: 4px !important; }
            
            .action-buttons-wrapper { gap: 6px !important; margin-left: 6px !important; }
            
            /* Make buttons icon-only and circular */
            .primary-action-btn {
                padding: 8px !important;
                width: 32px;
                height: 32px;
                border-radius: 50% !important;
            }
            .primary-action-btn span {
                display: none;
            }
            .primary-action-btn svg {
                width: 16px; height: 16px;
                margin: 0 !important;
            }
        }
'''

# Insert the CSS right before @keyframes errorShake
content = content.replace('@keyframes errorShake', css_rules + '\n        @keyframes errorShake')

# Also replace the old @media (max-width: 650px) for action-bar-wrapper so it doesn't conflict
old_media = '''        @media (max-width: 650px) {
            .action-bar-wrapper { flex-direction: column; border-radius: 8px; padding: 16px; gap: 12px; }
            .action-bar-wrapper .action-dropdown { max-width: 100% !important; width: 100%; }
            .action-bar-wrapper .action-spacer { display: none; }
            .action-bar-wrapper .divider { width: 100%; margin: 4px 0; }
            .action-bar-wrapper .action-buttons { width: 100%; justify-content: space-between; flex-direction: column; }
            .action-bar-wrapper .action-buttons button { width: 100%; margin-top: 8px; }
        }'''
content = content.replace(old_media, '')

# Now replace the inline styles in HTML
content = re.sub(r'style="display: flex; gap: 12px; margin-left: 12px;"', 'class="action-buttons-wrapper"', content)

# 1. Started button
content = re.sub(
    r'<button class="start-btn-blue" @click=\{\(\) => this\._handleStart\(\)\} style="border-radius: 8px; padding: 14px 40px; display: flex; align-items: center; gap: 8px; border: none; outline: none; box-shadow: 0 1px 3px rgba\(0,0,0,0\.1\); background: rgba\(59, 130, 246, 0\.1\); border: 1px solid var\(--accent\); color: var\(--accent\); font-weight: 600; font-size: 15px; letter-spacing: 0\.5px; cursor: pointer; transition: all 0\.2s;">',
    '<button class="primary-action-btn active" @click=>',
    content
)

# 2. Resume button
content = re.sub(
    r'<button class="start-btn-blue" @click=\{\(\) => this\._handleStart\(\)\} style="border-radius: 8px; padding: 14px 40px; display: flex; align-items: center; gap: 8px; border: none; outline: none; box-shadow: 0 1px 3px rgba\(0,0,0,0\.1\); font-weight: 600; font-size: 15px; letter-spacing: 0\.5px; cursor: pointer;">',
    '<button class="primary-action-btn" @click=>',
    content
)

# 3. Mouse Toggle wrapper replacement
content = re.sub(
    r'<div style="margin-left: auto; display: flex; align-items: center;"',
    '<div class="mouse-toggle-wrapper"',
    content
)

# 4. Action dropdown inner div
content = re.sub(
    r'<div style="display: flex; align-items: center; gap: 12px; padding: 6px 0; cursor: pointer; width: 100%;">',
    '<div class="action-dropdown-content">',
    content
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MainView.js layout rules.")

