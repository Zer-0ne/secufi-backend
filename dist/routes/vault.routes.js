/**
 * Vault Routes Module
 * Handles asset management operations including retrieval, status updates, and modifications
 */
import { authenticateJWT } from "@/middlewares/auth.middleware";
import { AIService } from "@/services/ai.service";
import { EncryptionService } from "@/services/encryption.service";
import { FinancialDataService } from "@/services/financial-data.service";
import { GmailAttachmentService } from "@/services/gmail-attachment.service";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
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
const vaultRoutes = Router();
// ============================================================================
// Routes
// ============================================================================
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
 *     { "id": "asset2", "name": "Vehicle", "status": "pending", "value": 50000 }
 *   ]
 * }
 */
vaultRoutes.get('/get-assets/', authenticateJWT, async (req, res) => {
    try {
        const assets = await financialDataService.getAssetsByUserId(req.user?.userId);
        return res.status(200).json({ success: true, data: assets });
    }
    catch (error) {
        console.error('Error fetching assets:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch assets',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
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
vaultRoutes.get('/get-asset/:assetId', authenticateJWT, async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const asset = await financialDataService.getAssetById(assetId, req.user?.userId);
        return res.status(200).json({ success: true, data: asset });
    }
    catch (error) {
        console.error('Error fetching asset:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch asset',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
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
 * - active, inactive, pending, approved, rejected
 * - under_review, needs_attention, verified, unverified
 * - flagged, escalated, resolved, closed, open
 * - in_progress, on_hold, completed, canceled
 * - draft, submitted, processing
 */
vaultRoutes.patch('/status-asset/:assetId', authenticateJWT, async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const { status } = req.body;
        // Allowed asset statuses
        const allowedStatus = [
            'active', 'inactive', 'pending', 'approved', 'rejected',
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
        const approvedAsset = await financialDataService.approveAsset(assetId, req.user?.userId, status);
        return res.status(200).json({ success: true, data: approvedAsset });
    }
    catch (error) {
        console.error('Error approving asset:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to approve asset',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
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
vaultRoutes.put('/edit-asset/:assetId', authenticateJWT, async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const assetData = req.body;
        const updatedAsset = await financialDataService.updateAsset(assetId, req.user?.userId, assetData);
        return res.status(200).json({ success: true, data: updatedAsset });
    }
    catch (error) {
        console.error('Error updating asset:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update asset',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
export default vaultRoutes;
//# sourceMappingURL=vault.routes.js.map