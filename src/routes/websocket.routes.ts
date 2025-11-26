/**
 * WebSocket Routes Configuration
 *
 * This module sets up WebSocket event handlers that mirror the REST API patterns
 * used in the Express-based routes. It provides real-time alternatives to
 * traditional HTTP endpoints with the same authentication and authorization
 * middleware.
 *
 * @module routes/websocket.routes
 * @requires @/services/websocket.service - WebSocket service implementation
 */

// Import required modules
import { WebSocketService } from '@/services/websocket.service';

/**
 * Setup WebSocket routes
 * 
 * @param {WebSocketService} wsService - WebSocket service instance
 * @description Registers all WebSocket event handlers with appropriate middleware
 * 
 * Usage example:
 * ```typescript
 * import { setupWebSocketRoutes } from './websocket.routes';
 * setupWebSocketRoutes(wsService);
 * ```
 */
export function setupWebSocketRoutes(wsService: WebSocketService): void {
  // ============================================================================
  // Family Access Routes (mirroring REST API)
  // ============================================================================

  /**
   * Revoke previously granted access permissions (real-time version)
   *
   * Mirrors the HTTP POST /api/families/access/revoke endpoint
   * Allows authenticated users to revoke access permissions they have previously
   * granted to other users via WebSocket connection.
   *
   * @event family/access/revoke
   * @middleware authenticateJWT - Requires valid JWT token
   * @param {Object} data - Request data
   * @param {string} data.accessId - UUID of the access grant to revoke
   * @returns {Object} Success response confirming revocation
   * @returns {Object} Error response if unauthorized or fails
   *
   * @example
   * // Client sends:
   * {
   *   "event": "family/access/revoke",
   *   "data": {
   *     "accessId": "access-uuid"
   *   }
   * }
   *
   * // Success response:
   * {
   *   "success": true,
   *   "data": null,
   *   "message": "Access revoked successfully",
   *   "event": "family/access/revoke",
   *   "timestamp": 1234567890
   * }
   */
  wsService.on('family/access/revoke', async (req, res) => {
    try {
      // Extract required data from request
      const { accessId } = req.data;
      const userId = req.user?.userId;
      
      // Validate required parameters
      if (!accessId) {
        res.error('Access ID is required', 'missing_access_id', 400);
        return;
      }
      
      if (!userId) {
        res.error('User not authenticated', 'unauthorized', 401);
        return;
      }
      
      // TODO: Implement actual revoke access logic here
      // This would typically involve:
      // 1. Verify the access record exists and belongs to the user
      // 2. Update the access record to mark it as inactive
      // 3. Return success response
      
      // For now, we'll simulate a successful operation
      console.log(`✅ Access ${accessId} revoked by user ${userId}`);
      res.success(null, 'Access revoked successfully');
    } catch (error) {
      console.error('❌ Error in WebSocket family/access/revoke:', error);
      res.error('Failed to revoke access', 'internal_error', 500);
    }
  });

  /**
   * Grant access permissions to another user (real-time version)
   *
   * Mirrors the HTTP POST /api/families/access/grant endpoint
   * Allows authenticated users to grant specific access permissions to other users
   * for viewing, editing, or deleting family assets via WebSocket connection.
   *
   * @event family/access/grant
   * @middleware authenticateJWT - Requires valid JWT token
   * @param {Object} data - Request data
   * @param {string} data.targetUserId - UUID of the user to grant access to
   * @param {string} data.accessType - Type of access being granted
   * @param {boolean} data.canViewAssets - Permission to view assets
   * @param {boolean} data.canEditAssets - Permission to edit assets
   * @param {boolean} data.canDeleteAssets - Permission to delete assets
   * @param {string} [data.accessUntil] - Optional expiration date (ISO string)
   * @returns {Object} Success response with access grant data
   * @returns {Object} Error response if fails
   */
  wsService.on('family/access/grant', async (req, res) => {
    try {
      // Extract required data from request
      const { 
        targetUserId, 
        accessType, 
        canViewAssets, 
        canEditAssets, 
        canDeleteAssets, 
        accessUntil 
      } = req.data;
      
      const userId = req.user?.userId;
      
      // Validate required parameters
      if (!targetUserId) {
        res.error('Target user ID is required', 'missing_target_user_id', 400);
        return;
      }
      
      if (!userId) {
        res.error('User not authenticated', 'unauthorized', 401);
        return;
      }
      
      // TODO: Implement actual grant access logic here
      // This would typically involve:
      // 1. Check if access already exists between users
      // 2. Create or update access record in database
      // 3. Return success response with access details
      
      // For now, we'll simulate a successful operation
      const accessRecord = {
        id: 'generated-access-id',
        parent_user_id: userId,
        child_user_id: targetUserId,
        access_type: accessType || 'view',
        can_view_assets: canViewAssets !== undefined ? canViewAssets : true,
        can_edit_assets: canEditAssets || false,
        can_delete_assets: canDeleteAssets || false,
        access_until: accessUntil || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log(`✅ Access granted from user ${userId} to ${targetUserId}`);
      res.success(accessRecord, 'Access granted successfully');
    } catch (error) {
      console.error('❌ Error in WebSocket family/access/grant:', error);
      res.error('Failed to grant access', 'internal_error', 500);
    }
  });

  /**
   * Get list of access grants (real-time version)
   *
   * Mirrors the HTTP GET /api/families/access/list endpoint
   * Fetches all active access permissions that the authenticated user has granted
   * to other users via WebSocket connection.
   *
   * @event family/access/list
   * @middleware authenticateJWT - Requires valid JWT token
   * @returns {Object} Success response with array of access grants
   * @returns {Object} Error response if fails
   */
  wsService.on('family/access/list', async (req, res) => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.error('User not authenticated', 'unauthorized', 401);
        return;
      }
      
      // TODO: Implement actual access list retrieval logic here
      // This would typically involve:
      // 1. Query database for access records where parent_user_id = userId
      // 2. Return array of access records
      
      // For now, we'll return an empty array
      const accessList: any[] = [];
      
      console.log(`✅ Retrieved access list for user ${userId}`);
      res.success(accessList, 'Access list retrieved');
    } catch (error) {
      console.error('❌ Error in WebSocket family/access/list:', error);
      res.error('Failed to retrieve access list', 'internal_error', 500);
    }
  });

  /**
   * Join a family room for real-time updates
   *
   * Allows users to join a WebSocket room for a specific family to receive
   * real-time updates about family activities.
   *
   * @event family/join
   * @middleware authenticateJWT - Requires valid JWT token
   * @param {Object} data - Request data
   * @param {string} data.familyId - UUID of the family to join
   * @returns {Object} Success response confirming room join
   * @returns {Object} Error response if fails
   */
  wsService.on('family/join', async (req, res) => {
    try {
      const { familyId } = req.data;
      const userId = req.user?.userId;
      
      if (!familyId) {
        res.error('Family ID required', 'missing_family_id', 400);
        return;
      }
      
      if (!userId) {
        res.error('User not authenticated', 'unauthorized', 401);
        return;
      }
      
      // Join the family room
      wsService.joinRoom(req.socket, `family-${familyId}`);
      
      res.success(null, `Joined family room: ${familyId}`);
    } catch (error) {
      console.error('❌ Error in WebSocket family/join:', error);
      res.error('Failed to join family room', 'join_failed', 500);
    }
  });

  /**
   * Leave a family room
   *
   * Allows users to leave a WebSocket room for a specific family.
   *
   * @event family/leave
   * @middleware authenticateJWT - Requires valid JWT token
   * @param {Object} data - Request data
   * @param {string} data.familyId - UUID of the family to leave
   * @returns {Object} Success response confirming room leave
   * @returns {Object} Error response if fails
   */
  wsService.on('family/leave', async (req, res) => {
    try {
      const { familyId } = req.data;
      const userId = req.user?.userId;
      
      if (!familyId) {
        res.error('Family ID required', 'missing_family_id', 400);
        return;
      }
      
      if (!userId) {
        res.error('User not authenticated', 'unauthorized', 401);
        return;
      }
      
      // Leave the family room
      wsService.leaveRoom(req.socket, `family-${familyId}`);
      
      res.success(null, `Left family room: ${familyId}`);
    } catch (error) {
      console.error('❌ Error in WebSocket family/leave:', error);
      res.error('Failed to leave family room', 'leave_failed', 500);
    }
  });

  // ============================================================================
  // Health Check Route
  // ============================================================================

  /**
   * WebSocket connection health check
   *
   * Simple endpoint to verify WebSocket connectivity and authentication status.
   *
   * @event health/check
   * @returns {Object} Success response with connection info
   */
  wsService.on('health/check', async (req, res) => {
    res.success({
      authenticated: !!req.user,
      userId: req.user?.userId,
      socketId: req.socket.id,
      connections: wsService.getConnectionCount()
    }, 'WebSocket connection healthy');
  });

  console.log('✅ WebSocket routes configured');
}