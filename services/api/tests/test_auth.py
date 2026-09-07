import pytest

def test_registration_validation(client):
    """Test standard security policies on user registration."""
    # Test short password rejection
    response = client.post("/auth/register", json={
        "email": "test@professional.com",
        "password": "short",
        "name": "Test User"
    })
    assert response.status_code == 400
    assert "Password must be at least 8 characters" in response.json()["detail"]

    # Test proper registration
    response = client.post("/auth/register", json={
        "email": "test@professional.com",
        "password": "securepassword123",
        "name": "Test User"
    })
    assert response.status_code == 200
    assert response.json()["success"] is True

    # Test duplicate email rejection
    response = client.post("/auth/register", json={
        "email": "test@professional.com",
        "password": "anotherpassword123",
        "name": "Another User"
    })
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_login_flow(client, db_session):
    """Test logging in and JWT generation."""
    # Manually verify the user to bypass email verification lock
    from models import User
    
    # 1. Register
    client.post("/auth/register", json={
        "email": "login@professional.com",
        "password": "securepassword123"
    })
    
    # 2. Mark as verified in DB
    user = db_session.query(User).filter_by(email="login@professional.com").first()
    user.is_verified = True
    db_session.commit()
    
    # 3. Login
    response = client.post("/auth/login", json={
        "email": "login@professional.com",
        "password": "securepassword123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["success"] is True
    assert data["user"]["email"] == "login@professional.com"
