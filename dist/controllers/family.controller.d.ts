import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
/**
 * FamilyController - Handles all family-related operations in the application
 *
 * This controller manages family group functionality including creation, member management,
 * invitations, permissions, settings, and access control. It provides comprehensive APIs
 * for family financial management systems, ensuring secure and controlled access to
 * family resources and data.
 *
 * Key Features:
 * - Family creation and management (CRUD operations)
 * - Member invitation and management system
 * - Role-based access control (owner, admin, member, viewer)
 * - Permission management for viewing, editing, deleting, and inviting
 * - Family settings and preferences configuration
 * - Access granting and revocation for external users
 * - Invitation lifecycle management (send, accept, reject)
 *
 * Security Considerations:
 * - All methods require JWT authentication
 * - Permission checks based on user roles and individual permissions
 * - Family ownership restrictions (one family per user)
 * - Transaction-based operations for data consistency
 * - Input validation and error handling
 *
 * Database Relations:
 * - Interacts with Family, FamilyMember, FamilyInvitation, FamilySettings, FamilyRole, FamilyAccess tables
 * - Uses Prisma ORM for type-safe database operations
 * - Implements cascading deletes and referential integrity
 *
 * @class FamilyController
 * @static
 */
export declare class FamilyController {
    /**
   * Create a new family group with the authenticated user as owner
   *
   * ⚠️ CONSTRAINT: Each user can only create ONE family
   *
   * This method creates a new family entity along with:
   * - Family member entry for the owner with full permissions
   * - Default family settings
   * - Default role definitions (owner, admin, member, viewer)
   *
   * @param req - Express request object with authenticated user
   * @param req.body.name - Required family name (non-empty string)
   * @param req.body.description - Optional family description
   * @param res - Express response object
   *
   * @returns Promise<Response> - JSON response with created family data or error
   *
   * @throws {400} - If family name is missing, empty, or user already owns a family
   * @throws {500} - If database transaction fails
   *
   * @example
   * POST /api/families
   * Authorization: Bearer <jwt_token>
   * {
   *   "name": "Smith Family",
   *   "description": "Family financial management group"
   * }
   *
   * Success Response (201):
   * {
   *   "success": true,
   *   "message": "Family created successfully",
   *   "data": { ...familyWithDetails }
   * }
   *
   * Error Response (400) - Already owns family:
   * {
   *   "success": false,
   *   "message": "You already own a family. Each user can only create one family."
   * }
   */
    static createFamily(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Retrieve detailed information about a specific family including members, settings, and roles
     *
     * This method fetches comprehensive family data including:
     * - Basic family information (name, description, owner)
     * - Active members with their user details and permissions
     * - Family settings and preferences
     * - Role definitions and permissions
     * - Pending invitations
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID to retrieve details for
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with family details or error
     *
     * @throws {403} - If user is not a member of the family or membership is inactive
     * @throws {404} - If family does not exist
     * @throws {500} - If database query fails
     *
     * @example
     * GET /api/families
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Family details retrieved",
     *   "data": {
     *     "id": "family-uuid",
     *     "name": "Smith Family",
     *     "members": [...],
     *     "settings": {...},
     *     "roles": [...],
     *     "invitations": [...]
     *   }
     * }
     */
    static getFamilyDetails(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Retrieve all families where the authenticated user is an active member
     *
     * This method fetches a comprehensive list of all family groups the user belongs to,
     * including family details, member information, settings, and the user's specific
     * role and permissions within each family. The response includes enriched data
     * such as member counts, owner information, and user-specific permissions.
     *
     * @param req - Express request object with authenticated user
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with array of user's families or error
     *
     * @throws {500} - If database query fails
     *
     * @example
     * GET /api/families
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Families retrieved",
     *   "data": [
     *     {
     *       "id": "family-uuid",
     *       "name": "Smith Family",
     *       "description": "Family financial management",
     *       "owner": {...},
     *       "members": [...],
     *       "settings": {...},
     *       "userRole": "admin",
     *       "userPermissions": {
     *         "can_view": true,
     *         "can_edit": true,
     *         "can_delete": false,
     *         "can_invite": true
     *       }
     *     }
     *   ]
     * }
     */
    static getUserFamilies(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Update family details such as name and description
     *
     * This method allows authorized family members to modify basic family information.
     * Only members with edit permissions (can_edit = true) can update family details.
     * The method supports partial updates - only provided fields will be updated.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID to update
     * @param req.body.name - Optional new family name (non-empty string)
     * @param req.body.description - Optional new family description
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with updated family data or error
     *
     * @throws {403} - If user lacks edit permissions or is not a family member
     * @throws {404} - If family does not exist
     * @throws {500} - If database update fails
     *
     * @example
     * PUT /api/families
     * Authorization: Bearer <jwt_token>
     * {
     *   "name": "Updated Smith Family",
     *   "description": "Updated family financial management group"
     * }
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Family updated successfully",
     *   "data": {
     *     "id": "family-uuid",
     *     "name": "Updated Smith Family",
     *     "description": "Updated family financial management group",
     *     "updated_at": "2024-01-15T10:30:00Z"
     *   }
     * }
     */
    static updateFamily(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Delete a family group permanently
     *
     * This method allows the family owner to completely remove a family group from the system.
     * All associated data including members, settings, roles, and invitations will be deleted.
     * Only the family owner can perform this action.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID to delete
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response confirming deletion or error
     *
     * @throws {403} - If user is not the family owner
     * @throws {404} - If family does not exist
     * @throws {500} - If database deletion fails
     *
     * @example
     * DELETE /api/families
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Family deleted successfully"
     * }
     */
    static deleteFamily(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Retrieve all active members of a specific family
     *
     * This method fetches a list of all active family members including their user details,
     * roles, and permissions. Members are ordered by their join date (oldest first).
     * Only active family members can access this information.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID to retrieve members for
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with array of family members or error
     *
     * @throws {403} - If user is not an active member of the family
     * @throws {500} - If database query fails
     *
     * @example
     * GET /api/families/members
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Family members retrieved",
     *   "data": [
     *     {
     *       "id": "member-uuid",
     *       "role": "admin",
     *       "user": {
     *         "id": "user-uuid",
     *         "name": "John Doe",
     *         "email": "john@example.com",
     *         "phone": "+1234567890",
     *         "profile_picture": "url"
     *       }
     *     }
     *   ]
     * }
     */
    static getFamilyMembers(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Invite a user to join a family group
     *
     * This method allows authorized family members to send invitations to new users via email.
     * The invitation includes the user's role and expires after 7 days. If the invited email
     * corresponds to an existing user, their ID is stored; otherwise, it's set to null for
     * future registration.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID to invite the user to
     * @param req.body.email - Required email address of the user to invite
     * @param req.body.role - Optional role for the invited user (defaults to 'member')
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with invitation data or error
     *
     * @throws {403} - If user lacks invite permissions or is not a family member
     * @throws {404} - If family does not exist
     * @throws {400} - If user already exists in family or invitation already sent
     * @throws {500} - If database transaction fails
     *
     * @example
     * POST /api/families/invite
     * Authorization: Bearer <jwt_token>
     * {
     *   "email": "newuser@example.com",
     *   "role": "member"
     * }
     *
     * Success Response (201):
     * {
     *   "success": true,
     *   "message": "Invitation sent successfully",
     *   "data": { ...invitationWithDetails }
     * }
     */
    static inviteMember(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Accept a pending family invitation
     *
     * This method allows an authenticated user to accept a family invitation sent to their email.
     * Upon acceptance, the user becomes an active family member with the specified role and permissions.
     * The invitation status is updated to 'accepted' and a family member record is created.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.invitationId - Required invitation UUID to accept
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with acceptance confirmation or error
     *
     * @throws {403} - If invitation is not addressed to the authenticated user's email
     * @throws {404} - If invitation does not exist
     * @throws {400} - If invitation is not pending or has expired
     * @throws {500} - If database transaction fails
     *
     * @example
     * POST /api/families/invitations/accept
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Invitation accepted successfully",
     *   "data": {
     *     "familyId": "family-uuid",
     *     "familyName": "Smith Family",
     *     "role": "member"
     *   }
     * }
     */
    static acceptInvitation(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Reject a pending family invitation
     *
     * This method allows an authenticated user to reject a family invitation sent to their email.
     * The invitation status is updated to 'rejected' and no further action is taken.
     * Rejected invitations cannot be accepted later.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.invitationId - Required invitation UUID to reject
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with rejection confirmation or error
     *
     * @throws {403} - If invitation is not addressed to the authenticated user's email
     * @throws {404} - If invitation does not exist
     * @throws {400} - If invitation is not pending
     * @throws {500} - If database update fails
     *
     * @example
     * POST /api/families/invitations/reject
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Invitation rejected"
     * }
     */
    static rejectInvitation(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Retrieve all pending family invitations for the authenticated user
     *
     * This method fetches a list of all pending family invitations sent to the authenticated user's email.
     * Only invitations that are still pending and have not expired are included.
     * Results are ordered by creation date (newest first).
     *
     * @param req - Express request object with authenticated user
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with array of pending invitations or error
     *
     * @throws {500} - If database query fails
     *
     * @example
     * GET /api/families/invitations/pending
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Pending invitations retrieved",
     *   "data": [
     *     {
     *       "id": "invitation-uuid",
     *       "family": {
     *         "id": "family-uuid",
     *         "name": "Smith Family",
     *         "description": "Family group"
     *       },
     *       "invited_by": {
     *         "id": "user-uuid",
     *         "name": "Jane Doe",
     *         "email": "jane@example.com"
     *       },
     *       "role": "member",
     *       "created_at": "2024-01-15T10:30:00Z"
     *     }
     *   ]
     * }
     */
    static getPendingInvitations(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Remove a member from a family group
     *
     * This method allows authorized family members (owner or admin with delete permissions)
     * to remove another member from the family. The member's status is set to inactive,
     * effectively removing their access while preserving historical data.
     * Family owners cannot be removed through this method.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID to remove member from
     * @param req.body.memberId - Required UUID of the member to remove
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response confirming removal or error
     *
     * @throws {403} - If user lacks permission to remove members
     * @throws {400} - If trying to remove self or family owner
     * @throws {404} - If member not found in family
     * @throws {500} - If database update fails
     *
     * @example
     * DELETE /api/families/members
     * Authorization: Bearer <jwt_token>
     * {
     *   "memberId": "member-uuid"
     * }
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Member removed successfully"
     * }
     */
    static removeMember(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Update a family member's role and permissions
     *
     * This method allows family owners and admins to modify another member's role and specific permissions.
     * Changes can include updating the role (member, admin) and individual permission flags.
     * Family owners cannot have their permissions modified through this method.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID containing the member
     * @param req.body.memberId - Required UUID of the member to update
     * @param req.body.role - Optional new role for the member
     * @param req.body.can_view - Optional boolean for view permission
     * @param req.body.can_edit - Optional boolean for edit permission
     * @param req.body.can_delete - Optional boolean for delete permission
     * @param req.body.can_invite - Optional boolean for invite permission
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with updated member data or error
     *
     * @throws {403} - If user is not owner or admin
     * @throws {400} - If trying to update family owner
     * @throws {404} - If member not found in family
     * @throws {500} - If database update fails
     *
     * @example
     * PUT /api/families/members/role
     * Authorization: Bearer <jwt_token>
     * {
     *   "memberId": "member-uuid",
     *   "role": "admin",
     *   "can_edit": true,
     *   "can_invite": true
     * }
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Member role updated successfully",
     *   "data": {
     *     "id": "member-uuid",
     *     "role": "admin",
     *     "can_view": true,
     *     "can_edit": true,
     *     "can_invite": true,
     *     "user": {
     *       "id": "user-uuid",
     *       "name": "John Doe",
     *       "email": "john@example.com"
     *     }
     *   }
     * }
     */
    static updateMemberRole(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Allow a non-owner member to leave a family group
     *
     * This method allows authenticated users who are not family owners to voluntarily leave a family.
     * Their membership status is set to inactive, removing their access while preserving historical data.
     * Family owners must transfer ownership or delete the family instead of leaving.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID to leave
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response confirming departure or error
     *
     * @throws {400} - If user is the family owner
     * @throws {404} - If user is not a member of the family
     * @throws {500} - If database update fails
     *
     * @example
     * POST /api/families/leave
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Successfully left family"
     * }
     */
    static leaveFamily(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Grant access permissions to another user for family-related operations
     *
     * This method allows authenticated users to grant specific access permissions to other users
     * for viewing, editing, or deleting family assets. If access already exists, it will be updated;
     * otherwise, a new access record is created. Access can be time-limited.
     *
     * @param req - Express request object with authenticated user
     * @param req.body.targetUserId - Required UUID of the user to grant access to
     * @param req.body.accessType - Required type of access being granted
     * @param req.body.canViewAssets - Required boolean for asset viewing permission
     * @param req.body.canEditAssets - Required boolean for asset editing permission
     * @param req.body.canDeleteAssets - Required boolean for asset deletion permission
     * @param req.body.accessUntil - Optional expiration date for the access
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with access grant data or error
     *
     * @throws {500} - If database operation fails
     *
     * @example
     * POST /api/families/access/grant
     * Authorization: Bearer <jwt_token>
     * {
     *   "targetUserId": "user-uuid",
     *   "accessType": "full",
     *   "canViewAssets": true,
     *   "canEditAssets": true,
     *   "canDeleteAssets": false,
     *   "accessUntil": "2024-12-31T23:59:59Z"
     * }
     *
     * Success Response (201):
     * {
     *   "success": true,
     *   "message": "Access granted successfully",
     *   "data": {
     *     "id": "access-uuid",
     *     "access_type": "full",
     *     "can_view_assets": true,
     *     "can_edit_assets": true,
     *     "can_delete_assets": false,
     *     "access_until": "2024-12-31T23:59:59Z"
     *   }
     * }
     */
    static grantAccess(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Retrieve list of access grants made by the authenticated user
     *
     * This method fetches all active access permissions that the authenticated user has granted
     * to other users, including details about the granted users and their permissions.
     *
     * @param req - Express request object with authenticated user
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with array of access grants or error
     *
     * @throws {500} - If database query fails
     *
     * @example
     * GET /api/families/access
     * Authorization: Bearer <jwt_token>
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Access list retrieved",
     *   "data": [
     *     {
     *       "id": "access-uuid",
     *       "access_type": "view",
     *       "can_view_assets": true,
     *       "can_edit_assets": false,
     *       "can_delete_assets": false,
     *       "child_user": {
     *         "id": "user-uuid",
     *         "name": "Jane Doe",
     *         "email": "jane@example.com",
     *         "profile_picture": "url"
     *       }
     *     }
     *   ]
     * }
     */
    static getUserAccess(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Revoke previously granted access permissions
     *
     * This method allows authenticated users to revoke access permissions they have previously
     * granted to other users. The access record is marked as inactive.
     *
     * @param req - Express request object with authenticated user
     * @param req.body.accessId - Required UUID of the access grant to revoke
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response confirming revocation or error
     *
     * @throws {403} - If user is not the granter of the access
     * @throws {500} - If database update fails
     *
     * @example
     * POST /api/families/access/revoke
     * Authorization: Bearer <jwt_token>
     * {
     *   "accessId": "access-uuid"
     * }
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Access revoked successfully"
     * }
     */
    static revokeAccess(req: AuthenticatedRequest, res: Response): Promise<Response>;
    /**
     * Update family-wide settings and preferences
     *
     * This method allows authorized family members (owner or those with edit permissions)
     * to modify family settings such as sharing preferences, approval requirements,
     * currency, financial year start, and transaction notifications.
     *
     * @param req - Express request object with authenticated user
     * @param req.params.familyId - Required family UUID to update settings for
     * @param req.body.canShareAssets - Optional boolean for asset sharing permission
     * @param req.body.canViewOthers - Optional boolean for viewing others' data
     * @param req.body.requireApproval - Optional boolean for transaction approval requirement
     * @param req.body.currency - Optional currency code (e.g., 'INR', 'USD')
     * @param req.body.financialYearStart - Optional financial year start date (MM-DD format)
     * @param req.body.notifyLargeTransactions - Optional boolean for large transaction notifications
     * @param req.body.largeTransactionThreshold - Optional threshold amount for notifications
     * @param res - Express response object
     *
     * @returns Promise<Response> - JSON response with updated settings or error
     *
     * @throws {403} - If user lacks permission to update settings
     * @throws {500} - If database operation fails
     *
     * @example
     * PUT /api/families/settings
     * Authorization: Bearer <jwt_token>
     * {
     *   "canShareAssets": true,
     *   "requireApproval": true,
     *   "currency": "USD",
     *   "notifyLargeTransactions": true,
     *   "largeTransactionThreshold": 50000
     * }
     *
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Settings updated successfully",
     *   "data": {
     *     "family_id": "family-uuid",
     *     "can_share_assets": true,
     *     "require_approval": true,
     *     "currency": "USD",
     *     "notify_large_transactions": true,
     *     "large_transaction_threshold": 50000
     *   }
     * }
     */
    static updateSettings(req: AuthenticatedRequest, res: Response): Promise<Response>;
}
//# sourceMappingURL=family.controller.d.ts.map