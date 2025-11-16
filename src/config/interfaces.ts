/**
 * @fileoverview TypeScript interfaces and types for the application
 * @description This file contains all TypeScript interfaces, types, and enums used throughout
 * the application. It defines the structure of data models, API requests/responses,
 * and extends Prisma-generated types with additional properties.
 * 
 * @module config/interfaces
 * @requires @prisma/client - Prisma-generated database types
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

// Import Prisma-generated types for database models
import { User, Family, FamilyInvitation, FamilySettings, FamilyRole, FamilyAccess, ActivityLog } from '@prisma/client';

// ============================================================================
// User Types
// ============================================================================

/**
 * Extended User type with family relationships
 * 
 * @interface UserWithFamily
 * @extends {User}
 * @description Extends the base User model with family-related relationships.
 * This is used when we need to fetch a user with their family connections.
 * 
 * @property {Family | null} [family] - The family this user belongs to (if any)
 * @property {Family[]} owned_families - Families owned/created by this user
 * @property {FamilyAccess[]} family_access_as_parent - Access records where user is the parent/granter
 * @property {FamilyAccess[]} family_access_as_family - Access records where user is the family member
 */
export interface UserWithFamily extends User {
  family?: Family | null; // Optional family membership
  owned_families: Family[]; // Families this user owns
  family_access_as_parent: FamilyAccess[]; // Access granted by this user
  family_access_as_family: FamilyAccess[]; // Access granted to this user
}

/**
 * User profile information for display purposes
 * 
 * @interface UserProfile
 * @description Simplified user information used for profile displays and listings.
 * Contains only the essential user information without sensitive data.
 * 
 * @property {string} id - Unique user identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} [phone] - Optional phone number
 * @property {string} [profilePicture] - Optional profile picture URL
 * @property {string} role - User's role in the system (e.g., 'user', 'admin')
 * @property {string} [familyRole] - User's role within their family (e.g., 'owner', 'member')
 */
export interface UserProfile {
  id: string; // Unique identifier for the user
  name: string; // Full name of the user
  email: string; // Email address
  phone?: string; // Optional phone number
  profilePicture?: string; // Optional profile picture URL
  role: string; // System-wide role
  familyRole?: string; // Role within family context
}

// ============================================================================
// Family Types
// ============================================================================

/**
 * Extended Family type with all relationships
 * 
 * @interface FamilyWithMembers
 * @extends {Family}
 * @description Extends the base Family model with all related data including members,
 * owner, settings, roles, and pending invitations. Used when fetching complete family data.
 * 
 * @property {User[]} members - All users who are members of this family
 * @property {User} owner - The user who created and owns this family
 * @property {FamilySettings} [settings] - Optional family-specific settings
 * @property {FamilyRole[]} roles - Custom roles defined within this family
 * @property {FamilyInvitation[]} invitations - Pending invitations to join this family
 */
export interface FamilyWithMembers extends Family {
  members: User[]; // All family members
  owner: User; // Family owner/creator
  settings?: FamilySettings; // Optional family settings
  roles: FamilyRole[]; // Custom roles for this family
  invitations: FamilyInvitation[]; // Pending invitations
}

/**
 * Individual family member information
 * 
 * @interface FamilyMember
 * @description Represents a single family member with their details and permissions.
 * Used for displaying family member lists and managing member access.
 * 
 * @property {string} id - Unique member identifier
 * @property {string} name - Member's full name
 * @property {string} email - Member's email address
 * @property {string} [phone] - Optional phone number
 * @property {string} role - Member's role in the family
 * @property {string} [profilePicture] - Optional profile picture URL
 * @property {Date} joinedAt - Date when member joined the family
 * @property {Record<string, boolean>} permissions - Map of permission names to boolean values
 */
export interface FamilyMember {
  id: string; // Unique identifier
  name: string; // Full name
  email: string; // Email address
  phone?: string; // Optional phone
  role: string; // Role in family
  profilePicture?: string; // Optional picture URL
  joinedAt: Date; // Join timestamp
  permissions: Record<string, boolean>; // Permission flags
}

