/**
 * Family Management Routes
 *
 * This module defines all API routes related to family management functionality.
 * It handles family creation, member management, access control, invitations,
 * and family settings. All routes require JWT authentication.
 *
 * Routes are organized into logical sections:
 * - Family CRUD operations
 * - Member management
 * - Invitation handling
 * - Access control (parent-child relationships)
 * - Family settings
 *
 * @module FamilyRoutes
 */
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { FamilyController } from '../controllers/family.controller.js';
import JWTService from '../services/jwt.service.js';
const familyRoutes = Router();
// ============================================================================
// Family CRUD Routes
// ============================================================================
/**
 * Create a new family group
 *
 * Creates a new family entity with the authenticated user as the owner.
 * Each user can only create and own one family. The family includes
 * default settings, roles, and the owner as the first member.
 *
 * @route POST /api/families
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {Object} req.body
 * @param {string} [req.body.name] - Family name (defaults to user ID if not provided)
 * @param {string} [req.body.description] - Optional family description
 * @returns {Object} 201 - Success response with created family data
 * @returns {Object} 400 - Bad request (missing name, already owns family)
 * @returns {Object} 500 - Server error
 *
 * @example
 * POST /api/families
 * Authorization: Bearer <jwt_token>
 * {
 *   "name": "Smith Family",
 *   "description": "Family financial management group"
 * }
 */
familyRoutes.post('/', authenticateJWT, FamilyController.createFamily);
/**
 * Get all families where authenticated user is a member
 *
 * Retrieves a comprehensive list of all family groups the user belongs to,
 * including family details, member information, settings, and the user's
 * specific role and permissions within each family.
 *
 * @route GET /api/families
 * @middleware authenticateJWT - Requires valid JWT token
 * @returns {Object} 200 - Success response with array of user's families
 * @returns {Object} 500 - Server error
 *
 * @example
 * GET /api/families
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.get('/', authenticateJWT, FamilyController.getUserFamilies);
/**
 * Get detailed information about a specific family
 *
 * Retrieves comprehensive family data including members, settings, roles,
 * and pending invitations. Only active family members can access this information.
 *
 * @route GET /api/families
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family to retrieve
 * @returns {Object} 200 - Success response with family details
 * @returns {Object} 403 - Forbidden (not a member or inactive membership)
 * @returns {Object} 404 - Family not found
 * @returns {Object} 500 - Server error
 *
 * @example
 * GET /api/families
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.get('', authenticateJWT, FamilyController.getFamilyDetails);
/**
 * Update family details
 *
 * Allows authorized family members to modify basic family information
 * such as name and description. Only members with edit permissions can update.
 *
 * @route PUT /api/families
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family to update
 * @param {Object} req.body
 * @param {string} [req.body.name] - New family name
 * @param {string} [req.body.description] - New family description
 * @returns {Object} 200 - Success response with updated family data
 * @returns {Object} 403 - Forbidden (insufficient permissions)
 * @returns {Object} 404 - Family not found
 * @returns {Object} 500 - Server error
 *
 * @example
 * PUT /api/families
 * Authorization: Bearer <jwt_token>
 * {
 *   "name": "Updated Smith Family",
 *   "description": "Updated family description"
 * }
 */
