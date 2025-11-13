import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { PrismaClient, User } from '@prisma/client';
import { Response } from 'express';
import { TempUserData } from '../middlewares/temp-user.middleware.js';
/**
 * Service responsible for user lifecycle operations and related family initialization.
 *
 * Responsibilities:
 * - Create a new user or fetch an existing one by email, Google ID, or phone.
 * - Initialize the user's primary family and default roles/settings on first creation.
 * - Attach the user to an invited family when temp invitation data is present.
 * - Retrieve users by various identifiers and via access tokens.
 * - Update user profile fields in a safe, typed manner.
 *
 * Notes:
 * - All write operations use Prisma transactions where multiple tables are affected,
 *   ensuring data integrity for user, family, member, roles, and settings.
 * - Passwords, when present, are hashed using bcryptjs.
 * - Email comparisons are normalized to lowercase and trimmed to avoid duplicates.
 */
export declare class UserService {
    private prisma;
    /**
     * Construct the UserService.
     *
     * @param prisma Prisma client instance scoped to the current request or application.
     */
    constructor(prisma: PrismaClient);
    /**
     * Create user or return existing user
     */
    /**
     * Create a user if one does not already exist, otherwise return the existing user.
     *
     * Matching precedence:
     * 1) Email (required)
     * 2) Google ID (optional)
     * 3) Phone (optional)
     *
     * On first creation:
     * - A single personal family is created with the user as the owner.
     * - Default family settings and roles (owner/admin/member/viewer) are seeded.
     * - If provided, temp invitation info is applied to join an invited family and mark
     *   the invitation as accepted.
     *
     * @param data.email Required email; normalized to lowercase and trimmed.
     * @param data.name Optional display name; falls back to temp user data if provided.
     * @param data.password Optional raw password; will be hashed if present.
     * @param data.user_type Optional user type; defaults to 'parent'.
     * @param data.phone Optional phone; falls back to temp user data if provided.
     * @param data.google_id Optional Google account identifier.
     * @param data.google_email Optional Google account email.
     * @param data.profile_picture Optional profile image URL.
     * @param data.tempUserData Optional temp/invitation context for post-signup linkage.
     *
     * @returns An object with:
     *  - user: the up-to-date `User` (includes `owned_family`)
     *  - isNewUser: true if a new user was created; false if an existing user was found
     *  - hadTempData: true if tempUserData was provided and applied
     *
     * @throws Error with a user-friendly message if creation fails or violates constraints.
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
        user: User;
        isNewUser: boolean;
        hadTempData: boolean;
    }>;
    /**
     * Get user by ID
     */
    /**
     * Fetch a user by unique identifier.
     *
     * @param userId The user's unique ID.
     * @returns The `User` if found, otherwise `null`.
     */
    getUserById(userId: string): Promise<User | null>;
    /**
     * Get user by email
     */
    /**
     * Fetch a user by email. Email is normalized (lowercased, trimmed).
     *
     * @param email The user's email (case-insensitive).
     * @returns The `User` if found, otherwise `null`.
     */
    getUserByEmail(email: string): Promise<User | null>;
    /**
     * Get user by google_id
     */
    /**
     * Fetch a user by Google ID.
     *
     * @param googleId The Google account identifier.
     * @returns The `User` if found, otherwise `null`.
     */
    getUserByGoogleId(googleId: string): Promise<User | null>;
    getUserByAccessToken(req: AuthenticatedRequest, res: Response): Promise<User | boolean>;
    /**
     * Update user
     */
    /**
     * Update mutable user profile fields. Automatically sets `updated_at` to the current time.
     *
     * Allowed fields include:
     * - name, phone, address, date_of_birth, profile_picture, is_verified, is_active
     *
     * @param userId The user to update.
     * @param data Partial set of fields to update.
     * @returns The updated `User` if successful; otherwise `null`.
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
     * Format user response
     */
    /**
     * Produce a sanitized, API-friendly representation of a user.
     *
     * - Converts date fields to ISO strings.
     * - Omits sensitive properties (e.g., password).
     *
     * @param user The Prisma `User` record.
     * @returns A plain object safe for API responses.
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