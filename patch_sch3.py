import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_styles = """
            .social-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 16px 8px;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                background: #ffffff;
                color: #4b5563;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .social-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(0,0,0,0.06);
            }
            .social-btn.copy:hover { border-color: #6b7280; color: #111827; }
            .social-btn.whatsapp:hover { border-color: #25D366; color: #25D366; }
            .social-btn.gmail:hover { border-color: #EA4335; color: #EA4335; }
            .social-btn.outlook:hover { border-color: #0078D4; color: #0078D4; }
            .social-btn.hidewin:hover { border-color: var(--accent); color: var(--accent); }

            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .step-create .header-title { animation: fadeIn 0.4s ease-out; }
            .step-share { animation: fadeIn 0.4s ease-out; }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
"""

if ".social-btn {" not in content:
    content = content.replace("width: 100%;\n                overflow: hidden;", "width: 100%;\n                overflow: hidden;\n" + new_styles)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Phase 3 CSS")
