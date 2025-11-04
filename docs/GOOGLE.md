# Google OAuth and Gmail API Integration

This document provides comprehensive documentation for integrating with Google OAuth 2.0 and Gmail API, enabling secure access to Gmail accounts and email processing capabilities.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Security Considerations](#security-considerations)

## Overview
This service provides a secure way to:
- Authenticate users with Google OAuth 2.0
- Access Gmail accounts with user consent
- Process emails and attachments
- Manage email labels and filters
- Handle OAuth tokens and refresh tokens

## Prerequisites

### Google Cloud Console Setup
1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Gmail API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials (Web application type)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/google/callback` (development)
   - `https://your-production-url.com/api/google/callback` (production)

### Environment Variables
Add these to your `.env` file:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
GOOGLE_AUTH_SCOPE=profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify

# Application
NODE_ENV=development
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install googleapis@^100.0.0 @google-cloud/local-auth@^2.0.0
```

### 2. Initialize Google OAuth2 Client
```typescript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
```

## API Endpoints

### Base URL
```
/api/google
```

### 1. Get Authorization URL

#### GET /api/google/auth-url/:userId
Generates the Google OAuth 2.0 consent screen URL for user authentication.

**Authentication:** None required

**Path Parameters:**
- `userId`: `string` (required) - Unique identifier for the user

**Query Parameters:**
- `state`: `string` (optional) - Opaque value to maintain state between request and callback
- `access_type`: `string` (optional) - 'online' (default) or 'offline' for refresh tokens
- `prompt`: `string` (optional) - 'none', 'consent', or 'select_account' (default: 'consent')
- `include_granted_scopes`: `boolean` (optional) - Include previously granted scopes (default: true)

**Example Request:**
```
GET /api/google/auth-url/user123?state=abc123&access_type=offline
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=...",
    "expiresIn": 300,
    "state": "abc123"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid user ID or parameters
- `500 Internal Server Error`: Failed to generate auth URL

### 2. OAuth Callback Handler

#### GET /api/google/callback
Handles the OAuth 2.0 callback from Google after user consent.

**Authentication:** None required

**Query Parameters:**
- `code`: `string` (required) - Authorization code from Google
- `state`: `string` (optional) - State parameter from auth URL
- `scope`: `string` (optional) - Space-separated list of scopes granted
- `authuser`: `string` (optional) - Google account session index
- `hd`: `string` (optional) - Hosted domain of the user's G Suite account
- `prompt`: `string` (optional) - Prompt parameter from the authorization request

**Example Request:**
```
GET /api/google/callback?code=4/0Adeu5B...&state=abc123
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "access_token": "ya29.a0ARr...",
      "refresh_token": "1//0e...",
      "scope": "https://www.googleapis.com/auth/gmail.readonly",
      "token_type": "Bearer",
      "expiry_date": 1635876000000
    },
    "user": {
      "email": "user@example.com",
      "name": "John Doe",
      "picture": "https://...",
      "hd": "example.com"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing or invalid parameters
- `401 Unauthorized`: Invalid authorization code
- `403 Forbidden`: Access denied or insufficient scopes
- `500 Internal Server Error`: Failed to exchange code for tokens

### 3. Token Management

#### POST /api/google/refresh-token
Exchange a refresh token for a new access token.

**Authentication:** Bearer Token (refresh token)

**Request Body:**
```json
{
  "refreshToken": "1//0e..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "ya29.a0ARr...",
    "expires_in": 3600,
    "scope": "https://www.googleapis.com/auth/gmail.readonly",
    "token_type": "Bearer"
  }
}
```

### 4. Revoke Access

#### POST /api/google/revoke/:userId
Revokes all tokens and disconnects the user's Google account.

**Authentication:** Bearer Token

**Path Parameters:**
- `userId`: `string` (required) - User ID to revoke access for

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully revoked access"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid user ID
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: No active Google connection found
- `500 Internal Server Error`: Failed to revoke access

## Authentication Flow

1. **Client-Side**:
   - Redirect user to `/api/google/auth-url/:userId`
   - User authenticates with Google and grants permissions
   - Google redirects to your callback URL with an authorization code
   - Exchange code for tokens using `/api/google/callback`
   - Store tokens securely (httpOnly cookies recommended)

2. **Token Refresh**:
   - Access tokens expire after 1 hour
   - Use refresh tokens to get new access tokens
   - Refresh tokens are long-lived but can be revoked

## Rate Limiting

- **Quota Limits**:
  - 10,000 requests per project per 100 seconds
  - 50,000 requests per project per 100 seconds (higher quota available)

- **Headers**:
  ```bash
  X-RateLimit-Limit: 10000
  X-RateLimit-Remaining: 9999
  X-RateLimit-Reset: 1635876000
  ```

## Security Considerations

1. **Token Security**:
   - Never expose refresh tokens client-side
   - Use secure, httpOnly cookies for token storage
   - Implement CSRF protection

2. **OAuth Scopes**:
   - Request only necessary permissions
   - Use the principle of least privilege
   - Review and audit granted permissions regularly

3. **Production Best Practices**:
   - Enable HTTPS for all OAuth endpoints
   - Validate state parameters to prevent CSRF
   - Implement proper error handling and logging
   - Monitor for suspicious activity

4. **Compliance**:
   - Comply with Google API Services User Data Policy
   - Include a privacy policy URL in your OAuth consent screen
   - Handle user data in accordance with GDPR/CCPA

### POST /api/google/set-token
Store Google API tokens for the authenticated user.

**Authentication:** JWT required (Bearer token)

**Request Body:**
```json
{
  "accessToken": "string (required)",
  "refreshToken": "string (optional)"
}
```

**Response (Success - 201/200):**
```json
{
  "success": true,
  "message": "Tokens saved successfully" | "Tokens already exist for this user"
}
```

**Error Responses:**
- 400: Access token is required
- 500: Failed to save tokens

### POST /api/google/get-token
Retrieve stored Google API tokens for the authenticated user.

**Authentication:** JWT required (Bearer token)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Tokens retrieved successfully",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "accessTokenExpiresAt": "number",
    "refreshTokenExpiresAt": "number"
  }
}
```

