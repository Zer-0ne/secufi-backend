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
// Import bcrypt for secure password hashing
import bcrypt from 'bcryptjs';
// Import JWT service for token operations
import JWTService from './jwt.service.js';
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
export class UserService {
    /**
     * Prisma client instance for database operations
     * @private
     * @type {PrismaClient}
     */
    prisma;
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
    constructor(prisma) {
        // Store Prisma client for database operations
        this.prisma = prisma;
    }
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
    async createOrGetUser(data) {
        try {
            // Normalize email to lowercase and remove whitespace
            // This ensures consistent email matching regardless of input format
            const email = data.email.toLowerCase().trim();
            // Check if user exists by email (primary identifier)
            let user = await this.prisma.user.findUnique({
                where: { email }, // Email is unique in database
                include: {
                    owned_family: true, // Include family owned by this user
                },
            });
            // If user found by email, return existing user
            if (user) {
                console.log(`✓ User already exists: ${email}`);
                return { user, isNewUser: false, hadTempData: false };
            }
            // Check if user exists by Google ID (if provided)
            // This handles cases where user signed up with different email but same Google account
            if (data.google_id) {
                user = await this.prisma.user.findUnique({
                    where: { google_id: data.google_id }, // Google ID is unique
                    include: {
                        owned_family: true, // Include owned family
                    },
                });
                // If user found by Google ID, return existing user
                if (user) {
                    console.log(`✓ User already exists with google_id: ${data.google_id}`);
                    return { user, isNewUser: false, hadTempData: false };
                }
            }
            // Phone-based lookup is currently disabled
            // Uncomment if phone should be a unique identifier
            // NO needs for this code
            // Check if user exists by phone
            // if (data.phone) {
            //   user = await this.prisma.user.findFirst({
            //     where: { phone: data.phone },
            //     include: {
            //       owned_family: true,
            //     },
            //   });
            //   if (user) {
            //     console.log(`✓ User already exists with phone: ${data.phone}`);
            //     return { user, isNewUser: false, hadTempData: false };
            //   }
            // }
            // Hash password if provided (for traditional email/password signup)
            let hashedPassword = null;
            if (data.password) {
                // Use bcrypt with 10 salt rounds (good balance of security and performance)
                hashedPassword = await bcrypt.hash(data.password, 10);
            }
            // Merge temp user data (from invitation) with provided data
            // Temp data takes lower priority than explicitly provided values
            const finalName = data.name || data.tempUserData?.name || null;
            const finalPhone = data.phone || data.tempUserData?.phone || null;
            // Create new user and their family in a transaction
            // Transaction ensures all-or-nothing: if any step fails, everything rolls back
            const result = await this.prisma.$transaction(async (tx) => {
                // Step 1: Create the user record
                const newUser = await tx.user.create({
                    data: {
                        email, // Normalized email
                        name: finalName, // Display name
                        password: hashedPassword, // Hashed password (null for OAuth users)
                        user_type: data.user_type || 'parent', // Default to parent type
                        phone: finalPhone, // Phone number
                        google_id: data.google_id || null, // Google account ID
                        google_email: data.google_email || null, // Google email
                        profile_picture: data.profile_picture || null, // Profile image URL
                        is_google_user: !!data.google_id, // Flag if signed up via Google
                        role: 'user', // System role (vs family role)
                        is_active: true, // Activate account immediately
                    },
                });
                // Step 2: Create the user's personal family
                // Generate friendly family name from user's name or email
                const familyName = finalName
                    ? `${finalName}'s Family` // Use name if available
                    : `${email.split('@')[0]}'s Family`; // Otherwise use email prefix
                const newFamily = await tx.family.create({
                    data: {
                        name: familyName, // Family display name
                        description: 'Personal family group', // Default description
                        owner_id: newUser.id, // Link to user as owner
                    },
                });
                // Step 3: Create family member entry for owner
                // This gives the owner full permissions in their own family
                await tx.familyMember.create({
                    data: {
                        family_id: newFamily.id, // Link to created family
                        user_id: newUser.id, // Link to created user
                        role: 'owner', // Owner role with full access
                        can_view: true, // Can view all family data
                        can_edit: true, // Can edit family data
                        can_delete: true, // Can delete family data
                        can_invite: true, // Can invite new members
                        is_active: true, // Active membership
                    },
                });
                // Step 4: Create default family settings
                // These are sensible defaults that can be customized later
                await tx.familySettings.create({
                    data: {
                        family_id: newFamily.id, // Link to created family
                        can_share_assets: true, // Allow asset sharing by default
                        can_view_others: true, // Members can view each other's data
                        require_approval: false, // Don't require approval for actions
                        currency: 'INR', // Default to Indian Rupee
                        financial_year_start: '01-04', // April 1st (Indian fiscal year)
                        notify_large_transactions: true, // Enable large transaction notifications
                        large_transaction_threshold: 100000, // 1 lakh INR threshold
                    },
                });
                // Step 5: Create default family roles
                // These roles provide different permission levels for family members
                const defaultRoles = [
                    {
                        name: 'owner',
                        description: 'Full access to all family features',
                        permissions: {
                            view_assets: true, // Can view all assets
                            create_assets: true, // Can create new assets
                            edit_assets: true, // Can edit existing assets
                            delete_assets: true, // Can delete assets
                            manage_members: true, // Can add/remove members
                            approve_transactions: true, // Can approve transactions
                            export_data: true, // Can export family data
                        },
                    },
                    {
                        name: 'admin',
                        description: 'Manage family members and assets',
                        permissions: {
                            view_assets: true, // Can view all assets
                            create_assets: true, // Can create new assets
                            edit_assets: true, // Can edit existing assets
                            delete_assets: false, // Cannot delete assets
                            manage_members: true, // Can manage members
                            approve_transactions: true, // Can approve transactions
                            export_data: true, // Can export data
                        },
                    },
                    {
                        name: 'member',
                        description: 'View and create assets',
                        permissions: {
                            view_assets: true, // Can view assets
                            create_assets: true, // Can create assets
                            edit_assets: false, // Cannot edit assets
                            delete_assets: false, // Cannot delete assets
                            manage_members: false, // Cannot manage members
                            approve_transactions: false, // Cannot approve transactions
                            export_data: false, // Cannot export data
                        },
                    },
                    {
                        name: 'viewer',
                        description: 'View-only access',
                        permissions: {
                            view_assets: true, // Can only view assets
                            create_assets: false, // Cannot create assets
                            edit_assets: false, // Cannot edit assets
                            delete_assets: false, // Cannot delete assets
                            manage_members: false, // Cannot manage members
                            approve_transactions: false, // Cannot approve transactions
                            export_data: false, // Cannot export data
                        },
                    },
                ];
                // Create each default role in the database
                for (const role of defaultRoles) {
                    await tx.familyRole.create({
                        data: {
                            family_id: newFamily.id, // Link to created family
                            name: role.name, // Role name
                            description: role.description, // Role description
                            permissions: role.permissions, // Role permissions object
                            is_default: true, // Mark as default role
                        },
                    });
                }
                // Step 6: Handle invitation acceptance if temp data provided
                // If user was invited to another family before signing up, add them now
                if (data.tempUserData?.invited_by_family_id) {
                    const invitedFamilyId = data.tempUserData.invited_by_family_id;
                    const invitedRole = data.tempUserData.invited_role || 'member'; // Default to member role
                    console.log(`✓ Adding user to invited family: ${invitedFamilyId}`);
                    // Add user as member of the invited family
                    await tx.familyMember.create({
                        data: {
                            family_id: invitedFamilyId, // The family they were invited to
                            user_id: newUser.id, // The newly created user
                            role: invitedRole, // Role from invitation
                            // Set permissions based on invited role
                            can_view: true, // All roles can view
                            can_edit: invitedRole === 'admin' || invitedRole === 'owner', // Admin+ can edit
                            can_delete: invitedRole === 'owner', // Only owner can delete
                            can_invite: invitedRole === 'admin' || invitedRole === 'owner', // Admin+ can invite
                            is_active: true, // Active membership
                        },
                    });
                    // Update invitation status to accepted if invitation ID provided
                    if (data.tempUserData.invitation_id) {
                        await tx.familyInvitation.update({
                            where: { id: data.tempUserData.invitation_id }, // Find invitation
                            data: {
                                status: 'accepted', // Mark as accepted
                                accepted_at: new Date(), // Record acceptance time
                                invited_user_id: newUser.id, // Link to user who accepted
                            },
                        });
                    }
                }
                // Log successful user and family creation
                console.log(`✅ New user created: ${email}`);
                console.log(`✅ Family created: ${newFamily.id} (${familyName})`);
                // Return user with their owned family included
                // Use findUniqueOrThrow to ensure user still exists (should always be true)
                return await tx.user.findUniqueOrThrow({
                    where: { id: newUser.id }, // Find by ID
                    include: {
                        owned_family: true, // Include the family we just created
                    },
                });
            });
            // Return successful result
            return {
                user: result, // The created user with family
                isNewUser: true, // Flag that this is a new user
                hadTempData: !!data.tempUserData, // Flag if invitation data was used
            };
        }
        catch (error) {
            // Log error for debugging
            console.error('❌ Error in createOrGetUser:', error);
            // Check for unique constraint violation
            // This shouldn't happen due to our checks, but handle it gracefully
            if (error instanceof Error && error.message.includes('Unique constraint')) {
                throw new Error('User already has a family. Each user can only own one family.');
            }
            // Throw generic error for other failures
            throw new Error('Failed to create or get user');
        }
    }
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
    async getUserById(userId) {
        try {
            // Query database for user by primary key
            const user = await this.prisma.user.findUnique({
                where: { id: userId }, // ID is unique
            });
            // Return user or null if not found
            return user;
        }
        catch (error) {
            // Log error and return null (don't throw to allow graceful handling)
            console.error('Error getting user by ID:', error);
            return null;
        }
    }
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
    async getUserByEmail(email) {
        try {
            // Normalize email before lookup (lowercase and trim)
            // Query database for user by email
            const user = await this.prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() }, // Email is unique
            });
            // Return user or null if not found
            return user;
        }
        catch (error) {
            // Log error and return null
            console.error('Error getting user by email:', error);
            return null;
        }
    }
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
    async getUserByGoogleId(googleId) {
        try {
            // Query database for user by Google ID
            const user = await this.prisma.user.findUnique({
                where: { google_id: googleId }, // Google ID is unique
            });
            // Return user or null if not found
            return user;
        }
        catch (error) {
            // Log error and return null
            console.error('Error getting user by google_id:', error);
            return null;
        }
    }
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
    async getUserByAccessToken(req, res) {
        try {
            // Extract Authorization header from request
            const authHeader = req.headers.authorization;
            // Extract JWT token from header (handles "Bearer <token>" format)
            const token = JWTService.extractFromHeader(authHeader);
            // Decode token to get userId (without verification - just reading payload)
            // Note: The exclamation marks are TypeScript non-null assertions
            const userId = JWTService.decode(token).userId;
            // Query database for user by ID from token
            const user = await this.prisma.user.findUnique({
                where: { id: userId.toString() }, // Convert to string if needed
            });
            // If user not found, return false
            if (!user) {
                return false;
            }
            // Return the authenticated user
            return user;
        }
        catch (error) {
            // Log error and return false
            console.error('Error getting user by access token:', error.message);
            return false;
        }
    }
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
    async updateUser(userId, data) {
        try {
            // Update user record with provided data
            const user = await this.prisma.user.update({
                where: { id: userId }, // Find user by ID
                data: {
                    ...data, // Spread provided fields
                    updated_at: new Date(), // Always update timestamp
                },
            });
            // Return updated user
            return user;
        }
        catch (error) {
            // Log error and return null
            console.error('Error updating user:', error);
            return null;
        }
    }
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
    formatUserResponse(user) {
        // Return object with selected fields, excluding sensitive data
        return {
            id: user.id, // User ID
            email: user.email, // Email (non-null assertion since email is required)
            name: user.name, // Display name
            user_type: user.user_type, // User type (parent/family)
            role: user.role, // System role
            is_verified: user.is_verified, // Email verification status
            is_active: user.is_active, // Account active status
            phone: user.phone, // Phone number
            profile_picture: user.profile_picture, // Profile picture URL
            created_at: user.created_at.toISOString(), // Creation timestamp as ISO string
            updated_at: user.updated_at.toISOString(), // Update timestamp as ISO string
        };
    }
}
//# sourceMappingURL=user.service.js.map