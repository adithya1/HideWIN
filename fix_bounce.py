import os, re

src_dir = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src'
files_patched = []

for root, dirs, files in os.walk(src_dir):
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for fname in files:
        if not fname.endswith('.js'):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            orig = f.read()
        
        content = orig
        
        # 1. Remove translateY on hover/active (bounce up/down on button hover)
        # e.g. transform: translateY(-1px); or transform: translateY(-2px); on hover
        content = re.sub(r'transform:\s*translateY\(\s*-?\d+px\s*\);?\s*\n', '', content)
        
        # 2. Remove scale() inline onmouseover="this.style.transform='scale(1.05)'"
        content = re.sub(r"\sonmouseover=\"this\.style\.transform\s*=\s*'scale\([^)]*\)'\"", '', content)
        content = re.sub(r"\sonmouseout=\"this\.style\.transform\s*=\s*'scale\([^)]*\)'\"", '', content)
        
        # 3. Replace cubic-bezier spring transitions on buttons with standard flat transition
        # cubic-bezier(0.4, 0, 0.2, 1) and similar — replace with ease
        content = re.sub(
            r'transition:\s*all\s+[\d.]+s\s+cubic-bezier\([^)]+\)',
            'transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease',
            content
        )
        
        # 4. Replace :hover box-shadow lifts that imply floating/elevation bounce
        # Leave colour transitions but remove large box-shadow on hover for buttons
        # We target patterns like box-shadow: 0 6px ... or 0 8px ... on hover
        content = re.sub(
            r'(\.btn[^{]*:hover\s*\{[^}]*?)box-shadow:\s*0\s+[6-9]\d*px[^;]*;',
            r'\1box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);',
            content,
            flags=re.DOTALL
        )
        
        # 5. Change button :active transform scale(0.95/0.98) to simple background darken (remove transform)
        content = re.sub(
            r'(:active\s*\{[^}]*?)transform:\s*scale\([^)]*\);?',
            r'\1',
            content,
            flags=re.DOTALL
        )
        
        # 6. Remove translateY from :active states specifically
        content = re.sub(
            r'(:active\s*\{[^}]*?)transform:\s*translateY\([^)]*\);?',
            r'\1',
            content,
            flags=re.DOTALL
        )
        
        if content != orig:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            files_patched.append(fname)

print("Patched files:")
for f in files_patched:
    print(" -", f)
print(f"\nTotal: {len(files_patched)} files")
