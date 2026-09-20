import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

preflight = """
            // Pre-flight check
            try {
                await fetch(configManager.getWebBaseUrl(), { mode: 'no-cors' });
            } catch (networkErr) {
                const isLocal = configManager.getWebBaseUrl().includes('localhost') || configManager.getWebBaseUrl().includes('127.0.0.1');
                this.status = isLocal 
                    ? 'Local server is down. Start it or configure cloud domain in Admin Settings.' 
                    : `Server is unreachable. Configure a working domain in Admin Settings.`;
                this.statusType = 'error';
                this.loading = false;
                return;
            }

            // 4. Open external browser"""

content = content.replace("// 4. Open external browser", preflight)

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
