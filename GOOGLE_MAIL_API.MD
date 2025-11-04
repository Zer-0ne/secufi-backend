# Complete Google OAuth & Email API Reference

## Base URL

```
http://localhost:5000/api/google
```

## Authentication Endpoints

### 1. Get Authorization URL

**Endpoint:** `GET /api/google/auth-url/:userId`

**Description:** Generate Google OAuth authorization URL for user consent. This URL contains encoded userId in state parameter.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string (UUID) | Yes | User ID from database |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| scopes | string | No | `gmail.readonly,gmail.send` | Comma-separated OAuth scopes |

**Request Example:**
```bash
curl -X GET "http://localhost:5000/api/google/auth-url/9494410c-9996-4d13-afc3-2937c2470807"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Auth URL generated successfully",
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=xxx&redirect_uri=http://localhost:5000/api/google/callback&response_type=code&scope=https://www.googleapis.com/auth/gmail.readonly%20https://www.googleapis.com/auth/gmail.send&access_type=offline&prompt=consent&state=OTQ5NDQxMGMtOTk5Ni00ZDEzLWFmYzMtMjkzN2MyNDcwODA3"
}
```

**Frontend Implementation:**
```typescript
// Step 1: Get auth URL
const response = await fetch(
  `http://localhost:5000/api/google/auth-url/${userId}`
);
const { authUrl } = await response.json();

// Step 2: Redirect user to Google OAuth
window.location.href = authUrl;
```

**Available Scopes:**
```
https://www.googleapis.com/auth/gmail.readonly      // Read emails
https://www.googleapis.com/auth/gmail.send          // Send emails
https://www.googleapis.com/auth/gmail.modify        // Modify emails (labels, etc.)
https://www.googleapis.com/auth/gmail.labels        // Manage labels
```

***

### 2. OAuth Callback (Automatic)

**Endpoint:** `GET /api/google/callback`

**Description:** Handles OAuth callback from Google. This is called by Google directly after user consent. Automatically exchanges code for tokens and encrypts them in database.

**Query Parameters (From Google):**
| Parameter | Type | Description |
|-----------|------|-------------|
| code | string | OAuth authorization code |
| state | string | Base64-encoded userId |
| error | string (optional) | Error code if user denied |
| error_description | string (optional) | Error description |

**Redirect Flow:**
```
User clicks auth URL
    ↓
Google OAuth screen (user grants permission)
    ↓
Google redirects to: /api/google/callback?code=...&state=...
    ↓
Backend exchanges code for tokens
    ↓
Backend redirects to: 
http://localhost:3000/auth/google/callback?success=true&userId=...
```

**Success Redirect (3xx):**
```
http://localhost:3000/auth/google/callback?success=true&userId=9494410c-9996-4d13-afc3-2937c2470807
```

**Error Redirect (3xx):**
```
http://localhost:3000/auth/google/callback?success=false&error=access_denied

OR

http://localhost:3000/auth/google/callback?success=false&error=Invalid%20OAuth%20state%20parameter
```

**Common Error Codes:**
| Code | Meaning |
|------|---------|
| access_denied | User denied permissions |
| invalid_scope | Invalid OAuth scopes requested |
| server_error | Google server error |
| Authorization code or state missing | Missing query parameters |
| Invalid OAuth state parameter | State decode failed (security issue) |

**Frontend Implementation:**
```typescript
// In your frontend callback page: /auth/google/callback
const params = new URLSearchParams(window.location.search);
const success = params.get('success') === 'true';
const userId = params.get('userId');
const error = params.get('error');

if (success && userId) {
  console.log('✓ Authentication successful!', userId);
  // Store userId, redirect to dashboard
  localStorage.setItem('userId', userId);
  window.location.href = '/dashboard';
} else {
  console.error('✗ Authentication failed:', error);
  // Show error message
}
```

***

## Email Operations

### 3. List All Emails

**Endpoint:** `GET /api/google/emails/:userId`

**Description:** Retrieve paginated list of all user emails from Gmail

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string (UUID) | Yes | User ID |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| maxResults | number | No | 10 | Number of emails per page (1-500) |
| pageToken | string | No | - | Token for next page pagination |

**Request Example:**
```bash
curl -X GET "http://localhost:5000/api/google/emails/9494410c-9996-4d13-afc3-2937c2470807?maxResults=5"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Retrieved 5 emails",
  "data": {
    "emails": [
      {
        "id": "185ea3d5e2b85c53",
        "threadId": "185ea3d5e2b85c53",
        "from": "sender@example.com",
        "to": "user@example.com",
        "subject": "Important Update",
        "snippet": "This is a preview of the email content...",
        "body": "Full email body content here...",
        "date": "Thu, 30 Oct 2025 10:30:00 +0530",
        "labels": ["INBOX", "IMPORTANT"],
        "internalDate": "1730280600000"
      },
      {
        "id": "185ea3d5e2b85c54",
        "threadId": "185ea3d5e2b85c54",
        "from": "another@example.com",
        "to": "user@example.com",
        "subject": "Meeting Request",
        "snippet": "Can we schedule a meeting...",
        "body": "Can we schedule a meeting...",
        "date": "Thu, 30 Oct 2025 09:15:00 +0530",
        "labels": ["INBOX"],
        "internalDate": "1730276700000"
      }
    ],
    "nextPageToken": "12345abcde",
    "totalMessages": 250
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authenticated",
  "error": "No valid credentials found. Please authenticate first."
}
```

**Frontend Implementation:**
```typescript
const userId = localStorage.getItem('userId');

