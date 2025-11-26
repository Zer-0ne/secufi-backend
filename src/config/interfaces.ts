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
// Asset Document Metadata Types (AI Service Responses)
// ============================================================================

/**
 * Data Quality Assessment from AI
 * 
 * @interface DataQualityAssessment
 * @description Measures the quality of extracted data from documents.
 * Used by AI to rate the clarity and completeness of extraction.
 * 
 * @property {number} textClarity - Text clarity score (0-100)
 * @property {number} completeness - Data completeness score (0-100)
 * @property {number} structureQuality - Document structure quality (0-100)
 * @property {number} overallConfidence - Overall confidence score (0-100)
 */
export interface DataQualityAssessment {
  textClarity: number;
  completeness: number;
  structureQuality: number;
  overallConfidence: number;
}

/**
 * Parties and Entities in Financial Document
 * 
 * @interface DocumentParties
 * @description Information about parties involved in financial document.
 * 
 * @property {string} [pan] - PAN number
 * @property {string} [bankName] - Bank name
 * @property {string} [customerName] - Customer name
 * @property {string} [mobileNumber] - Mobile number
 * @property {string} [email] - Email address
 * @property {string} [address] - Full address
 */
export interface DocumentParties {
  pan?: string;
  bankName?: string;
  customerName?: string;
  mobileNumber?: string;
  email?: string;
  address?: string;
}

/**
 * Contact Details from Document
 * 
 * @interface ContactDetails
 * @description Contact information extracted from document.
 * 
 * @property {string} [mobileNumber] - Mobile number
 * @property {string} [email] - Email address
 * @property {string} [phone] - Phone number
 * @property {string} [website] - Website URL
 */
export interface ContactDetails {
  mobileNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
}

/**
 * Financial Figures from Document
 * 
 * @interface FinancialFigures
 * @description All monetary values extracted from document.
 * 
 * @property {number} [totalDue] - Total amount due
 * @property {number} [creditLimit] - Credit limit
 * @property {number} [outstandingBalance] - Outstanding balance
 * @property {number} [minimumPayment] - Minimum payment required
 * @property {number} [totalCredits] - Total credit amount
 * @property {number} [totalDebits] - Total debit amount
 * @property {number} [openingBalance] - Opening balance
 * @property {number} [closingBalance] - Closing balance
 * @property {number} [interestCharged] - Interest charged
 * @property {number} [fees] - Fees and charges
 */
export interface FinancialFigures {
  totalDue?: number;
  creditLimit?: number;
  outstandingBalance?: number;
  minimumPayment?: number;
  totalCredits?: number;
  totalDebits?: number;
  openingBalance?: number;
  closingBalance?: number;
  interestCharged?: number;
  fees?: number;
}

/**
 * Identification Numbers from Document
 * 
 * @interface IdentificationNumbers
 * @description All identification numbers extracted from document.
 * 
 * @property {string} [pan] - PAN number
 * @property {string} [gstin] - GST number
 * @property {string} [accountNumber] - Account number
 * @property {string} [policyNumber] - Policy number
 * @property {string} [folioNumber] - Folio number
 * @property {string} [crnNumber] - CRN number
 * @property {string} [transactionId] - Transaction ID
 * @property {string} [invoiceNumber] - Invoice number
 * @property {string} [receiptNumber] - Receipt number
 */
export interface IdentificationNumbers {
  pan?: string;
  gstin?: string;
  accountNumber?: string;
  policyNumber?: string;
  folioNumber?: string;
  crnNumber?: string;
  transactionId?: string;
  invoiceNumber?: string;
  receiptNumber?: string;
}

/**
 * Document Dates
 * 
 * @interface DocumentDates
 * @description All dates extracted from document.
 * 
 * @property {string} [statementDate] - Statement date
 * @property {string} [dueDate] - Due date
 * @property {string} [startDate] - Period start date
 * @property {string} [endDate] - Period end date
 * @property {string} [maturityDate] - Maturity date
 * @property {string} [issueDate] - Issue date
 * @property {string} [paymentDate] - Payment date
 */
export interface DocumentDates {
  statementDate?: string | null;
  dueDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  maturityDate?: string | null;
  issueDate?: string | null;
  paymentDate?: string | null;
}

/**
 * Transaction Details from Statement
 * 
 * @interface TransactionDetail
 * @description Individual transaction information.
 * 
 * @property {string} date - Transaction date
 * @property {string} description - Transaction description
 * @property {number} amount - Transaction amount
 * @property {string} type - Transaction type (debit/credit)
 * @property {string} [reference] - Reference number
 * @property {string} [category] - Transaction category
 */
