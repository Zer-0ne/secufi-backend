import { Router, Request, Response } from 'express';
import { GoogleService } from '@services/google.service';
import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '@services/encryption.service';
import {
  GoogleAuthResponse,
  ListEmailsResponse,
  GetEmailResponse,
} from '@/types/google';
import { AuthenticatedRequest, authenticateJWT } from '@/middlewares/auth.middleware';
import JWTService from '@/services/jwt.service';
import { getExpiryDate, isExpired } from '@/config/utils';

const googleRouter = Router();
const prisma = new PrismaClient();
const encryptionService = new EncryptionService();
const googleService = new GoogleService(
  {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUrl:
      process.env.GOOGLE_REDIRECT_URL ||
      'http://localhost:5000/api/google/callback',
  },
  prisma,
  encryptionService
);

/**
 * GET /api/google/auth-url/:userId
 * Get authorization URL for user consent
 */
googleRouter.get('/auth-url/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'Missing userId parameter',
      } as GoogleAuthResponse);
      return;
    }

    const scopes = (req.query.scopes as string)?.split(',') || [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
    ];

    googleService.setUserId(userId);
    const authUrl = googleService.getAuthUrl(scopes);

    console.log(`✓ Auth URL generated for user: ${userId}`);

    const response: GoogleAuthResponse = {
      success: true,
      message: 'Auth URL generated successfully',
      authUrl,
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate auth URL',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as GoogleAuthResponse);
  }
});


/**
 * @route POST /api/google/set-token
 * @description
 * Stores the user's Google `accessToken` and `refreshToken` in the database for later API access (e.g. Gmail API, Calendar API, etc.).
 * 
 * This endpoint is intended for cases where tokens are obtained manually or from an external OAuth flow,
 * rather than through a full Google OAuth redirect process.
 *
 * @access Protected (requires JWT in Authorization header)
 *
 * @middleware authenticateJWT - Validates the user's JWT and extracts `userId` for token association.
 *
 * @body
 * - accessToken {string} - The Google API access token (required)
 * - refreshToken {string} - The Google API refresh token (optional but recommended)
 *
 * @headers
 * - Authorization: Bearer <JWT>  → required for user authentication
 *
 * @logic
 * 1. Validates that an access token is provided.
 * 2. Extracts the `userId` from the JWT.
 * 3. Checks if tokens already exist for that user in the database and whether they’re still valid.
 * 4. If valid tokens exist → responds with HTTP 200 and a “Tokens already exist” message.
 * 5. Otherwise, saves new credentials to the database with an expiry timestamp (using `getExpiryDate()`).
 *
 * @response
 * - 200: Tokens already exist for this user.
 * - 201 / 200: Tokens saved successfully.
 * - 400: Missing access token in request body.
 * - 500: Failed to save tokens due to server/database error.
 *
 * @example
 * POST /google/set-token
 * Authorization: Bearer <JWT>
 * {
 *   "accessToken": "ya29.a0ARrdaM...",
 *   "refreshToken": "1//0gabcdef..."
 * }
 */
googleRouter.post('/set-token', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { accessToken, refreshToken } = req.body;
    const authHeader = req.headers.authorization;

    if (!accessToken) {
      res.status(400).json({
        success: false,
        message: 'Access token is required',
        error: 'Missing accessToken in request body',
      });
    }
    const token = JWTService.extractFromHeader(authHeader);
    const userId = (JWTService.decode(token!)!).userId;
    console.log(userId)

    await googleService.setUserId(userId);
    const isExist = await googleService.loadCredentialsFromDatabase(userId);

    // console.log(isExpired(googleService.getCredentials()!.accessTokenExpiresAt!))
    if (isExist && !isExpired(googleService.getCredentials()!.accessTokenExpiresAt!)) {
      res.status(200).json({
        success: true,
        message: 'Tokens already exist for this user',
        error: 'Tokens already exist',
      });
      return;
    }
    googleService.saveCredentialsToDatabase(userId, {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: getExpiryDate(1),
      refreshTokenExpiresAt: getExpiryDate(1),
    })

    res.json({
      success: true,
      message: 'Tokens saved successfully',
    });
  } catch (error) {
    console.error('Error saving tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save tokens',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as GoogleAuthResponse);
  }
});