familyRoutes.put('', authenticateJWT, FamilyController.updateFamily);
/**
 * Delete a family group permanently
 *
 * Allows the family owner to completely remove a family group from the system.
 * All associated data including members, settings, roles, and invitations
 * will be deleted. Only the family owner can perform this action.
 *
 * @route DELETE /api/families
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family to delete
 * @returns {Object} 200 - Success response confirming deletion
 * @returns {Object} 403 - Forbidden (not the owner)
 * @returns {Object} 404 - Family not found
 * @returns {Object} 500 - Server error
 *
 * @example
 * DELETE /api/families
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.delete('', authenticateJWT, FamilyController.deleteFamily);
// ============================================================================
// Family Members Routes
// ============================================================================
/**
 * Get all active members of a specific family
 *
 * Retrieves a list of all active family members including their user details,
 * roles, and permissions. Members are ordered by their join date.
 * Only active family members can access this information.
 *
 * @route GET /api/families/members
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family to retrieve members for
 * @returns {Object} 200 - Success response with array of family members
 * @returns {Object} 403 - Forbidden (not a family member)
 * @returns {Object} 500 - Server error
 *
 * @example
 * GET /api/families/members
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.get('/members', authenticateJWT, FamilyController.getFamilyMembers);
/**
 * Invite a user to join a family group
 *
 * Allows authorized family members to send invitations to new users via email.
 * The invitation includes the user's role and expires after 7 days. If the invited
 * email corresponds to an existing user, their ID is stored; otherwise, it's set
 * to null for future registration.
 *
 * @route POST /api/families/members/invite
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family to invite the user to
 * @param {Object} req.body
 * @param {string} req.body.email - Email address of the user to invite
 * @param {string} [req.body.role='member'] - Role for the invited user
 * @param {string} [req.body.name] - Optional name for non-registered users
 * @param {string} [req.body.phone] - Optional phone for non-registered users
 * @returns {Object} 201 - Success response with invitation data
 * @returns {Object} 403 - Forbidden (insufficient permissions)
 * @returns {Object} 404 - Family not found
 * @returns {Object} 400 - Bad request (user already in family, invalid role, etc.)
 * @returns {Object} 500 - Server error
 *
 * @example
 * POST /api/families/members/invite
 * Authorization: Bearer <jwt_token>
 * {
 *   "email": "newuser@example.com",
 *   "role": "member",
 *   "name": "John Doe",
 *   "phone": "+1234567890"
 * }
 */
familyRoutes.post('/members/invite', authenticateJWT, FamilyController.inviteMember);
/**
 * Update a family member's role and permissions
 *
 * Allows family owners and admins to modify another member's role and specific
 * permissions. Changes can include updating the role and individual permission flags.
 * Family owners cannot have their permissions modified through this method.
 *
 * @route PUT /api/families/members/role
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family containing the member
 * @param {Object} req.body
 * @param {string} req.body.memberId - UUID of the member to update
 * @param {string} [req.body.role] - New role for the member
 * @param {boolean} [req.body.can_view] - View permission flag
 * @param {boolean} [req.body.can_edit] - Edit permission flag
 * @param {boolean} [req.body.can_delete] - Delete permission flag
 * @param {boolean} [req.body.can_invite] - Invite permission flag
 * @returns {Object} 200 - Success response with updated member data
 * @returns {Object} 403 - Forbidden (not owner/admin or trying to update owner)
 * @returns {Object} 404 - Member not found
 * @returns {Object} 500 - Server error
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
 */
