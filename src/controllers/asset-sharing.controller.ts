/**
 * @fileoverview Controller for handling asset sharing operations within families
 * @description This controller manages sharing assets with family members, retrieving shared assets,
 * and revoking sharing permissions. It ensures proper authorization and validation
 * for all sharing-related operations.
 * 
 * @module controllers/asset-sharing.controller
 * @requires express - Express Response type for HTTP responses
 * @requires @prisma/client - Prisma ORM client for database operations
 * @requires @/middlewares/auth.middleware - AuthenticatedRequest type for authenticated requests
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

const prisma = new PrismaClient();

/**
 * Interface defining the structure of the request body for sharing an asset
 * 
 * @interface ShareAssetRequest
 * @description Contains all parameters needed to share an asset with family members
 * or specific users within a family context
 * 
 * @property {string} assetId - The unique identifier of the asset to be shared (required)
 * @property {string} [familyId] - Optional family ID; if not provided, uses the user's owned family
 * @property {string} [sharedWithUserId] - Optional user ID to share with a specific family member
 * @property {boolean} [canView=true] - Permission to view the asset (default: true)
 * @property {boolean} [canEdit=false] - Permission to edit the asset (default: false)
 * @property {boolean} [canDelete=false] - Permission to delete the asset (default: false)
 * @property {Date} [expiresAt] - Optional expiration date for the sharing
 * @property {string} [notes] - Optional notes about the sharing
 */
interface ShareAssetRequest {
    assetId: string;
    familyId?: string;
    sharedWithUserId?: string;
    canView?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    expiresAt?: Date;
    notes?: string;
}

/**
 * Controller class for managing asset sharing functionality.
 * Handles operations like sharing assets with families or specific users,
 * retrieving shared assets, and revoking sharing permissions.
 */
export class AssetSharingController {
    /**
     * Shares an asset with a family or a specific family member.
     * Validates ownership, family membership, and permissions before creating or updating the share.
     * If the asset is already shared, updates the existing share; otherwise, creates a new one.
     *
     * @param req - The authenticated request object containing user info and body data
     * @param res - The response object to send back to the client
     * @returns A promise resolving to the response with success status and shared asset data
     *
     * @throws {400} If assetId is missing or target user is not an active family member
     * @throws {403} If user doesn't own the asset or isn't a family member
     * @throws {404} If asset or family is not found
     * @throws {500} For internal server errors during database operations
     */
    static async shareAsset(
        req: AuthenticatedRequest,
        res: Response
    ): Promise<Response> {
        try {
            const userId = req.user?.userId!;
            const {
                assetId,
                // familyId: requestedFamilyId,
                sharedWithUserId,
                canView = true,
                canEdit = false,
                canDelete = false,
                expiresAt,
                notes,
            } = req.body as ShareAssetRequest;

            const requestedFamilyId = req.params.familyId

            // Validate required fields
            if (!assetId) {
                return res.status(400).json({
                    success: false,
                    message: 'Asset ID is required',
                });
            }

            // Get asset and verify ownership
            const asset = await prisma.asset.findUnique({
                where: { id: assetId },
            });

            if (!asset) {
                return res.status(404).json({
                    success: false,
                    message: 'Asset not found',
                });
            }

            if (asset.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only share your own assets',
                });
            }

            // Resolve familyId
            let familyId = requestedFamilyId;
            if (!familyId) {
                const ownedFamily = await prisma.family.findUnique({
                    where: { owner_id: userId },
                    select: { id: true },
                });

                if (!ownedFamily) {
                    return res.status(404).json({
                        success: false,
                        message: 'You do not own any family. Please specify a family ID.',
                    });
                }

                familyId = ownedFamily.id;
            }

            // Verify user is member of the family
            const membership = await prisma.familyMember.findUnique({
                where: {
                    family_id_user_id: {
                        family_id: familyId,
                        user_id: userId,
                    },
                },
            });

