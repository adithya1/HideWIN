import re
import glob

files = glob.glob('src/components/views/*.js')
files.append('src/components/app/HideWinApp.js')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix broken gradient backgrounds
    content = re.sub(r'background:\s*var\(--accent\)\s*0%,\s*var\(--accent-hover\)\s*100%\);', r'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);', content)
    content = re.sub(r'background:\s*var\(--accent\)\s*100%\);', r'background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);', content)
    content = re.sub(r'background:\s*linear-gradient\([^)]*var\(--accent\)[^)]*\);', r'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);', content)
    
    # Also find any background: var(--accent) used on primary buttons and revert them to blue
    content = re.sub(r'background:\s*var\(--accent\);\s*color:\s*var\(--bg-elevated\);', r'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;', content)

    # Some primary buttons might just have background: var(--accent);
    # Let's fix .start-btn and .notes-btn.primary explicitly if they have var(--accent)
    if 'sharedPageStyles.js' in filepath:
        content = content.replace('background: var(--accent);', 'background: #3b82f6;')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Reverted primary buttons to sky blue gradients!")
