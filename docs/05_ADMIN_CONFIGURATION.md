# 05 - Administrator Configuration

## Overview
The Admin API allows the initial system administrator to manage platform settings.

## Administrator Setup
To define the initial administrator, set the following environment variables in `.env`:
- `ADMIN_EMAIL` (e.g. admin@example.com)
- `ADMIN_PASSWORD` (e.g. securepassword)

## API Endpoints

### `GET /admin/settings`
**Purpose**: Retrieve current runtime settings.
**Required Permissions**: Admin JWT
**Response Example**:
```json
{
  "admin_email": "admin@example.com",
  "environment": "production",
  "log_level": "INFO"
}
```
**Error Example (403 Forbidden)**:
```json
{
  "detail": "Admin privileges required"
}
```