            if (!membership) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not a member of this family',
                });
            }

            // If sharing with specific user, verify they are family member
            if (sharedWithUserId) {
                const targetMembership = await prisma.familyMember.findUnique({
                    where: {
                        family_id_user_id: {
                            family_id: familyId,
                            user_id: sharedWithUserId,
                        },
                    },
                });

                if (!targetMembership || !targetMembership.is_active) {
                    return res.status(400).json({
                        success: false,
                        message: 'Target user is not an active member of this family',
                    });
                }
            }

            // Check if already shared
            const existingShare = await prisma.sharedAsset.findUnique({
                where: {
                    asset_id_family_id_shared_with_user_id: {
                        asset_id: assetId,
                        family_id: familyId,
                        shared_with_user_id: sharedWithUserId!,
                    },
                },
            });

            if (existingShare) {
                // Update existing share
                const updatedShare = await prisma.sharedAsset.update({
                    where: { id: existingShare.id },
                    data: {
                        can_view: canView,
                        can_edit: canEdit,
                        can_delete: canDelete,
                        expires_at: expiresAt ? new Date(expiresAt) : null,
                        notes: notes || null,
                        is_active: true,
                    },
                    include: {
                        asset: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                sub_type: true,
                            },
                        },
                        family: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        shared_with_user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });

                console.log(`✅ Asset ${assetId} share updated with family ${familyId}`);

                return res.json({
                    success: true,
                    message: 'Asset sharing permissions updated successfully',
                    data: updatedShare,
                });
            }

            // Create new share
            const sharedAsset = await prisma.sharedAsset.create({
                data: {
                    asset_id: assetId,
                    shared_by_user_id: userId,
                    family_id: familyId,
                    shared_with_user_id: sharedWithUserId || null,
                    can_view: canView,
                    can_edit: canEdit,
                    can_delete: canDelete,
                    expires_at: expiresAt ? new Date(expiresAt) : null,
                    notes: notes || null,
                    is_active: true,
                },
                include: {
                    asset: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            sub_type: true,
                        },
                    },
                    family: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    shared_with_user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            console.log(`✅ Asset ${assetId} shared with family ${familyId}`);

            return res.status(201).json({
                success: true,
                message: sharedWithUserId
                    ? 'Asset shared with user successfully'
                    : 'Asset shared with family successfully',
                data: sharedAsset,
            });
        } catch (error) {
            console.error('❌ Error sharing asset:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to share asset',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    /**
     * Retrieves all assets shared with the current user, either directly or through family membership.
     * This method fetches shared assets where the user is either the direct recipient or a member
     * of a family with which the asset has been shared. It enhances the response with effective
     * permissions based on the user's role within the family.
     *
     * @param req - The authenticated request object containing user information
     * @param res - The response object to send back to the client
     * @returns A promise resolving to the response with success status and array of shared assets
     *
     * @throws {500} For internal server errors during database operations
     */
    static async getSharedAssets(
        req: AuthenticatedRequest,
        res: Response
    ): Promise<Response> {
        try {
            const userId = req.user?.userId!;

            // Get user's family memberships
            const memberships = await prisma.familyMember.findMany({
                where: {
                    user_id: userId,
                    is_active: true,
                },
                select: {
                    family_id: true,
                    role: true,
                },
            });

            const familyIds = memberships.map((m) => m.family_id);

            // Get shared assets
            const sharedAssets = await prisma.sharedAsset.findMany({
                where: {
                    is_active: true,
                    OR: [
                        // Shared directly with user
                        { shared_with_user_id: userId },
                        // Shared with families user is member of
                        {
                            family_id: { in: familyIds },
                            shared_with_user_id: null,
                        },
                    ],
                    // Check expiry
                    //   OR: [
                    //     { expires_at: null },
                    //     { expires_at: { gt: new Date() } },
                    //   ],
                },
                include: {
                    asset: {
                        select: {
                            id: true,
                            user_id: true,
                            name: true,
                            type: true,
                            sub_type: true,
                            balance: true,
                            total_value: true,
                            status: true,
                            last_updated: true,
                            address: true,
                            nominee: true,
                            policy_number: true,
                            fund_name: true,
                            folio_number: true,
                            account_number: true,
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    name: true,
                                    profile_picture: true
                                }
                            },
                            issues: true
                        }
                    },

                    shared_by_user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    family: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            // Enhance with user's permissions
            const assetsWithPermissions = await Promise.all(
                sharedAssets.map(async (shared) => {
                    const userMembership = memberships.find(
                        (m) => m.family_id === shared.family_id
                    );

                    if (!userMembership) return null;

                    // Get role permissions
                    const role = await prisma.familyRole.findUnique({
                        where: {
                            family_id_name: {
                                family_id: shared.family_id,
                                name: userMembership.role,
                            },
                        },
                    });

                    if (!role) return null;

                    const rolePerms = role.permissions as any;

                    return {
                        ...shared,
                        effectivePermissions: {
                            canView: shared.can_view && rolePerms.view_assets,
                            canEdit: shared.can_edit && rolePerms.edit_assets,
                            canDelete: shared.can_delete && rolePerms.delete_assets,
                        },
                        userRole: userMembership.role,
                    };
                })
            );

            const validAssets = assetsWithPermissions.filter((a) => a !== null);

            return res.json({
                success: true,
                message: 'Shared assets retrieved successfully',
                data: validAssets,
                count: validAssets.length,
            });
        } catch (error) {
            console.error('❌ Error getting shared assets:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get shared assets',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    /**
     * Retrieves all assets that have been shared by the current user.
     * This method returns a list of assets the user has shared with others,
     * including details about the shared assets, the families they were shared with,
     * and any specific users they were shared with.
     *
     * @param req - The authenticated request object containing user information
     * @param res - The response object to send back to the client
     * @returns A promise resolving to the response with success status and array of shared assets
     *
     * @throws {500} For internal server errors during database operations
     */
    static async getMySharedAssets(
        req: AuthenticatedRequest,
        res: Response
    ): Promise<Response> {
        try {
            const userId = req.user?.userId!;

            const sharedAssets = await prisma.sharedAsset.findMany({
                where: {
                    shared_by_user_id: userId,
                    is_active: true,
                },
                include: {
                    asset: {
                        select: {
                            id: true,
                            user_id: true,
                            name: true,
                            type: true,
                            sub_type: true,
                            balance: true,
                            total_value: true,
                            status: true,
                            last_updated: true,
                            address: true,
                            nominee: true,
                            policy_number: true,
                            fund_name: true,
                            folio_number: true,
                            account_number: true,
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    name: true,
                                    profile_picture: true
                                }
                            },
                            issues: true
                        }
                    },
                    family: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    shared_with_user: {
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

            return res.json({
                success: true,
                message: 'Your shared assets retrieved successfully',
                data: sharedAssets,
                count: sharedAssets.length,
            });
        } catch (error) {
            console.error('❌ Error getting my shared assets:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get your shared assets',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    /**
     * Revokes the sharing of a specific asset.
     * This method allows the user who shared the asset or the asset owner to revoke the sharing,
     * effectively removing access for the previously shared users or family members.
     *
     * @param req - The authenticated request object containing user information and sharedAssetId in params
     * @param res - The response object to send back to the client
     * @returns A promise resolving to the response with success status
     *
     * @throws {404} If the shared asset is not found
     * @throws {403} If the user is not authorized to revoke the sharing
     * @throws {500} For internal server errors during database operations
     */
    static async revokeAssetSharing(
        req: AuthenticatedRequest,
        res: Response
    ): Promise<Response> {
        try {
            const userId = req.user?.userId!;
            const { sharedAssetId } = req.params;

            const sharedAsset = await prisma.sharedAsset.findUnique({
                where: { id: sharedAssetId },
                include: {
                    asset: {
                        select: {
                            id: true,
                            user_id: true,
                            name: true,
                            type: true,
                            sub_type: true,
                            balance: true,
                            total_value: true,
                            status: true,
                            last_updated: true,
                            address: true,
                            nominee: true,
                            policy_number: true,
                            fund_name: true,
                            folio_number: true,
                            account_number: true,
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    name: true,
                                    profile_picture: true
                                }
                            },
                            issues: true
                        }
                    },
                },
            });

            if (!sharedAsset) {
                return res.status(404).json({
                    success: false,
                    message: 'Shared asset not found',
                });
            }

            // Verify user is the one who shared it or asset owner
            if (
                sharedAsset.shared_by_user_id !== userId &&
                sharedAsset.asset.user_id !== userId
            ) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to revoke this sharing',
                });
            }

            // use this in future when we working on activity logs
            // await prisma.sharedAsset.update({
            //     where: { id: sharedAssetId },
            //     data: { is_active: false },
            // });

            // remove this in future when we working on activity logs
            await prisma.sharedAsset.delete({
                where: {
                    id: sharedAssetId
                }
            })

            console.log(`✅ Asset sharing ${sharedAssetId} revoked`);

            return res.json({
                success: true,
                message: 'Asset sharing revoked successfully',
            });
        } catch (error) {
            console.error('❌ Error revoking asset sharing:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to revoke asset sharing',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
