// middleware/assetPermission.middleware.ts
// Import PrismaClient for database interactions
import { PrismaClient } from '@prisma/client';
// Initialize Prisma client instance for database operations
const prisma = new PrismaClient();
/**
 * Middleware function to check if a user has access to a specific asset.
 *
 * This middleware performs a comprehensive access control check by evaluating:
 * 1. **Ownership Check**: Verifies if the user is the direct owner of the asset.
 * 2. **Shared Permissions**: Checks if the asset has been shared with the user or their family.
 * 3. **Family Role Permissions**: For shared assets, combines shared permissions with the user's role-based permissions within the family.
 *
 * The middleware supports three permission levels: 'view', 'edit', and 'delete'.
 * It attaches an `assetPermissions` object to the request for downstream use.
 *
 * @param requiredPermission - The minimum permission required ('view', 'edit', or 'delete')
 * @returns An Express middleware function that handles the access check
 *
 * @example
 * ```typescript
 * app.get('/assets/:assetId', checkAssetAccess('view'), (req, res) => {
 *   // Access granted, req.assetPermissions contains permission details
 * });
 * ```
 *
 * @throws Will return HTTP 400 if assetId is missing
 * @throws Will return HTTP 404 if asset is not found
 * @throws Will return HTTP 403 if user lacks required permission
 * @throws Will return HTTP 500 for internal server errors
 */
export const checkAssetAccess = (requiredPermission) => {
    // Return the actual middleware function
    return async (req, res, next) => {
        try {
            // Extract user ID from authenticated request (non-null assertion as auth middleware ensures presence)
            const userId = req.user?.userId;
            // Extract asset ID from route parameters or request body
            const assetId = req.params.assetId || req.body.assetId;
            // Validate that asset ID is provided
            if (!assetId) {
                return res.status(400).json({
                    success: false,
                    message: 'Asset ID is required',
                });
            }
            // Query database to retrieve asset details including owner information
            // Includes user's owned family for potential future use
            const asset = await prisma.asset.findUnique({
                where: { id: assetId },
                include: {
                    user: {
                        select: {
                            id: true,
                            owned_family: {
                                select: { id: true },
                            },
                        },
                    },
                },
            });
            // Check if asset exists in database
            if (!asset) {
                return res.status(404).json({
                    success: false,
                    message: 'Asset not found',
                });
            }
            // Permission Check 1: Verify if user is the direct owner of the asset
            if (asset.user_id === userId) {
                // Grant full permissions for owner
                req.assetPermissions = {
                    canView: true,
                    canEdit: true,
                    canDelete: true,
                    isOwner: true,
                    source: 'owner',
                };
                // Proceed to next middleware/route handler
                return next();
            }
            // Permission Check 2: Check if asset is shared with user or their family
            const sharedAsset = await prisma.sharedAsset.findFirst({
                where: {
                    asset_id: assetId, // Match the specific asset
                    is_active: true, // Only consider active shares
                    OR: [
                        { shared_with_user_id: userId }, // Direct share with user
                        {
                            AND: [
                                { shared_with_user_id: null }, // Family-level share (not individual)
                                {
                                    family: {
                                        members: {
                                            some: {
                                                user_id: userId, // User is a member of the family
                                                is_active: true, // Active membership
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                    // Note: Expiry check commented out - could be enabled if needed
                    // OR: [
                    //   { expires_at: null },
                    //   { expires_at: { gt: new Date() } },
                    // ],
                },
                include: {
                    family: {
                        include: {
                            members: {
                                where: { user_id: userId }, // Get user's membership details
                                include: {
                                    user: true, // Include user details (though may not be necessary)
                                },
                            },
                        },
                    },
                },
            });
            // If a shared asset record is found, evaluate permissions
            if (sharedAsset) {
                // Extract user's family membership from the shared asset's family
                const userMembership = sharedAsset.family.members[0];
                // Retrieve user's role permissions within the family
                const userRole = await prisma.familyRole.findUnique({
                    where: {
                        family_id_name: {
                            family_id: sharedAsset.family_id,
                            name: userMembership.role, // Role name from membership
                        },
                    },
                });
                // Validate that role exists and has permissions
                if (!userRole) {
                    return res.status(403).json({
                        success: false,
                        message: 'Invalid role permissions',
                    });
                }
                // Extract role permissions (assuming JSON structure with asset permissions)
                const rolePermissions = userRole.permissions;
                // Combine shared asset permissions with user's role permissions
                // Both shared permissions and role permissions must be true for access
                const permissions = {
                    canView: sharedAsset.can_view && rolePermissions.view_assets,
                    canEdit: sharedAsset.can_edit && rolePermissions.edit_assets,
                    canDelete: sharedAsset.can_delete && rolePermissions.delete_assets,
                    isOwner: false,
                    source: 'shared',
                };
                // Check if user has the specific required permission
                const hasPermission = (requiredPermission === 'view' && permissions.canView) ||
                    (requiredPermission === 'edit' && permissions.canEdit) ||
                    (requiredPermission === 'delete' && permissions.canDelete);
                // Deny access if required permission is not granted
                if (!hasPermission) {
                    return res.status(403).json({
                        success: false,
                        message: `You don't have permission to ${requiredPermission} this asset`,
                        userPermissions: permissions, // Include current permissions for debugging
                    });
                }
                // Attach permissions to request for use in subsequent handlers
                req.assetPermissions = permissions;
                // Proceed to next middleware/route handler
                return next();
            }
            // No access found through ownership or sharing
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this asset',
            });
        }
        catch (error) {
            // Log error for debugging purposes
            console.error('Error checking asset access:', error);
            // Return internal server error with sanitized error message
            return res.status(500).json({
                success: false,
                message: 'Failed to check asset permissions',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };
};
//# sourceMappingURL=asset-access.middleware.js.map