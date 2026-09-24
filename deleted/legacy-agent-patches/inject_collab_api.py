import os
p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\routers\collaboration.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

endpoint = """
@router.get("/public/dns-settings")
def get_public_dns_settings(db: Session = Depends(get_db)):
    from db_models import AppSettings
    import json
    settings = db.query(AppSettings).first()
    if not settings:
        return {"dnsIP": "127.0.0.1", "dnsPort": "8000", "dnsDomain": ""}
    
    settings_dict = {}
    if settings.settings:
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

if "/public/dns-settings" not in text:
    text = text + "\n" + endpoint
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Injected into collaboration.py!")