const response = await fetch(
  `http://localhost:5000/api/google/emails/${userId}?maxResults=10`
);
const { success, data } = await response.json();

if (success) {
  console.log('Emails:', data.emails);
  console.log('Next page token:', data.nextPageToken);
  console.log('Total:', data.totalMessages);
  
  // Fetch next page
  const nextRes = await fetch(
    `http://localhost:5000/api/google/emails/${userId}?maxResults=10&pageToken=${data.nextPageToken}`
  );
}
```

***

### 4. Get Specific Email

**Endpoint:** `GET /api/google/emails/:userId/:id`

**Description:** Retrieve full details of a specific email by Gmail ID

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string (UUID) | Yes | User ID |
| id | string | Yes | Email ID from Gmail |

**Request Example:**
```bash
curl -X GET "http://localhost:5000/api/google/emails/9494410c-9996-4d13-afc3-2937c2470807/185ea3d5e2b85c53"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email retrieved successfully",
  "data": {
    "id": "185ea3d5e2b85c53",
    "threadId": "185ea3d5e2b85c53",
    "from": "sender@example.com",
    "to": "user@example.com",
    "subject": "Invoice #INV-001",
    "snippet": "Thank you for your purchase...",
    "body": "Dear Customer,\n\nThank you for your recent purchase. Your invoice is attached.\n\nAmount: $500.00\nDate: Oct 30, 2025\n\nBest regards,\nInvoicing System",
    "date": "Thu, 30 Oct 2025 10:30:00 +0530",
    "labels": ["INBOX"],
    "internalDate": "1730280600000"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Email not found",
  "error": "Email with ID 185ea3d5e2b85c53 not found"
}
```

**Frontend Implementation:**
```typescript
const userId = localStorage.getItem('userId');
const emailId = "185ea3d5e2b85c53";

const response = await fetch(
  `http://localhost:5000/api/google/emails/${userId}/${emailId}`
);
const { success, data } = await response.json();

if (success) {
  console.log('Full email:', data);
  console.log('Body:', data.body);
}
```

***

### 5. Search Emails

**Endpoint:** `GET /api/google/search/:userId`

**Description:** Search emails using Gmail search syntax

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string (UUID) | Yes | User ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (Gmail search syntax) |
| maxResults | number | No | Number of results (default: 10, max: 500) |

**Gmail Search Syntax Examples:**

| Query | Finds |
|-------|-------|
| `from:sender@example.com` | Emails from specific sender |
| `to:recipient@example.com` | Emails to specific recipient |
| `subject:invoice` | Emails with "invoice" in subject |
| `has:attachment` | Emails with attachments |
| `is:unread` | Unread emails |
| `is:starred` | Starred emails |
| `label:INBOX` | Emails in INBOX label |
| `before:2025/10/30` | Emails before specific date |
| `after:2025/10/01` | Emails after specific date |
| `filename:pdf` | Emails with PDF attachments |
| `is:important` | Important emails |
| `size:5M` | Emails larger than 5MB |
| `from:sender@example.com subject:invoice` | Combined search |

**Request Examples:**
```bash
# Search for invoices from a specific sender
curl -X GET "http://localhost:5000/api/google/search/9494410c-9996-4d13-afc3-2937c2470807?q=from:invoice@example.com%20subject:invoice&maxResults=10"

# Search for unread emails
curl -X GET "http://localhost:5000/api/google/search/9494410c-9996-4d13-afc3-2937c2470807?q=is:unread"

