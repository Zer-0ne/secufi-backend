/**
 * Vault Routes Module
 * Handles asset management operations including retrieval, status updates, and modifications
 */

import { AuthenticatedRequest, authenticateJWT } from "@/middlewares/auth.middleware";
import { AIService } from "@/services/ai.service";
import { EncryptionService } from "@/services/encryption.service";
import { EmailData, FinancialDataService } from "@/services/financial-data.service";
import { GmailAttachmentService } from "@/services/gmail-attachment.service";
import { GoogleService } from "@/services/google.service";
import { UserService } from "@/services/user.service";
import { Asset, PrismaClient, User } from "@prisma/client";
import { Router, Response } from "express";


// ============================================================================
// Service Initialization
// ============================================================================

/**
 * Prisma Client instance for database operations
 * Note: In production, use a singleton pattern to avoid multiple instances
 * @see https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client
 */
const prisma = new PrismaClient();

/** Encryption service instance for securing sensitive data */
const encryptionService = new EncryptionService();

/** AI service instance for intelligent asset analysis */
const aiService = new AIService();

/** Gmail attachment service instance for handling email attachments */
const attachmentService = new GmailAttachmentService();

/**
 * Financial data service instance
 * Handles asset operations and financial data processing
 */
const financialDataService = new FinancialDataService(prisma, aiService);

export const googleService = new GoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUrl: process.env.GOOGLE_REDIRECT_URL ||
        'http://localhost:5000/api/google/callback',
}, prisma, encryptionService);

const userService = new UserService(prisma);

const vaultRoutes = Router();

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /create-asset
 * Create a new asset manually
 * 
 * @route POST /create-asset
 * @middleware authenticateJWT - Validates JWT token and extracts user ID
 * @body {Object} assetData - Asset information to create
 * @body {string} name - Asset name (required)
 * @body {string} type - Asset category: 'asset', 'liability', or 'insurance' (required)
 * @body {string} [sub_type] - Asset sub-type (e.g., 'mutual_fund', 'credit_card', 'health_insurance')
 * @body {string} [account_number] - Account number
 * @body {string} [ifsc_code] - IFSC code
 * @body {string} [branch_name] - Branch name
 * @body {string} [bank_name] - Bank name
 * @body {number} [balance] - Current balance/value
 * @body {number} [total_value] - Total value/coverage amount
 * @body {string} [status] - Asset status (default: 'draft')
 * @body {string} [address] - Asset location/address
 * @body {string} [nominee] - Nominee details
 * @body {string} [policy_number] - Policy number (for insurance)
 * @body {string} [fund_name] - Fund name (for investments)
 * @body {string} [folio_number] - Folio number (for investments)
 * @body {string} [crn_number] - CRN number
 * @body {Object} [document_metadata] - Additional metadata
 * @returns {Object} 201 - Success response with created asset
 * @returns {Object} 400 - Bad request if required fields are missing
 * @returns {Object} 500 - Server error with error message
 * 
 * @example
 * // Request
 * POST /api/vault/create-asset
 * Authorization: Bearer <token>
 * Content-Type: application/json
 * 
 * {
 *   "name": "HDFC Mutual Fund",
 *   "type": "asset",
 *   "sub_type": "mutual_fund",
 *   "fund_name": "HDFC Equity Fund",
 *   "folio_number": "12345678",
 *   "balance": 150000,
 *   "status": "active"
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "message": "Asset created successfully",
 *   "data": {
 *     "id": "asset123",
 *     "name": "HDFC Mutual Fund",
 *     "type": "asset",
 *     "balance": 150000,
 *     "createdAt": "2025-11-18T07:45:00Z"
 *   }
 * }
 */
