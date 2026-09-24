import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''
        if (!success) {
            console.error("DEBUG: initializeCloud returned false! BYPASSING FOR DEBUGGING.");
            // Bypass failure
            // const mainView = this.shadowRoot.querySelector('main-view');
            // if (mainView && mainView.triggerApiKeyError) {
            //     mainView.triggerApiKeyError();
            // }
            // return;
        }
'''

code = code.replace('''
        if (!success) {
            console.error("DEBUG: initializeCloud returned false! Aborting startActualSession.");
            const mainView = this.shadowRoot.querySelector('main-view');
            if (mainView && mainView.triggerApiKeyError) {
                mainView.triggerApiKeyError();
            }
            return;
        }
''', replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
