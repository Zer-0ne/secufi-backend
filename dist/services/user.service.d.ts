import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { PrismaClient, User } from '@prisma/client';
import { Response } from 'express';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * Create user or return existing user
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
    }): Promise<{
        user: User;
        isNewUser: boolean;
    }>;
    /**
     * Get user by ID
     */
    getUserById(userId: string): Promise<User | null>;
    /**
     * Get user by email
     */
    getUserByEmail(email: string): Promise<User | null>;
    /**
     * Get user by google_id
     */
    getUserByGoogleId(googleId: string): Promise<User | null>;
    getUserByAccessToken(req: AuthenticatedRequest, res: Response): Promise<User | boolean>;
    /**
     * Update user
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
    formatUserResponse(user: User): {
        id: string;
        email: string | null;
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