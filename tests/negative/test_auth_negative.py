import pytest
import jwt
from datetime import timedelta
from fastapi import HTTPException
from services.api.services.auth_service import AuthenticationService
from services.api.core.security import get_current_user
from services.api.core.config import settings

def test_verify_password_invalid():
    hashed = AuthenticationService.get_password_hash("correct_password")
    assert not AuthenticationService.verify_password("wrong_password", hashed)

def test_token_validation_expired():
    # Create an expired token
    token = AuthenticationService.create_access_token(
        data={"sub": "test@test.com"}, 
        expires_delta=timedelta(minutes=-10) # Expired 10 mins ago
    )
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=token)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Token has expired"

def test_token_validation_invalid_signature():
    # Create a token with a different secret
    payload = {"sub": "test@test.com"}
    bad_token = jwt.encode(payload, "wrong_secret", algorithm="HS256")
    
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=bad_token)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Could not validate credentials"
