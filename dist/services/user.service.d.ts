/**
 * @fileoverview User service for managing user lifecycle and operations
 * @description This service handles all user-related operations including:
 * - User creation with automatic family initialization
 * - User retrieval by various identifiers (ID, email, Google ID, access token)
 * - User profile updates
 * - Family invitation handling during user registration
 * - Integration with temporary user data from invitations
 *
 * Key features:
 * - Atomic user + family creation using Prisma transactions
 * - Automatic family setup with default roles and settings
 * - Support for Google OAuth authentication
 * - Password hashing with bcryptjs
 * - Invitation acceptance during signup
 * - Normalized email handling (lowercase, trimmed)
 *
 * @module services/user
 * @requires @prisma/client - Database ORM
 * @requires bcryptjs - Password hashing
 * @requires express - HTTP request/response types
 *
 * @author Secufi Team
 * @version 1.0.0
 */
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { PrismaClient, User } from '@prisma/client';
import { Response } from 'express';
import { TempUserData } from '../middlewares/temp-user.middleware.js';
/**
 * User Service Class
 *
 * @class UserService
 * @description Service responsible for user lifecycle operations and family initialization.
 *
 * Core responsibilities:
 * - Create new users or fetch existing ones by email, Google ID, or phone
 * - Initialize the user's primary family and default roles/settings on first creation
 * - Attach users to invited families when temp invitation data is present
 * - Retrieve users by various identifiers and via access tokens
 * - Update user profile fields in a safe, typed manner
 * - Format user data for API responses
 *
 * Transaction safety:
 * - All write operations use Prisma transactions where multiple tables are affected
 * - Ensures data integrity for user, family, member, roles, and settings
 *
 * Security features:
 * - Passwords are hashed using bcryptjs (10 rounds)
 * - Email comparisons are normalized (lowercase, trimmed) to avoid duplicates
 * - Sensitive data (passwords) excluded from API responses
 *
 * @example
 * // Initialize service with Prisma client
 * const userService = new UserService(prisma);
 *
 * // Create or get user
 * const result = await userService.createOrGetUser({
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   password: 'secure-password'
 * });
 */
