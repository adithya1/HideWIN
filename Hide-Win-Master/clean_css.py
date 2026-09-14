import re

def clean_css(content):
    # Remove excessive rounded cards
    content = re.sub(r'border-radius:\s*50px;?', 'border-radius: 8px;', content)
    content = re.sub(r'border-radius:\s*16px;?', 'border-radius: 8px;', content)
    content = re.sub(r'border-radius:\s*12px;?', 'border-radius: 6px;', content)
    content = re.sub(r'border-radius:\s*20px;?', 'border-radius: 8px;', content)
    
    # Remove glassmorphism (backdrop-filter)
    content = re.sub(r'backdrop-filter:\s*blur\([^)]+\);?', '', content)
    content = re.sub(r'-webkit-backdrop-filter:\s*blur\([^)]+\);?', '', content)
    
    # Clean up hardcoded dark mode colors to tokens
    content = re.sub(r'#1e1e24', 'var(--bg-surface)', content)
    content = re.sub(r'rgba\(38,\s*40,\s*48,\s*0\.4\)', 'var(--bg-surface)', content)
    content = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.85\)', 'var(--bg-elevated)', content)
    content = re.sub(r'#0f172a', 'var(--text-primary)', content)
    content = re.sub(r'#334155', 'var(--text-secondary)', content)
    content = re.sub(r'#94a3b8', 'var(--text-muted)', content)
    
    # Replace white-transparent hovers with a token or black-transparent for light mode
    content = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.05\)', 'var(--bg-hover)', content)
    content = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.1\)', 'var(--bg-hover)', content)
    content = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.08\)', 'var(--border)', content)
    content = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.2\)', 'var(--border-strong)', content)
    content = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.12\)', 'var(--border-strong)', content)
    
    # Remove excessive gradients
    content = re.sub(r'background:\s*linear-gradient[^;]+;', 'background: var(--bg-surface);', content)
    content = re.sub(r'background:\s*radial-gradient[^;]+;', 'background: transparent;', content)
    
    # Remove excessive shadows
    content = re.sub(r'box-shadow:\s*0\s+4px\s+24px[^;]+;', 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);', content)
    content = re.sub(r'box-shadow:\s*0\s+8px\s+32px[^;]+;', 'box-shadow: 0 4px 6px rgba(0,0,0,0.1);', content)
    
    # Normalize blue buttons to Antigravity blue
    content = re.sub(r'#185fc4', 'var(--accent)', content)
    content = re.sub(r'#1550a6', 'var(--accent-hover)', content)
    content = re.sub(r'#3b82f6', 'var(--accent)', content)
    
    return content

files = [
    'src/components/views/MainView.js',
    'src/components/views/NotesView.js',
    'src/components/views/sharedPageStyles.js',
    'src/components/app/HideWinApp.styles.js',
    'src/index.html'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = clean_css(content)
    
    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {fpath}")

