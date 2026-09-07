import pytest
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.exc import ArgumentError

def test_invalid_database_url():
    with pytest.raises(ArgumentError):
        create_async_engine("invalid_url_format")
