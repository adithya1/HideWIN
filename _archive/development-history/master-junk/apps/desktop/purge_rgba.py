import re
import glob

files = glob.glob('src/components/views/*.js')
files.append('src/components/app/HideWinApp.js')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace background: rgba(255, 255, 255, >0.5) with var(--bg-elevated)
    content = re.sub(r'background:\s*rgba\(255,\s*255,\s*255,\s*0\.[56789]\d*\)', r'background: var(--bg-elevated)', content)
    content = re.sub(r'background:\s*rgba\(255,\s*255,\s*255,\s*1(?:\.0+)?\)', r'background: var(--bg-elevated)', content)
    
    # Replace background: rgba(255, 255, 255, <0.5) with var(--bg-hover)
    content = re.sub(r'background:\s*rgba\(255,\s*255,\s*255,\s*0\.[01234]\d*\)', r'background: var(--bg-hover)', content)
    
    # Replace border: 1px solid rgba(255, 255, 255, ...) with border: 1px solid var(--border)
    content = re.sub(r'border:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.\d+\)', r'border: 1px solid var(--border)', content)
    
    # Replace border-color: rgba(...)
    content = re.sub(r'border-color:\s*rgba\(255,\s*255,\s*255,\s*0\.\d+\)', r'border-color: var(--border)', content)

    # Some inset shadows with white
    content = re.sub(r'inset 0 1px 1px rgba\(255,\s*255,\s*255,\s*0\.\d+\)', r'transparent', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Purged hardcoded rgba white values.")
