# 06 - API Documentation

## Authentication APIs

### `POST /auth/signup`
Registers a new user. Passwords are cryptographically hashed using `bcrypt` and never stored in plain text.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Success (201)**: Returns the user profile (without the password).
- **Error (400)**: `Email already registered`
- **Error (422)**: Validation error if email is malformed or password is missing.

### `POST /auth/login`
Authenticates a user and returns a JWT access token. Uses OAuth2 `application/x-www-form-urlencoded` format.
- **Request Body**: `username=user@example.com&password=securepassword123`
- **Success (200)**:
  ```json
  {
    "access_token": "eyJhbGci...",
    "token_type": "bearer"
  }
  ```
- **Error (401)**: `Incorrect email or password`
