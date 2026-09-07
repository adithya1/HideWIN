import pytest
from models import User
from routers.auth import create_access_token

def get_auth_headers(client, db_session, role="ADMIN", email="admin@test.com"):
    # Force create user
    user = User(email=email, role=role, is_verified=True)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    token = create_access_token(data={"sub": email, "id": user.id, "role": role})
    return {"Authorization": f"Bearer {token}"}

def test_global_branding_rbac(client, db_session):
    """Test that only ADMIN can mutate branding."""
    user_headers = get_auth_headers(client, db_session, role="USER", email="user@test.com")
    
    response = client.put("/api/admin/branding", headers=user_headers, json={
        "admin_logo_url": "newlogo.png",
        "vendor_logo_url": "vendorlogo.png",
        "favicon_url": "fav.ico"
    })
    
    assert response.status_code == 403
    assert "ADMIN role required" in response.json()["detail"]
    
    # Test ADMIN
    admin_headers = get_auth_headers(client, db_session, role="ADMIN", email="super@test.com")
    response_admin = client.put("/api/admin/branding", headers=admin_headers, json={
        "admin_logo_url": "newlogo.png",
        "vendor_logo_url": "vendorlogo.png",
        "favicon_url": "fav.ico"
    })
    assert response_admin.status_code == 200
    assert response_admin.json()["success"] is True

def test_vendor_seat_quota_enforcement(client, db_session):
    """Regression Test: Vendor inviting more users than their allocated seats MUST fail."""
    admin_headers = get_auth_headers(client, db_session, role="ADMIN", email="admin2@test.com")
    
    # 1. Admin creates vendor with 1 seat
    response = client.post("/api/admin/vendor", headers=admin_headers, json={
        "email": "vendor@business.com",
        "company_name": "Test Vendor",
        "allocated_seats": 1,
        "is_active": True
    })
    assert response.status_code == 200
    
    # 2. Vendor logs in
    vendor_headers = get_auth_headers(client, db_session, role="VENDOR", email="vendor@business.com")
    
    # 3. Vendor hits quota by inviting 1 user
    invite1 = client.post("/api/vendor/invite", headers=vendor_headers, json={
        "email": "employee1@business.com"
    })
    assert invite1.status_code == 200
    
    # 4. Vendor attempts to invite 2nd user -> SHOULD FAIL! 403
    invite2 = client.post("/api/vendor/invite", headers=vendor_headers, json={
        "email": "employee2@business.com"
    })
    
    assert invite2.status_code == 403
    assert "Seat quota reached" in invite2.json()["detail"]