/**
 * Family statistics and metrics
 * 
 * @interface FamilyStats
 * @description Aggregated statistics about a family's data and activities.
 * Used for dashboard displays and analytics.
 * 
 * @property {number} totalMembers - Total number of family members
 * @property {number} totalAssets - Total number of assets in family vault
 * @property {number} totalTransactions - Total number of financial transactions
 * @property {number} pendingInvitations - Number of pending family invitations
 * @property {number} [totalIncome] - Optional total income amount
 * @property {number} [totalExpenses] - Optional total expenses amount
 */
export interface FamilyStats {
  totalMembers: number; // Count of family members
  totalAssets: number; // Count of assets
  totalTransactions: number; // Count of transactions
  pendingInvitations: number; // Count of pending invites
  totalIncome?: number; // Optional income sum
  totalExpenses?: number; // Optional expenses sum
}

/**
 * Request body for creating a new family
 * 
 * @interface CreateFamilyRequest
 * @description Data required to create a new family unit.
 * 
 * @property {string} name - Name of the family (required)
 * @property {string} [description] - Optional description of the family
 */
export interface CreateFamilyRequest {
  name: string; // Family name (required)
  description?: string; // Optional description
}

/**
 * Request body for updating family information
 * 
 * @interface UpdateFamilyRequest
 * @description Data that can be updated for an existing family.
 * All fields are optional to allow partial updates.
 * 
 * @property {string} [name] - New name for the family
 * @property {string} [description] - New description for the family
 */
export interface UpdateFamilyRequest {
  name?: string; // Optional new name
  description?: string; // Optional new description
}

// ============================================================================
// Family Member Types
// ============================================================================

/**
 * Request body for inviting a new member to a family
 * 
 * @interface InviteMemberRequest
 * @description Contains all information needed to invite someone to join a family.
 * The invitation will be sent to the specified email address.
 * 
 * @property {string} email - Email address of the person to invite (required)
 * @property {'member' | 'admin' | 'viewer'} role - Role to assign to the invited person
 * @property {string} name - Name of the person being invited
 * @property {string} phone - Phone number of the person being invited
 */
export interface InviteMemberRequest {
  email: string; // Email to send invitation to
  role: 'member' | 'admin' | 'viewer'; // Role to assign
  name: string; // Name of invitee
  phone: string; // Phone number of invitee
}

/**
 * Response format for family member information
 * 
 * @interface MemberResponse
 * @description Standardized response format when returning member information.
 * Used in API responses for member-related operations.
 * 
 * @property {string} id - Unique member identifier
 * @property {string} name - Member's full name
 * @property {string} email - Member's email address
 * @property {string} role - Member's role in the family
 * @property {Date} joinedAt - Date when member joined
 * @property {'active' | 'pending' | 'removed'} status - Current status of the member
 */
export interface MemberResponse {
  id: string; // Unique identifier
  name: string; // Full name
  email: string; // Email address
  role: string; // Family role
  joinedAt: Date; // Join date
  status: 'active' | 'pending' | 'removed'; // Current status
}

/**
 * Request body for removing a member from a family
 * 
 * @interface RemoveMemberRequest
 * @description Specifies which member should be removed from the family.
 * 
 * @property {string} memberId - ID of the member to remove
 */
export interface RemoveMemberRequest {
  memberId: string; // ID of member to remove
}

// ============================================================================
// Family Invitation Types
// ============================================================================

/**
 * Enumeration of possible invitation statuses
 * 
 * @enum {string}
 * @description Represents the current state of a family invitation.
 * 
 * @property {string} PENDING - Invitation sent but not yet responded to
 * @property {string} ACCEPTED - Invitation accepted by recipient
 * @property {string} REJECTED - Invitation rejected by recipient
 * @property {string} EXPIRED - Invitation expired (time limit exceeded)
 */
