import glob
import re

files = glob.glob(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\*.js')
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    # Look for max-width on containers like form-body, form-container, etc.
    # Be careful not to remove max-width: 100% (used on images)
    
    # In sharedPageStyles.js:
    content = re.sub(r'max-width:\s*\d+px;\s*margin:\s*0\s+auto;', 'margin: 0;', content)
    content = re.sub(r'\.form-container\s*\{[^}]*max-width:\s*640px;[^}]*\}', lambda m: m.group(0).replace('max-width: 640px;', 'width: 100%; flex: 1;'), content)
    
    # In ScheduleMeetingView.js
    content = re.sub(r'\.form-body\s*\{[^}]*max-width:\s*800px;[^}]*\}', lambda m: m.group(0).replace('max-width: 800px;', 'width: 100%; box-sizing: border-box;'), content)
    
    # In MainView.js
    content = re.sub(r'\.form-wrapper\s*\{[^}]*max-width:\s*420px;[^}]*\}', lambda m: m.group(0).replace('max-width: 420px;', 'width: 100%; box-sizing: border-box;'), content)
    
    # Remove width: 100vw and height: 100vh from host styles globally to avoid OS-level scrollbars
    content = re.sub(r'width:\s*100vw\s*;', 'width: 100%;', content)
    content = re.sub(r'height:\s*100vh\s*;', 'height: 100%;', content)
    
    # Check for hardcoded 850px max-width in MainView
    content = re.sub(r'max-width:\s*850px;', 'max-width: 100%;', content)
    content = re.sub(r'max-width:\s*800px;', 'max-width: 100%;', content)
    content = re.sub(r'max-width:\s*640px;', 'max-width: 100%;', content)

    if original != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {path}")

# Also update HideWinApp.js host styles
app_path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

app_content = re.sub(r'width:\s*100vw\s*;', 'width: 100%;', app_content)
app_content = re.sub(r'height:\s*100vh\s*;', 'height: 100%;', app_content)
app_content = re.sub(r'height:\s*calc\(100vh\s*-\s*78px\);', 'height: calc(100% - 78px);', app_content)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_content)
print("Updated HideWinApp.js")
