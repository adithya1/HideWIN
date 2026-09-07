import pytest
import httpx
import uuid
import models
from database import SessionLocal
from routers.auth import get_password_hash

BASE_URL = "http://localhost:8000/api"

@pytest.fixture(scope="module")
def sa_account():
    db = SessionLocal()
    rand_prefix = uuid.uuid4().hex[:4]
    email = f"super_{rand_prefix}@hidewin.com"
    pwd = "protected_key_2024"
    sa = models.User(
        email=email,
        password=get_password_hash(pwd),
        role="SUPER_ADMIN",
        is_verified=True,
        is_premium=True
    )
    db.add(sa)
    db.commit()
    db.refresh(sa)
    yield {"email": email, "password": pwd, "id": sa.id, "mac": f"MAC-SA-{rand_prefix}"}
    # Cleanup optionally
    db.delete(sa)
    db.commit()
    db.close()

def test_hierarchy_creation_and_protection(sa_account):
    """Verify Super Admin can create Admin and Admin cannot delete Super Admin."""
    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Login Super Admin
        r = client.post("/auth/login", json={
            "email": sa_account["email"], 
            "password": sa_account["password"], 
            "macAddress": sa_account["mac"]
        })
        assert r.status_code == 200
        sa_token = r.json()["token"]
        sa_headers = {"Authorization": f"Bearer {sa_token}"}

        # 2. Create Admin
        adm_email = f"admin_{uuid.uuid4().hex[:4]}@hidewin.com"
        r = client.post("/admin/user/create", headers=sa_headers, json={
            "email": adm_email, "password": sa_account["password"], "role": "ADMIN"
        })
        assert r.status_code == 200
        adm_id = r.json()["user_id"]

        # 3. Login Admin
        r = client.post("/auth/login", json={
            "email": adm_email, 
            "password": sa_account["password"], 
            "macAddress": f"MAC-ADM-{uuid.uuid4().hex[:4]}"
        })
        assert r.status_code == 200
        adm_token = r.json()["token"]
        adm_headers = {"Authorization": f"Bearer {adm_token}"}

        # 4. Attempt Deletion of Super Admin (MUST FAIL)
        r = client.delete(f"/admin/user/{sa_account['id']}", headers=adm_headers)
        assert r.status_code == 403
        assert "Only Super Admins can delete other Super Admins" in r.json()["detail"]

def test_vendor_staff_isolation(sa_account):
    """Verify Vendor Staff are isolated to their own vendor data."""
    with httpx.Client(base_url=BASE_URL) as client:
        # 1. Login SA
        r = client.post("/auth/login", json={"email": sa_account["email"], "password": sa_account["password"], "macAddress": sa_account["mac"]})
        sa_headers = {"Authorization": f"Bearer {r.json()['token']}"}

        # 2. Create Vendor
        v_email = f"vendor_{uuid.uuid4().hex[:4]}@hidewin.com"
        r = client.post("/admin/vendor/create", headers=sa_headers, json={
            "email": v_email, "password": sa_account["password"], "allocated_seats": 5
        })
        v_id = r.json()["vendor_id"]

        # 3. Login Vendor
        r = client.post("/vendor/login", json={"email": v_email, "password": sa_account["password"]})
        v_headers = {"Authorization": f"Bearer {r.json()['token']}"}

        # 4. Create Staff
        vs_email = f"v_staff_{uuid.uuid4().hex[:4]}@hidewin.com"
        r = client.post("/vendor/staff/create", headers=v_headers, json={
            "email": vs_email, "password": sa_account["password"], "permissions": {"view_users": True}
        })
        assert r.status_code == 200
