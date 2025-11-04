# Family Management API

This document provides comprehensive documentation for the Family Management API, which enables users to create and manage family groups, handle member invitations, control access permissions, and configure family settings.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
- [Security Considerations](#security-considerations)

## Overview
The Family Management API allows users to create family groups for collaborative financial management. Key features include:

- **Family Creation & Management**: Create, update, and delete family groups
- **Member Management**: Invite, accept, reject, and remove family members
- **Role-Based Access Control**: Define permissions for different family roles
- **Access Control**: Grant and revoke access between users (parent-child relationships)
- **Settings Management**: Configure family-wide settings and preferences

## Getting Started

### Prerequisites
- Valid JWT authentication token
- User account with appropriate permissions
- Database connection (Prisma ORM)

### Authentication
All family API endpoints require JWT authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Base URL
```
/api/family
```

## API Endpoints

### Family CRUD Operations

#### 1. Create Family
**POST /api/family**

Create a new family group. The authenticated user becomes the owner.

**Request Body:**
```json
{
  "name": "Smith Family",
  "description": "Family financial management group"
}
```

**Field Descriptions:**
- `name`: (required) Family name, must be non-empty string
- `description`: (optional) Family description

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Family created successfully",
  "data": {
    "id": "family-uuid",
    "name": "Smith Family",
    "description": "Family financial management group",
    "owner_id": "user-uuid",
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:00:00.000Z",
    "members": [
      {
        "id": "member-uuid",
        "user_id": "user-uuid",
        "role": "owner",
        "can_view": true,
        "can_edit": true,
        "can_delete": true,
        "can_invite": true,
        "is_active": true,
        "joined_at": "2023-12-01T10:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "owner": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "settings": {
      "id": "settings-uuid",
      "family_id": "family-uuid",
      "can_share_assets": true,
      "can_view_others": true,
      "require_approval": false,
      "currency": "INR",
      "financial_year_start": "01-04",
      "notify_large_transactions": true,
      "large_transaction_threshold": 100000
    }
  }
}
```

**Error Responses:**
- `400`: Family name is required
- `500`: Failed to create family

#### 2. Get User Families
**GET /api/family**

Get all family where the authenticated user is a member.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Families retrieved",
  "data": [
    {
      "id": "family-uuid",
      "name": "Smith Family",
      "description": "Family financial management group",
      "owner_id": "user-uuid",
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:00:00.000Z",
      "userRole": "owner",
      "userPermissions": {
        "can_view": true,
        "can_edit": true,
        "can_delete": true,
        "can_invite": true
      },
      "owner": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "members": [
        {
          "id": "member-uuid",
          "role": "owner",
          "user": {
            "id": "user-uuid",
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      ],
      "settings": {
        "can_share_assets": true,
        "can_view_others": true,
        "require_approval": false,
        "currency": "INR"
      }
    }
  ]
}
```

#### 3. Get Family Details
**GET /api/family/:familyId**

Get detailed information about a specific family.

**Parameters:**
- `familyId`: (required) UUID of the family

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Family details retrieved",
  "data": {
    "id": "family-uuid",
    "name": "Smith Family",
    "description": "Family financial management group",
    "owner_id": "user-uuid",
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:00:00.000Z",
    "members": [
      {
        "id": "member-uuid",
        "user_id": "user-uuid",
        "role": "owner",
        "can_view": true,
        "can_edit": true,
        "can_delete": true,
        "can_invite": true,
        "is_active": true,
        "joined_at": "2023-12-01T10:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+1234567890",
          "profile_picture": "https://example.com/avatar.jpg"
        }
      }
    ],
    "owner": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "settings": {
      "id": "settings-uuid",
      "family_id": "family-uuid",
      "can_share_assets": true,
      "can_view_others": true,
      "require_approval": false,
      "currency": "INR",
      "financial_year_start": "01-04",
      "notify_large_transactions": true,
      "large_transaction_threshold": 100000
    },
    "roles": [
      {
        "id": "role-uuid",
        "family_id": "family-uuid",
        "name": "owner",
        "permissions": {
          "view_assets": true,
          "create_assets": true,
          "edit_assets": true,
          "delete_assets": true,
          "manage_members": true,
          "approve_transactions": true,
          "export_data": true
        },
        "is_default": true
      }
    ],
    "invitations": []
  }
}
```

**Error Responses:**
- `403`: Unauthorized to access this family
- `404`: Family not found
- `500`: Failed to fetch family details

#### 4. Update Family
**PUT /api/family/:familyId**

Update family information.

**Parameters:**
- `familyId`: (required) UUID of the family

**Request Body:**
```json
{
  "name": "Updated Family Name",
  "description": "Updated description"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Family updated successfully",
  "data": {
    "id": "family-uuid",
    "name": "Updated Family Name",
    "description": "Updated description",
    "owner_id": "user-uuid",
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:05:00.000Z"
  }
}
```

**Error Responses:**
- `403`: Not authorized to update family details
- `500`: Failed to update family

#### 5. Delete Family
**DELETE /api/family/:familyId**

Delete a family. Only the owner can perform this action.

**Parameters:**
- `familyId`: (required) UUID of the family

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Family deleted successfully"
}
```