familyRoutes.put('/members/role', authenticateJWT, FamilyController.updateMemberRole);
/**
 * Remove a member from a family group
 *
 * Allows authorized family members to remove another member from the family.
 * The member's status is set to inactive, removing their access while preserving
 * historical data. Family owners cannot be removed through this method.
 *
 * @route DELETE /api/families/members/:memberId
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family to remove member from
 * @param {Object} req.body
 * @param {string} req.body.memberId - UUID of the member to remove
 * @returns {Object} 200 - Success response confirming removal
 * @returns {Object} 403 - Forbidden (insufficient permissions)
 * @returns {Object} 400 - Bad request (removing self or owner)
 * @returns {Object} 404 - Member not found
 * @returns {Object} 500 - Server error
 *
 * @example
 * DELETE /api/families/members/:memberId
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.delete('/members/:memberId', authenticateJWT, FamilyController.removeMember);
/**
 * Allow a non-owner member to leave a family group
 *
 * Allows authenticated users who are not family owners to voluntarily leave a family.
 * Their membership status is set to inactive, removing their access while preserving
 * historical data. Family owners must transfer ownership or delete the family instead.
 *
 * @route POST /api/families/leave
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family to leave
 * @returns {Object} 200 - Success response confirming departure
 * @returns {Object} 400 - Bad request (owner trying to leave)
 * @returns {Object} 404 - Not a member of the family
 * @returns {Object} 500 - Server error
 *
 * @example
 * POST /api/families/leave
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.post('/leave', authenticateJWT, FamilyController.leaveFamily);
// ============================================================================
// Family Invitations Routes
// ============================================================================
/**
 * Get all pending family invitations for the authenticated user
 *
 * Retrieves a list of all pending family invitations sent to the authenticated
 * user's email. Only invitations that are still pending and have not expired
 * are included. Results are ordered by creation date (newest first).
 *
 * @route GET /api/families/invitations/pending
 * @middleware authenticateJWT - Requires valid JWT token
 * @returns {Object} 200 - Success response with array of pending invitations
 * @returns {Object} 500 - Server error
 *
 * @example
 * GET /api/families/invitations/pending
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.get('/invitations/pending', authenticateJWT, FamilyController.getPendingInvitations);
/**
 * Accept a pending family invitation
 *
 * Allows an authenticated user to accept a family invitation sent to their email.
 * Upon acceptance, the user becomes an active family member with the specified role
 * and permissions. The invitation status is updated to 'accepted'.
 *
 * @route POST /api/families/invitations/:invitationId/accept
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.invitationId - UUID of the invitation to accept
 * @returns {Object} 200 - Success response with acceptance confirmation
 * @returns {Object} 403 - Forbidden (invitation not for this user)
 * @returns {Object} 404 - Invitation not found
 * @returns {Object} 400 - Bad request (invitation not pending or expired)
 * @returns {Object} 500 - Server error
 *
 * @example
 * POST /api/families/invitations/accept
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.post('/invitations/:invitationId/accept', authenticateJWT, FamilyController.acceptInvitation);
/**
 * @route GET /family/invitations/:invitationId/accept/:userId/:oneTimeToken
 * @description
 * Accept a family invitation sent via email.
 * This endpoint verifies the one-time token (OTT) associated with the invitation.
 * If the token is valid and unused, the user is added to the family group.
 *
 * **Flow:**
 * 1. Validate required parameters: `invitationId`, `userId`, `oneTimeToken`.
 * 2. Verify one-time token using JWTService.
 * 3. Reject if token is expired or marked as used (`payload.isUsed === true`).
 * 4. Attach the authenticated user to `req.user`.
 * 5. Call `FamilyController.acceptInvitation()` to complete the acceptance process.
 * 6. Respond back with success message and status.
 *
 * @param {string} req.params.invitationId - The unique ID of the family invitation.
 * @param {string} req.params.userId - ID of the user who is accepting the invitation.
 * @param {string} req.params.oneTimeToken - One-time JWT token sent in invitation email.
 *
 * @returns {201 Created} Invitation accepted successfully.
 * @returns {400 Bad Request} Missing required parameters.
 * @returns {401 Unauthorized} Token expired or already used.
 * @returns {500 Internal Server Error} Server-side error.
 *
 * @example
 * // Client-side usage:
 * // Suppose user receives an email link like:
 * // https://your-domain.com/family/invitations/INV12345/accept/USER789/TOKEN_ABC
 *
 * fetch("https://your-domain.com/family/invitations/INV12345/accept/USER789/TOKEN_ABC")
 *   .then(res => res.json())
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 *
 * // Successful Response:
 * {
 *   "message": "Invitation accepted successfully",
 *   "status": true
 * }
 *
 * // If token expired:
 * {
 *   "message": "One time invitation is expired!",
 *   "error": "One time invitation is expired!"
 * }
 */
