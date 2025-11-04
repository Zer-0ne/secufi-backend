import { Router, Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { UserService } from '@services/user.service';
import { CreateUserRequest, CreateUserResponse, GetUserResponse } from '@/types/user';
import JWTService from '@/services/jwt.service';
import { AuthenticatedRequest, authenticateJWT } from '@/middlewares/auth.middleware';

const userRouter = Router();
export const prisma = new PrismaClient();
const userService = new UserService(prisma);

/**
 * POST /api/users
 * Create new user or return existing user
 */
userRouter.post('/', async (req: Request, res: Response) => {

  // console.log(req.body)
  try {
    const {
      email,
      name,
      password,
      user_type,
      phone,
      google_id,
      google_email,
      profile_picture,
    } = req.body as CreateUserRequest;

    // Validate email
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
        error: 'Missing email parameter',
      } as CreateUserResponse);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format',
        error: 'Please provide a valid email address',
      } as CreateUserResponse);
      return;
    }

    // Create or get user
    const { user, isNewUser } = await userService.createOrGetUser({
      email,
      name,
      password,
      user_type: user_type || 'parent',
      phone,
      google_id,
      google_email,
      profile_picture,
    });

    const accessToken = JWTService.signAccessToken({
      userId: user.id,
      email: user.email!,
    })

    const refreshToken = JWTService.signRefreshToken({
      userId: user.id,
      email: user.email!,
    });

    const response: CreateUserResponse = {
      success: true,
      message: isNewUser
        ? 'User created successfully'
        : 'User already exists',
      user: userService.formatUserResponse(user)!,
      tokens: {
        accessToken,
        refreshToken,
      },
      isNewUser,
    };

    res.status(isNewUser ? 201 : 200).json(response);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create or get user',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as CreateUserResponse);
  }
});

userRouter.get('/profile', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized: User ID missing' });
      return;
    }

    const user = await userService.getUserById(userId.toString());
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      user: userService.formatUserResponse(user),
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Failed to get profile', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});



// update user profile route
userRouter.put('/kyc', authenticateJWT, async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const user = await userService.getUserByAccessToken(req, res);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });

    }
    const { id: userId } = user as User;
    const { phone, address, date_of_birth, pan_number } = req.body;
    const { wants_to_update_details } = req.query;
    if (!phone || !date_of_birth || !pan_number) {
      return res.status(400).json({ success: false, message: 'phone, pan number, address and date_of_birth are required' });

    }

    if (!wants_to_update_details && (user as User).is_verified) {

      // this will change to status(400) and success is false in future now this is for testing purpose
      return res.status(200).json({
        success: true, message: 'You are already varified, Do you want update your details?',
        action: {
          redirect: '/api/users/kyc?wants_to_update_details=true',
        }
      });
    }

    // console.log(date_of_birth.toISOString().split("T")[0])

    const updatedUser = await userService.updateUser(userId.toString(), {
      phone,
      address,
      date_of_birth: new Date(date_of_birth),
      is_verified: true,
      pan_number,
    } as any);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userService.formatUserResponse(updatedUser),
    });
  }
  catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

/**
 * GET /api/users/:userId
 * Get user by ID
 */
userRouter.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'Missing userId parameter',
      } as GetUserResponse);
      return;
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: `User with ID ${userId} not found`,
      } as GetUserResponse);
      return;
    }

    const response: GetUserResponse = {
      success: true,
      message: 'User retrieved successfully',
      user: userService.formatUserResponse(user) as any,
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as GetUserResponse);
  }
});


/**
 * GET /api/users/email/:email
 * Get user by email
 */
userRouter.get('/email/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
        error: 'Missing email parameter',
      } as GetUserResponse);
      return;
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: `User with email ${email} not found`,
      } as GetUserResponse);
      return;
    }

    const response: GetUserResponse = {
      success: true,
      message: 'User retrieved successfully',
      user: userService.formatUserResponse(user) as any,
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting user by email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as GetUserResponse);
  }
});

/**
 * GET /api/users/google/:googleId
 * Get user by Google ID
 */
userRouter.get('/google/:googleId', async (req: Request, res: Response) => {
  try {
    const { googleId } = req.params;

    if (!googleId) {
      res.status(400).json({
        success: false,
        message: 'Google ID is required',
        error: 'Missing googleId parameter',
      } as GetUserResponse);
      return;
    }

    const user = await userService.getUserByGoogleId(googleId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: `User with Google ID ${googleId} not found`,
      } as GetUserResponse);
      return;
    }

    const response: GetUserResponse = {
      success: true,
      message: 'User retrieved successfully',
      user: userService.formatUserResponse(user),
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting user by google_id:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as GetUserResponse);
  }
});

/**
 * PUT /api/users/:userId
 * Update user
 */
userRouter.put('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, phone, address, date_of_birth, profile_picture, is_verified, is_active } =
      req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'Missing userId parameter',
      } as GetUserResponse);
      return;
    }

    // Check if user exists
    const existingUser = await userService.getUserById(userId);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: `User with ID ${userId} not found`,
      } as GetUserResponse);
      return;
    }

    // Update user
    const updatedUser = await userService.updateUser(userId, {
      name,
      phone,
      address,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
      profile_picture,
      is_verified,
      is_active,
    });

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    const response: GetUserResponse = {
      success: true,
      message: 'User updated successfully',
      user: userService.formatUserResponse(updatedUser),
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as GetUserResponse);
  }
});

export default userRouter;