export enum InvitationStatus {
  PENDING = 'pending', // Awaiting response
  ACCEPTED = 'accepted', // Accepted by recipient
  REJECTED = 'rejected', // Rejected by recipient
  EXPIRED = 'expired', // Expired due to time limit
}

/**
 * Response format for family invitation information
 * 
 * @interface FamilyInvitationResponse
 * @description Complete information about a family invitation.
 * Used when displaying invitation details to users.
 * 
 * @property {string} id - Unique invitation identifier
 * @property {string} familyId - ID of the family extending the invitation
 * @property {string} familyName - Name of the family
 * @property {string} invitedBy - Name or ID of the user who sent the invitation
 * @property {string} invitedEmail - Email address of the invited person
 * @property {string} role - Role the person will have if they accept
 * @property {InvitationStatus} status - Current status of the invitation
 * @property {Date} [expiresAt] - Optional expiration date
 * @property {Date} createdAt - Date when invitation was created
 */
export interface FamilyInvitationResponse {
  id: string; // Unique identifier
  familyId: string; // Family ID
  familyName: string; // Family name
  invitedBy: string; // Inviter name/ID
  invitedEmail: string; // Invitee email
  role: string; // Assigned role
  status: InvitationStatus; // Current status
  expiresAt?: Date; // Optional expiry date
  createdAt: Date; // Creation timestamp
}

/**
 * Request body for accepting or rejecting an invitation
 * 
 * @interface InvitationActionRequest
 * @description Specifies the action to take on a family invitation.
 * 
 * @property {string} invitationId - ID of the invitation to act on
 * @property {'accept' | 'reject'} action - Action to perform
 */
export interface InvitationActionRequest {
  invitationId: string; // Invitation ID
  action: 'accept' | 'reject'; // Action to take
}

// ============================================================================
// Family Access Types
// ============================================================================

/**
 * Enumeration of access permission levels
 * 
 * @enum {string}
 * @description Defines the level of access a family member can have.
 * 
 * @property {string} VIEW - Read-only access to view data
 * @property {string} EDIT - Ability to view and modify data
 * @property {string} FULL - Complete access including delete permissions
 */
export enum AccessType {
  VIEW = 'view', // Read-only access
  EDIT = 'edit', // Read and write access
  FULL = 'full', // Full access including delete
}

/**
 * Request body for granting access to a family member
 * 
 * @interface GrantAccessRequest
 * @description Specifies the access permissions to grant to a user.
 * Allows fine-grained control over what actions the user can perform.
 * 
 * @property {string} userId - ID of the user to grant access to
 * @property {AccessType} accessType - Overall access level (view/edit/full)
 * @property {boolean} canViewAssets - Whether user can view family assets
 * @property {boolean} canEditAssets - Whether user can edit family assets
 * @property {boolean} canDeleteAssets - Whether user can delete family assets
 * @property {Date} [accessUntil] - Optional expiration date for access
 */
export interface GrantAccessRequest {
  userId: string; // User to grant access to
  accessType: AccessType; // Access level
  canViewAssets: boolean; // View permission
  canEditAssets: boolean; // Edit permission
  canDeleteAssets: boolean; // Delete permission
  accessUntil?: Date; // Optional expiry date
}

/**
 * Response format for family access information
 * 
 * @interface FamilyAccessResponse
 * @description Complete information about a user's access to family data.
 * 
 * @property {string} id - Unique access record identifier
 * @property {string} userId - ID of the user with access
 * @property {string} userName - Name of the user
 * @property {string} userEmail - Email of the user
 * @property {AccessType} accessType - Overall access level
 * @property {Object} permissions - Detailed permission flags
 * @property {boolean} permissions.canViewAssets - Can view assets
 * @property {boolean} permissions.canEditAssets - Can edit assets
 * @property {boolean} permissions.canDeleteAssets - Can delete assets
 * @property {Date} [accessUntil] - Optional expiration date
 * @property {boolean} isActive - Whether access is currently active
 * @property {Date} grantedAt - Date when access was granted
 */
