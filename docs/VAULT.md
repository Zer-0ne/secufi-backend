# Vault API

This document provides comprehensive documentation for the Vault API, which enables users to manage their financial assets including retrieval, status updates, and modifications.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
- [Security Considerations](#security-considerations)

## Overview
The Vault API allows authenticated users to manage their financial assets. Key features include:

- **Asset Retrieval**: Get all assets or specific asset details
- **Asset Status Management**: Update asset statuses with predefined allowed values
- **Asset Modification**: Edit asset information and properties
- **Secure Access**: All operations require JWT authentication and user ownership validation

## Getting Started

### Prerequisites
- Valid JWT authentication token
- User account with appropriate permissions
- Database connection (Prisma ORM)

### Authentication
All vault API endpoints require JWT authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Base URL
```
/api/vault
```

## API Endpoints

### Asset Retrieval Operations

#### 1. Get All Assets
**GET /api/vault/get-assets/**

Retrieve all assets for the authenticated user.

**Middleware:**
- `authenticateJWT` - Validates JWT token and extracts user ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "asset1",
      "name": "Property",
      "status": "active",
      "value": 100000,
      "description": "Commercial property",
      "createdAt": "2023-12-01T10:00:00.000Z",
      "updatedAt": "2023-12-01T10:00:00.000Z"
    },
    {
      "id": "asset2",
      "name": "Vehicle",
      "status": "pending",
      "value": 50000,
      "description": "Family car",
      "createdAt": "2023-12-01T11:00:00.000Z",
      "updatedAt": "2023-12-01T11:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized (invalid/missing JWT)
- `500`: Failed to fetch assets

#### 2. Get Specific Asset
**GET /api/vault/get-asset/:assetId**

Retrieve a specific asset by ID.

**Parameters:**
- `assetId`: (required) The unique identifier of the asset

**Middleware:**
- `authenticateJWT` - Validates JWT token and extracts user ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "asset123",
    "name": "Property",
    "status": "active",
    "value": 100000,
    "description": "Commercial property in downtown",
    "category": "real_estate",
    "location": "Downtown Area",
    "purchaseDate": "2020-01-15T00:00:00.000Z",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized (invalid/missing JWT)
- `403`: Forbidden (asset doesn't belong to user)
- `404`: Asset not found
- `500`: Failed to fetch asset

### Asset Modification Operations

#### 3. Update Asset Status
**PATCH /api/vault/status-asset/:assetId**

Update the status of an asset.

**Parameters:**
- `assetId`: (required) The unique identifier of the asset

**Middleware:**
- `authenticateJWT` - Validates JWT token and extracts user ID

**Request Body:**
```json
{
  "status": "approved"
}
```

**Field Descriptions:**
- `status`: (required) New status for the asset

**Allowed Status Values:**
- `active`, `inactive`, `pending`, `approved`, `rejected`
- `under_review`, `needs_attention`, `verified`, `unverified`
- `flagged`, `escalated`, `resolved`, `closed`, `open`
- `in_progress`, `on_hold`, `completed`, `canceled`
- `draft`, `submitted`, `processing`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "asset123",
    "status": "approved",
    "updatedAt": "2023-12-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid status value
- `401`: Unauthorized (invalid/missing JWT)
- `403`: Forbidden (asset doesn't belong to user)
- `404`: Asset not found
- `500`: Failed to approve asset

#### 4. Edit Asset
**PUT /api/vault/edit-asset/:assetId**

Update asset information.

**Parameters:**
- `assetId`: (required) The unique identifier of the asset

**Middleware:**
- `authenticateJWT` - Validates JWT token and extracts user ID

**Request Body:**
```json
{
  "name": "Updated Asset Name",
  "value": 150000,
  "description": "Updated description",
  "category": "real_estate",
  "location": "Updated Location"
}
```

**Field Descriptions:**
- All fields are optional - only provided fields will be updated
- `name`: Asset name (string)
- `value`: Asset value (number)
- `description`: Asset description (string)
- `category`: Asset category (string)
- `location`: Asset location (string)
- Additional fields may be supported based on asset type

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "asset123",
    "name": "Updated Asset Name",
    "value": 150000,
    "description": "Updated description",
    "category": "real_estate",
    "location": "Updated Location",
    "updatedAt": "2023-12-01T12:05:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized (invalid/missing JWT)
- `403`: Forbidden (asset doesn't belong to user)
- `404`: Asset not found
- `500`: Failed to update asset

## Request/Response Formats

### Common Request Headers
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

### Common Response Structure
**Success Response:**
```json
{
  "success": true,
  "data": <response_data>,
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Asset Data Structure
```json
{
  "id": "string (UUID)",
  "name": "string",
  "status": "string (from allowed statuses)",
  "value": "number",
  "description": "string (optional)",
  "category": "string (optional)",
  "location": "string (optional)",
  "purchaseDate": "string (ISO date, optional)",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors, invalid status)
- `401`: Unauthorized (missing/invalid JWT)
- `403`: Forbidden (insufficient permissions, asset ownership)
- `404`: Not Found (asset not found)
- `500`: Internal Server Error

### Common Error Messages
- "Invalid status value"
- "Failed to fetch assets"
- "Failed to fetch asset"
- "Failed to approve asset"
- "Failed to update asset"
- "Asset not found"

## Data Models

### Asset
```typescript
interface Asset {
  id: string;
  userId: string;
  name: string;
  status: AssetStatus;
  value: number;
  description?: string;
  category?: string;
  location?: string;
  purchaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### AssetStatus
```typescript
type AssetStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'under_review'
  | 'needs_attention'
  | 'verified'
  | 'unverified'
  | 'flagged'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'open'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'canceled'
  | 'draft'
  | 'submitted'
  | 'processing';
```

## Security Considerations

### Authentication & Authorization
- All endpoints require valid JWT authentication
- User ownership validation ensures users can only access/modify their own assets
- Asset ID validation prevents unauthorized access to other users' assets

### Data Validation
- Input validation on all request bodies and parameters
- SQL injection prevention through Prisma ORM
- XSS protection through input sanitization
- Status value validation against predefined allowed statuses

### Rate Limiting
- API endpoints inherit rate limiting from authentication middleware
- Additional vault-specific rate limits may be implemented for asset operations

### Audit Logging
- All asset operations are logged for security auditing
- Asset creation, updates, and status changes are tracked
- Failed authorization attempts are logged

## Best Practices

### API Usage
1. Always include proper authentication headers
2. Handle errors gracefully with appropriate HTTP status codes
3. Use the correct content-type (application/json) for requests
4. Validate input data on the client side before sending requests
5. Implement proper loading states for better user experience

### Asset Management
1. Regularly review and update asset statuses
2. Keep asset information accurate and up-to-date
3. Use appropriate categories and descriptions for better organization
4. Monitor asset values and update as needed
5. Archive inactive assets rather than deleting them

### Security
1. Never share JWT tokens or asset IDs publicly
2. Validate all input data before processing
3. Use HTTPS for all API communications
4. Regularly rotate JWT tokens
5. Monitor API usage for suspicious activity
