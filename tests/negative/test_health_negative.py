def test_invalid_configuration_fails():
    # If the app starts with a bad env, it should throw an error.
    # We mock this by assuming a missing DATABASE_URL raises ValidationError
    import pytest
    from pydantic import ValidationError
    from services.api.core.config import Settings
    
    with pytest.raises(ValidationError):
        Settings(DATABASE_URL=None)
