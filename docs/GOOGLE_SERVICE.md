# Google Service Integration

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview
The `GoogleService` class provides a comprehensive interface for integrating with Google's OAuth 2.0 and Gmail API. It handles the complete authentication flow, token management, and common Gmail operations with built-in security features.

## Installation

### Prerequisites
- Node.js 16+
- Google Cloud Project with Gmail API enabled
- OAuth 2.0 credentials from Google Cloud Console

### Install Dependencies
```bash
npm install googleapis @prisma/client
```

## Configuration

### Environment Variables
```env
# Required
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback

# Optional (with defaults)
GOOGLE_AUTH_SCOPE=profile email https://www.googleapis.com/auth/gmail.readonly
ENCRYPTION_KEY=your-encryption-key
```

### Service Initialization
```typescript
import { PrismaClient } from '@prisma/client';
import { GoogleService } from './services/google.service';
import { EncryptionService } from './services/encryption.service';

const prisma = new PrismaClient();
const encryptionService = new EncryptionService(process.env.ENCRYPTION_KEY);

const googleService = new GoogleService(
  {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_REDIRECT_URI
  },
  prisma,
  encryptionService
);
```

## API Reference

### GoogleService Class

#### Constructor
```typescript
new GoogleService(
  config: GoogleAuthConfig,
  prisma: PrismaClient,
  encryptionService: EncryptionService
)
```

**Parameters:**
- `config`: `GoogleAuthConfig` - OAuth 2.0 configuration
- `prisma`: `PrismaClient` - Database client for storing tokens
- `encryptionService`: `EncryptionService` - For securing OAuth tokens

#### Configuration Interface
```typescript
interface GoogleAuthConfig {
  clientId: string;          // Google OAuth client ID
  clientSecret: string;      // Google OAuth client secret
  redirectUrl: string;       // Callback URL registered in Google Cloud Console
  scopes?: string[];         // Optional array of OAuth scopes
  accessType?: 'online' | 'offline';  // Default: 'offline' for refresh tokens
  prompt?: string;           // OAuth consent screen behavior
}
```

### Core Methods

#### setUserId(userId: string): void
Sets the current user context for token management.

**Parameters:**
- `userId`: `string` - Unique identifier for the user

**Throws:**
- `Error` - If userId is not provided

**Example:**
```typescript
googleService.setUserId('user-123');
```

#### getAuthUrl(options?: AuthUrlOptions): string
Generates the Google OAuth 2.0 consent screen URL.

**Parameters (optional):**
```typescript
interface AuthUrlOptions {
  scopes?: string[];         // Override default scopes
  accessType?: 'online' | 'offline';
  prompt?: 'none' | 'consent' | 'select_account';
  state?: string;            // CSRF protection
  includeGrantedScopes?: boolean;
}
```

**Returns:** `string` - The authorization URL

**Example:**
```typescript
const authUrl = googleService.getAuthUrl({
  scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
  accessType: 'offline',
  prompt: 'consent'
});
```

- `code`: string (authorization code from OAuth callback)
- `userId`: string (user identifier)

**Returns:** Promise<GoogleCredentials>

**Throws:** Error if exchange fails

### saveCredentialsToDatabase(userId: string, credentials: GoogleCredentials): Promise<void>
Save encrypted credentials to database.

**Parameters:**
- `userId`: string
- `credentials`: GoogleCredentials

**Throws:** Error if save fails

### loadCredentialsFromDatabase(userId: string): Promise<boolean>
Load and decrypt credentials from database.

**Parameters:**
- `userId`: string

**Returns:** Promise<boolean> (true if loaded successfully)

### refreshAccessToken(): Promise<boolean>
Refresh expired access token using refresh token.

**Returns:** Promise<boolean> (true if refreshed successfully)

### listEmails(maxResults?: number, pageToken?: string): Promise<{emails: EmailMessage[], nextPageToken?: string, totalMessages: number}>
List emails from Gmail.

**Parameters:**
- `maxResults`: number (optional, default 10)
- `pageToken`: string (optional, for pagination)

**Returns:** Promise with emails array and pagination info

