import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''
        this.currentView = 'assistant';
        console.error("DEBUG: currentView successfully set to assistant! startTime=" + this.startTime);
        this._startTimer();
'''
code = code.replace("this.currentView = 'assistant';\n        this._startTimer();", replacement)

replacement2 = '''
        if (!success) {
            console.error("DEBUG: initializeCloud returned false! Aborting startActualSession.");
            const mainView = this.shadowRoot.querySelector('main-view');
            if (mainView && mainView.triggerApiKeyError) {
                mainView.triggerApiKeyError();
            }
            return;
        }
'''
code = code.replace('''
            if (!success) {
                const mainView = this.shadowRoot.querySelector('main-view');
                if (mainView && mainView.triggerApiKeyError) {
                    mainView.triggerApiKeyError();
                }
                return;
            }
''', replacement2)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
