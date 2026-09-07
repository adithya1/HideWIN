import re
import glob

files = glob.glob('src/components/views/*.js')
files.append('src/components/app/HideWinApp.js')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace specifically #f3f4f6, #f1f5f9, #f4f4f5, #e4e4e7, #e8e8e8 with var(--bg-surface) or var(--bg-hover)
    content = re.sub(r'#F3F4F6', r'var(--bg-surface)', content, flags=re.IGNORECASE)
    content = re.sub(r'#F1F5F9', r'var(--bg-app)', content, flags=re.IGNORECASE)
    content = re.sub(r'#F4F4F5', r'var(--bg-hover)', content, flags=re.IGNORECASE)
    content = re.sub(r'#E4E4E7', r'var(--border)', content, flags=re.IGNORECASE)
    content = re.sub(r'#E8E8E8', r'var(--border)', content, flags=re.IGNORECASE)
    content = re.sub(r'#EFF6FF', r'transparent', content, flags=re.IGNORECASE)
    
    # Replace specific dark mode hardcoded colors that were used for backgrounds
    content = re.sub(r'#09090b', r'var(--bg-app)', content, flags=re.IGNORECASE)
    content = re.sub(r'#18181b', r'var(--bg-surface)', content, flags=re.IGNORECASE)
    content = re.sub(r'#27272a', r'var(--bg-elevated)', content, flags=re.IGNORECASE)
    content = re.sub(r'#3f3f46', r'var(--bg-hover)', content, flags=re.IGNORECASE)
    content = re.sub(r'#71717a', r'var(--border)', content, flags=re.IGNORECASE)
    content = re.sub(r'#a1a1aa', r'var(--text-secondary)', content, flags=re.IGNORECASE)
    content = re.sub(r'#d4d4d8', r'var(--text-primary)', content, flags=re.IGNORECASE)
    content = re.sub(r'#111111', r'var(--bg-app)', content, flags=re.IGNORECASE)
    content = re.sub(r'#1e1e1e', r'var(--bg-surface)', content, flags=re.IGNORECASE)
    content = re.sub(r'#1e1e24', r'var(--bg-elevated)', content, flags=re.IGNORECASE)
    content = re.sub(r'#1e3a8a', r'var(--accent)', content, flags=re.IGNORECASE)
    content = re.sub(r'#1e293b', r'var(--bg-surface)', content, flags=re.IGNORECASE)
    content = re.sub(r'#334155', r'var(--text-secondary)', content, flags=re.IGNORECASE)
    
    # Check for hardcoded colors in styling blocks
    content = re.sub(r'background:\s*#14161c', r'background: var(--bg-app)', content, flags=re.IGNORECASE)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Purged all remaining structural hex colors.")
