with open('Hide-Win-Master/src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '''const result = await ipcRenderer.invoke(this.isAuthenticated ? 'panel-toggle-main' : 'panel-open-main');''',
    '''const result = await ipcRenderer.invoke('panel-toggle-main');'''
)

with open('Hide-Win-Master/src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(text)
