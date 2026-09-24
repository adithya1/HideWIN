import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\routers\user.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

import re

# We want to replace the ENTIRE get_public_dns_settings function.
correct_func = """@router.get("/public/dns-settings")
def get_public_dns_settings(db: Session = Depends(get_db)):
    from db_models import AppSetting
    
    ip_setting = db.query(AppSetting).filter(AppSetting.setting_key == "dns_ip").first()
    port_setting = db.query(AppSetting).filter(AppSetting.setting_key == "dns_port").first()
    domain_setting = db.query(AppSetting).filter(AppSetting.setting_key == "dns_domain").first()
    
    return {
        "dnsIP": ip_setting.setting_value if ip_setting else "127.0.0.1",
        "dnsPort": port_setting.setting_value if port_setting else "8000",
        "dnsDomain": domain_setting.setting_value if domain_setting else ""
    }"""

# regex to replace from `@router.get("/public/dns-settings")` up to but not including the next `@router.` or end of file
text = re.sub(r'@router\.get\("/public/dns-settings"\)[\s\S]*?(?=@router|$)', correct_func + "\n\n", text)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Fixed get_public_dns_settings logic!")