export interface FamilyAccessResponse {
  id: string; // Unique identifier
  userId: string; // User ID
  userName: string; // User name
  userEmail: string; // User email
  accessType: AccessType; // Access level
  permissions: { // Detailed permissions
    canViewAssets: boolean; // View permission
    canEditAssets: boolean; // Edit permission
    canDeleteAssets: boolean; // Delete permission
  };
  accessUntil?: Date; // Optional expiry
  isActive: boolean; // Active status
  grantedAt: Date; // Grant timestamp
}

/**
 * Request body for revoking access from a family member
 * 
 * @interface RevokeAccessRequest
 * @description Specifies which access record to revoke.
 * 
 * @property {string} accessId - ID of the access record to revoke
 */
export interface RevokeAccessRequest {
  accessId: string; // Access record ID to revoke
}

// ============================================================================
// Family Role Types
// ============================================================================

/**
 * Request body for creating or updating a family role
 * 
 * @interface FamilyRoleRequest
 * @description Defines a custom role within a family with specific permissions.
 * 
 * @property {string} name - Name of the role (e.g., "Admin", "Viewer")
 * @property {string} [description] - Optional description of the role
 * @property {Record<string, boolean>} permissions - Map of permission names to boolean values
 */
export interface FamilyRoleRequest {
  name: string; // Role name
  description?: string; // Optional description
  permissions: Record<string, boolean>; // Permission flags
}

/**
 * Response format for family role information
 * 
 * @interface FamilyRoleResponse
 * @description Complete information about a family role.
 * 
 * @property {string} id - Unique role identifier
 * @property {string} name - Name of the role
 * @property {string} [description] - Optional description
 * @property {Record<string, boolean>} permissions - Permission flags
 * @property {boolean} isDefault - Whether this is a default system role
 */
export interface FamilyRoleResponse {
  id: string; // Unique identifier
  name: string; // Role name
  description?: string; // Optional description
  permissions: Record<string, boolean>; // Permission map
  isDefault: boolean; // Default role flag
}

// ============================================================================
// Family Settings Types
// ============================================================================

/**
 * Request body for updating family settings
 * 
 * @interface FamilySettingsRequest
 * @description Configurable settings for a family unit.
 * All fields are optional to allow partial updates.
 * 
 * @property {boolean} [canShareAssets] - Whether members can share assets
 * @property {boolean} [canViewOthers] - Whether members can view other members' data
 * @property {boolean} [requireApproval] - Whether actions require approval
 * @property {string} [currency] - Default currency for the family (e.g., "USD", "EUR")
 * @property {string} [financialYearStart] - Start month of financial year (e.g., "January")
 * @property {boolean} [notifyLargeTransactions] - Whether to notify on large transactions
 * @property {number} [largeTransactionThreshold] - Threshold amount for large transactions
 */
export interface FamilySettingsRequest {
  canShareAssets?: boolean; // Asset sharing permission
  canViewOthers?: boolean; // View others' data permission
  requireApproval?: boolean; // Approval requirement flag
  currency?: string; // Default currency
  financialYearStart?: string; // Financial year start month
  notifyLargeTransactions?: boolean; // Large transaction notification flag
  largeTransactionThreshold?: number; // Threshold for large transactions
}

/**
 * Response format for family settings
 * 
 * @interface FamilySettingsResponse
 * @description Complete family settings information.
 * 
 * @property {string} id - Unique settings identifier
 * @property {boolean} canShareAssets - Asset sharing enabled
 * @property {boolean} canViewOthers - Can view others enabled
 * @property {boolean} requireApproval - Approval required
 * @property {string} currency - Default currency
 * @property {string} financialYearStart - Financial year start
 * @property {boolean} notifyLargeTransactions - Notification enabled
 * @property {number} largeTransactionThreshold - Notification threshold
 */
