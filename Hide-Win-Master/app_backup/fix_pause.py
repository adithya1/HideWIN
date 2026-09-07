with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = "if (sessionState === 'active') sessionState = 'paused';"
rep = "if (sessionState === 'active') sessionState = 'paused';\n            try { require('./utils/window').triggerAutoStealthStop(); } catch(e) { console.error(e); }"

if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added triggerAutoStealthStop to pause-session-window")
else:
    print("Target not found")