export interface TransactionDetail {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  reference?: string;
  category?: string;
}

/**
 * Document Classification
 * 
 * @interface DocumentClassification
 * @description Classification of the financial document.
 * 
 * @property {string} type - Document type (e.g., "Credit Card Statement")
 * @property {string} purpose - Document purpose
 * @property {string} category - Document category (e.g., "Banking")
 */
export interface DocumentClassification {
  type: string;
  purpose: string;
  category: string;
}

/**
 * Additional Metadata for Document
 * 
 * @interface AdditionalMetadata
 * @description Extra metadata extracted from document.
 * 
 * @property {string} [currency] - Currency code
 * @property {string} [accountType] - Account type
 * @property {string} [productType] - Product type
 * @property {string} [statementPeriod] - Statement period
 * @property {number} [pageCount] - Number of pages
 * @property {boolean} [hasTables] - Whether document has tables
 */
export interface AdditionalMetadata {
  currency?: string;
  accountType?: string;
  productType?: string;
  statementPeriod?: string;
  pageCount?: number;
  hasTables?: boolean;
}

/**
 * Complete Attachment Analysis Content
 * 
 * @interface AttachmentContent
 * @description Full analysis of attachment/PDF document.
 * This is the structure returned by analyzePDFDocument.
 * 
 * @property {DocumentDates | null} dates - All dates from document
 * @property {DocumentParties} parties - Parties and entities
 * @property {string[]} keyFindings - Key findings from document
 * @property {ContactDetails} [contactDetails] - Contact information
 * @property {FinancialFigures} [financialFigures] - Financial figures
 * @property {AdditionalMetadata} [additionalMetadata] - Extra metadata
 * @property {TransactionDetail[] | null} transactionDetails - Transaction list
 * @property {DataQualityAssessment} dataQualityAssessment - Quality assessment
 * @property {IdentificationNumbers} [identificationNumbers] - ID numbers
 * @property {DocumentClassification} documentClassification - Classification
 */
export interface AttachmentContent {
  dates: DocumentDates | null;
  parties: DocumentParties;
  keyFindings: string[];
  contactDetails?: ContactDetails;
  financialFigures?: FinancialFigures;
  additionalMetadata?: AdditionalMetadata;
  transactionDetails: TransactionDetail[] | null;
  dataQualityAssessment: DataQualityAssessment;
  identificationNumbers?: IdentificationNumbers;
  documentClassification: DocumentClassification;
}

/**
 * Attachment Analysis Result
 * 
 * @interface AttachmentAnalysis
 * @description Analysis result for individual attachment.
 * 
 * @property {AttachmentContent} content - Extracted content
 * @property {number} confidence - Confidence score (0-100)
 * @property {string} transactionType - Type of transaction
 */
export interface AttachmentAnalysis {
  content: AttachmentContent;
  confidence: number;
  transactionType: string;
}

/**
 * AI Analysis Result (Simplified)
 * 
 * @interface AIAnalysis
 * @description Simplified AI analysis for quick reference.
 * 
 * @property {string} date - Transaction date
 * @property {string} status - Current status
 * @property {string | null} balance - Balance amount
 * @property {string} [bankName] - Bank name
 * @property {string} currency - Currency code
 * @property {string} merchant - Merchant/Institution name
 * @property {string} assetType - Asset type
 * @property {number} confidence - Confidence score
 * @property {string} description - Description
 * @property {number | null} total_value - Total value
 * @property {string | null} assetSubType - Asset sub-type
 * @property {string | null} accountNumber - Account number
 * @property {string} assetCategory - Asset category
 * @property {string} transactionType - Transaction type
 * @property {FinancialMetadata} financialMetadata - Financial metadata
 */
export interface AIAnalysis {
  date: string;
  status: string;
  balance: string | null;
  bankName?: string;
  currency: string;
  merchant: string;
  assetType: string;
  confidence: number;
  description: string;
  total_value: number | null;
  assetSubType: string | null;
  accountNumber: string | null;
  assetCategory: string;
  transactionType: string;
  financialMetadata: FinancialMetadata;
}

// ============================================================================
// Asset Document Metadata Types
// ============================================================================