**Throws:** Error if Gmail client not initialized

### getEmailById(emailId: string): Promise<EmailMessage | null>
Get full email by ID.

**Parameters:**
- `emailId`: string

**Returns:** Promise<EmailMessage | null>

**Throws:** Error if Gmail client not initialized

### searchEmails(query: string, maxResults?: number): Promise<EmailMessage[]>
Search emails using Gmail query syntax.

**Parameters:**
- `query`: string (Gmail search query)
- `maxResults`: number (optional, default 10)

**Returns:** Promise<EmailMessage[]>

**Throws:** Error if Gmail client not initialized

### getCredentials(): GoogleCredentials | null
Get current credentials.

**Returns:** GoogleCredentials or null

### clearCredentials(): Promise<boolean>
Clear credentials from database and memory.

**Returns:** Promise<boolean> (true if cleared successfully)

**Throws:** Error if userId not set

### hasValidCredentials(): boolean
Check if valid credentials are available.

**Returns:** boolean

### getEmailWithAttachments(emailId: string, attachmentService: GmailAttachmentService, password?: string): Promise<{email: EmailMessage, attachments: Array<{filename: string, mimeType: string, size: number, content: string, metadata: Record<string, any>}>}>
Get email with processed attachments.

**Parameters:**
- `emailId`: string
- `attachmentService`: GmailAttachmentService
- `password`: string (optional, for password-protected attachments)

**Returns:** Promise with email and attachments data

**Throws:** Error if Gmail client not initialized

## Interfaces

### GoogleCredentials
```typescript
{
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number; // timestamp
  refreshTokenExpiresAt: number; // timestamp
}
```

### EmailMessage
```typescript
{
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  labels: string[];
  internalDate: string;
}
```

## Usage Examples

### OAuth Flow
```typescript
const googleService = new GoogleService(config, prisma, encryptionService);

// Set user ID
googleService.setUserId('user123');

// Get authorization URL
const authUrl = googleService.getAuthUrl();

// After user authorizes, exchange code for tokens
const credentials = await googleService.exchangeCodeForTokens(code, 'user123');
```

### Gmail Operations
```typescript
// Load existing credentials
const loaded = await googleService.loadCredentialsFromDatabase('user123');

if (loaded) {
  // List emails
  const { emails, nextPageToken } = await googleService.listEmails(20);

  // Get specific email
  const email = await googleService.getEmailById('emailId123');

  // Search emails
  const searchResults = await googleService.searchEmails('from:bank subject:statement');
}
```

### Attachment Processing
```typescript
const attachmentService = new GmailAttachmentService();
const { email, attachments } = await googleService.getEmailWithAttachments(
  'emailId123',
  attachmentService,
  'password123' // optional
);
```

## Security Features

### Token Encryption
- Access and refresh tokens encrypted using AES-256-GCM
- IV stored separately for each token
- Encryption keys managed by EncryptionService

### Token Management
- Automatic token refresh when expired
- 5-minute buffer for token expiry checks
- Secure credential storage in database

### OAuth Security
- State parameter encoding for user ID protection
- Offline access type for refresh tokens
- Proper scope management

## Dependencies
- `googleapis`: Google API client
- `google-auth-library`: OAuth2 client
- `@prisma/client`: Database operations
- `EncryptionService`: Token encryption
- `GmailAttachmentService`: Attachment processing

## Error Handling
- Comprehensive error logging
- Graceful fallbacks for token refresh failures
- Validation of required parameters

## Gmail API Features
- Full email retrieval with body extraction
- Multipart message handling (text/plain, text/html)
- Attachment metadata extraction
- Pagination support
- Search query support

## Best Practices
1. **User ID Management**: Always set userId before operations
2. **Token Validation**: Check credentials before API calls
3. **Error Handling**: Implement proper error handling for API failures
4. **Security**: Never log sensitive token data
5. **Rate Limiting**: Respect Gmail API quotas
6. **State Management**: Use encoded state for OAuth security

## Limitations
- Requires valid Google OAuth credentials
- Subject to Gmail API rate limits
- Large attachments may require special handling
- Token refresh requires valid refresh token
