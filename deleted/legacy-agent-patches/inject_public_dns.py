import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

endpoint_code = """
@app.get("/api/public/dns-settings")
def get_public_dns_settings(db: Session = Depends(get_db)):
    # Fetch from AppSettings table
    from db_models import AppSettings
    settings = db.query(AppSettings).first()
    if not settings:
        return {"dnsIP": "127.0.0.1", "dnsPort": "8000", "dnsDomain": ""}
    
    settings_dict = {}
    if settings.settings:
        import json
        try:
            settings_dict = json.loads(settings.settings)
        except:
            pass
            
    return {
        "dnsIP": settings_dict.get("dns_ip", "127.0.0.1"),
        "dnsPort": settings_dict.get("dns_port", "8000"),
        "dnsDomain": settings_dict.get("dns_domain", "")
    }
"""

if "/api/public/dns-settings" not in text:
    # Inject it before the WebRTC stuff
    inject_point = text.find("import uuid")
    if inject_point != -1:
        text = text[:inject_point] + endpoint_code + "\n\n" + text[inject_point:]
        with open(p, "w", encoding="utf-8") as f:
            f.write(text)
        print("Injected public DNS settings endpoint!")
