with open('Hide-Win-Master/src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_code = '''            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.invoke('open-external', fullUrl);
            } else {
                window.location.href = fullUrl;
            }
            
            // Stay in loading state indefinitely while user completes login in browser
            // When deep link returns, the global event will handle token exchange and close this view
        } catch (err) {'''

new_code = '''            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.invoke('open-external', fullUrl);
                // Minimize main window and show panel automatically
                setTimeout(() => {
                    ipcRenderer.invoke('panel-toggle-main');
                }, 100);
            } else {
                window.location.href = fullUrl;
            }
            
            // Stay in loading state indefinitely while user completes login in browser
            // When deep link returns, the global event will handle token exchange and close this view
        } catch (err) {'''

text = text.replace(old_code, new_code)

with open('Hide-Win-Master/src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(text)
