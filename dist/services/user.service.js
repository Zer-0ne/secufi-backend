import bcrypt from 'bcryptjs';
import JWTService from './jwt.service';
export class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create user or return existing user
     */
    async createOrGetUser(data) {
        try {
            // Normalize email
            const email = data.email.toLowerCase().trim();
            // Check if user exists by email
            let user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (user) {
                console.log(`✓ User already exists: ${email}`);
                return { user, isNewUser: false };
            }
            // Check if user exists by google_id
            if (data.google_id) {
                user = await this.prisma.user.findUnique({
                    where: { google_id: data.google_id },
                });
                if (user) {
                    console.log(`✓ User already exists with google_id: ${data.google_id}`);
                    return { user, isNewUser: false };
                }
            }
            // Check if user exists by phone
            if (data.phone) {
                user = await this.prisma.user.findUnique({
                    where: { phone: data.phone },
                });
                if (user) {
                    console.log(`✓ User already exists with phone: ${data.phone}`);
                    return { user, isNewUser: false };
                }
            }
            // Hash password if provided
            let hashedPassword = null;
            if (data.password) {
                hashedPassword = await bcrypt.hash(data.password, 10);
            }
            // Create new user
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    name: data.name || null,
                    password: hashedPassword,
                    user_type: data.user_type || 'parent',
                    phone: data.phone || null,
                    google_id: data.google_id || null,
                    google_email: data.google_email || null,
                    profile_picture: data.profile_picture || null,
                    is_google_user: !!data.google_id,
                    role: 'user',
                    is_active: true,
                },
            });
            console.log(`✓ New user created: ${email}`);
            return { user: newUser, isNewUser: true };
        }
        catch (error) {
            console.error('Error in createOrGetUser:', error);
            throw new Error('Failed to create or get user');
        }
    }
    /**
     * Get user by ID
     */
    async getUserById(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            return user;
        }
        catch (error) {
            console.error('Error getting user by ID:', error);
            return null;
        }
    }
    /**
     * Get user by email
     */
    async getUserByEmail(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });
            return user;
        }
        catch (error) {
            console.error('Error getting user by email:', error);
            return null;
        }
    }
    /**
     * Get user by google_id
     */
    async getUserByGoogleId(googleId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { google_id: googleId },
            });
            return user;
        }
        catch (error) {
            console.error('Error getting user by google_id:', error);
            return null;
        }
    }
    async getUserByAccessToken(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = JWTService.extractFromHeader(authHeader);
            const userId = JWTService.decode(token).userId;
            const user = await this.prisma.user.findUnique({
                where: { id: userId.toString() },
            });
            if (!user) {
                return false;
            }
            return user;
        }
        catch (error) {
            console.error('Error getting user by access token:', error.message);
            return false;
        }
    }
    /**
     * Update user
     */
    async updateUser(userId, data) {
        try {
            const user = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    ...data,
                    updated_at: new Date(),
                },
            });
            return user;
        }
        catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
    }
    /**
     * Format user response
     */
    formatUserResponse(user) {
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
//# sourceMappingURL=user.service.js.map