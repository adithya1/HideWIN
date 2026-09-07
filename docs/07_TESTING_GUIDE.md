# 07 - Testing Guide

All developers MUST run the test suite before opening a PR.

## Running Tests
Run all tests:
```bash
pytest
```

Run specific suites:
```bash
pytest tests/unit
pytest tests/negative
pytest tests/regression
```

## Generating Coverage
```bash
pytest --cov=services/api --cov-report=html
```
Open `htmlcov/index.html` to view the report.
