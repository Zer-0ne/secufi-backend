import { User, Family, FamilyInvitation, FamilySettings, FamilyRole, FamilyAccess, ActivityLog } from '@prisma/client';

// ============================================================================
// User Types
// ============================================================================

export interface UserWithFamily extends User {
  family?: Family | null;
  owned_families: Family[];
  family_access_as_parent: FamilyAccess[];
  family_access_as_family: FamilyAccess[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  role: string;
  familyRole?: string;
}

// ============================================================================
// Family Types
// ============================================================================

export interface FamilyWithMembers extends Family {
  members: User[];
  owner: User;
  settings?: FamilySettings;
  roles: FamilyRole[];
  invitations: FamilyInvitation[];
}

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

export interface FamilyStats {
  totalMembers: number;
  totalAssets: number;
  totalTransactions: number;
  pendingInvitations: number;
  totalIncome?: number;
  totalExpenses?: number;
}

export interface CreateFamilyRequest {
  name: string;
  description?: string;
}

export interface UpdateFamilyRequest {
  name?: string;
  description?: string;
}

// ============================================================================
// Family Member Types
// ============================================================================

export interface InviteMemberRequest {
  email: string;
  role: 'member' | 'admin' | 'viewer';
}

export interface MemberResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: Date;
  status: 'active' | 'pending' | 'removed';
}

export interface RemoveMemberRequest {
  memberId: string;
}

// ============================================================================
// Family Invitation Types
// ============================================================================

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

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

export interface InvitationActionRequest {
  invitationId: string;
  action: 'accept' | 'reject';
}

// ============================================================================
// Family Access Types
// ============================================================================

export enum AccessType {
  VIEW = 'view',
  EDIT = 'edit',
  FULL = 'full',
}

export interface GrantAccessRequest {
  userId: string;
  accessType: AccessType;
  canViewAssets: boolean;
  canEditAssets: boolean;
  canDeleteAssets: boolean;
  accessUntil?: Date;
}

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

export interface RevokeAccessRequest {
  accessId: string;
}

// ============================================================================
// Family Role Types
// ============================================================================

export interface FamilyRoleRequest {
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
}

export interface FamilyRoleResponse {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  isDefault: boolean;
}

// ============================================================================
// Family Settings Types
// ============================================================================

export interface FamilySettingsRequest {
  canShareAssets?: boolean;
  canViewOthers?: boolean;
  requireApproval?: boolean;
  currency?: string;
  financialYearStart?: string;
  notifyLargeTransactions?: boolean;
  largeTransactionThreshold?: number;
}

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

// ============================================================================
// Activity Log Types
// ============================================================================

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

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

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

// ============================================================================
// Authenticated Request with Family Context
// ============================================================================

export interface AuthenticatedRequestWithFamily extends Express.Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    familyId?: string;
    familyRole?: string;
  };
}
