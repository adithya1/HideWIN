import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main = f.read()

main = re.sub(r'\.home-header\s*\{.*?\}', '', main, flags=re.DOTALL)
main = re.sub(r'\.header-left\s*\{.*?\}', '', main, flags=re.DOTALL)
main = re.sub(r'\.header-right\s*\{.*?\}', '', main, flags=re.DOTALL)
main = re.sub(r'\.refresh-btn\s*\{.*?\}', '', main, flags=re.DOTALL)
main = re.sub(r'\.refresh-btn:hover\s*\{.*?\}', '', main, flags=re.DOTALL)
main = re.sub(r'\.avatar-circle\s*\{.*?\}', '', main, flags=re.DOTALL)
main = re.sub(r'\.meetings-left-text\s*\{.*?\}', '', main, flags=re.DOTALL)
main = re.sub(r'\.meetings-left-text span\s*\{.*?\}', '', main, flags=re.DOTALL)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main)

print("Cleaned up obsolete CSS classes.")
