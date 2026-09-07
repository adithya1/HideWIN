with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    triggerAutoStealthStopFn = () => {
        try {
            if (blockerProcess) {
                try { 
                    if (blockerProcess.stdin) {
                        blockerProcess.stdin.write("EXIT\\n");
                        blockerProcess.stdin.end();
                    }
                    const pToKill = blockerProcess;
                    setTimeout(() => { try { pToKill.kill(); } catch (e) {} }, 200);
                } catch(e) {}
                blockerProcess = null;
            }"""

rep = """    triggerAutoStealthStopFn = () => {
        try {
            if (blockerProcess && blockerProcess.stdin) {
                try { blockerProcess.stdin.write("UNLOCK\\n"); } catch (e) {}
            }"""

if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed triggerAutoStealthStopFn to not kill the engine")
else:
    print("Target not found")