export declare class UserService {
    /**
     * Prisma client instance for database operations
     * @private
     * @type {PrismaClient}
     */
    private prisma;
    /**
     * Construct the UserService
     *
     * @constructor
     * @param {PrismaClient} prisma - Prisma client instance scoped to the current request or application
     *
     * @example
     * // Create service instance
     * const userService = new UserService(prisma);
     */
    constructor(prisma: PrismaClient);
    /**
     * Create a user if one does not already exist, otherwise return the existing user
     *
     * @async
     * @method createOrGetUser
     * @param {Object} data - User creation data
     * @param {string} data.email - Required email; normalized to lowercase and trimmed
     * @param {string} [data.name] - Optional display name; falls back to temp user data if provided
     * @param {string} [data.password] - Optional raw password; will be hashed if present
     * @param {'parent' | 'family'} [data.user_type] - Optional user type; defaults to 'parent'
     * @param {string} [data.phone] - Optional phone; falls back to temp user data if provided
     * @param {string} [data.google_id] - Optional Google account identifier
     * @param {string} [data.google_email] - Optional Google account email
     * @param {string} [data.profile_picture] - Optional profile image URL
     * @param {TempUserData} [data.tempUserData] - Optional temp/invitation context for post-signup linkage
     *
     * @returns {Promise<Object>} Result object containing:
     * @returns {User} user - The up-to-date User (includes owned_family)
     * @returns {boolean} isNewUser - True if a new user was created; false if an existing user was found
     * @returns {boolean} hadTempData - True if tempUserData was provided and applied
     *
     * @throws {Error} If creation fails or violates constraints
     *
     * @description
     * Matching precedence:
     * 1. Email (required)
     * 2. Google ID (optional)
     * 3. Phone (optional - currently commented out)
     *
     * On first creation:
     * - A single personal family is created with the user as the owner
     * - Default family settings and roles (owner/admin/member/viewer) are seeded
     * - If provided, temp invitation info is applied to join an invited family and mark
     *   the invitation as accepted
     *
     * @example
     * // Create user with email and password
     * const result = await userService.createOrGetUser({
     *   email: 'user@example.com',
     *   name: 'John Doe',
     *   password: 'secure-password'
     * });
     *
     * @example
     * // Create user from Google OAuth
     * const result = await userService.createOrGetUser({
     *   email: 'user@gmail.com',
     *   name: 'Jane Smith',
     *   google_id: 'google-account-id',
     *   google_email: 'user@gmail.com',
     *   profile_picture: 'https://...'
     * });
     *
     * @example
     * // Create user with invitation data
     * const result = await userService.createOrGetUser({
     *   email: 'invited@example.com',
     *   tempUserData: {
     *     invitation_id: 'inv-123',
     *     invited_by_family_id: 'family-456',
     *     invited_role: 'member',
     *     name: 'Invited User',
     *     phone: '+1234567890'
     *   }
     * });
     */
    createOrGetUser(data: {
        email: string;
        name?: string;
        password?: string;
        user_type?: 'parent' | 'family';
        phone?: string;
        google_id?: string;
        google_email?: string;
        profile_picture?: string;
        tempUserData?: TempUserData;
    }): Promise<{
        user: Partial<User>;
        isNewUser: boolean;
        hadTempData: boolean;
    }>;
    /**
     * Fetch a user by unique identifier
     *
     * @async
     * @method getUserById
     * @param {string} userId - The user's unique ID
     * @returns {Promise<User | null>} The User if found, otherwise null
     *
     * @example
     * // Get user by ID
     * const user = await userService.getUserById('user-123');
     * if (user) {
     *   console.log('Found user:', user.email);
     * }
     */
    getUserById(userId: string): Promise<User | null>;
    /**
     * Fetch a user by email
     *
     * @async
     * @method getUserByEmail
     * @param {string} email - The user's email (case-insensitive)
     * @returns {Promise<User | null>} The User if found, otherwise null
     *
     * @description Email is normalized (lowercased, trimmed) before lookup
     *
     * @example
     * // Get user by email
     * const user = await userService.getUserByEmail('USER@EXAMPLE.COM');
     * if (user) {
     *   console.log('Email normalized to:', user.email); // user@example.com
     * }
     */
    getUserByEmail(email: string): Promise<User | null>;
    /**
     * Fetch a user by Google ID
     *
     * @async
     * @method getUserByGoogleId
     * @param {string} googleId - The Google account identifier
     * @returns {Promise<User | null>} The User if found, otherwise null
     *
     * @example
     * // Get user by Google ID
     * const user = await userService.getUserByGoogleId('google-account-123');
     * if (user) {
     *   console.log('Google user:', user.google_email);
     * }
     */
    getUserByGoogleId(googleId: string): Promise<User | null>;
    /**
     * Resolve a user from an HTTP Authorization header containing a JWT access token
     *
     * @async
     * @method getUserByAccessToken
     * @param {AuthenticatedRequest} req - Express request with Authorization header
     * @param {Response} res - Express response (unused directly; included for signature parity)
     * @returns {Promise<User | boolean>} The User if found; otherwise false if token invalid or user missing
     *
     * @description
     * Process:
     * 1. Extracts the token from the Authorization header using the JWT service
     * 2. Decodes the token to read the embedded userId
     * 3. Fetches the user by ID
     *
     * @example
     * // In middleware or route handler
     * const user = await userService.getUserByAccessToken(req, res);
     * if (user === false) {
     *   return res.status(401).json({ error: 'Invalid token' });
     * }
     * console.log('Authenticated user:', user.email);
     */
    getUserByAccessToken(req: AuthenticatedRequest, res: Response): Promise<User | boolean>;
    /**
     * Update mutable user profile fields
     *
     * @async
     * @method updateUser
     * @param {string} userId - The user to update
     * @param {Object} data - Partial set of fields to update
     * @param {string} [data.name] - User's display name
     * @param {string} [data.phone] - User's phone number
     * @param {string} [data.address] - User's address
     * @param {Date} [data.date_of_birth] - User's date of birth
     * @param {string} [data.profile_picture] - Profile picture URL
     * @param {boolean} [data.is_verified] - Email verification status
     * @param {boolean} [data.is_active] - Account active status
     * @returns {Promise<User | null>} The updated User if successful; otherwise null
     *
     * @description
     * Automatically sets `updated_at` to the current time.
     * Allowed fields include:
     * - name, phone, address, date_of_birth, profile_picture, is_verified, is_active
     *
     * @example
     * // Update user profile
     * const updated = await userService.updateUser('user-123', {
     *   name: 'New Name',
     *   phone: '+1234567890',
     *   is_verified: true
     * });
     *
     * @example
     * // Update profile picture
     * const updated = await userService.updateUser('user-123', {
     *   profile_picture: 'https://example.com/photo.jpg'
     * });
     */
    updateUser(userId: string, data: Partial<{
        name: string;
        phone: string;
        address: string;
        date_of_birth: Date;
        profile_picture: string;
        is_verified: boolean;
        is_active: boolean;
    }>): Promise<User | null>;
    /**
     * Produce a sanitized, API-friendly representation of a user
     *
     * @method formatUserResponse
     * @param {User} user - The Prisma User record
     * @returns {Object} A plain object safe for API responses
     *
     * @description
     * - Converts date fields to ISO strings
     * - Omits sensitive properties (e.g., password)
     * - Includes only necessary fields for API responses
     *
     * @example
     * // Format user for API response
     * const user = await userService.getUserById('user-123');
     * const formatted = userService.formatUserResponse(user);
     * res.json(formatted);
     *
     * @example
     * // Returns structure like:
     * {
     *   id: 'user-123',
     *   email: 'user@example.com',
     *   name: 'John Doe',
     *   user_type: 'parent',
     *   role: 'user',
     *   is_verified: true,
     *   is_active: true,
     *   phone: '+1234567890',
     *   profile_picture: 'https://...',
     *   created_at: '2024-01-01T00:00:00.000Z',
     *   updated_at: '2024-01-01T00:00:00.000Z'
     * }
     */
    formatUserResponse(user: User): {
        id: string;
        email: string;
        name: string | null;
        user_type: string | null;
        role: string | null;
        is_verified: boolean;
        is_active: boolean;
        phone: string | null;
        profile_picture: string | null;
        created_at: string;
        updated_at: string;
    };
}
//# sourceMappingURL=user.service.d.ts.map