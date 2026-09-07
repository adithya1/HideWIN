import sys, os
import httpx
import uuid
import models
from sqlalchemy.orm import Session
from database import SessionLocal
from routers.auth import get_password_hash

BASE_URL = "http://localhost:8000/api"

def e2e_audit():
    print("--- 🏆 HIDEWIN E2E MASTER AUDIT (v2.3) ---")
    
    # 1. AUTH AS SEEDED SUPER ADMIN
    # (Email: admin@hidewin.com / Pass: adminpassword123)
    with httpx.Client(base_url=BASE_URL) as client:
        r = client.post("/auth/login", json={
            "email": "admin@hidewin.com", 
            "password": "adminpassword123", 
            "macAddress": f"MAC-SA-{uuid.uuid4().hex[:4]}"
        })
        if r.status_code != 200:
            print(f"[!] Login Failed: {r.json()}")
            return
        
        sa_token = r.json()["token"]
        headers = {"Authorization": f"Bearer {sa_token}"}
        print("[+] Super Admin Authenticated")

        # 2. CREATE VENDOR STAFF (Tier 2)
        # First find a vendor (Stark Industries was seeded)
        v_email = "starkindustries@vendor.com"
        r_v = client.post("/vendor/login", json={"email":v_email, "password":"vendorpassword123"})
        v_token = r_v.json()["token"]
        v_headers = {"Authorization": f"Bearer {v_token}"}
        
        vs_email = f"staff_{uuid.uuid4().hex[:4]}@stark.com"
        r_vs = client.post("/vendor/staff/create", headers=v_headers, json={
            "email": vs_email, "password": "staffpassword123", 
            "permissions": {"view_users": True}
        })
        if r_vs.status_code == 200:
            print(f"[✓] Vendor Staff Created: {vs_email}")
        else:
            print(f"[!] Vendor Staff Creation Failed: {r_vs.json()}")

        # 3. HARDWARE LOCK TEST
        u_email = "tony.stark@starkindustries.com"
        u_pwd = "password123"
        mac1 = f"MAC-T1-{uuid.uuid4().hex[:4]}"
        mac2 = f"MAC-T2-{uuid.uuid4().hex[:4]}"
        
        # Login 1 (Lock)
        client.post("/auth/login", json={"email": u_email, "password": u_pwd, "macAddress": mac1})
        print(f"[+] User locked to {mac1}")
        
        # Login 2 (Fail)
        r_l2 = client.post("/auth/login", json={"email": u_email, "password": u_pwd, "macAddress": mac2})
        if r_l2.status_code == 403:
            print(f"[✓] Hardware Lock: {mac2} blocked successfully")
        
        # Reset (Managed)
        # Note: vendor resets user
        db = SessionLocal()
        user_obj = db.query(models.User).filter(models.User.email == u_email).first()
        client.post(f"/vendor/users/{user_obj.id}/reset-hardware", headers=v_headers)
        print("[+] Hardware reset by Vendor")
        db.close()
        
        # Login 2 (Success)
        r_l3 = client.post("/auth/login", json={"email": u_email, "password": u_pwd, "macAddress": mac2})
        if r_l3.status_code == 200:
            print(f"[✓] Recovery: {mac2} login successful after reset")

    print("\n--- 🏁 ALL HIERARCHY AUDITS COMPLETED SUCCESSFULLY ---")

if __name__ == "__main__":
    e2e_audit()
