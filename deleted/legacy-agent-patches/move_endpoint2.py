import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

pattern = r'@app\.get\("/api/public/dns-settings"\).*?return \{.*?\}'
match = re.search(pattern, text, re.DOTALL)
if match:
    block = match.group(0)
    text = text.replace(block, "")
    
    insert_point = text.find("public_dir = os.path.join")
    if insert_point != -1:
        # Go back to start of line
        insert_point = text.rfind('\n', 0, insert_point)
        text = text[:insert_point] + "\n" + block + "\n" + text[insert_point:]
        with open(p, "w", encoding="utf-8") as f:
            f.write(text)
        print("Moved endpoint successfully!")