# Search for emails with attachments from last 30 days
curl -X GET "http://localhost:5000/api/google/search/9494410c-9996-4d13-afc3-2937c2470807?q=has:attachment%20after:2025/09/30"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Found 3 emails matching query",
  "data": {
    "emails": [
      {
        "id": "185ea3d5e2b85c53",
        "threadId": "185ea3d5e2b85c53",
        "from": "invoice@example.com",
        "to": "user@example.com",
        "subject": "Invoice #INV-001",
        "snippet": "Invoice for services rendered...",
        "body": "Invoice details...",
        "date": "Thu, 30 Oct 2025 10:30:00 +0530",
        "labels": ["INBOX"],
        "internalDate": "1730280600000"
      }
    ],
    "totalMessages": 3
  }
}
```

**Frontend Implementation:**
```typescript
const userId = localStorage.getItem('userId');

// Search for invoices
const response = await fetch(
  `http://localhost:5000/api/google/search/${userId}?q=subject:invoice&maxResults=20`
);
const { success, data } = await response.json();

if (success) {
  console.log(`Found ${data.totalMessages} invoices`);
  data.emails.forEach(email => {
    console.log(`${email.subject} from ${email.from}`);
  });
}
```

***

## Credential Management

### 6. Delete/Clear Credentials

**Endpoint:** `DELETE /api/google/credentials/:userId`

**Description:** Clear stored encrypted credentials from database. User will need to authenticate again.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string (UUID) | Yes | User ID |

**Request Example:**
```bash
curl -X DELETE "http://localhost:5000/api/google/credentials/9494410c-9996-4d13-afc3-2937c2470807"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Credentials cleared successfully"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to clear credentials",
  "error": "Failed to clear credentials"
}
```

**Frontend Implementation:**
```typescript
const userId = localStorage.getItem('userId');

const response = await fetch(
  `http://localhost:5000/api/google/credentials/${userId}`,
  { method: 'DELETE' }
);
const { success } = await response.json();

if (success) {
  console.log('✓ Credentials cleared');
  // Clear stored userId and redirect to login
  localStorage.removeItem('userId');
  window.location.href = '/login';
}
```

***

## Complete Frontend Flow Example

```typescript
// Step 1: User clicks "Connect Google" button
async function connectGoogle(userId: string) {
  const res = await fetch(
    `http://localhost:5000/api/google/auth-url/${userId}`
  );
  const { authUrl } = await res.json();
  window.location.href = authUrl;
}

// Step 2: After redirect, check callback page
function handleGoogleCallback() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.get('success') === 'true') {
    const userId = params.get('userId');
    console.log('✓ Connected!', userId);
    localStorage.setItem('userId', userId);
    // Redirect to email list
    window.location.href = '/emails';
  } else {
    console.error('✗ Error:', params.get('error'));
    window.location.href = '/login';
  }
}

// Step 3: Fetch and display emails
async function loadEmails() {
  const userId = localStorage.getItem('userId');
  
  const res = await fetch(
    `http://localhost:5000/api/google/emails/${userId}?maxResults=20`
  );
  const { data } = await res.json();
  
  data.emails.forEach(email => {
    console.log(`${email.from} - ${email.subject}`);
  });
}

// Step 4: Search emails
async function searchInvoices() {
  const userId = localStorage.getItem('userId');
  
  const res = await fetch(
    `http://localhost:5000/api/google/search/${userId}?q=subject:invoice`
  );
  const { data } = await res.json();
  
  return data.emails;
}

// Step 5: Disconnect
async function disconnectGoogle() {
  const userId = localStorage.getItem('userId');
  
  await fetch(
    `http://localhost:5000/api/google/credentials/${userId}`,
    { method: 'DELETE' }
  );
  
  localStorage.removeItem('userId');
  window.location.href = '/login';
}
```

***

## Error Handling

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Missing userId parameter | Provide userId in URL path |
| 400 | Missing code or state | Check OAuth redirect URL is correct |
| 401 | Not authenticated | User needs to connect Google OAuth first |
| 404 | Email not found | Check email ID is correct |
| 500 | Failed to exchange code | Check Google credentials and redirect URL |
| 500 | Database error | Check PostgreSQL connection |

***

## Security Notes[1]

- **Encryption**: AES-256-GCM with random IV per token 
- **Storage**: Encrypted in PostgreSQL, never in memory long-term 
- **State Parameter**: Base64-encoded userId prevents CSRF attacks
- **Auto-Expiry**: Credentials deleted automatically after 30 days
- **Token Refresh**: Automatic 5 minutes before expiry

***

## Environment Configuration

```bash
# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URL=http://localhost:5000/api/google/callback
FRONTEND_REDIRECT_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Encryption
ENCRYPTION_KEY=64_char_hex_string

# Server
PORT=5000
```
