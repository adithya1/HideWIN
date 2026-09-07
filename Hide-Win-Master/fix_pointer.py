with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                if (el) {
                    const opts = { bubbles: true, cancelable: true, composed: true, clientX: pos.x, clientY: pos.y };
                    el.dispatchEvent(new MouseEvent('mousedown', opts));
                    el.dispatchEvent(new MouseEvent('mouseup', opts));
                    el.dispatchEvent(new MouseEvent('click', opts));
                }"""

rep = """                if (el) {
                    const opts = { bubbles: true, cancelable: true, composed: true, clientX: pos.x, clientY: pos.y };
                    el.dispatchEvent(new PointerEvent('pointerdown', opts));
                    el.dispatchEvent(new MouseEvent('mousedown', opts));
                    el.dispatchEvent(new PointerEvent('pointerup', opts));
                    el.dispatchEvent(new MouseEvent('mouseup', opts));
                    el.dispatchEvent(new MouseEvent('click', opts));
                }"""
if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added PointerEvents to stealth-click-at")
else:
    print("Target not found")
