# JWT Authentication Service

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Security Best Practices](#security-best-practices)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

## Overview
The `JWTService` provides a secure and flexible implementation of JSON Web Tokens (JWT) for authentication and authorization. It supports token generation, verification, and refresh token functionality with strong security defaults.

## Installation

### Prerequisites
- Node.js 16+
- `jsonwebtoken` package
- Environment configuration

### Install Dependencies
```bash
npm install jsonwebtoken @types/jsonwebtoken --save
```

## Configuration

### Environment Variables
Configure these in your `.env` file:

```env
# Required
JWT_SECRET=your-256-bit-secret-change-this-in-production
JWT_REFRESH_SECRET=another-256-bit-secret-change-this-too

# Optional (with defaults)
JWT_EXPIRY=15m                     # Access token expiry
JWT_REFRESH_EXPIRY=7d              # Refresh token expiry
JWT_ISSUER=your-app-name           # Token issuer
JWT_AUDIENCE=your-app-users        # Token audience
JWT_ALGORITHM=HS256               # Signing algorithm
JWT_COOKIE_NAME=refresh_token      # HTTP-only cookie name for refresh token
JWT_COOKIE_HTTP_ONLY=true         # Enable HTTP-only cookies
JWT_COOKIE_SECURE=true            # Only send over HTTPS
JWT_COOKIE_SAME_SITE=strict       # CSRF protection
JWT_COOKIE_MAX_AGE=604800000      # 7 days in ms
```

### Security Recommendations
1. Use strong, randomly generated secrets (min 32 characters)
2. Set appropriate token expiration times
3. Enable HTTP-only and Secure flags for cookies
4. Use SameSite=Strict for CSRF protection
5. Rotate secrets periodically in production

## API Reference

### Token Generation

#### signAccessToken(payload: IJWTPayload, options?: SignOptions): string
Generates a short-lived access token.

**Parameters:**
- `payload`: `IJWTPayload` - Data to encode in the token
  ```typescript
  interface IJWTPayload {
    userId: string | number;
    email: string;
    role?: string;
    [key: string]: any; // Additional custom claims
  }
  ```
- `options`: `SignOptions` (optional) - Override default signing options
  ```typescript
  interface SignOptions {
    expiresIn?: string | number;  // e.g., '15m', '1h', '7d'
    issuer?: string;
    audience?: string | string[];
    algorithm?: string;          // Default: 'HS256'
    keyid?: string;
    jwtid?: string;
  }
  ```

**Returns:** `string` - Signed JWT access token

**Example:**
```typescript
const token = JWTService.signAccessToken(
  { userId: 123, email: 'user@example.com', role: 'admin' },
  { expiresIn: '15m' }
);
```

#### signRefreshToken(payload: IJWTPayload, options?: SignOptions): string
Generates a long-lived refresh token (stored in HTTP-only cookie).

**Parameters:**
- `payload`: `IJWTPayload` - Data to encode
- `options`: `SignOptions` (optional) - Override default signing options

**Returns:** `string` - Signed JWT refresh token

**Example:**
```typescript
const refreshToken = JWTService.signRefreshToken(
  { userId: 123, email: 'user@example.com' },
  { expiresIn: '7d' }
);
```

#### signTokenPair(payload: IJWTPayload, options?: TokenPairOptions): ITokenPair
Generates both access and refresh tokens with a single call.

**Parameters:**
- `payload`: `IJWTPayload` - Data to encode in both tokens
- `options`: `TokenPairOptions` (optional)
  ```typescript
  interface TokenPairOptions {
    accessToken?: SignOptions;
    refreshToken?: SignOptions;
  }
  ```

**Returns:** `ITokenPair`
```typescript
interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;  // TTL in seconds
}
```

**Example:**
```typescript
const { accessToken, refreshToken } = JWTService.signTokenPair(
  { userId: 123, email: 'user@example.com' },
  {
    accessToken: { expiresIn: '15m' },
    refreshToken: { expiresIn: '7d' }
  }
);
```

### Token Verification

#### verifyAccessToken(token: string, options?: VerifyOptions): IJWTPayload
Verifies and decodes an access token.

**Parameters:**
- `token`: `string` - JWT token to verify
- `options`: `VerifyOptions` (optional)
  ```typescript
  interface VerifyOptions {
    issuer?: string | string[];
    audience?: string | string[];
    ignoreExpiration?: boolean;  // Default: false
    clockTolerance?: number;    // Seconds to tolerate for expiration
  }
  ```

**Returns:** `IJWTPayload` - Decoded token payload

**Throws:**
- `TokenExpiredError` - If token has expired
- `JsonWebTokenError` - For invalid tokens
- `NotBeforeError` - If used before valid date

**Example:**

**Parameters:**
- `token`: string (JWT token to decode)

**Returns:** IDecodedToken or null

### getPayload(token: string, isRefreshToken?: boolean): IDecodedToken
Get verified token payload.

**Parameters:**
- `token`: string (JWT token)
- `isRefreshToken`: boolean (optional, default false)

**Returns:** IDecodedToken

### isExpired(token: string): boolean
Check if token is expired.

**Parameters:**
- `token`: string (JWT token)

**Returns:** boolean (true if expired)

### getExpiryDate(token: string): Date | null
Get token expiration date.

**Parameters:**
- `token`: string (JWT token)

**Returns:** Date or null

### getTimeUntilExpiry(token: string): number
Get remaining time until token expires.

**Parameters:**
- `token`: string (JWT token)

**Returns:** number (seconds until expiry, 0 if expired)

### refreshAccessToken(refreshToken: string): string
Generate new access token using refresh token.

**Parameters:**
- `refreshToken`: string (valid refresh token)

**Returns:** string (new access token)

**Throws:** Error if refresh token is invalid

### extractFromHeader(authHeader?: string): string | null
Extract token from Authorization header.

**Parameters:**
- `authHeader`: string (Authorization header value)

**Returns:** string or null (extracted token)

**Supports:** "Bearer <token>" and plain "<token>" formats

### isValidFormat(token: string): boolean
Check if string is valid JWT format.

**Parameters:**
- `token`: string

**Returns:** boolean

### getTokenType(token: string): 'access' | 'refresh' | 'unknown'
Determine token type based on expiry time.

**Parameters:**
- `token`: string (JWT token)

**Returns:** 'access' | 'refresh' | 'unknown'

### getConfig(): object
Get current JWT configuration.

**Returns:** Configuration object
```typescript
{
  accessTokenExpiry: string,
  refreshTokenExpiry: string,
  issuer: string,
  audience: string
}
```

## Interfaces

### IJWTPayload
```typescript
{
  userId: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
  [key: string]: any;
}
```

### IDecodedToken
```typescript
{
  userId: string | ObjectId;
  email?: string;
  role?: string;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}
```

### ITokenPair
```typescript
{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

## Usage Examples

### Basic Token Creation
```typescript
const payload = { userId: '123', email: 'user@example.com' };

// Create access token
const accessToken = JWTService.signAccessToken(payload);

// Create refresh token
const refreshToken = JWTService.signRefreshToken(payload);

// Create both tokens
const tokens = JWTService.signTokenPair(payload);
```

### Token Verification
```typescript
try {
  const decoded = JWTService.verifyAccessToken(accessToken);
  console.log('User ID:', decoded.userId);
} catch (error) {
  console.log('Token invalid:', error.message);
}
```

### Token Refresh
```typescript
try {
  const newAccessToken = JWTService.refreshAccessToken(refreshToken);
  // Use new access token
} catch (error) {
  // Refresh token invalid, require re-authentication
}
```

### Middleware Usage
```typescript
const authenticateJWT = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const token = JWTService.extractFromHeader(authHeader);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = JWTService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

## Security Features

### Algorithm
- **HS256**: HMAC SHA-256 for symmetric encryption
- Secure against timing attacks

### Token Expiry
- Access tokens: Short-lived (default 1 day)
- Refresh tokens: Long-lived (default 7 days)
- Automatic expiry checking

### Issuer/Audience Validation
- Tokens validated against configured issuer and audience
- Prevents token reuse across different applications

### Error Handling
- Specific error messages for different failure types
- TokenExpiredError, JsonWebTokenError, NotBeforeError handling

## Dependencies
- `jsonwebtoken`: JWT library
- `mongoose`: For ObjectId type (optional)

## Best Practices
1. **Secret Keys**: Use strong, unique secrets for access and refresh tokens
2. **Environment Variables**: Store secrets securely, not in code
3. **Token Storage**: Store tokens securely (httpOnly cookies, secure storage)
4. **Refresh Logic**: Implement proper refresh token rotation
5. **Error Handling**: Handle token verification errors gracefully
6. **Expiry Management**: Check token expiry before making requests

## Limitations
- Symmetric encryption (HS256) requires shared secret
- No built-in token blacklisting (implement separately if needed)
- Tokens cannot be invalidated before expiry (use short expiry times)
