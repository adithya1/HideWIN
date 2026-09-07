import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main = f.read()

# Remove the HTML spans completely
main = re.sub(r'<span class="mobile-field-label">Mode</span>', '', main)
main = re.sub(r'<span class="mobile-field-label">Profile</span>', '', main)

# Remove the obsolete CSS definitions for them
main = re.sub(r'\.mobile-field-label\s*\{[^}]*\}', '', main, flags=re.DOTALL)
main = re.sub(r'\.pill-dropdown-inner \.mobile-field-label\s*\{[^}]*\}', '', main, flags=re.DOTALL)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main)

print("Removed Mode and Profile labels successfully.")