export interface FamilySettingsResponse {
  id: string; // Unique identifier
  canShareAssets: boolean; // Sharing enabled
  canViewOthers: boolean; // View others enabled
  requireApproval: boolean; // Approval required
  currency: string; // Default currency
  financialYearStart: string; // Fiscal year start
  notifyLargeTransactions: boolean; // Notification flag
  largeTransactionThreshold: number; // Notification threshold
}

// ============================================================================
// Activity Log Types
// ============================================================================

/**
 * Response format for activity log entries
 * 
 * @interface ActivityLogResponse
 * @description Represents a single activity log entry showing user actions.
 * Used for audit trails and activity feeds.
 * 
 * @property {string} id - Unique log entry identifier
 * @property {string} userId - ID of user who performed the action
 * @property {string} userName - Name of user who performed the action
 * @property {string} action - Description of the action performed
 * @property {string} entityType - Type of entity affected (e.g., "asset", "transaction")
 * @property {string} [entityId] - Optional ID of the affected entity
 * @property {Record<string, any>} [changes] - Optional details of what changed
 * @property {Date} createdAt - Timestamp when action occurred
 */
export interface ActivityLogResponse {
  id: string; // Unique identifier
  userId: string; // Actor user ID
  userName: string; // Actor user name
  action: string; // Action performed
  entityType: string; // Type of entity
  entityId?: string; // Optional entity ID
  changes?: Record<string, any>; // Optional change details
  createdAt: Date; // Action timestamp
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API response wrapper
 * 
 * @template T - Type of the data payload
 * @interface ApiResponse
 * @description Standard format for all API responses.
 * Provides consistent structure for success and error responses.
 * 
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - Human-readable message about the result
 * @property {T} [data] - Optional data payload (present on success)
 * @property {string} [error] - Optional error message (present on failure)
 */
export interface ApiResponse<T> {
  success: boolean; // Success status
  message: string; // Response message
  data?: T; // Optional data payload
  error?: string; // Optional error message
}

/**
 * Paginated API response wrapper
 * 
 * @template T - Type of the data items
 * @interface PaginatedResponse
 * @description Standard format for paginated list responses.
 * Includes both data and pagination metadata.
 * 
 * @property {boolean} success - Whether the request was successful
 * @property {T[]} data - Array of data items for current page
 * @property {Object} pagination - Pagination metadata
 * @property {number} pagination.total - Total number of items across all pages
 * @property {number} pagination.page - Current page number (1-indexed)
 * @property {number} pagination.limit - Number of items per page
 * @property {number} pagination.totalPages - Total number of pages
 */
export interface PaginatedResponse<T> {
  success: boolean; // Success status
  data: T[]; // Array of items
  pagination: { // Pagination info
    total: number; // Total item count
    page: number; // Current page number
    limit: number; // Items per page
    totalPages: number; // Total page count
  };
}

// ============================================================================
// Authenticated Request with Family Context
// ============================================================================

/**
 * Extended Express Request with authenticated user and family context
 * 
 * @interface AuthenticatedRequestWithFamily
 * @extends {Express.Request}
 * @description Extends the standard Express Request with user authentication
 * and family context information. Used in protected routes after authentication
 * middleware has added user information to the request.
 * 
 * @property {Object} [user] - Optional authenticated user information
 * @property {string} user.userId - Unique identifier of the authenticated user
 * @property {string} user.email - Email address of the authenticated user
 * @property {string} user.role - System role of the user
 * @property {string} [user.familyId] - Optional ID of user's family
 * @property {string} [user.familyRole] - Optional role within the family
 */
export interface AuthenticatedRequestWithFamily extends Express.Request {
  user?: { // Optional user context (added by auth middleware)
    userId: string; // User ID
    email: string; // User email
    role: string; // System role
    familyId?: string; // Optional family ID
    familyRole?: string; // Optional family role
  };
}