familyRoutes.get('/invitations/:invitationId/accept/:userId/:oneTimeToken', async (req, res) => {
    try {
        const { invitationId, userId, oneTimeToken } = req.params;
        if (!invitationId || !userId || !oneTimeToken) {
            return res.status(400).json({
                success: false,
                message: 'Invitation ID, One Time Token  and User ID are required',
            });
        }
        const payload = await JWTService.verifyAccessToken(oneTimeToken);
        if (payload.isUsed) {
            return res.status(401).json({ message: 'One time invitation is expired!', error: 'One time invitation is expired!' });
        }
        req.user = { userId };
        const response = await FamilyController.acceptInvitation(req, res);
        return res.status(201).json({ message: response.message, status: response.status });
    }
    catch (error) {
        console.log('Error in invitation with mail :: ', error.message);
        return res.status(500).json({
            message: (process.env.NODE_ENV) ? error.message : 'Something went wrong!'
        });
    }
});
/**
 * Reject a pending family invitation
 *
 * Allows an authenticated user to reject a family invitation sent to their email.
 * The invitation status is updated to 'rejected' and no further action is taken.
 * Rejected invitations cannot be accepted later.
 *
 * @route POST /api/families/invitations/:invitationId/reject
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.invitationId - UUID of the invitation to reject
 * @returns {Object} 200 - Success response confirming rejection
 * @returns {Object} 403 - Forbidden (invitation not for this user)
 * @returns {Object} 404 - Invitation not found
 * @returns {Object} 400 - Bad request (invitation not pending)
 * @returns {Object} 500 - Server error
 *
 * @example
 * POST /api/families/invitations/reject
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.post('/invitations/:invitationId/reject', authenticateJWT, FamilyController.rejectInvitation);
// ============================================================================
// Family Access Routes (Parent-Child access control)
// ============================================================================
/**
 * Grant access permissions to another user for family-related operations
 *
 * Allows authenticated users to grant specific access permissions to other users
 * for viewing, editing, or deleting family assets. If access already exists, it will
 * be updated; otherwise, a new access record is created. Access can be time-limited.
 *
 * @route POST /api/families/access/grant
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {Object} req.body
 * @param {string} req.body.targetUserId - UUID of the user to grant access to
 * @param {string} req.body.accessType - Type of access being granted
 * @param {boolean} req.body.canViewAssets - Permission to view assets
 * @param {boolean} req.body.canEditAssets - Permission to edit assets
 * @param {boolean} req.body.canDeleteAssets - Permission to delete assets
 * @param {string} [req.body.accessUntil] - Optional expiration date (ISO string)
 * @returns {Object} 201 - Success response with access grant data
 * @returns {Object} 500 - Server error
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
 */
familyRoutes.post('/access/grant', authenticateJWT, FamilyController.grantAccess);
/**
 * Retrieve list of access grants made by the authenticated user
 *
 * Fetches all active access permissions that the authenticated user has granted
 * to other users, including details about the granted users and their permissions.
 *
 * @route GET /api/families/access/list
 * @middleware authenticateJWT - Requires valid JWT token
 * @returns {Object} 200 - Success response with array of access grants
 * @returns {Object} 500 - Server error
 *
 * @example
 * GET /api/families/access/list
 * Authorization: Bearer <jwt_token>
 */
familyRoutes.get('/access/list', authenticateJWT, FamilyController.getUserAccess);
/**
 * Revoke previously granted access permissions
 *
 * Allows authenticated users to revoke access permissions they have previously
 * granted to other users. The access record is marked as inactive.
 *
 * @route POST /api/families/access/revoke
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {Object} req.body
 * @param {string} req.body.accessId - UUID of the access grant to revoke
 * @returns {Object} 200 - Success response confirming revocation
 * @returns {Object} 403 - Forbidden (not the granter of the access)
 * @returns {Object} 500 - Server error
 *
 * @example
 * POST /api/families/access/revoke
 * Authorization: Bearer <jwt_token>
 * {
 *   "accessId": "access-uuid"
 * }
 */
familyRoutes.post('/access/revoke', authenticateJWT, FamilyController.revokeAccess);
// ============================================================================
// Family Settings Routes
// ============================================================================
/**
 * Update family-wide settings and preferences
 *
 * Allows authorized family members (owner or those with edit permissions)
 * to modify family settings such as sharing preferences, approval requirements,
 * currency, financial year start, and transaction notifications.
 *
 * @route PUT /api/families/settings
 * @middleware authenticateJWT - Requires valid JWT token
 * @param {string} req.params.familyId - UUID of the family to update settings for
 * @param {Object} req.body
 * @param {boolean} [req.body.canShareAssets] - Asset sharing permission
 * @param {boolean} [req.body.canViewOthers] - View others' data permission
 * @param {boolean} [req.body.requireApproval] - Transaction approval requirement
 * @param {string} [req.body.currency] - Currency code (e.g., 'INR', 'USD')
 * @param {string} [req.body.financialYearStart] - Financial year start (MM-DD)
 * @param {boolean} [req.body.notifyLargeTransactions] - Large transaction notifications
 * @param {number} [req.body.largeTransactionThreshold] - Notification threshold amount
 * @returns {Object} 200 - Success response with updated settings
 * @returns {Object} 403 - Forbidden (insufficient permissions)
 * @returns {Object} 500 - Server error
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
 */
familyRoutes.put('/settings', authenticateJWT, FamilyController.updateSettings);
export default familyRoutes;
//# sourceMappingURL=family.routes.js.map