/**
 * @route POST /google/get-token
 * @description
 * Retrieves the stored Google API tokens (access & refresh) for the authenticated user.
 * Used by services that require Google API access without re-authenticating.
 *
 * @access Protected (requires JWT in Authorization header)
 *
 * @middleware authenticateJWT - Validates JWT and identifies the `userId`.
 *
 * @headers
 * - Authorization: Bearer <JWT> → required for identifying the user
 *
 * @logic
 * 1. Extracts `userId` from the JWT.
 * 2. Loads any stored Google credentials for that user from the database.
 * 3. If no tokens are found → returns 404.
 * 4. If tokens exist but access token is expired → returns 401.
 * 5. Otherwise → returns the stored credentials.
 *
 * @response
 * - 200: Tokens retrieved successfully.
 * - 401: Access token has expired.
 * - 404: No tokens found for this user.
 * - 500: Failed to retrieve tokens due to internal error.
 *
 * @example
 * POST /google/get-token
 * Authorization: Bearer <JWT>
 *
 * @returns
 * {
 *   "success": true,
 *   "message": "Tokens retrieved successfully",
 *   "data": {
 *     "accessToken": "ya29.a0ARrdaM...",
 *     "refreshToken": "1//0gabcdef...",
 *     "accessTokenExpiresAt": 1730786869154,
 *     "refreshTokenExpiresAt": 1730873269154
 *   }
 * }
 */
googleRouter.post('/get-token', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTService.extractFromHeader(authHeader);
    const userId = (JWTService.decode(token!)!).userId;
    console.log(userId)

    await googleService.setUserId(userId);
    const loaded = await googleService.loadCredentialsFromDatabase(userId);
    if (!loaded) {
      res.status(404).json({
        success: false,
        message: 'No tokens found for this user',
        error: 'Tokens not found',
      });
      return;
    }
    const credentials = googleService.getCredentials();

    if (isExpired(credentials!.accessTokenExpiresAt!)) {
      res.status(401).json({
        success: false,
        message: 'Access token has expired',
        error: 'Access token expired',
      });
      return;
    }
    res.json({
      success: true,
      message: 'Tokens retrieved successfully',
      data: credentials,
    });
  }
  catch (error) {
    console.error('Error retrieving tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tokens',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as GoogleAuthResponse);
  }
});

/**
 * GET /api/google/callback
 * Handle OAuth callback and exchange code for tokens
 * Query params: code, state (state contains encoded userId)
 */
googleRouter.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state, error, error_description } = req.query;

    console.log('Callback received:', {
      code: code ? `${String(code).substring(0, 20)}...` : 'missing',
      state: state ? `${String(state).substring(0, 20)}...` : 'missing',
      error: error || 'none',
    });

    // Handle OAuth errors from Google
    if (error) {
      console.error(
        '✗ OAuth error from Google:',
        error,
        error_description || ''
      );

      const frontendUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:3000';
      const errorMessage = String(error_description || error);

      const redirectUrl = `${frontendUrl}/auth/google/callback?success=false&error=${encodeURIComponent(errorMessage)}`;

      console.log(`Redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
      return;
    }

    // Validate code and state
    if (!code || !state) {
      console.error('✗ Missing code or state in callback');

      const frontendUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:3000';
      const errorMessage = 'Authorization code or state missing';

      const redirectUrl = `${frontendUrl}/auth/google/callback?success=false&error=${encodeURIComponent(errorMessage)}`;

      console.log(`Redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
      return;
    }

    // Extract code and state from arrays (if needed)
    const codeStr = Array.isArray(code) ? code[0] : String(code);
    const stateStr = Array.isArray(state) ? state[0] : String(state);

    console.log(`Code length: ${codeStr.length}, State length: ${stateStr.length}`);

    // Decode state to get userId
    let userId: string;
    try {
      userId = googleService.extractUserIdFromState(stateStr);
      console.log(`✓ Extracted userId from state: ${userId}`);
    } catch (decodeError) {
      console.error('✗ Failed to decode state:', decodeError);

      const frontendUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:3000';
      const errorMessage = 'Invalid OAuth state parameter';

      const redirectUrl = `${frontendUrl}/auth/google/callback?success=false&error=${encodeURIComponent(errorMessage)}`;

      console.log(`Redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
      return;
    }

    if (!userId) {
      console.error('✗ UserId is empty after decoding state');

      const frontendUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:3000';
      const errorMessage = 'Could not extract user ID from state';

      const redirectUrl = `${frontendUrl}/auth/google/callback?success=false&error=${encodeURIComponent(errorMessage)}`;

      console.log(`Redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
      return;
    }

    // Exchange code for tokens
    console.log(`⟳ Exchanging authorization code for tokens for user: ${userId}`);
    try {
      const credentials = await googleService.exchangeCodeForTokens(
        codeStr,
        userId
      );

      console.log(`✓ Credentials successfully obtained and stored for user: ${userId}`);

      // Redirect to frontend with success
      const frontendUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/google/callback?success=true&userId=${userId}`;

      console.log(`Redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
    } catch (tokenError) {
      console.error('✗ Failed to exchange code for tokens:', tokenError);

      const frontendUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:3000';
      const errorMessage =
        tokenError instanceof Error
          ? tokenError.message
          : 'Failed to obtain credentials';

      const redirectUrl = `${frontendUrl}/auth/google/callback?success=false&error=${encodeURIComponent(errorMessage)}`;

      console.log(`Redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('✗ Unexpected error in callback handler:', error);

    const frontendUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:3000';
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    const redirectUrl = `${frontendUrl}/auth/google/callback?success=false&error=${encodeURIComponent(errorMessage)}`;

    console.log(`Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);
  }
});

