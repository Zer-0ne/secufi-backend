// routes/assetSharing.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { prisma } from '../config/database.js';
import { AssetSharingController } from '../controllers/asset-sharing.controller.js';
import { checkAssetAccess } from '../middlewares/asset-access.middleware.js';
const assetSharingRouter = Router();
// Share asset with family/user
assetSharingRouter.post('/share', authenticateJWT, AssetSharingController.shareAsset);
// Get assets shared WITH current user
assetSharingRouter.get('/shared-with-me', authenticateJWT, AssetSharingController.getSharedAssets);
// Get assets shared BY current user
assetSharingRouter.get('/shared-by-me', authenticateJWT, AssetSharingController.getMySharedAssets);
// Revoke sharing
assetSharingRouter.delete('/share/:sharedAssetId', authenticateJWT, AssetSharingController.revokeAssetSharing);
// Protected asset routes (with permission checking)
assetSharingRouter.get('/asset/:assetId', authenticateJWT, checkAssetAccess('view'), async (req, res) => {
    // Asset details with permissions
    const permissions = req.assetPermissions;
    const asset = await prisma.asset.findUnique({
        where: { id: req.params.assetId },
    });
    res.json({
        success: true,
        data: asset,
        permissions,
    });
});
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
//# sourceMappingURL=asset-sharing.routes.js.map