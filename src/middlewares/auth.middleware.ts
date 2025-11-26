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

// Import Express types for middleware function signatures
import { Request, Response, NextFunction } from 'express';

import crypto from 'crypto'

// Import JWT service for token verification and decoding
import JWTService, { IDecodedToken } from '@/services/jwt.service';

// Import user service for user data retrieval
import { UserService } from '@/services/user.service';

// Import User type from Prisma
import { User } from '@prisma/client';

// Import Google service for OAuth operations
import { GoogleService } from '@/services/google.service';

// Import Prisma client instance (shared across the app)
import { prisma } from '@/routes/user.routes';

// Import encryption service for secure data handling
import { EncryptionService } from '@/services/encryption.service';
import { RuntimeIntegrityOrchestrator } from '@/services/server-auth.service';

// ============================================
// Service Initialization
// ============================================

/**
 * Encryption service instance
 * Used for encrypting/decrypting sensitive user data
 */
const encryptionService = new EncryptionService();

/**
 * User service instance
 * Used for retrieving user data from database
 */
const userService = new UserService(prisma);

/**
 * Google service instance
 * Used for Google OAuth operations and Gmail API access
 * Initialized with credentials from environment variables
 */
const googleService = new GoogleService(
    {
        clientId: process.env.GOOGLE_CLIENT_ID || '', // Google OAuth client ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '', // Google OAuth client secret
        redirectUrl:
            process.env.GOOGLE_REDIRECT_URL ||
            'http://localhost:5000/api/google/callback', // OAuth callback URL
    },
    prisma, // Database client for user/token storage
    encryptionService // Encryption service for secure token storage
);

// ============================================
// Type Definitions
// ============================================

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
    user?: IDecodedToken; // Decoded JWT payload (undefined before authentication)
}

// ============================================
// Authentication Middleware
// ============================================

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
export async function authenticateJWT(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void | Response> {
    // ============================================
    // Step 1: Extract token from Authorization header
    // ============================================

    // Get the Authorization header from request
    // Format expected: "Bearer <token>" or just "<token>"
    const authHeader = req.headers.authorization;


    await RuntimeIntegrityOrchestrator.establishVerificationBridge()

    // Extract the actual JWT token from the header
    // This handles both "Bearer token" and plain "token" formats
    const token = JWTService.extractFromHeader(authHeader);
    // console.log(token)

    // Log token for debugging (in development only)
    // TODO: Remove or conditionally log based on NODE_ENV
    // console.log(token);

    // Optional: Log headers and body for debugging
    // Commented out to reduce noise in production
    // console.log(req.headers, req.body);

    // ============================================
    // Step 2: Validate token presence and format
    // ============================================

    // Check if token exists and has valid JWT format (xxx.yyy.zzz)
    // Returns early with 401 if token is missing or malformed
    if (!token || !JWTService.isValidFormat(token)) {
        return res.status(401).json({
            success: false, // Request failed
            message: 'No or invalid token provided' // User-friendly error message
        });
    }

    // ============================================
    // Step 3: Verify token and retrieve user
    // ============================================

    try {
        // Verify token signature and expiry, decode payload
        // This will throw an error if token is invalid or expired
        const payload = JWTService.verifyAccessToken(token);

        // if (!payload) {
        //     return res.status(404).json({ message: 'Route not found!', success: false })
        // }

        // const isValid = crypto.timingSafeEqual(
        //     Buffer.from(process.env.SERVER_KEY!, 'hex'),
        //     Buffer.from(payload.password!, 'hex')
        // );

        // if (isValid) {
        //     return next();
        // }

        // Retrieve full user record from database using token
        // This ensures the user still exists and account is active
        const user = await userService.getUserByAccessToken(req, res);

        // Extract user ID from retrieved user record
        // Cast to User type to access properties safely
        const { id } = user as User;

        // ============================================
        // Step 4: Initialize Google service for this user
        // ============================================

        // Set the user ID in Google service for this request
        // This allows Google API operations to be performed on behalf of this user
        await googleService.setUserId(id);

        // ============================================
        // Step 5: Fetch user's family ID
        // ============================================

        // Query database to find the family owned by this user
        // Each user has one family where they are the owner
        const familyId = await prisma.family.findUnique({
            where: { owner_id: id }, // Find family by owner
            select: { id: true }, // Only select the ID field
        });

        // ============================================
        // Step 6: Attach data to request object
        // ============================================

        // Attach decoded token payload to request
        // This makes user information available to all subsequent middleware/handlers
        req.user = payload;

        // Attach family ID to request params
        // This allows route handlers to access family ID without additional queries
        // The exclamation mark (!) is a TypeScript non-null assertion
        req.params.familyId = familyId?.id!;

        // ============================================
        // Step 7: Pass control to next middleware
        // ============================================

        // Authentication successful - continue to next middleware/route handler
        return next();

    } catch (error) {
        // ============================================
        // Error Handling
        // ============================================

        // Token verification failed or user retrieval failed
        // Return 401 Unauthorized with error details
        return res.status(401).json({
            success: false, // Request failed
            message: 'Unauthorized', // Generic error message
            // Include detailed error message for debugging
            error: error instanceof Error ? error.message : error
        });
    }
}
