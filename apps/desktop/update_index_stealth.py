with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update start-session
start_target = """                if (sessionState !== 'paused') {
                    sessionStartTime = Date.now();
                }
                sessionState = 'active';"""
if 'require(\'./utils/window\').triggerAutoStealthStart();' not in content:
    content = content.replace(start_target, start_target + "\n                try { require('./utils/window').triggerAutoStealthStart(); } catch(e) { console.error(e); }")

# 2. Update end-session-completely
end_target = """    ipcMain.handle('end-session-completely', async (event) => {
        try {
            sessionState = 'idle';"""
if 'require(\'./utils/window\').triggerAutoStealthStop();' not in content:
    content = content.replace(end_target, end_target + "\n            try { require('./utils/window').triggerAutoStealthStop(); } catch(e) { console.error(e); }")

# 3. Update close-session-window
close_target = """    ipcMain.handle('close-session-window', async (event) => {
        try {
            sessionState = 'idle';"""
content = content.replace(close_target, close_target + "\n            try { require('./utils/window').triggerAutoStealthStop(); } catch(e) { console.error(e); }")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("index.js updated successfully")
