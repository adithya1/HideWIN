import re
file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Remove the three handlers from setupGeneralIpcHandlers
target_start = "function setupGeneralIpcHandlers() {"
target_end = "    ipcMain.handle('get-app-version'"

if target_start in code and target_end in code:
    start_idx = code.find(target_start)
    end_idx = code.find(target_end)
    
    # We replace everything between them with just function setupGeneralIpcHandlers() {\n\n
    code = code[:start_idx] + "function setupGeneralIpcHandlers() {\n    \n" + code[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS")
else:
    print("NOT FOUND")
