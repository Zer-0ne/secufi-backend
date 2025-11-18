/**
 * @fileoverview Authentication middleware for JWT token verification
 * @description This middleware provides JWT-based authentication for protected routes.
 * It verifies access tokens, extracts user information, and attaches user data to requests.
 *
 * Key features:
 * - JWT token extraction from Authorization header
 * - Token format validation
 * - Token signature verification
 * - User existence validation
 * - Family ID automatic injection
 * - Google service initialization per request
 *
 * @module middlewares/auth
 * @requires express - Express types for request/response
 * @requires @/services/jwt.service - JWT token operations
 * @requires @/services/user.service - User data retrieval
 * @requires @/services/google.service - Google OAuth operations
 * @requires @/services/encryption.service - Data encryption
 * @requires @prisma/client - Database types
 *
 * @author Secufi Team
 * @version 1.0.0
 */
import { Request, Response, NextFunction } from 'express';
import { IDecodedToken } from '../services/jwt.service.js';
/**
 * Extended Express Request with authenticated user information
 *
 * @interface AuthenticatedRequest
 * @extends {Request}
 * @description Extends the standard Express Request to include decoded JWT payload.
 * This interface is used in all protected routes after authentication middleware.
 *
 * @property {IDecodedToken} [user] - Decoded JWT payload containing user information
 * @property {string} user.userId - Unique identifier of the authenticated user
 * @property {string} user.email - Email address of the authenticated user
 * @property {string} user.role - Role of the authenticated user
 * @property {number} user.iat - Token issued at timestamp
 * @property {number} user.exp - Token expiration timestamp
 *
 * @example
 * // Use in route handlers
 * router.get('/protected', authenticateJWT, (req: AuthenticatedRequest, res) => {
 *   const userId = req.user?.userId;
 *   res.json({ userId });
 * });
 */
export interface AuthenticatedRequest extends Request {
    user?: IDecodedToken;
}
/**
 * JWT authentication middleware
 *
 * @async
 * @function authenticateJWT
 * @param {AuthenticatedRequest} req - Express request object (will be extended with user data)
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function to pass control to next middleware
 * @returns {Promise<void | Response>} Calls next() on success, returns error response on failure
 *
 * @description
 * Authenticates incoming requests by verifying JWT access tokens.
 *
 * Authentication flow:
 * 1. Extract token from Authorization header
 * 2. Validate token format (JWT structure)
 * 3. Verify token signature and expiry
 * 4. Retrieve user from database using token payload
 * 5. Initialize Google service with user ID
 * 6. Fetch user's family ID
 * 7. Attach decoded payload and family ID to request
 * 8. Pass control to next middleware/route handler
 *
 * On success:
 * - req.user is populated with decoded token payload
 * - req.params.familyId is populated with user's family ID
 * - Control passes to next middleware
 *
 * On failure:
 * - Returns 401 Unauthorized with error message
 * - Request is terminated
 *
 * @throws {401} If token is missing, invalid, expired, or user not found
 *
 * @example
 * // Protect a route with authentication
 * import { authenticateJWT } from './middlewares/auth.middleware';
 *
 * router.get('/api/protected', authenticateJWT, (req: AuthenticatedRequest, res) => {
 *   // User is authenticated at this point
 *   const userId = req.user?.userId;
 *   const familyId = req.params.familyId;
 *   res.json({ userId, familyId });
 * });
 *
 * @example
 * // Multiple middleware chaining
 * router.post(
 *   '/api/family/assets',
 *   authenticateJWT,  // First: Authenticate
 *   validateAsset,    // Second: Validate request
 *   createAsset       // Third: Handle request
 * );
 */
export declare function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response>;
//# sourceMappingURL=auth.middleware.d.ts.map