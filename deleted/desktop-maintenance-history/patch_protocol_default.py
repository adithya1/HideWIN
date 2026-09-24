with open('src/utils/configManager.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("return config.appProtocol || 'hidewin';", "return config.appProtocol || 'huddlemate';")

with open('src/utils/configManager.js', 'w', encoding='utf-8') as f:
    f.write(content)
