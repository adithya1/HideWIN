import re

fpath = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AuthView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add new CSS classes
css_to_add = '''
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 16px;
            text-align: left;
            width: 100%;
            max-width: 320px;
        }
        .input-label {
            font-size: 14px;
            font-weight: 500;
            color: #475569;
        }
        .input-field {
            padding: 12px 16px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 15px;
            outline: none;
            transition: border-color 0.2s;
        }
        .input-field:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .error-message {
            color: #ef4444;
            font-size: 14px;
            margin-top: -8px;
            margin-bottom: 16px;
            text-align: left;
            width: 100%;
            max-width: 320px;
        }
        .success-message {
            background: #dcfce7;
            color: #15803d;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #bbf7d0;
            margin-bottom: 24px;
            font-size: 14px;
            width: 100%;
            max-width: 320px;
        }
        .sso-btn {
            width: 100%;
            max-width: 320px;
            padding: 12px;
            background: white;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: background 0.2s;
            color: #334155;
            font-size: 15px;
            margin-bottom: 12px;
        }
        .sso-btn:hover {
            background: #f8fafc;
        }
'''

content = content.replace('    ;\n\n    static properties = {', css_to_add + '    ;\n\n    static properties = {')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AuthView.js CSS.")