/**
 * Financial Metadata for Assets
 * 
 * @interface FinancialMetadata
 * @description Comprehensive financial metadata that can be stored in Asset.document_metadata field.
 * Contains all financial information extracted by AI from documents.
 * 
 * @property {number} [totalValue] - Total value of the asset/investment
 * @property {number} [currentValue] - Current market value
 * 
 * @property {boolean} isRecurring - Whether this is a recurring transaction/payment
 * @property {'monthly' | 'quarterly' | 'yearly' | 'one-time'} [frequency] - Frequency of recurring payments
 * @property {string} [dueDate] - Due date for payment (ISO date string)
 * 
 * @property {number} [coverageAmount] - Insurance coverage amount
 * @property {number} [premium] - Insurance premium amount
 * @property {string} [premiumFrequency] - How often premium is paid
 * @property {string} [maturityDate] - Insurance maturity date (ISO date string)
 * @property {number} [sumAssured] - Insurance sum assured
 * @property {number} [policyTerm] - Insurance policy term in years
 * @property {string} [beneficiary] - Insurance beneficiary name
 * 
 * @property {number} [outstandingBalance] - Outstanding balance for liabilities
 * @property {number} [minimumPayment] - Minimum payment required
 * @property {number} [creditLimit] - Credit limit (for credit cards)
 * @property {number} [interestRate] - Interest rate percentage
 * @property {number} [emiAmount] - EMI amount
 * @property {string} [emiDueDate] - EMI due date (ISO date string)
 * 
 * @property {number} [purchasePrice] - Original purchase price (for investments)
 * @property {number} [currentNav] - Current NAV (Net Asset Value) for mutual funds
 * @property {number} [units] - Number of units held
 * @property {number} [appreciationRate] - Rate of appreciation
 * @property {number} [returnsPercentage] - Returns in percentage
 */
export interface FinancialMetadata {
  // General Financial Values
  totalValue?: number;
  currentValue?: number;

  // Recurring Payment Info
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  dueDate?: string;

  // Insurance Specific
  coverageAmount?: number;
  premium?: number;
  premiumFrequency?: string;
  maturityDate?: string;
  sumAssured?: number;
  policyTerm?: number;
  beneficiary?: string;

  // Liability Specific (Credit Cards, Loans)
  outstandingBalance?: number;
  minimumPayment?: number;
  creditLimit?: number;
  interestRate?: number;
  emiAmount?: number;
  emiDueDate?: string;

  // Investment Specific (Stocks, Mutual Funds)
  purchasePrice?: number;
  currentNav?: number;
  units?: number;
  appreciationRate?: number;
  returnsPercentage?: number;
}

/**
 * Required User Fields for Asset
 * 
 * @interface RequiredUserFields
 * @description Tracks which user profile fields are required for this asset.
 * Used to identify missing information that needs to be collected from the user.
 * 
 * @property {boolean} [name] - User name required
 * @property {boolean} [phone] - Phone number required
 * @property {boolean} [email] - Email address required
 * @property {boolean} [address] - Address required
 * @property {boolean} [pan_number] - PAN number required
 * @property {boolean} [aadhar_number] - Aadhar number required
 * @property {boolean} [date_of_birth] - Date of birth required
 * @property {boolean} [crn_number] - CRN number required
 * @property {boolean} [account_number] - Account number required
 * @property {boolean} [ifsc_code] - IFSC code required
 * @property {boolean} [policy_number] - Policy number required
 * @property {boolean} [folio_number] - Folio number required
 */
export interface RequiredUserFields {
  name?: boolean;
  phone?: boolean;
  email?: boolean;
  address?: boolean;
  pan_number?: boolean;
  aadhar_number?: boolean;
  date_of_birth?: boolean;
  crn_number?: boolean;
  account_number?: boolean;
  ifsc_code?: boolean;
  policy_number?: boolean;
  folio_number?: boolean;
}

/**
 * Complete Document Metadata stored in Asset.document_metadata field
 * 
 * @interface DocumentMetadata
 * @description Full structure of metadata extracted by AI from financial documents.
 * This is stored as JSON in the Asset.document_metadata field.
 * Covers ALL possible fields from AI service responses.
 * 
 * @property {string} type - Asset type (credit_card, savings_account, etc.)
 * @property {string} status - Status (active, inactive, etc.)
 * @property {string} emailId - Email ID from which this was extracted
 * @property {string | null} subType - Asset sub-type
 * @property {string} category - Category (asset, liability, insurance)
 * @property {string} currency - Currency code
 * @property {string} merchant - Merchant/Bank name
 * @property {string[]} keyPoints - Key information points
 * @property {AIAnalysis} aiAnalysis - AI analysis summary
 * @property {number} confidence - Confidence score (0-100)
 * @property {string} description - Description
 * @property {string} emailSender - Email sender
 * @property {string} extractedAt - Extraction timestamp (ISO)
 * @property {string} emailSubject - Email subject
 * @property {string} transactionDate - Transaction date
 * @property {FinancialMetadata} financialMetadata - Financial metadata
 * @property {AttachmentAnalysis} [attachmentAnalysis] - Attachment analysis
 */
