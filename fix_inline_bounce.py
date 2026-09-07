import re, os

files = [
    r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js',
    r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\sharedPageStyles.js',
]

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content

    # Remove inline translateY from onmouseover/onmouseout (cards/shortcuts bounce)
    # Replace translateY(-Npx) in inline style handlers with nothing (remove transform)
    content = re.sub(r"this\.style\.transform\s*=\s*'translateY\([^']*\)';\s*", '', content)
    content = re.sub(r"this\.style\.transform\s*=\s*'translateY\([^']*\)'", '', content)
    
    # Clean up leftover semicolons: e.g. ; ; from removed properties
    content = re.sub(r";\s*;", ';', content)

    # Fix sharedPageStyles: remove translateY from .notes-btn:hover and .notes-btn.primary:hover
    content = re.sub(r'(\.notes-btn:hover\s*\{[^}]*)transform:\s*translateY\([^)]*\);?', r'\1', content)
    content = re.sub(r'(\.notes-btn\.primary:hover\s*\{[^}]*)transform:\s*translateY\([^)]*\);?', r'\1', content)
    
    # Remove translateY from note-card:hover (cards should not float)
    content = re.sub(r'(\.note-card:hover\s*\{[^}]*)transform:\s*translateY\([^)]*\);?', r'\1', content)

    if content != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Cleaned:", os.path.basename(path))
    else:
        print("No change:", os.path.basename(path))
