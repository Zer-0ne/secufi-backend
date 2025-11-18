/**
 * @fileoverview Controller for handling asset sharing operations within families.
 * This controller manages sharing assets with family members, retrieving shared assets,
 * and revoking sharing permissions. It ensures proper authorization and validation
 * for all sharing-related operations.
 */
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
/**
 * Controller class for managing asset sharing functionality.
 * Handles operations like sharing assets with families or specific users,
 * retrieving shared assets, and revoking sharing permissions.
 */
export declare class AssetSharingController {
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
    static shareAsset(req: AuthenticatedRequest, res: Response): Promise<Response>;
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
    static getSharedAssets(req: AuthenticatedRequest, res: Response): Promise<Response>;
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
    static getMySharedAssets(req: AuthenticatedRequest, res: Response): Promise<Response>;
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
    static revokeAssetSharing(req: AuthenticatedRequest, res: Response): Promise<Response>;
}
//# sourceMappingURL=asset-sharing.controller.d.ts.map