/**
 * GET /api/google/emails/:userId
 * List all emails with pagination
 */
googleRouter.get('/emails/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const maxResults = parseInt((req.query.maxResults as string) || '10');
    const pageToken = (req.query.pageToken as string) || undefined;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
        error: 'Missing userId parameter',
      } as ListEmailsResponse);
      return;
    }

    googleService.setUserId(userId);

    const loaded = await googleService.loadCredentialsFromDatabase(userId);

    if (!loaded) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
        error: 'No valid credentials found. Please authenticate first.',
      } as ListEmailsResponse);
      return;
    }

    const result = await googleService.listEmails(maxResults, pageToken);

    const response: ListEmailsResponse = {
      success: true,
      message: `Retrieved ${result.emails.length} emails`,
      data: result,
    };

    res.json(response);
  } catch (error) {
    console.error('Error listing emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list emails',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ListEmailsResponse);
  }
});

/**
 * GET /api/google/emails/:userId/:id
 * Get specific email by ID
 */
googleRouter.get('/emails/:userId/:id', async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.params;

    if (!userId || !id) {
      res.status(400).json({
        success: false,
        message: 'User ID and Email ID are required',
        error: 'Missing userId or id parameter',
      } as GetEmailResponse);
      return;
    }

    googleService.setUserId(userId);

    const loaded = await googleService.loadCredentialsFromDatabase(userId);

    if (!loaded) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
        error: 'No valid credentials found. Please authenticate first.',
      } as GetEmailResponse);
      return;
    }

    const email = await googleService.getEmailById(id);

    if (!email) {
      res.status(404).json({
        success: false,
        message: 'Email not found',
        error: `Email with ID ${id} not found`,
      } as GetEmailResponse);
      return;
    }

    const response: GetEmailResponse = {
      success: true,
      message: 'Email retrieved successfully',
      data: email,
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as GetEmailResponse);
  }
});

/**
 * GET /api/google/search/:userId
 * Search emails by query
 */
googleRouter.get('/search/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const query = (req.query.q as string) || '';
    const maxResults = parseInt((req.query.maxResults as string) || '10');

    if (!userId || !query) {
      res.status(400).json({
        success: false,
        message: 'User ID and search query are required',
        error: 'Missing userId or q parameter',
      } as ListEmailsResponse);
      return;
    }

    googleService.setUserId(userId);

    const loaded = await googleService.loadCredentialsFromDatabase(userId);

    if (!loaded) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
        error: 'No valid credentials found. Please authenticate first.',
      } as ListEmailsResponse);
      return;
    }

    const emails = await googleService.searchEmails(query, maxResults);

    const response: ListEmailsResponse = {
      success: true,
      message: `Found ${emails.length} emails matching query`,
      data: {
        emails,
        totalMessages: emails.length,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error searching emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search emails',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ListEmailsResponse);
  }
});

/**
 * DELETE /api/google/credentials/:userId
 * Clear credentials
 */
googleRouter.delete(
  '/credentials/:userId',
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required',
          error: 'Missing userId parameter',
        } as GoogleAuthResponse);
        return;
      }

      googleService.setUserId(userId);
      const cleared = await googleService.clearCredentials();

      if (!cleared) {
        throw new Error('Failed to clear credentials');
      }

      const response: GoogleAuthResponse = {
        success: true,
        message: 'Credentials cleared successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Error clearing credentials:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear credentials',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as GoogleAuthResponse);
    }
  }
);

export default googleRouter;
