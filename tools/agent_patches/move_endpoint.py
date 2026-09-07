import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Extract the endpoint block
pattern = r'@app\.get\("/api/public/dns-settings"\).*?return \{.*?\}'
match = re.search(pattern, text, re.DOTALL)
if match:
    block = match.group(0)
    text = text.replace(block, "")
    
    # Insert it before the # "?"? Serve static public files "?"?
    insert_point = text.find("# ??? Serve static public files ???")
    if insert_point != -1:
        text = text[:insert_point] + block + "\n\n" + text[insert_point:]
        with open(p, "w", encoding="utf-8") as f:
            f.write(text)
        print("Moved endpoint successfully!")
    else:
        print("Could not find insert point")
else:
    print("Could not find endpoint block")
