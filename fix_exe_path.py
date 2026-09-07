p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# We want to replace the temp copy logic with a simple replace('app.asar', 'app.asar.unpacked')
old_logic = """    if (!blockerExePath) {
        blockerExePath = path.join(__dirname, 'MouseBlocker.exe');
        if (blockerExePath.includes('app.asar')) {
            const tempPath = path.join(os.tmpdir(), 'HideWin_MouseBlocker.exe');
            try {
                fs.copyFileSync(blockerExePath, tempPath);
                blockerExePath = tempPath;
                console.log('Extracted MouseBlocker.exe to temp folder:', tempPath);
            } catch (e) {
                console.error('Failed to extract MouseBlocker.exe from ASAR:', e);
            }
        }
    }"""

new_logic = """    if (!blockerExePath) {
        blockerExePath = path.join(__dirname, 'MouseBlocker.exe');
        if (blockerExePath.includes('app.asar')) {
            // Electron forge automatically unpacks .exe files to app.asar.unpacked
            blockerExePath = blockerExePath.replace('app.asar', 'app.asar.unpacked');
            console.log('Using unpacked MouseBlocker.exe at:', blockerExePath);
        }
    }"""

if old_logic in text:
    text = text.replace(old_logic, new_logic)
    print("SUCCESS: Updated MouseBlocker path logic for .exe build")
else:
    print("ERROR: Could not find old_logic")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
