def test_config_loads():
    from services.api.core.config import settings
    assert settings.APP_ENV in ["development", "testing", "staging", "production"]
