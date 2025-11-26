/**
 * @fileoverview Asset sharing API routes
 * @description This module defines all API routes related to asset sharing functionality.
 * It handles sharing assets with families or specific users, retrieving shared assets,
 * revoking sharing permissions, and accessing assets with proper permission checks.
 * 
 * @module routes/asset-sharing.routes
 * @requires express - Express Router for route definition
 * @requires @/middlewares/auth.middleware - JWT authentication middleware
 * @requires @/config/database - Prisma database client
 * @requires @/controllers/asset-sharing.controller - Asset sharing controller methods
 * @requires @/middlewares/asset-access.middleware - Asset permission checking middleware
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

import { Router } from 'express';
import { authenticateJWT } from '@/middlewares/auth.middleware';
import { prisma } from '@/config/database';
import { AssetSharingController } from '@/controllers/asset-sharing.controller';
import { checkAssetAccess } from '@/middlewares/asset-access.middleware';

/**
 * Express router for asset sharing operations
 */
const assetSharingRouter = Router();

// Share asset with family/user
assetSharingRouter.post(
  '/share',
  authenticateJWT,
  AssetSharingController.shareAsset
);

// Get assets shared WITH current user
assetSharingRouter.get(
  '/shared-with-me',
  authenticateJWT,
  AssetSharingController.getSharedAssets
);

// Get assets shared BY current user
assetSharingRouter.get(
  '/shared-by-me',
  authenticateJWT,
  AssetSharingController.getMySharedAssets
);

// Revoke sharing
assetSharingRouter.delete(
  '/share/:sharedAssetId',
  authenticateJWT,
  AssetSharingController.revokeAssetSharing
);

// Protected asset routes (with permission checking)
assetSharingRouter.get(
  '/asset/:assetId',
  authenticateJWT,
  checkAssetAccess('view'),
  async (req, res) => {
    // Asset details with permissions
    const permissions = (req as any).assetPermissions;
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.assetId },
    });
    
    res.json({
      success: true,
      data: asset,
      permissions,
    });
  }
);

// assetSharingRouter.put(
//   '/asset/:assetId',
//   authenticateJWT,
//   checkAssetAccess('edit'),
//   async (req, res) => {
//     // Update asset
//     // ... implementation
//   }
// );

// assetSharingRouter.delete(
//   '/asset/:assetId',
//   authenticateJWT,
//   checkAssetAccess('delete'),
//   async (req, res) => {
//     // Delete asset
//     // ... implementation
//   }
// );

export default assetSharingRouter;
