import re

with open('src/admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("window.electronAPI.setConfig", "ipcRenderer.invoke('storage:set-config'")
content = content.replace("window.electronAPI.getConfig()", "ipcRenderer.invoke('storage:get-config')")

with open('src/admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
