import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

debug_toast = """
                            this.dnsPort = data.dnsPort || '8000';
                            usingApi = true;
                            setTimeout(() => this.showToast(`Fetched IP from API: ${this.dnsIP}:${this.dnsPort}`, 'success'), 1000);
                        }
"""

if "Fetched IP from API" not in text:
    text = text.replace("this.dnsPort = data.dnsPort || '8000';\n                            usingApi = true;", debug_toast)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Added debug toast for API fetch!")
