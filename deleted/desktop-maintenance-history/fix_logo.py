file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinAppRenderers.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

target = "url('./assets/images/small_icon.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center;"
replacement = target + " filter: brightness(0) invert(1);"

if target in code:
    code = code.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS")
else:
    print("FAILED")
