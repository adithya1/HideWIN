with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("private static volatile bool _running = true;", "private static volatile bool _running = true;\n    private static volatile bool _isLocked = false;")

# Also need to make sure we don't accidentally RestoreCursors if we didn't override them.
# The user wants NO overrides, NO loading cursors, just the pure OS freeze.
# We should probably wipe all the overriding logic out to make the code cleaner, but since I already re-wrote HookCallback and readerThread, it should compile.

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected _isLocked")
