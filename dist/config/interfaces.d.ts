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
import { User, Family, FamilyInvitation, FamilySettings, FamilyRole, FamilyAccess } from '@prisma/client';
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
    family?: Family | null;
    owned_families: Family[];
    family_access_as_parent: FamilyAccess[];
    family_access_as_family: FamilyAccess[];
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
    id: string;
    name: string;
    email: string;
    phone?: string;
    profilePicture?: string;
    role: string;
    familyRole?: string;
}
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
    members: User[];
    owner: User;
    settings?: FamilySettings;
    roles: FamilyRole[];
    invitations: FamilyInvitation[];
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
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    profilePicture?: string;
    joinedAt: Date;
    permissions: Record<string, boolean>;
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
    totalMembers: number;
    totalAssets: number;
    totalTransactions: number;
    pendingInvitations: number;
    totalIncome?: number;
    totalExpenses?: number;
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
    name: string;
    description?: string;
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
    name?: string;
    description?: string;
}
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
    email: string;
    role: 'member' | 'admin' | 'viewer';
    name: string;
    phone: string;
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
    id: string;
    name: string;
    email: string;
    role: string;
    joinedAt: Date;
    status: 'active' | 'pending' | 'removed';
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
    memberId: string;
}
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
export declare enum InvitationStatus {
    PENDING = "pending",// Awaiting response
    ACCEPTED = "accepted",// Accepted by recipient
    REJECTED = "rejected",// Rejected by recipient
    EXPIRED = "expired"
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
    id: string;
    familyId: string;
    familyName: string;
    invitedBy: string;
    invitedEmail: string;
    role: string;
    status: InvitationStatus;
    expiresAt?: Date;
    createdAt: Date;
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
    invitationId: string;
    action: 'accept' | 'reject';
}
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
export declare enum AccessType {
    VIEW = "view",// Read-only access
    EDIT = "edit",// Read and write access
    FULL = "full"
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
    userId: string;
    accessType: AccessType;
    canViewAssets: boolean;
    canEditAssets: boolean;
    canDeleteAssets: boolean;
    accessUntil?: Date;
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
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    accessType: AccessType;
    permissions: {
        canViewAssets: boolean;
        canEditAssets: boolean;
        canDeleteAssets: boolean;
    };
    accessUntil?: Date;
    isActive: boolean;
    grantedAt: Date;
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
    accessId: string;
}
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
    name: string;
    description?: string;
    permissions: Record<string, boolean>;
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
    id: string;
    name: string;
    description?: string;
    permissions: Record<string, boolean>;
    isDefault: boolean;
}
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
    canShareAssets?: boolean;
    canViewOthers?: boolean;
    requireApproval?: boolean;
    currency?: string;
    financialYearStart?: string;
    notifyLargeTransactions?: boolean;
    largeTransactionThreshold?: number;
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
    id: string;
    canShareAssets: boolean;
    canViewOthers: boolean;
    requireApproval: boolean;
    currency: string;
    financialYearStart: string;
    notifyLargeTransactions: boolean;
    largeTransactionThreshold: number;
}
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
    id: string;
    userId: string;
    userName: string;
    action: string;
    entityType: string;
    entityId?: string;
    changes?: Record<string, any>;
    createdAt: Date;
}
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
    success: boolean;
    message: string;
    data?: T;
    error?: string;
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
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
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
    user?: {
        userId: string;
        email: string;
        role: string;
        familyId?: string;
        familyRole?: string;
    };
}
//# sourceMappingURL=interfaces.d.ts.map