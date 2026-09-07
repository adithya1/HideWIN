with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\auth.py', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('msg.set_content(content)', "content_html = content.replace('\\n', '<br>') if '<' not in content else content\n        msg.add_alternative(content_html, subtype='html')\n        msg.set_content(content)")
with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\auth.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched send_email to support HTML")
