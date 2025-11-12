import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import JWTService from './jwt.service';
import { TempUserData } from '@/middlewares/temp-user.middleware';

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
export class UserService {
  private prisma: PrismaClient;

  /**
   * Construct the UserService.
   *
   * @param prisma Prisma client instance scoped to the current request or application.
   */
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

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
  async createOrGetUser(data: {
    email: string;
    name?: string;
    password?: string;
    user_type?: 'parent' | 'family';
    phone?: string;
    google_id?: string;
    google_email?: string;
    profile_picture?: string;
    // ✅ NEW: Accept temp user data
    tempUserData?: TempUserData;
  }): Promise<{ user: User; isNewUser: boolean; hadTempData: boolean }> {
    try {
      // Normalize email
      const email = data.email.toLowerCase().trim();

      // Check if user exists by email
      let user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          owned_family: true,
        },
      });

      if (user) {
        console.log(`✓ User already exists: ${email}`);
        return { user, isNewUser: false, hadTempData: false };
      }

      // Check if user exists by google_id
      if (data.google_id) {
        user = await this.prisma.user.findUnique({
          where: { google_id: data.google_id },
          include: {
            owned_family: true,
          },
        });

        if (user) {
          console.log(`✓ User already exists with google_id: ${data.google_id}`);
          return { user, isNewUser: false, hadTempData: false };
        }
      }

      // Check if user exists by phone
      if (data.phone) {
        user = await this.prisma.user.findUnique({
          where: { phone: data.phone },
          include: {
            owned_family: true,
          },
        });

        if (user) {
          console.log(`✓ User already exists with phone: ${data.phone}`);
          return { user, isNewUser: false, hadTempData: false };
        }
      }

      // Hash password if provided
      let hashedPassword = null;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      // ✅ Merge temp user data with provided data
      const finalName = data.name || data.tempUserData?.name || null;
      const finalPhone = data.phone || data.tempUserData?.phone || null;

      // ✅ Create new user and their ONE family in a transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create new user
        const newUser = await tx.user.create({
          data: {
            email,
            name: finalName,
            password: hashedPassword,
            user_type: data.user_type || 'parent',
            phone: finalPhone,
            google_id: data.google_id || null,
            google_email: data.google_email || null,
            profile_picture: data.profile_picture || null,
            is_google_user: !!data.google_id,
            role: 'user',
            is_active: true,
          },
        });

        // Create the user's ONE family with them as owner
        const familyName = finalName
          ? `${finalName}'s Family`
          : `${email.split('@')[0]}'s Family`;

        const newFamily = await tx.family.create({
          data: {
            name: familyName,
            description: 'Personal family group',
            owner_id: newUser.id,
          },
        });

        // Create family member entry for owner with full permissions
        await tx.familyMember.create({
          data: {
            family_id: newFamily.id,
            user_id: newUser.id,
            role: 'owner',
            can_view: true,
            can_edit: true,
            can_delete: true,
            can_invite: true,
            is_active: true,
          },
        });

        // Create default family settings
        await tx.familySettings.create({
          data: {
            family_id: newFamily.id,
            can_share_assets: true,
            can_view_others: true,
            require_approval: false,
            currency: 'INR',
            financial_year_start: '01-04',
            notify_large_transactions: true,
            large_transaction_threshold: 100000,
          },
        });

        // Create default roles
        const defaultRoles = [
          {
            name: 'owner',
            description: 'Full access to all family features',
            permissions: {
              view_assets: true,
              create_assets: true,
              edit_assets: true,
              delete_assets: true,
              manage_members: true,
              approve_transactions: true,
              export_data: true,
            },
          },
          {
            name: 'admin',
            description: 'Manage family members and assets',
            permissions: {
              view_assets: true,
              create_assets: true,
              edit_assets: true,
              delete_assets: false,
              manage_members: true,
              approve_transactions: true,
              export_data: true,
            },
          },
          {
            name: 'member',
            description: 'View and create assets',
            permissions: {
              view_assets: true,
              create_assets: true,
              edit_assets: false,
              delete_assets: false,
              manage_members: false,
              approve_transactions: false,
              export_data: false,
            },
          },
          {
            name: 'viewer',
            description: 'View-only access',
            permissions: {
              view_assets: true,
              create_assets: false,
              edit_assets: false,
              delete_assets: false,
              manage_members: false,
              approve_transactions: false,
              export_data: false,
            },
          },
        ];

        for (const role of defaultRoles) {
          await tx.familyRole.create({
            data: {
              family_id: newFamily.id,
              name: role.name,
              description: role.description,
              permissions: role.permissions,
              is_default: true,
            },
          });
        }

        // ✅ NEW: If they were invited to another family, add them as member
        if (data.tempUserData?.invited_by_family_id) {
          const invitedFamilyId = data.tempUserData.invited_by_family_id;
          const invitedRole = data.tempUserData.invited_role || 'member';

          console.log(`✓ Adding user to invited family: ${invitedFamilyId}`);

          // Add as family member
          await tx.familyMember.create({
            data: {
              family_id: invitedFamilyId,
              user_id: newUser.id,
              role: invitedRole,
              can_view: true,
              can_edit: invitedRole === 'admin' || invitedRole === 'owner',
              can_delete: invitedRole === 'owner',
              can_invite: invitedRole === 'admin' || invitedRole === 'owner',
              is_active: true,
            },
          });

          // ✅ Update invitation status if invitation_id exists
          if (data.tempUserData.invitation_id) {
            await tx.familyInvitation.update({
              where: { id: data.tempUserData.invitation_id },
              data: {
                status: 'accepted',
                accepted_at: new Date(),
                invited_user_id: newUser.id,
              },
            });
          }
        }

        console.log(`✅ New user created: ${email}`);
        console.log(`✅ Family created: ${newFamily.id} (${familyName})`);

        // Return user with their family included
        return await tx.user.findUniqueOrThrow({
          where: { id: newUser.id },
          include: {
            owned_family: true,
          },
        });
      });

      return {
        user: result,
        isNewUser: true,
        hadTempData: !!data.tempUserData
      };
    } catch (error) {
      console.error('❌ Error in createOrGetUser:', error);

      if (error instanceof Error && error.message.includes('Unique constraint')) {
        throw new Error('User already has a family. Each user can only own one family.');
      }

      throw new Error('Failed to create or get user');
    }
  }





  /**
   * Get user by ID
   */
  /**
   * Fetch a user by unique identifier.
   *
   * @param userId The user's unique ID.
   * @returns The `User` if found, otherwise `null`.
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Get user by email
   */
  /**
   * Fetch a user by email. Email is normalized (lowercased, trimmed).
   *
   * @param email The user's email (case-insensitive).
   * @returns The `User` if found, otherwise `null`.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  /**
   * Get user by google_id
   */
  /**
   * Fetch a user by Google ID.
   *
   * @param googleId The Google account identifier.
   * @returns The `User` if found, otherwise `null`.
   */
  async getUserByGoogleId(googleId: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { google_id: googleId },
      });

      return user;
    } catch (error) {
      console.error('Error getting user by google_id:', error);
      return null;
    }
  }

  async getUserByAccessToken(req: AuthenticatedRequest, res: Response): Promise<User | boolean> {
    /**
     * Resolve a user from an HTTP Authorization header containing a JWT access token.
     *
     * Process:
     * - Extracts the token from the Authorization header using the JWT service.
     * - Decodes the token to read the embedded userId.
     * - Fetches the user by ID.
     *
     * @param req Express request with Authorization header.
     * @param res Express response (unused directly; included for signature parity).
     * @returns The `User` if found; otherwise `false` if token invalid or user missing.
     */
    try {
      const authHeader = req.headers.authorization;
      const token = JWTService.extractFromHeader(authHeader);
      const userId = JWTService.decode(token!)!.userId;

      const user = await this.prisma.user.findUnique({
        where: { id: userId.toString() },
      });

      if (!user) {

        return false;
      }
      return user;
    } catch (error) {
      console.error('Error getting user by access token:', (error as Error).message);
      return false;
    }
  }


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
  async updateUser(
    userId: string,
    data: Partial<{
      name: string;
      phone: string;
      address: string;
      date_of_birth: Date;
      profile_picture: string;
      is_verified: boolean;
      is_active: boolean;
    }>
  ): Promise<User | null> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

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
  formatUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      user_type: user.user_type,
      role: user.role,
      is_verified: user.is_verified,
      is_active: user.is_active,
      phone: user.phone,
      profile_picture: user.profile_picture,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }
}
