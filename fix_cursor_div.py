import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

div_html = """
            <div class="fake-cursor" style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\"><path fill=\\"red\\" stroke=\\"white\\" stroke-width=\\"1\\" d=\\"M19.32,11.59l-2.45-1.52A1.44,1.44,0,0,0,14.65,11v-4A2.65,2.65,0,0,0,12,4.38a2.65,2.65,0,0,0-2.65,2.64v7.71l-2.31-2.32a1.76,1.76,0,0,0-2.49,0,1.76,1.76,0,0,0,0,2.49l4.57,4.57A6,6,0,0,0,13.35,21.2h2a6.41,6.41,0,0,0,6.23-5l.77-4.14A1.45,1.45,0,0,0,19.32,11.59Z\\"/></svg>');"></div>
        """

if 'class="fake-cursor"' not in text:
    # Inject it before the last </div> in the render function
    # Let's just find the end of the template
    text = text.replace("            `\n    }\n", div_html + "            `\n    }\n")
    print("Injected fake cursor div!")

# Also fix the inline style display bug I introduced earlier
text = text.replace("if (fakeCursor) fakeCursor.style.display = 'block';", "if (fakeCursor) fakeCursor.style.display = isActive ? 'block' : 'none';")

with open(p, 'w', encoding='utf-8') as f:
    f.write(text)

