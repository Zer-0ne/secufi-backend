/**
 * Family Management Routes
 * Handles family creation, member management, access control, and settings
 */

import { Router } from 'express';
import { authenticateJWT } from '@/middlewares/auth.middleware';
import { FamilyController } from '@/controllers/family.controller';

const familyRoutes = Router();

// ============================================================================
// Family CRUD Routes
// ============================================================================

/**
 * POST /families
 * Create a new family
 */
familyRoutes.post('/', authenticateJWT, FamilyController.createFamily);

/**
 * GET /families
 * Get all families where user is a member
 */
familyRoutes.get('/', authenticateJWT, FamilyController.getUserFamilies);

/**
 * GET /families/:familyId
 * Get specific family details
 */
familyRoutes.get('/:familyId', authenticateJWT, FamilyController.getFamilyDetails);

/**
 * PUT /families/:familyId
 * Update family details
 */
familyRoutes.put('/:familyId', authenticateJWT, FamilyController.updateFamily);

/**
 * DELETE /families/:familyId
 * Delete family (owner only)
 */
familyRoutes.delete('/:familyId', authenticateJWT, FamilyController.deleteFamily);

// ============================================================================
// Family Members Routes
// ============================================================================

/**
 * GET /families/:familyId/members
 * Get all family members
 */
familyRoutes.get('/:familyId/members', authenticateJWT, FamilyController.getFamilyMembers);

/**
 * POST /families/:familyId/members/invite
 * Invite member to family
 * @body { email, role }
 */
familyRoutes.post('/:familyId/members/invite', authenticateJWT, FamilyController.inviteMember);

/**
 * PUT /families/:familyId/members/role
 * Update member role and permissions
 * @body { memberId, role, can_view, can_edit, can_delete, can_invite }
 */
familyRoutes.put('/:familyId/members/role', authenticateJWT, FamilyController.updateMemberRole);

/**
 * DELETE /families/:familyId/members
 * Remove member from family
 * @body { memberId }
 */
familyRoutes.delete('/:familyId/members', authenticateJWT, FamilyController.removeMember);

/**
 * POST /families/:familyId/leave
 * Leave family (for non-owner members)
 */
familyRoutes.post('/:familyId/leave', authenticateJWT, FamilyController.leaveFamily);

// ============================================================================
// Family Invitations Routes
// ============================================================================

/**
 * GET /families/invitations/pending
 * Get pending family invitations for authenticated user
 */
familyRoutes.get('/invitations/pending', authenticateJWT, FamilyController.getPendingInvitations);

/**
 * POST /families/invitations/:invitationId/accept
 * Accept family invitation
 */
familyRoutes.post(
  '/invitations/:invitationId/accept',
  authenticateJWT,
  FamilyController.acceptInvitation
);

/**
 * POST /families/invitations/:invitationId/reject
 * Reject family invitation
 */
familyRoutes.post(
  '/invitations/:invitationId/reject',
  authenticateJWT,
  FamilyController.rejectInvitation
);

// ============================================================================
// Family Access Routes (Parent-Child access control)
// ============================================================================

/**
 * POST /families/access/grant
 * Grant access to another user
 * @body { targetUserId, accessType, canViewAssets, canEditAssets, canDeleteAssets, accessUntil }
 */
familyRoutes.post('/access/grant', authenticateJWT, FamilyController.grantAccess);

/**
 * GET /families/access/list
 * Get user's access grants
 */
familyRoutes.get('/access/list', authenticateJWT, FamilyController.getUserAccess);

/**
 * POST /families/access/revoke
 * Revoke access from user
 * @body { accessId }
 */
familyRoutes.post('/access/revoke', authenticateJWT, FamilyController.revokeAccess);

// ============================================================================
// Family Settings Routes
// ============================================================================

/**
 * PUT /families/:familyId/settings
 * Update family settings
 * @body { canShareAssets, canViewOthers, requireApproval, currency, etc. }
 */
familyRoutes.put('/:familyId/settings', authenticateJWT, FamilyController.updateSettings);

export default familyRoutes;
