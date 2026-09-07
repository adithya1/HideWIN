import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Fix broken quotes
content = content.replace('yield f"data: {fake_gemini_chunk}\n\n"\n', 'yield f"data: {fake_gemini_chunk}\\n\\n"\n')
content = content.replace('yield f"data: {fake_gemini_chunk}\n\n"', 'yield f"data: {fake_gemini_chunk}\\n\\n"')

# There's a lingering quote:
content = re.sub(r'yield f"data: \{\{\\"error\\": \\"Groq API Error: \{response\.status_code\}\\"\}\}\\n\\n"\n\n"\n', 'yield f"data: {{\\"error\\": \\"Groq API Error: {response.status_code}\\"}}\\n\\n"\n', content)
content = re.sub(r'yield f"data: \{fake_gemini_chunk\}\n\n"\n                            except', 'yield f"data: {fake_gemini_chunk}\\n\\n"\n                            except', content)

# It might be easier to just overwrite the whole function since it's so broken.
