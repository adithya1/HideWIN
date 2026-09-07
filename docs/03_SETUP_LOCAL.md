# 03 - Local Setup & Onboarding Guide

## 1. Prerequisites
- Python 3.11+
- PostgreSQL
- Git

## 2. Clone and Environment
```bash
git clone https://github.com/aditya-win/Hide-WIN.git
cd Hide-WIN
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
```

## 3. Configuration
Copy the `.env.example` file to `.env` and fill in the PostgreSQL connection string.

## 4. Running Locally
```bash
uvicorn services.api.main:app --reload
```
Navigate to `http://localhost:8000/docs` to view the OpenAPI Swagger UI.
