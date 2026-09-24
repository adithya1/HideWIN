with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("http://localhost:5173/signin", "http://localhost:5173/login")

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
