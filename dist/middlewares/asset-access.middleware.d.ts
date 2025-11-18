import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
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
export declare const checkAssetAccess: (requiredPermission: "view" | "edit" | "delete") => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=asset-access.middleware.d.ts.map