# Authentication and User Management API

This document provides comprehensive documentation for the authentication and user management system, including detailed API references, request/response formats, and usage examples.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Rate Limiting](#rate-limiting)

## Overview
The Authentication and User Management API provides secure user registration, authentication, and profile management. It uses JWT (JSON Web Tokens) for stateless authentication and supports features like email verification, password reset, and role-based access control.

## Getting Started

### Prerequisites
- Node.js 14.0.0 or later
- MongoDB database
- Required environment variables set in your `.env` file

### Environment Variables
```env
# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

# Email (for verification and password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Application
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

### Installation
```bash
# Install required dependencies
npm install bcryptjs jsonwebtoken mongoose validator

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

## API Endpoints

### Base URL
```
/api/users
```

### 1. User Registration

#### POST /api/users
Create a new user or return existing user.

**Authentication:** None required

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "user_type": "parent",
  "profile": {
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postalCode": "10001"
    },
    "preferences": {
      "language": "en",
      "timezone": "America/New_York",
      "notifications": {
        "email": true,
        "sms": true,
        "push": true
      }
    }
  },
  "children": [
    {
      "name": "Alice Smith",
      "dateOfBirth": "2020-05-15",
      "gender": "female"
    }
  ]
}
```

**Field Descriptions:**
- `email`: (required) Must be a valid email address. Will be converted to lowercase.
- `name`: (optional) User's full name.
- `password`: (required for signup) Must be at least 8 characters long, containing at least one uppercase letter, one lowercase letter, one number, and one special character.
- `phone`: (optional) International phone number format with country code.
- `user_type`: (optional) One of: 'parent', 'guardian', 'admin'. Defaults to 'parent'.
- `profile`: (optional) Object containing additional user information.
- `children`: (optional) Array of child profiles associated with the user.

**Response:**

**Success (201 Created - New User):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "5f8d7a6e8c7d6b5a4c3b2a1f",
      "email": "user@example.com",
      "name": "John Doe",
      "user_type": "parent",
      "isEmailVerified": false,
      "profile": {
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "gender": "male",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "country": "USA",
          "postalCode": "10001"
        },
        "preferences": {
          "language": "en",
          "timezone": "America/New_York",
          "notifications": {
            "email": true,
            "sms": true,
            "push": true
          }
        }
      },
      "children": [
        {
          "_id": "6a5b4c3d2e1f0a9b8c7d6e5f",
          "name": "Alice Smith",
          "dateOfBirth": "2020-05-15T00:00:00.000Z",
          "gender": "female"
        }
      ]
    },
    "tokens": {
      "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2023-12-03T10:00:00.000Z"
      },
      "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2023-12-10T10:00:00.000Z"
      }
    }
  }
}
```

**Success (200 OK - Existing User):**
```json
{
  "success": true,
  "message": "User already exists",
  "data": {
    "user": {
      "_id": "5f8d7a6e8c7d6b5a4c3b2a1f",
      "email": "user@example.com",
      "name": "John Doe",
      "user_type": "parent",
      "isEmailVerified": true,
      "profile": {
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "gender": "male"
      }
    },
    "tokens": {
      "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2023-12-03T10:00:00.000Z"
      },
      "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2023-12-10T10:00:00.000Z"
      }
    }
  }
}
```

**Error Responses:**

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters long"
      }
    ]
  }
}
```

**409 Conflict - Email Already Exists**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email already in use"
  }
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

### 2. User Login

#### POST /api/users/login
Authenticate a user and return JWT tokens.

**Authentication:** None required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "5f8d7a6e8c7d6b5a4c3b2a1f",
      "email": "user@example.com",
      "name": "John Doe",
      "user_type": "parent",
      "isEmailVerified": true
    },
    "tokens": {
      "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2023-12-03T10:00:00.000Z"
      },
      "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires": "2023-12-10T10:00:00.000Z"
      }
    }
  }
}
```

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with a work factor of 10
- Passwords are never stored in plain text
- Password reset tokens are hashed before storage
- Failed login attempts are rate-limited

