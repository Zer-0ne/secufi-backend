import { prisma } from '../config/database.js';
import { getClientIP } from '../config/request.helper.js';
import emailService from '../services/email.service.js';
import JWTService from '../services/jwt.service.js';
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
export class FamilyController {
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
    static async createFamily(req, res) {
        try {
            const userId = req.user?.userId;
            const { name = userId, description } = req.body;
            // ✅ CHECK 1: Validate family name
            if (!name || name.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Family name is required',
                });
            }
            // ✅ CHECK 2: Verify user doesn't already own a family
            const existingFamily = await prisma.family.findUnique({
                where: { owner_id: userId },
                select: { id: true, name: true }
            });
            if (existingFamily) {
                return res.status(400).json({
                    success: false,
                    message: 'You already own a family. Each user can only create one family.',
                    error: `Existing family: "${existingFamily.name}"`,
                });
            }
            // Create family with owner and member entry in single transaction
            const family = await prisma.$transaction(async (tx) => {
                // Create family
                const newFamily = await tx.family.create({
                    data: {
                        name,
                        description,
                        owner_id: userId,
                    },
                });
                // Create family member entry for owner
                await tx.familyMember.create({
                    data: {
                        family_id: newFamily.id,
                        user_id: userId,
                        role: 'owner',
                        can_view: true,
                        can_edit: true,
                        can_delete: true,
                        can_invite: true,
                        is_active: true,
                    },
                });
                // Create default family settings
                await tx.familySettings.create({
                    data: {
                        family_id: newFamily.id,
                    },
                });
                // Create default roles
                const defaultRoles = [
                    {
                        name: 'owner',
                        permissions: {
                            view_assets: true,
                            create_assets: true,
                            edit_assets: true,
                            delete_assets: true,
                            manage_members: true,
                            approve_transactions: true,
                            export_data: true,
                        },
                    },
                    {
                        name: 'admin',
                        permissions: {
                            view_assets: true,
                            create_assets: true,
                            edit_assets: true,
                            delete_assets: false,
                            manage_members: true,
                            approve_transactions: true,
                            export_data: true,
                        },
                    },
                    {
                        name: 'member',
                        permissions: {
                            view_assets: true,
                            create_assets: true,
                            edit_assets: false,
                            delete_assets: false,
                            manage_members: false,
                            approve_transactions: false,
                            export_data: false,
                        },
                    },
                    {
                        name: 'viewer',
                        permissions: {
                            view_assets: true,
                            create_assets: false,
                            edit_assets: false,
                            delete_assets: false,
                            manage_members: false,
                            approve_transactions: false,
                            export_data: false,
                        },
                    },
                ];
                for (const role of defaultRoles) {
                    await tx.familyRole.create({
                        data: {
                            family_id: newFamily.id,
                            name: role.name,
                            permissions: role.permissions,
                            is_default: true,
                        },
                    });
                }
                return newFamily;
            });
            const familyWithDetails = await prisma.family.findUnique({
                where: { id: family.id },
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    profile_picture: true,
                                },
                            },
                        },
                    },
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    settings: true,
                },
            });
            console.log(`✅ Family created: ${family.id} by ${userId}`);
            return res.status(201).json({
                success: true,
                message: 'Family created successfully',
                data: familyWithDetails,
            });
        }
        catch (error) {
            console.error('❌ Error creating family:', error);
            // Handle Prisma unique constraint error
            if (error instanceof Error && error.message.includes('Unique constraint')) {
                return res.status(400).json({
                    success: false,
                    message: 'You already own a family. Each user can only create one family.',
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to create family',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async getFamilyDetails(req, res) {
        try {
            const familyId = req.params.familyId;
            const userId = req.user?.userId;
            // Check if user is member of the family
            const membership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });
            if (!membership || !membership.is_active) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to access this family',
                });
            }
            const family = await prisma.family.findUnique({
                where: { id: familyId },
                include: {
                    members: {
                        where: { is_active: true },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    phone: true,
                                    profile_picture: true,
                                },
                            },
                        },
                    },
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    settings: true,
                    roles: true,
                    invitations: {
                        where: {
                            status: 'pending',
                        },
                    },
                },
            });
            if (!family) {
                return res.status(404).json({
                    success: false,
                    message: 'Family not found',
                });
            }
            console.log(`✅ Family details retrieved: ${familyId}`);
            return res.status(200).json({
                success: true,
                message: 'Family details retrieved',
                data: family,
            });
        }
        catch (error) {
            console.error('❌ Error fetching family details:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch family details',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async getUserFamilies(req, res) {
        try {
            const userId = req.user?.userId;
            // Get all families where user is a member
            const memberships = await prisma.familyMember.findMany({
                where: {
                    user_id: userId,
                    is_active: true,
                },
                include: {
                    family: {
                        include: {
                            owner: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                            members: {
                                where: { is_active: true },
                                select: {
                                    id: true,
                                    role: true,
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                            settings: true,
                        },
                    },
                },
            });
            const families = memberships.map((membership) => ({
                ...membership.family,
                userRole: membership.role,
                userPermissions: {
                    can_view: membership.can_view,
                    can_edit: membership.can_edit,
                    can_delete: membership.can_delete,
                    can_invite: membership.can_invite,
                },
            }));
            console.log(`✅ Retrieved ${families.length} families for user ${userId}`);
            return res.status(200).json({
                success: true,
                message: 'Families retrieved',
                data: families,
            });
        }
        catch (error) {
            console.error('❌ Error fetching user families:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch families',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async updateFamily(req, res) {
        try {
            const familyId = req.params.familyId;
            const userId = req.user?.userId;
            const { name, description } = req.body;
            // Verify user has edit permissions
            const membership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });
            if (!membership || !membership.can_edit) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update family details',
                });
            }
            const updatedFamily = await prisma.family.update({
                where: { id: familyId },
                data: {
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    updated_at: new Date(),
                },
            });
            console.log(`✅ Family updated: ${familyId}`);
            return res.status(200).json({
                success: true,
                message: 'Family updated successfully',
                data: updatedFamily,
            });
        }
        catch (error) {
            console.error('❌ Error updating family:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update family',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async deleteFamily(req, res) {
        try {
            const familyId = req.params.familyId;
            const userId = req.user?.userId;
            // Verify ownership
            const family = await prisma.family.findUnique({
                where: { id: familyId },
            });
            if (!family || family.owner_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Only family owner can delete family',
                });
            }
            await prisma.family.delete({
                where: { id: familyId },
            });
            console.log(`✅ Family deleted: ${familyId}`);
            return res.status(200).json({
                success: true,
                message: 'Family deleted successfully',
            });
        }
        catch (error) {
            console.error('❌ Error deleting family:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete family',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async getFamilyMembers(req, res) {
        try {
            const familyId = req.params.familyId;
            const userId = req.user?.userId;
            // Check if user is member of the family
            const membership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });
            if (!membership || !membership.is_active) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to access family members',
                });
            }
            const members = await prisma.familyMember.findMany({
                where: {
                    family_id: familyId,
                    is_active: true,
                    NOT: { user_id: userId }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            profile_picture: true,
                            assetsSharedWithMe: {
                                select: {
                                    id: true,
                                    asset_id: true
                                }
                            }
                        },
                    },
                },
                orderBy: {
                    joined_at: 'asc',
                },
            });
            console.log(`✅ Retrieved ${members.length} members for family ${familyId}`);
            return res.status(200).json({
                success: true,
                message: 'Family members retrieved',
                data: members,
            });
        }
        catch (error) {
            console.error('❌ Error fetching family members:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch family members',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async inviteMember(req, res) {
        try {
            const userId = req.user?.userId;
            const { email, role, name, phone } = req.body;
            // ✅ NEW: Get familyId from params OR fetch from user's owned family
            let familyId = req.params.familyId;
            if (!familyId) {
                // Fetch user's owned family
                const ownedFamily = await prisma.family.findUnique({
                    where: { owner_id: userId },
                    select: { id: true },
                });
                if (!ownedFamily) {
                    return res.status(404).json({
                        success: false,
                        message: 'You do not own any family. Please create a family first.',
                    });
                }
                familyId = ownedFamily.id;
                console.log(`✅ Using owned family ID: ${familyId}`);
            }
            // Verify user has invite permissions
            const membership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });
            if (!membership || !membership.can_invite) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to invite members',
                });
            }
            const family = await prisma.family.findUnique({
                where: { id: familyId },
            });
            if (!family) {
                return res.status(404).json({
                    success: false,
                    message: 'Family not found',
                });
            }
            // ✅ Fetch all available roles for this family
            const availableRoles = await prisma.familyRole.findMany({
                where: { family_id: familyId },
                select: { name: true },
            });
            const validRoleNames = availableRoles.map(r => r.name);
            // ✅ Validate that role exists in the family's role definitions
            const requestedRole = role || 'member';
            const familyRole = await prisma.familyRole.findUnique({
                where: {
                    family_id_name: {
                        family_id: familyId,
                        name: requestedRole,
                    },
                },
            });
            if (!familyRole) {
                return res.status(400).json({
                    success: false,
                    message: `Role '${requestedRole}' does not exist in this family. Valid roles: ${validRoleNames.join(', ')}`,
                    error: 'Invalid role',
                    availableRoles: validRoleNames,
                });
            }
            // ✅ Additional validation - prevent inviting as 'owner'
            if (requestedRole === 'owner') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot invite members with owner role. Each family can only have one owner.',
                    error: 'Invalid role',
                    availableRoles: validRoleNames.filter(r => r !== 'owner'),
                });
            }
            // Check if user with email already exists in family
            const invitedUser = await prisma.user.findUnique({
                where: { email },
            });
            if (invitedUser) {
                const existingMembership = await prisma.familyMember.findUnique({
                    where: {
                        family_id_user_id: {
                            family_id: familyId,
                            user_id: invitedUser.id,
                        },
                    },
                });
                if (existingMembership && existingMembership.is_active) {
                    return res.status(400).json({
                        success: false,
                        message: 'User already exists in family',
                    });
                }
            }
            // Check if invitation already exists
            const existingInvitation = await prisma.familyInvitation.findUnique({
                where: {
                    family_id_invited_email: {
                        family_id: familyId,
                        invited_email: email,
                    },
                },
            });
            if (existingInvitation && existingInvitation.status === 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'Invitation already sent to this email',
                });
            }
            // Create invitation
            const invitation = await prisma.familyInvitation.create({
                data: {
                    family_id: familyId,
                    invited_by_id: userId,
                    invited_email: email,
                    invited_user_id: invitedUser?.id || null,
                    role: requestedRole,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                },
                include: {
                    family: true,
                    invited_by: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            // If user doesn't exist in User table, create TempUser
            if (!invitedUser) {
                try {
                    console.log('This user is not registered yet in our platform so inviting him/her via email!');
                    await prisma.tempUser.upsert({
                        where: { email: email.toLowerCase().trim() },
                        create: {
                            email: email.toLowerCase().trim(),
                            name: name || null,
                            phone: phone || null,
                            invited_by_family_id: familyId,
                            invited_role: requestedRole,
                            invitation_id: invitation.id,
                            source: 'family_invitation',
                            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                        },
                        update: {
                            invited_by_family_id: familyId,
                            invited_role: requestedRole,
                            invitation_id: invitation.id,
                            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        },
                    });
                    console.log(`✅ Created/Updated temp user for ${email}`);
                }
                catch (tempError) {
                    console.error('⚠️ Error creating temp user:', tempError);
                }
            }
            console.log(`✅ Invitation sent to ${email} for family ${familyId} with role: ${requestedRole}`);
            // TODO: Send invitation email
            // ✅ Get origin and construct accept link
            // const origin = getClientOrigin(req);
            // this is for server origin
            const origin = `${req.protocol}://${req.get('host')}`;
            const clientIP = getClientIP(req);
            // Construct accept link
            const acceptLink = invitedUser
                ? `${process.env.NODE_ENV === 'development' ? process.env.SYSTEM_LOCAL_URL : origin}/api/family/invitations/${invitation.id}/accept/${invitedUser.id}/${await JWTService.signAccessToken({ isUsed: false, userId }, '7d')}`
                : `${process.env.NODE_ENV === 'development' ? process.env.SYSTEM_LOCAL_URL : origin}/api/users/register-with-invitation?invitation=${invitation.id}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(JWTService.signAccessToken({ isUsed: false, userId: '' }))}`;
            console.log(`📧 Sending invitation email to: ${email}`);
            console.log(`🔗 Accept link: ${acceptLink}`);
            console.log(`🌐 Client IP: ${clientIP}`);
            // ✅ Send invitation email
            // console.log("email :: ",email)
            try {
                await emailService.sendFamilyInvitation({
                    recipientName: email,
                    inviterName: family.name || 'Family Admin',
                    familyName: family.name,
                    role: requestedRole,
                    acceptLink: acceptLink,
                });
                console.log(`✅ Invitation email sent successfully to ${email}`);
            }
            catch (emailError) {
                console.error('❌ Error sending invitation email:', emailError);
                // Don't fail the entire request if email fails
            }
            return res.status(201).json({
                success: true,
                message: invitedUser
                    ? `Invitation sent successfully with role: ${requestedRole}`
                    : `Invitation sent successfully. User will be added as ${requestedRole} when they register.`,
                data: {
                    invitation,
                    role: requestedRole,
                    isNewUser: !invitedUser,
                    registrationRequired: !invitedUser,
                    familyId: familyId, // ✅ Include familyId in response
                },
            });
        }
        catch (error) {
            console.error('❌ Error inviting member:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to invite member',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async acceptInvitation(req, res) {
        try {
            const userId = req.user?.userId;
            const { invitationId } = req.params;
            const invitation = await prisma.familyInvitation.findUnique({
                where: { id: invitationId },
                include: { family: true },
            });
            if (!invitation) {
                return res.status(404).json({
                    success: false,
                    message: 'Invitation not found',
                });
            }
            // Verify invitation is for the authenticated user
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.email !== invitation.invited_email) {
                return res.status(403).json({
                    success: false,
                    message: 'This invitation is not for you',
                });
            }
            if (invitation.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: `Invitation already ${invitation.status}`,
                });
            }
            if (invitation.expires_at && invitation.expires_at < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invitation has expired',
                });
            }
            // Create family member and update invitation in transaction
            const result = await prisma.$transaction(async (tx) => {
                // Create family member entry
                const member = await tx.familyMember.create({
                    data: {
                        family_id: invitation.family_id,
                        user_id: userId,
                        role: invitation.role,
                        can_view: true,
                        can_edit: invitation.role === 'admin' || invitation.role === 'owner',
                        can_delete: invitation.role === 'owner',
                        can_invite: invitation.role === 'admin' || invitation.role === 'owner',
                        is_active: true,
                    },
                });
                // Update invitation status
                await tx.familyInvitation.update({
                    where: { id: invitationId },
                    data: {
                        status: 'accepted',
                        accepted_at: new Date(),
                        invited_user_id: userId,
                    },
                });
                return member;
            });
            console.log(`✅ User ${userId} accepted invitation to family ${invitation.family_id}`);
            return res.status(200).json({
                success: true,
                message: 'Invitation accepted successfully',
                data: {
                    familyId: invitation.family_id,
                    familyName: invitation.family.name,
                    role: invitation.role,
                },
            });
        }
        catch (error) {
            console.error('❌ Error accepting invitation:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to accept invitation',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async rejectInvitation(req, res) {
        try {
            const { invitationId } = req.params;
            const userId = req.user?.userId;
            const invitation = await prisma.familyInvitation.findUnique({
                where: { id: invitationId },
            });
            if (!invitation) {
                return res.status(404).json({
                    success: false,
                    message: 'Invitation not found',
                });
            }
            // Verify invitation is for the authenticated user
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (user?.email !== invitation.invited_email) {
                return res.status(403).json({
                    success: false,
                    message: 'This invitation is not for you',
                });
            }
            if (invitation.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: `Invitation already ${invitation.status}`,
                });
            }
            await prisma.familyInvitation.update({
                where: { id: invitationId },
                data: {
                    status: 'rejected',
                    rejected_at: new Date(),
                },
            });
            console.log(`✅ Invitation ${invitationId} rejected`);
            return res.status(200).json({
                success: true,
                message: 'Invitation rejected',
            });
        }
        catch (error) {
            console.error('❌ Error rejecting invitation:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to reject invitation',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async getPendingInvitations(req, res) {
        try {
            const userEmail = req.user?.email;
            const invitations = await prisma.familyInvitation.findMany({
                where: {
                    invited_email: userEmail,
                    status: 'pending',
                    OR: [
                        { expires_at: null },
                        { expires_at: { gt: new Date() } }
                    ]
                },
                include: {
                    family: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                    invited_by: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            });
            console.log(`✅ Retrieved ${invitations.length} pending invitations for ${userEmail}`);
            return res.status(200).json({
                success: true,
                message: 'Pending invitations retrieved',
                data: invitations,
            });
        }
        catch (error) {
            console.error('❌ Error fetching invitations:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch invitations',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async removeMember(req, res) {
        try {
            const familyId = req.params.familyId;
            const userId = req.user?.userId;
            const { memberId } = req.params || req.body;
            // Verify user has permission (owner or admin with can_delete)
            const userMembership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });
            if (!userMembership || (!userMembership.can_delete && userMembership.role !== 'owner')) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to remove members',
                });
            }
            // Cannot remove yourself
            if (memberId === userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot remove yourself from family. Use leave family instead.',
                });
            }
            // Find and deactivate member
            const memberToRemove = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: memberId,
                    },
                },
            });
            if (!memberToRemove) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found in family',
                });
            }
            // Cannot remove owner
            if (memberToRemove.role === 'owner') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot remove family owner',
                });
            }
            // await prisma.familyMember.update({
            //   where: { id: memberToRemove.id },
            //   data: {
            //     is_active: false,
            //     updated_at: new Date(),
            //   },
            // });
            await prisma.familyMember.delete({
                where: { id: memberToRemove.id }
            });
            console.log(`✅ Member ${memberId} removed from family ${familyId}`);
            return res.status(200).json({
                success: true,
                message: 'Member removed successfully',
            });
        }
        catch (error) {
            console.error('❌ Error removing member:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to remove member',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async updateMemberRole(req, res) {
        try {
            const familyId = req.params.familyId;
            const userId = req.user?.userId;
            const { memberId, role, can_view, can_edit, can_delete, can_invite } = req.body;
            // Verify user is owner or admin
            const userMembership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });
            if (!userMembership || (userMembership.role !== 'owner' && userMembership.role !== 'admin')) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update member roles',
                });
            }
            const memberToUpdate = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: memberId,
                    },
                },
            });
            if (!memberToUpdate) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found',
                });
            }
            // Cannot update owner
            if (memberToUpdate.role === 'owner') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot update owner permissions',
                });
            }
            const updatedMember = await prisma.familyMember.update({
                where: { id: memberToUpdate.id },
                data: {
                    ...(role && { role }),
                    ...(can_view !== undefined && { can_view }),
                    ...(can_edit !== undefined && { can_edit }),
                    ...(can_delete !== undefined && { can_delete }),
                    ...(can_invite !== undefined && { can_invite }),
                    updated_at: new Date(),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            console.log(`✅ Member ${memberId} role updated in family ${familyId}`);
            return res.status(200).json({
                success: true,
                message: 'Member role updated successfully',
                data: updatedMember,
            });
        }
        catch (error) {
            console.error('❌ Error updating member role:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update member role',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async leaveFamily(req, res) {
        try {
            const familyId = req.params.familyId;
            const userId = req.user?.userId;
            const membership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });
            if (!membership) {
                return res.status(404).json({
                    success: false,
                    message: 'Not a member of this family',
                });
            }
            if (membership.role === 'owner') {
                return res.status(400).json({
                    success: false,
                    message: 'Owner cannot leave family. Transfer ownership or delete family instead.',
                });
            }
            await prisma.familyMember.update({
                where: { id: membership.id },
                data: {
                    is_active: false,
                    updated_at: new Date(),
                },
            });
            console.log(`✅ User ${userId} left family ${familyId}`);
            return res.status(200).json({
                success: true,
                message: 'Successfully left family',
            });
        }
        catch (error) {
            console.error('❌ Error leaving family:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to leave family',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async grantAccess(req, res) {
        try {
            const userId = req.user?.userId;
            const { targetUserId, accessType, canViewAssets, canEditAssets, canDeleteAssets, accessUntil, } = req.body;
            // Check if access already exists
            const existingAccess = await prisma.familyAccess.findUnique({
                where: {
                    parent_user_id_child_user_id: {
                        parent_user_id: userId,
                        child_user_id: targetUserId,
                    },
                },
            });
            let access;
            if (existingAccess) {
                // Update existing access
                access = await prisma.familyAccess.update({
                    where: { id: existingAccess.id },
                    data: {
                        access_type: accessType,
                        can_view_assets: canViewAssets,
                        can_edit_assets: canEditAssets,
                        can_delete_assets: canDeleteAssets,
                        access_until: accessUntil,
                        is_active: true,
                        updated_at: new Date(),
                    },
                });
            }
            else {
                // Create new access
                access = await prisma.familyAccess.create({
                    data: {
                        parent_user_id: userId,
                        child_user_id: targetUserId,
                        access_type: accessType,
                        can_view_assets: canViewAssets,
                        can_edit_assets: canEditAssets,
                        can_delete_assets: canDeleteAssets,
                        access_until: accessUntil,
                    },
                });
            }
            console.log(`✅ Access granted to ${targetUserId} by ${userId}`);
            return res.status(201).json({
                success: true,
                message: 'Access granted successfully',
                data: access,
            });
        }
        catch (error) {
            console.error('❌ Error granting access:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to grant access',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async getUserAccess(req, res) {
        try {
            const userId = req.user?.userId;
            const accessList = await prisma.familyAccess.findMany({
                where: {
                    parent_user_id: userId,
                    is_active: true,
                },
                include: {
                    child_user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profile_picture: true,
                        },
                    },
                },
            });
            console.log(`✅ Retrieved ${accessList.length} access grants for user ${userId}`);
            return res.status(200).json({
                success: true,
                message: 'Access list retrieved',
                data: accessList,
            });
        }
        catch (error) {
            console.error('❌ Error fetching access list:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch access list',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async revokeAccess(req, res) {
        try {
            const userId = req.user?.userId;
            const { accessId } = req.body;
            const access = await prisma.familyAccess.findUnique({
                where: { id: accessId },
            });
            if (!access || access.parent_user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to revoke this access',
                });
            }
            await prisma.familyAccess.update({
                where: { id: accessId },
                data: {
                    is_active: false,
                    updated_at: new Date(),
                },
            });
            console.log(`✅ Access ${accessId} revoked`);
            return res.status(200).json({
                success: true,
                message: 'Access revoked successfully',
            });
        }
        catch (error) {
            console.error('❌ Error revoking access:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to revoke access',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
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
    static async updateSettings(req, res) {
        try {
            const familyId = req.params.familyId;
            const userId = req.user?.userId;
            const settings = req.body;
            // Verify user is owner or admin with edit permissions
            const membership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });
            if (!membership || (membership.role !== 'owner' && !membership.can_edit)) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update settings',
                });
            }
            const updatedSettings = await prisma.familySettings.upsert({
                where: { family_id: familyId },
                update: {
                    ...(settings.canShareAssets !== undefined && { can_share_assets: settings.canShareAssets }),
                    ...(settings.canViewOthers !== undefined && { can_view_others: settings.canViewOthers }),
                    ...(settings.requireApproval !== undefined && { require_approval: settings.requireApproval }),
                    ...(settings.currency && { currency: settings.currency }),
                    ...(settings.financialYearStart && { financial_year_start: settings.financialYearStart }),
                    ...(settings.notifyLargeTransactions !== undefined && {
                        notify_large_transactions: settings.notifyLargeTransactions,
                    }),
                    ...(settings.largeTransactionThreshold !== undefined && {
                        large_transaction_threshold: settings.largeTransactionThreshold,
                    }),
                    updated_at: new Date(),
                },
                create: {
                    family_id: familyId,
                    can_share_assets: settings.canShareAssets ?? true,
                    can_view_others: settings.canViewOthers ?? true,
                    require_approval: settings.requireApproval ?? false,
                    currency: settings.currency ?? 'INR',
                    financial_year_start: settings.financialYearStart ?? '01-04',
                    notify_large_transactions: settings.notifyLargeTransactions ?? true,
                    large_transaction_threshold: settings.largeTransactionThreshold ?? 100000,
                },
            });
            console.log(`✅ Family settings updated for ${familyId}`);
            return res.status(200).json({
                success: true,
                message: 'Settings updated successfully',
                data: updatedSettings,
            });
        }
        catch (error) {
            console.error('❌ Error updating settings:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update settings',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
//# sourceMappingURL=family.controller.js.map