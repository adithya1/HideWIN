with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    // Restore OS cursor on startup in case previous session left it hidden"""
rep = """    // Pre-boot the background engine so Windows loading spinners happen now instead of mid-session
    try {
        const winUtils = require('./utils/window');
        if (winUtils.triggerAutoStealthStartFn) winUtils.triggerAutoStealthStartFn();
    } catch(e) {}
    
    // Restore OS cursor on startup in case previous session left it hidden"""

if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected pre-boot")
else:
    print("Target not found")