### Token Security
- Access tokens expire after 1 day
- Refresh tokens expire after 7 days
- Tokens are signed with a strong secret key
- Refresh tokens are stored securely in the database
- Token blacklisting is implemented for logout functionality

### Rate Limiting
- 100 requests per 15 minutes per IP for authentication endpoints
- 1000 requests per hour per IP for other endpoints
- 10 failed login attempts will temporarily block the IP for 15 minutes

### CORS
- Only trusted origins are allowed
- Credentials are required for cross-origin requests
- Pre-flight requests are cached for 1 hour

## Best Practices
1. Always use HTTPS in production
2. Implement CSRF protection for web applications
3. Use secure, httpOnly cookies for storing refresh tokens
4. Implement proper session management
5. Regularly rotate your JWT secrets
6. Monitor and log authentication attempts
7. Implement account lockout after multiple failed attempts
8. Use secure password policies
9. Keep dependencies up to date
10. Regularly audit your authentication logs
  "phone": "string (optional)",
  "google_id": "string (optional)",
  "google_email": "string (optional)",
  "profile_picture": "string (optional)"
}
```

**Response (Success - 201/200):**
```json
{
  "success": true,
  "message": "User created successfully" | "User already exists",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "user_type": "string",
    "phone": "string",
    "google_id": "string",
    "google_email": "string",
    "profile_picture": "string",
    "is_verified": "boolean",
    "is_active": "boolean",
    "created_at": "string",
    "updated_at": "string"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "isNewUser": "boolean"
}
```

**Error Responses:**
- 400: Email is required / Invalid email format
- 500: Failed to create or get user

### GET /api/users/profile
Get authenticated user's profile.

**Authentication:** JWT required (Bearer token)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "user_type": "string",
    "phone": "string",
    "google_id": "string",
    "google_email": "string",
    "profile_picture": "string",
    "is_verified": "boolean",
    "is_active": "boolean",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

**Error Responses:**
- 401: Unauthorized
- 404: User not found
- 500: Failed to get profile

### PUT /api/users/kyc
Update user KYC information.

**Authentication:** JWT required (Bearer token)

**Query Parameters:**
- `wants_to_update_details`: boolean (optional)

**Request Body:**
```json
{
  "phone": "string (required)",
  "address": "string (required)",
  "date_of_birth": "string (required, ISO date)",
  "pan_number": "string (required)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "user_type": "string",
    "phone": "string",
    "address": "string",
    "date_of_birth": "string",
    "pan_number": "string",
    "is_verified": true,
    "is_active": "boolean",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

**Error Responses:**
- 400: Required fields missing
- 401: Unauthorized
- 404: User not found
- 500: Failed to update profile

### GET /api/users/:userId
Get user by ID.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "user_type": "string",
    "phone": "string",
    "google_id": "string",
    "google_email": "string",
    "profile_picture": "string",
    "is_verified": "boolean",
    "is_active": "boolean",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

**Error Responses:**
- 400: User ID is required
- 404: User not found
- 500: Failed to get user

### GET /api/users/email/:email
Get user by email.

**Authentication:** None required

**Parameters:**
- `email`: string (required, path parameter)

**Response:** Same as GET /api/users/:userId

**Error Responses:** Same as GET /api/users/:userId

### GET /api/users/google/:googleId
Get user by Google ID.

**Authentication:** None required

**Parameters:**
- `googleId`: string (required, path parameter)

**Response:** Same as GET /api/users/:userId

**Error Responses:** Same as GET /api/users/:userId

### PUT /api/users/:userId
Update user information.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)

**Request Body:**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "date_of_birth": "string (optional, ISO date)",
  "profile_picture": "string (optional)",
  "is_verified": "boolean (optional)",
  "is_active": "boolean (optional)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "user_type": "string",
    "phone": "string",
    "address": "string",
    "date_of_birth": "string",
    "pan_number": "string",
    "is_verified": "boolean",
    "is_active": "boolean",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

**Error Responses:**
- 400: User ID is required
- 404: User not found
- 500: Failed to update user
