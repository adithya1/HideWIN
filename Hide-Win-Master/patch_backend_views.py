import re
import os

# 1. ScheduleMeetingView
file_path = 'src/components/views/ScheduleMeetingView.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if "configManager =" not in content:
    content = content.replace("export class ScheduleMeetingView extends LitElement {", "const configManager = window.require ? window.require('./utils/configManager.js') : require('../../utils/configManager.js');\n\nexport class ScheduleMeetingView extends LitElement {")

content = re.sub(r'const dnsPort = \d+;', '', content)
content = re.sub(r"const baseUrl = dnsIP\.includes\('\.loca\.lt'\) \? `https://\$\{dnsIP\}/api/meetings` : `http://\$\{dnsIP\}:\$\{dnsPort\}/api/meetings`;", r"const baseUrl = `${configManager.getApiBaseUrl()}/api/meetings`;", content)
content = re.sub(r"invite_url_base: dnsIP\.includes\('\.loca\.lt'\) \? `https://\$\{dnsIP\}/invite/index\.html` : `http://\$\{dnsIP\}:\$\{dnsPort\}/invite/index\.html`", r"invite_url_base: `${configManager.getWebBaseUrl()}/invite/index.html`", content)
content = re.sub(r"const joinLink = `http://127\.0\.0\.1:8000/invite/index\.html\?channel=\$\{this\.createdMeeting\.id\}&passcode=\$\{passcode\}`; // fallback", r"const joinLink = `${configManager.getWebBaseUrl()}/invite/index.html?channel=${this.createdMeeting.id}&passcode=${passcode}`;", content)
content = re.sub(r"const apiUrl = dnsIP\.includes\('\.loca\.lt'\) \? `https://\$\{dnsIP\}/api/meetings/\$\{this\.createdMeeting\.id\}/send-invites` : `http://\$\{dnsIP\}:\$\{dnsPort\}/api/meetings/\$\{this\.createdMeeting\.id\}/send-invites`;", r"const apiUrl = `${configManager.getApiBaseUrl()}/api/meetings/${this.createdMeeting.id}/send-invites`;", content)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. InviteView
file_path = 'src/components/views/InviteView.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if "configManager =" not in content:
    content = content.replace("export class InviteView extends LitElement {", "const configManager = window.require ? window.require('./utils/configManager.js') : require('../../utils/configManager.js');\n\nexport class InviteView extends LitElement {")

content = re.sub(r"const inviteLink = cloudHost\.includes\('\.loca\.lt'\) \? `https://\$\{cloudHost\}/invite/index\.html\?channel=\$\{this\.activeChannelId\}&passcode=\$\{this\.channelToken\}` : `http://\$\{cloudHost\}/invite/index\.html\?channel=\$\{this\.activeChannelId\}&passcode=\$\{this\.channelToken\}`;", r"const inviteLink = `${configManager.getWebBaseUrl()}/invite/index.html?channel=${this.activeChannelId}&passcode=${this.channelToken}`;", content)
content = re.sub(r"'http://127\.0\.0\.1:8000/api/user/public/dns-settings'", r"`${configManager.getApiBaseUrl()}/api/user/public/dns-settings`", content)
content = re.sub(r"'http://127\.0\.0\.1:8000/api/user/remote-control'", r"`${configManager.getApiBaseUrl()}/api/user/remote-control`", content)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 3. authCheck
file_path = 'src/utils/authCheck.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()
if "configManager = " not in content:
    content = "const configManager = require('./configManager.js');\n" + content
content = re.sub(r"const backendUrl = storage\.getPreference\('backendUrl'\) \|\| 'http://localhost:8000';", r"const backendUrl = configManager.getApiBaseUrl();", content)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 4. cloud.js
file_path = 'src/utils/cloud.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()
if "configManager = " not in content:
    content = "const configManager = require('./configManager.js');\n" + content
content = re.sub(r"const url = `wss://api\.hidewin\.com/ws\?token=\$\{encodeURIComponent\(token\)\}`;", r"const url = `${configManager.getWsBaseUrl()}/ws?token=${encodeURIComponent(token)}`;", content)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 5. ai_proxy_client.js
file_path = 'src/utils/ai_proxy_client.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()
if "configManager = " not in content:
    content = "const configManager = require('./configManager.js');\n" + content
content = re.sub(r"const PROXY_URL = 'http://localhost:8000/api/ai-proxy/generate';", r"const PROXY_URL = `${configManager.getApiBaseUrl()}/api/ai-proxy/generate`;", content)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 6. renderer.js
file_path = 'src/utils/renderer.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()
if "configManager = " not in content:
    content = "const configManager = window.require('./configManager.js');\n" + content
content = re.sub(r"'http://localhost:8000/api/ai-proxy/stream-audio-to-llm'", r"`${configManager.getApiBaseUrl()}/api/ai-proxy/stream-audio-to-llm`", content)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