export interface DocumentMetadata {
  // Basic Identification
  type: string; // 'credit_card' | 'savings_account' | etc.
  status: string; // 'active' | 'inactive' | 'pending' | 'complete'
  emailId: string;
  subType: string | null;
  category: string; // 'asset' | 'liability' | 'insurance'
  
  // Financial Details
  currency: string;
  merchant: string;
  keyPoints: string[];
  
  // AI Analysis
  aiAnalysis: AIAnalysis;
  confidence: number;
  description: string;
  
  // Email Context
  emailSender: string;
  extractedAt: string; // ISO timestamp
  emailSubject: string;
  transactionDate: string;
  
  // Financial Metadata
  financialMetadata: FinancialMetadata;
  
  // Attachment Analysis (if attachment was analyzed)
  attachmentAnalysis?: AttachmentAnalysis;
}

/**
 * Extended Asset type with typed document_metadata
 * 
 * @interface AssetWithMetadata
 * @description Asset model with properly typed document_metadata field.
 * Use this when working with assets that have financial metadata.
 * 
 * @property {DocumentMetadata | any} document_metadata - Typed document metadata (can be flexible structure)
 */
export interface AssetWithMetadata {
  id: string;
  user_id: string;
  name: string | null;
  type: string;
  sub_type: string | null;
  
  // Bank/Financial Account Details
  account_number: string | null;
  ifsc_code: string | null;
  branch_name: string | null;
  bank_name: string | null;
  
  // Financial Values
  balance: number | null;
  total_value: number | null;
  
  // Status & Tracking
  status: string | null;
  last_updated: Date;
  
  // Address & Location
  address: string | null;
  crn_number: string | null;
  
  // Nominee/Beneficiary Details
  nominee: any;
  
  // Insurance Specific Fields
  policy_number: string | null;
  fund_name: string | null;
  folio_number: string | null;
  
  // Document/Attachment Fields
  document_type: string | null;
  document_metadata: DocumentMetadata | any; // ✅ Typed metadata (flexible for different structures)
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  file_content: string | null;
  
  // References
  transaction_id: string | null;
  email_id: string | null;
  
  // Issues & Required Fields
  issues: string[];
  required_fields: string[];
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

/**
 * Legacy Document Metadata Format (EnhancedFinancialData)
 * 
 * @interface LegacyDocumentMetadata
 * @description Older format used by analyzeFinancialEmail function.
 * Keeping for backward compatibility.
 * 
 * @property {'invoice' | 'payment' | 'receipt' | 'statement' | 'bill' | 'tax' | 'credit_card' | 'other'} transactionType
 * @property {number | null} amount
 * @property {string} currency
 * @property {string} merchant
 * @property {string} balance
 * @property {string} description
 * @property {string} date
 * @property {string | null} accountNumber
 * @property {number} confidence
 * @property {'asset' | 'liability' | 'insurance' | 'other'} assetCategory
 * @property {string} assetType
 * @property {string | null} assetSubType
 * @property {'active' | 'inactive' | 'pending' | 'complete' | 'missing'} status
 * @property {string} [bankName]
 * @property {string} [ifscCode]
 * @property {string} [branchName]
 * @property {string} [policyNumber]
 * @property {string} [folioNumber]
 * @property {string} [fundName]
 * @property {RequiredUserFields} [requiredUserFields]
 * @property {FinancialMetadata} financialMetadata
 * @property {string[]} keyPoints
 */
export interface LegacyDocumentMetadata {
  // Basic Transaction Data
  transactionType: 'invoice' | 'payment' | 'receipt' | 'statement' | 'bill' | 'tax' | 'credit_card' | 'other';
  amount: number | null;
  currency: string;
  merchant: string;
  balance: string;
  description: string;
  date: string;
  accountNumber: string | null;
  confidence: number;

  // Asset Classification
  assetCategory: 'asset' | 'liability' | 'insurance' | 'other';
  assetType: string;
  assetSubType: string | null;

  // Status
  status: 'active' | 'inactive' | 'pending' | 'complete' | 'missing';

  // Bank details
  bankName?: string;
  ifscCode?: string;
  branchName?: string;

  // Insurance/Investment
  policyNumber?: string;
  folioNumber?: string;
  fundName?: string;

  // Required fields
  requiredUserFields?: RequiredUserFields;

  // Financial metadata
  financialMetadata: FinancialMetadata;

  // Key points
  keyPoints: string[];
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
