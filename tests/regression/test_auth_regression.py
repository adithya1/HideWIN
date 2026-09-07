import pytest
from services.api.services.auth_service import AuthenticationService
from services.api.core.security import get_current_user

def test_authentication_regression_flow():
    """
    Regression Test:
    Verifies that the entire flow (hash -> verify -> token -> validate) 
    works correctly and has not been broken by recent changes.
    """
    # 1. User sets password
    plain_password = "secure_password_123"
    hashed = AuthenticationService.get_password_hash(plain_password)
    
    # 2. User logs in (verification)
    is_valid = AuthenticationService.verify_password(plain_password, hashed)
    assert is_valid is True
    
    # 3. System generates token
    token = AuthenticationService.create_access_token(data={"sub": "admin@example.com"})
    assert isinstance(token, str)
    
    # 4. System validates token on subsequent request
    extracted_email = get_current_user(token=token)
    assert extracted_email == "admin@example.com"