**Error Responses:**
- 401: Access token has expired
- 404: No tokens found for this user
- 500: Failed to retrieve tokens

### GET /api/google/callback
Handle OAuth callback from Google (redirect endpoint).

**Authentication:** None required

**Query Parameters:**
- `code`: string (authorization code)
- `state`: string (encoded userId)
- `error`: string (optional, OAuth error)
- `error_description`: string (optional, error description)

**Response:** Redirects to frontend URL with success/error parameters

### GET /api/google/emails/:userId
List emails with pagination.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)

**Query Parameters:**
- `maxResults`: number (optional, default: 10)
- `pageToken`: string (optional, for pagination)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Retrieved X emails",
  "data": {
    "emails": [
      {
        "id": "string",
        "threadId": "string",
        "labelIds": ["string"],
        "snippet": "string",
        "subject": "string",
        "from": "string",
        "to": "string",
        "date": "string",
        "body": "string"
      }
    ],
    "nextPageToken": "string",
    "totalMessages": "number"
  }
}
```

**Error Responses:**
- 400: User ID is required
- 401: Not authenticated
- 500: Failed to list emails

### GET /api/google/emails/:userId/:id
Get specific email by ID.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)
- `id`: string (required, path parameter, email ID)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Email retrieved successfully",
  "data": {
    "id": "string",
    "threadId": "string",
    "labelIds": ["string"],
    "snippet": "string",
    "subject": "string",
    "from": "string",
    "to": "string",
    "date": "string",
    "body": "string",
    "attachments": [
      {
        "filename": "string",
        "mimeType": "string",
        "size": "number",
        "data": "string"
      }
    ]
  }
}
```

**Error Responses:**
- 400: User ID and Email ID are required
- 401: Not authenticated
- 404: Email not found
- 500: Failed to get email

### GET /api/google/search/:userId
Search emails by query.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)

**Query Parameters:**
- `q`: string (required, search query)
- `maxResults`: number (optional, default: 10)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Found X emails matching query",
  "data": {
    "emails": [
      {
        "id": "string",
        "threadId": "string",
        "labelIds": ["string"],
        "snippet": "string",
        "subject": "string",
        "from": "string",
        "to": "string",
        "date": "string",
        "body": "string"
      }
    ],
    "totalMessages": "number"
  }
}
```

**Error Responses:**
- 400: User ID and search query are required
- 401: Not authenticated
- 500: Failed to search emails

### DELETE /api/google/credentials/:userId
Clear stored Google credentials.

**Authentication:** None required

**Parameters:**
- `userId`: string (required, path parameter)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Credentials cleared successfully"
}
```

**Error Responses:**
- 400: User ID is required
- 500: Failed to clear credentials