**Error Responses:**
- `403`: Only family owner can delete family
- `500`: Failed to delete family

### Family Member Management

#### 6. Get Family Members
**GET /api/family/:familyId/members**

Get all active members of a family.

**Parameters:**
- `familyId`: (required) UUID of the family

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Family members retrieved",
  "data": [
    {
      "id": "member-uuid",
      "user_id": "user-uuid",
      "role": "owner",
      "can_view": true,
      "can_edit": true,
      "can_delete": true,
      "can_invite": true,
      "is_active": true,
      "joined_at": "2023-12-01T10:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "profile_picture": "https://example.com/avatar.jpg"
      }
    }
  ]
}
```

**Error Responses:**
- `403`: Unauthorized to access family members
- `500`: Failed to fetch family members

#### 7. Invite Member
**POST /api/family/:familyId/members/invite**

Invite a user to join the family.

**Parameters:**
- `familyId`: (required) UUID of the family

**Request Body:**
```json
{
  "email": "jane@example.com",
  "role": "member"
}
```

**Field Descriptions:**
- `email`: (required) Email address of the user to invite
- `role`: (optional) Role to assign (defaults to "member")

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "id": "invitation-uuid",
    "family_id": "family-uuid",
    "invited_by_id": "user-uuid",
    "invited_email": "jane@example.com",
    "role": "member",
    "status": "pending",
    "expires_at": "2023-12-08T10:00:00.000Z",
    "created_at": "2023-12-01T10:00:00.000Z",
    "family": {
      "id": "family-uuid",
      "name": "Smith Family"
    },
    "invited_by": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
- `403`: Not authorized to invite members
- `400`: User already exists in family / Invitation already sent
- `500`: Failed to invite member

#### 8. Update Member Role
**PUT /api/family/:familyId/members/role**

Update a member's role and permissions.

**Parameters:**
- `familyId`: (required) UUID of the family

**Request Body:**
```json
{
  "memberId": "member-uuid",
  "role": "admin",
  "can_view": true,
  "can_edit": true,
  "can_delete": false,
  "can_invite": true
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Member role updated successfully",
  "data": {
    "id": "member-uuid",
    "user_id": "user-uuid",
    "role": "admin",
    "can_view": true,
    "can_edit": true,
    "can_delete": false,
    "can_invite": true,
    "is_active": true,
    "updated_at": "2023-12-01T10:05:00.000Z",
    "user": {
      "id": "user-uuid",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

**Error Responses:**
- `403`: Not authorized to update member roles
- `404`: Member not found
- `400`: Cannot update owner permissions
- `500`: Failed to update member role

#### 9. Remove Member
**DELETE /api/family/:familyId/members**

Remove a member from the family.

**Parameters:**
- `familyId`: (required) UUID of the family

**Request Body:**
```json
{
  "memberId": "member-uuid"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

**Error Responses:**
- `403`: Not authorized to remove members
- `404`: Member not found
- `400`: Cannot remove yourself / Cannot remove family owner
- `500`: Failed to remove member

#### 10. Leave Family
**POST /api/family/:familyId/leave**

Leave a family (for non-owner members).

**Parameters:**
- `familyId`: (required) UUID of the family

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Successfully left family"
}
```

**Error Responses:**
- `404`: Not a member of this family
- `400`: Owner cannot leave family
- `500`: Failed to leave family

### Family Invitations

#### 11. Get Pending Invitations
**GET /api/family/invitations/pending**

Get all pending family invitations for the authenticated user.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Pending invitations retrieved",
  "data": [
    {
      "id": "invitation-uuid",
      "family_id": "family-uuid",
      "invited_by_id": "user-uuid",
      "invited_email": "user@example.com",
      "role": "member",
      "status": "pending",
      "expires_at": "2023-12-08T10:00:00.000Z",
      "created_at": "2023-12-01T10:00:00.000Z",
      "family": {
        "id": "family-uuid",
        "name": "Smith Family",
        "description": "Family financial management group"
      },
      "invited_by": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### 12. Accept Invitation
**POST /api/family/invitations/:invitationId/accept**

Accept a family invitation.

**Parameters:**
- `invitationId`: (required) UUID of the invitation

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Invitation accepted successfully",
  "data": {
    "familyId": "family-uuid",
    "familyName": "Smith Family",
    "role": "member"
  }
}
```

**Error Responses:**
- `404`: Invitation not found
- `403`: This invitation is not for you
- `400`: Invitation already accepted / Invitation has expired
- `500`: Failed to accept invitation

#### 13. Reject Invitation
**POST /api/family/invitations/:invitationId/reject**

Reject a family invitation.

**Parameters:**
- `invitationId`: (required) UUID of the invitation

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Invitation rejected"
}
```

**Error Responses:**
- `404`: Invitation not found
- `403`: This invitation is not for you
- `400`: Invitation already rejected
- `500`: Failed to reject invitation

### Family Access Control

#### 14. Grant Access
**POST /api/family/access/grant**

Grant access to another user (parent-child relationship).

**Request Body:**
```json
{
  "targetUserId": "user-uuid",
  "accessType": "full",
  "canViewAssets": true,
  "canEditAssets": true,
  "canDeleteAssets": false,
  "accessUntil": "2024-12-01T00:00:00.000Z"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Access granted successfully",
  "data": {
    "id": "access-uuid",
    "parent_user_id": "parent-uuid",
    "child_user_id": "child-uuid",
    "access_type": "full",
    "can_view_assets": true,
    "can_edit_assets": true,
    "can_delete_assets": false,
    "access_until": "2024-12-01T00:00:00.000Z",
    "is_active": true,
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `500`: Failed to grant access

#### 15. Get User Access
**GET /api/family/access/list**

Get all access grants for the authenticated user.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Access list retrieved",
  "data": [
    {
      "id": "access-uuid",
      "parent_user_id": "parent-uuid",
      "child_user_id": "child-uuid",
      "access_type": "full",
      "can_view_assets": true,
      "can_edit_assets": true,
      "can_delete_assets": false,
      "access_until": "2024-12-01T00:00:00.000Z",
      "is_active": true,
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:00:00.000Z",
      "child_user": {
        "id": "child-uuid",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "profile_picture": "https://example.com/avatar.jpg"
      }
    }
  ]
}
```

#### 16. Revoke Access
**POST /api/family/access/revoke**

Revoke access from a user.

**Request Body:**
```json
{
  "accessId": "access-uuid"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Access revoked successfully"
}
```

**Error Responses:**
- `403`: Not authorized to revoke this access
- `500`: Failed to revoke access

### Family Settings

#### 17. Update Family Settings
**PUT /api/family/:familyId/settings**

Update family settings and preferences.

**Parameters:**
- `familyId`: (required) UUID of the family

**Request Body:**
```json
{
  "canShareAssets": true,
  "canViewOthers": true,
  "requireApproval": false,
  "currency": "INR",
  "financialYearStart": "01-04",
  "notifyLargeTransactions": true,
  "largeTransactionThreshold": 100000
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "id": "settings-uuid",
    "family_id": "family-uuid",
    "can_share_assets": true,
    "can_view_others": true,
    "require_approval": false,
    "currency": "INR",
    "financial_year_start": "01-04",
    "notify_large_transactions": true,
    "large_transaction_threshold": 100000,
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:05:00.000Z"
  }
}
```

**Error Responses:**
- `403`: Not authorized to update settings
- `500`: Failed to update settings

## Error Handling

### Common Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid JWT)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

### Common Error Messages
- "Family name is required"
- "Unauthorized to access this family"
- "Not authorized to invite members"
- "User already exists in family"
- "Invitation already sent to this email"
- "Only family owner can delete family"
- "Cannot remove family owner"
- "Owner cannot leave family"

## Data Models

### Family
```typescript
{
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}
```

### FamilyMember
```typescript
{
  id: string;
  family_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_invite: boolean;
  is_active: boolean;
  joined_at: Date;
  updated_at: Date;
}
```

### FamilyInvitation
```typescript
{
  id: string;
  family_id: string;
  invited_by_id: string;
  invited_email: string;
  invited_user_id?: string;
  role: string;
  status: 'pending' | 'accepted' | 'rejected';
  expires_at?: Date;
  accepted_at?: Date;
  rejected_at?: Date;
  created_at: Date;
  updated_at: Date;
}
```

### FamilySettings
```typescript
{
  id: string;
  family_id: string;
  can_share_assets: boolean;
  can_view_others: boolean;
  require_approval: boolean;
  currency: string;
  financial_year_start: string;
  notify_large_transactions: boolean;
  large_transaction_threshold: number;
  created_at: Date;
  updated_at: Date;
}
```

### FamilyAccess
```typescript
{
  id: string;
  parent_user_id: string;
  child_user_id: string;
  access_type: string;
  can_view_assets: boolean;
  can_edit_assets: boolean;
  can_delete_assets: boolean;
  access_until?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

## Security Considerations

### Authentication & Authorization
- All endpoints require valid JWT authentication
- Role-based access control (RBAC) implemented
- Owner has full permissions, other roles have limited access
- Permission checks performed on all sensitive operations

### Data Validation
- Input validation on all request bodies
- SQL injection prevention through Prisma ORM
- XSS protection through input sanitization

### Rate Limiting
- API endpoints inherit rate limiting from authentication middleware
- Additional family-specific rate limits may be implemented

### Audit Logging
- All family operations are logged for security auditing
- Member additions, removals, and permission changes are tracked
- Failed authorization attempts are logged

## Best Practices

### API Usage
1. Always include proper authentication headers
2. Handle errors gracefully with appropriate HTTP status codes
3. Use the correct content-type (application/json) for requests
4. Validate input data on the client side before sending requests
5. Implement proper loading states for better user experience

### Family Management
1. Regularly review and update member permissions
2. Monitor pending invitations and clean up expired ones
3. Set appropriate family settings based on your needs
4. Communicate with family members about role changes
5. Keep family information up to date

### Security
1. Use strong, unique passwords for all family accounts
2. Enable two-factor authentication when available
3. Regularly review access logs for suspicious activity
4. Revoke access immediately when no longer needed
5. Be cautious when granting admin or owner-level permissions