vaultRoutes.post(
    '/create-asset',
    authenticateJWT,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
        try {
            const assetData = req.body;

            const assetTypes = await prisma.asset.groupBy({
                by: ['type'],
                where: {
                    user_id: req.user?.userId!
                }
            });

            const allowedTypes = assetTypes.map(item => item.type);

            // Validate required fields
            if (!assetData.name || !assetData.type) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: name and type are required',
                });
            }

            // Validate asset type
            // const allowedTypes = ['asset', 'liability', 'insurance'];
            if (!allowedTypes.includes(assetData.type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid type. Must be one of: asset, liability, insurance',
                    allowedTypes
                });
            }

            // Create asset with provided data
            const newAsset = await prisma.asset.create({
                data: {
                    user_id: req.user?.userId!,
                    name: assetData.name,
                    type: assetData.type,
                    sub_type: assetData.sub_type || null,
                    account_number: assetData.account_number || null,
                    ifsc_code: assetData.ifsc_code || null,
                    branch_name: assetData.branch_name || null,
                    bank_name: assetData.bank_name || null,
                    balance: assetData.balance ? parseFloat(String(assetData.balance)) : null,
                    total_value: assetData.total_value ? parseFloat(String(assetData.total_value)) : null,
                    status: assetData.status || 'draft',
                    last_updated: new Date(),
                    address: assetData.address || null,
                    nominee: assetData.nominee || null,
                    policy_number: assetData.policy_number || null,
                    fund_name: assetData.fund_name || null,
                    folio_number: assetData.folio_number || null,
                    crn_number: assetData.crn_number || null,
                },
                select: {
                    id: true,
                    user_id: true,
                    name: true,
                    type: true,
                    sub_type: true,
                    account_number: true,
                    ifsc_code: true,
                    branch_name: true,
                    bank_name: true,
                    balance: true,
                    total_value: true,
                    status: true,
                    last_updated: true,
                    address: true,
                    nominee: true,
                    policy_number: true,
                    fund_name: true,
                    folio_number: true,
                    crn_number: true,
                    created_at: true,
                    updated_at: true,
                },
            });

            return res.status(201).json({
                success: true,
                message: 'Asset created successfully',
                data: newAsset,
            });
        } catch (error) {
            console.error('Error creating asset:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create asset',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);

/**
 * GET /get-assets/
 * Retrieve all assets for the authenticated user
 * 
 * @route GET /get-assets/
 * @middleware authenticateJWT - Validates JWT token and extracts user ID
 * @returns {Object} 200 - Success response with array of user assets
 * @returns {Object} 500 - Server error with error message
 * 
 * @example
 * // Request
 * GET /api/vault/get-assets/
 * Authorization: Bearer <token>
 * 
 * // Response
 * {
 *   "success": true,
 *   "data": [
 *     { "id": "asset1", "name": "Property", "status": "active", "value": 100000 },
 *     { "id": "asset2", "name": "Vehicle", "status": "inactive", "value": 50000 }
 *   ]
 * }
 */
vaultRoutes.get(
    '/get-assets/',
    authenticateJWT,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
        try {
            const assets = await financialDataService.getAssetsByUserId(req.user?.userId!);

            // Add extra fields to each asset
            const enrichedAssets = assets.map(asset => ({
                ...asset,
                source: "AI",
                submitted: true,
            }));

            return res.status(200).json({
                success: true,
                data: enrichedAssets
            });
        } catch (error) {
            console.error('Error fetching assets:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch assets',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);


/**
 * GET /get-asset/:assetId
 * Retrieve a specific asset by ID
 * 
 * @route GET /get-asset/:assetId
 * @param {string} assetId - The unique identifier of the asset
 * @middleware authenticateJWT - Validates JWT token and extracts user ID
 * @returns {Object} 200 - Success response with asset details
 * @returns {Object} 500 - Server error with error message
 * 
 * @example
 * // Request
 * GET /api/vault/get-asset/asset123
 * Authorization: Bearer <token>
 * 
 * // Response
 * {
 *   "success": true,
 *   "data": {
 *     "id": "asset123",
 *     "name": "Property",
 *     "status": "active",
 *     "value": 100000,
 *     "description": "Commercial property in downtown"
 *   }
 * }
 */
vaultRoutes.get(
    '/get-asset/:assetId',
    authenticateJWT,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
        try {
            const assetId = req.params.assetId;
            const asset = await financialDataService.getAssetById(assetId, req.user?.userId!);
            return res.status(200).json({ success: true, data: asset });
        } catch (error) {
            console.error('Error fetching asset:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch asset',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);

/**
 * PATCH /status-asset/:assetId
 * Update the status of an asset
 * 
 * @route PATCH /status-asset/:assetId
 * @param {string} assetId - The unique identifier of the asset
 * @middleware authenticateJWT - Validates JWT token and extracts user ID
 * @body {Object} - Request body
 * @body {string} status - New status for the asset (must be one of allowed statuses)
 * @returns {Object} 200 - Success response with updated asset
 * @returns {Object} 400 - Bad request if status is invalid
 * @returns {Object} 500 - Server error with error message
 * 
 * @example
 * // Request
 * PATCH /api/vault/status-asset/asset123
 * Authorization: Bearer <token>
 * Content-Type: application/json
 * 
 * {
 *   "status": "approved"
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "data": {
 *     "id": "asset123",
 *     "status": "approved",
 *     "updatedAt": "2025-11-04T13:08:00Z"
 *   }
 * }
 * 
 * @description
 * Allowed status values:
 * - active, inactive, inactive, approved, rejected
 * - under_review, needs_attention, verified, unverified
 * - flagged, escalated, resolved, closed, open
 * - in_progress, on_hold, completed, canceled
 * - draft, submitted, processing
 */
vaultRoutes.patch(
    '/status-asset/:assetId',
    authenticateJWT,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
        try {
            const assetId = req.params.assetId;
            const { status } = req.body;

            // Allowed asset statuses
            const allowedStatus = [
                'active', 'inactive', 'inactive', 'approved', 'rejected',
                'under_review', 'needs_attention', 'verified', 'unverified',
                'flagged', 'escalated', 'resolved', 'closed', 'open',
                'in_progress', 'on_hold', 'completed', 'canceled',
                'draft', 'submitted', 'processing'
            ];

            // Validate status input
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status value',
                    allowedStatus
                });
            }

            const approvedAsset = await financialDataService.approveAsset(
                assetId,
                req.user?.userId!,
                status
            );
            return res.status(200).json({ success: true, data: approvedAsset });
        } catch (error) {
            console.error('Error approving asset:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to approve asset',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);

/**
 * PUT /edit-asset/:assetId
 * Update asset information
 * 
 * @route PUT /edit-asset/:assetId
 * @param {string} assetId - The unique identifier of the asset
 * @middleware authenticateJWT - Validates JWT token and extracts user ID
 * @body {Object} assetData - Asset properties to update (flexible schema)
 * @returns {Object} 200 - Success response with updated asset
 * @returns {Object} 500 - Server error with error message
 * 
 * @example
 * // Request
 * PUT /api/vault/edit-asset/asset123
 * Authorization: Bearer <token>
 * Content-Type: application/json
 * 
 * {
 *   "name": "Updated Asset Name",
 *   "value": 150000,
 *   "description": "Updated description"
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "data": {
 *     "id": "asset123",
 *     "name": "Updated Asset Name",
 *     "value": 150000,
 *     "description": "Updated description",
 *     "updatedAt": "2025-11-04T13:08:00Z"
 *   }
 * }
 * 
 * @description
 * Updates specified fields of an asset. Only authenticated users can modify their own assets.
 */
vaultRoutes.put(
    '/edit-asset/:assetId',
    authenticateJWT,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
        try {
            const assetId = req.params.assetId;
            const assetData = req.body;
            const assetToUpdate = await financialDataService.getAssetById(assetId, req.user?.userId!) as Asset

            // start the email analysis again with required datas
            let isRequiredDataExist = false;
            console.log(assetToUpdate.required_fields)
            for (const field of assetToUpdate?.required_fields || []) {
                isRequiredDataExist = !!(await checkValueRequired(assetData, field as keyof Asset, req.user?.userId!))
            }

            if (isRequiredDataExist) {
                const loaded = await googleService.loadCredentialsFromDatabase(req.user?.userId!);
                if (!loaded) {
                    return res.status(401).json({
                        success: false,
                        message: 'Not authenticated. Please connect Google account first.',
                    });
                }
                const emailData = await googleService.getEmailById(assetToUpdate.email_id!)
                const lockedAttachmentsPassword = await aiService.guessPassword(emailData?.subject!, emailData?.body!, req.user?.userId!, assetToUpdate)
                console.log('password :: ', lockedAttachmentsPassword)
                const emailWithAttachments = await googleService.getEmailWithAttachments(emailData?.id!, attachmentService, lockedAttachmentsPassword ? lockedAttachmentsPassword : undefined);
                await financialDataService.updateFinancialEmail(req.user?.userId!, assetId, {
                    emailId: emailData?.id!,
                    subject: emailData?.subject!,
                    from: emailData?.from!,
                    body: emailData?.body!,
                    date: emailData?.date!,
                    attachmentContents: emailWithAttachments.attachments,
                });
            }

            await financialDataService.updateAsset(
                assetId,
                req.user?.userId!,
                assetData
            );
            return res.status(200).json({ success: true, });
        } catch (error) {
            console.error('Error updating asset:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update asset',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);


const checkValueRequired = async (assetData: Asset, requiredField: keyof Asset | keyof User, userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (assetData[requiredField as keyof Asset] || user?.[requiredField as keyof User]) {
        return true;
    }
    return false;
}



/**
 * GET /asset-types
 * Retrieve all distinct asset types
 * 
 * @route GET /asset-types
 * @middleware authenticateJWT - Validates JWT token and extracts user ID
 * @returns {Object} 200 - Success response with array of asset types
 * @returns {Object} 500 - Server error with error message
 * 
 * @example
 * // Request
 * GET /api/vault/asset-types
 * Authorization: Bearer <token>
 * 
 * // Response
 * {
 *   "success": true,
 *   "data": ["asset", "liability", "insurance"]
 * }
 */
vaultRoutes.get(
    '/asset-types',
    authenticateJWT,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
        try {
            const assetTypes = await prisma.asset.groupBy({
                by: ['type'],
                where: {
                    user_id: req.user?.userId!
                }
            });

            const types = assetTypes.map(item => item.type);

            return res.status(200).json({
                success: true,
                data: types
            });
        } catch (error) {
            console.error('Error fetching asset types:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch asset types',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);


export default vaultRoutes;
