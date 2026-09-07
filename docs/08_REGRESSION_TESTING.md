# 08 - Regression Testing

## What is Regression Testing?
When modifying existing code, we must ensure we haven't broken past functionality.

## Requirements
If you touch `auth_service.py`, you must run:
```bash
pytest tests/regression/test_auth_regression.py
```
If this test fails, your PR will be rejected by the GitHub Actions CI pipeline.
