/**
 * @fileoverview JSON Web Token (JWT) service for authentication and authorization
 * @description This service provides comprehensive JWT token management including:
 * - Token generation (access and refresh tokens)
 * - Token verification and validation
 * - Token decoding and payload extraction
 * - Token expiry checking and refresh functionality
 * - Utility functions for token manipulation
 * 
 * The service uses static methods for easy usage without instantiation and
 * implements industry best practices for JWT handling including separate
 * access and refresh tokens with different expiry times.
 * 
 * @module services/jwt.service
 * @requires jsonwebtoken - JWT encoding, decoding, and verification
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

// Import JWT library and its TypeScript types
import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

/**
 * Interface for JWT payload data structure
 * 
 * @interface IJWTPayload
 * @description Defines the structure of data encoded in JWT tokens.
 * Contains user identification and authorization information.
 * 
 * @property {string} userId - Unique identifier for the user (required)
 * @property {string} [email] - User's email address (optional)
 * @property {string} [role] - User's role/permission level (optional)
 * @property {boolean} [isAdmin] - Whether user has admin privileges (optional)
 * @property {any} [key: string] - Additional custom properties can be added
 */
export interface IJWTPayload {
  userId: string; // Primary identifier for the user
  email?: string; // User's email for reference
  role?: string; // Role-based access control
  isAdmin?: boolean; // Admin flag for quick checks
  [key: string]: any; // Allow additional custom fields
}

/**
 * Interface for decoded JWT token
 * 
 * @interface IDecodedToken
 * @extends {JwtPayload}
 * @description Extends the standard JwtPayload with application-specific fields.
 * Represents the decoded and verified token data.
 * 
 * @property {string} userId - User identifier from token
 * @property {string} [email] - User's email from token
 * @property {string} [role] - User's role from token
 * @property {boolean} [isAdmin] - Admin status from token
 * @property {number} [iat] - Issued at timestamp (added by JWT library)
 * @property {number} [exp] - Expiration timestamp (added by JWT library)
 */
export interface IDecodedToken extends JwtPayload {
  userId: string; // User ID from payload
  email?: string; // Optional email
  role?: string; // Optional role
  isAdmin?: boolean; // Optional admin flag
  iat?: number; // Issued at (Unix timestamp)
  exp?: number; // Expiration time (Unix timestamp)
}

/**
 * Interface for token pair response
 * 
 * @interface ITokenPair
 * @description Contains both access and refresh tokens along with expiry information.
 * Used when generating token pairs for user authentication.
 * 
 * @property {string} accessToken - Short-lived access token for API requests
 * @property {string} refreshToken - Long-lived refresh token for getting new access tokens
 * @property {number} expiresIn - Access token expiry time in seconds
 */
export interface ITokenPair {
  accessToken: string; // Token for API authentication
  refreshToken: string; // Token for refreshing access token
  expiresIn: number; // Access token lifetime in seconds
}

/**
 * JWT Service Class
 * 
 * @class JWTService
 * @description Provides static methods for JWT token operations.
 * All methods are static to allow usage without instantiation.
 * Uses getter methods for dynamic environment variable loading to ensure
 * values are always current even if environment variables change at runtime.
 * 
 * Key features:
 * - Separate access and refresh token handling
 * - Configurable expiry times
 * - Comprehensive error handling
 * - Token validation and verification
 * - Utility methods for token manipulation
 */
export class JWTService {
  // ============================================
  // Configuration (Dynamic getters for environment variables)
  // ============================================

  /**
   * Get access token secret from environment
   * 
   * @private
   * @static
   * @getter
   * @description Returns the secret key used to sign and verify access tokens.
   * Uses environment variable JWT_SECRET or falls back to a default.
   * IMPORTANT: Change the default secret in production!
   * 
   * @returns {string} Secret key for access tokens
   */
  private static get ACCESS_TOKEN_SECRET(): string {
    // Get secret from environment, or use default (CHANGE IN PRODUCTION!)
    return process.env.JWT_SECRET || 'your-secret-key-change-this';
  }

  /**
   * Get refresh token secret from environment
   * 
   * @private
   * @static
   * @getter
   * @description Returns the secret key used to sign and verify refresh tokens.
   * Should be different from access token secret for added security.
   * Uses environment variable JWT_REFRESH_SECRET or falls back to a default.
   * 
   * @returns {string} Secret key for refresh tokens
   */
  private static get REFRESH_TOKEN_SECRET(): string {
    // Get refresh secret from environment, separate from access token secret
    return process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this';
  }

  /**
   * Get access token expiry duration from environment
   * 
   * @private
   * @static
   * @getter
   * @description Returns the expiry duration for access tokens.
   * Accepts formats like "1d" (1 day), "15m" (15 minutes), "2h" (2 hours).
   * Short expiry recommended for security (typically 15m to 1d).
   * 
   * @returns {string} Expiry duration string (e.g., "1d", "15m")
   */
  private static get ACCESS_TOKEN_EXPIRY(): string {
    // Get expiry from environment, default to 1 day
    return process.env.JWT_EXPIRY || '1d';
  }

  /**
   * Get refresh token expiry duration from environment
   * 
   * @private
   * @static
   * @getter
   * @description Returns the expiry duration for refresh tokens.
   * Should be longer than access tokens (typically 7d to 30d).
   * Allows users to get new access tokens without re-authenticating.
   * 
   * @returns {string} Expiry duration string (e.g., "7d", "30d")
   */
  private static get REFRESH_TOKEN_EXPIRY(): string {
    // Get refresh expiry from environment, default to 7 days
    return process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  /**
   * Get JWT issuer identifier from environment
   * 
   * @private
   * @static
   * @getter
   * @description Returns the issuer (iss) claim for JWT tokens.
   * Identifies who created/issued the token (typically your app name).
   * Used for token validation to prevent token reuse across apps.
   * 
   * @returns {string} Issuer identifier
   */
  private static get ISSUER(): string {
    // Get issuer from environment, typically your application name
    return process.env.JWT_ISSUER || 'your-app-name';
  }

  /**
   * Get JWT audience identifier from environment
   * 
   * @private
   * @static
   * @getter
   * @description Returns the audience (aud) claim for JWT tokens.
   * Identifies who the token is intended for (typically your app users).
   * Used for token validation to prevent token misuse.
   * 
   * @returns {string} Audience identifier
   */
  private static get AUDIENCE(): string {
    // Get audience from environment, typically your user base identifier
    return process.env.JWT_AUDIENCE || 'your-app-users';
  }

  // ============================================
  // SIGN: Create Access Token
  // ============================================
  
  /**
   * Generate a short-lived access token
   * 
   * @static
   * @method signAccessToken
   * @description Creates a JWT access token with the provided payload.
   * Access tokens are short-lived (typically 15m-1d) and used for API authentication.
   * The token is signed using HS256 algorithm with the access token secret.
   * 
   * @param {IJWTPayload} payload - Data to encode in the token (user info, roles, etc.)
   * @param {string | number} [expiresIn] - Optional custom expiry (overrides env default)
   * @returns {string} Signed JWT access token
   * @throws {Error} If token generation fails
   * 
   * @example
   * // Generate access token for user
   * const token = JWTService.signAccessToken({
   *   userId: '123',
   *   email: 'user@example.com',
   *   role: 'user'
   * });
   */
  static signAccessToken(payload: IJWTPayload, expiresIn?: string | number): string {
    try {
      // Configure token options
      const options: SignOptions = {
        expiresIn: (expiresIn || this.ACCESS_TOKEN_EXPIRY as any), // Use custom or default expiry
        issuer: this.ISSUER, // Who created the token
        audience: this.AUDIENCE, // Who the token is for
        algorithm: 'HS256', // HMAC SHA256 signing algorithm
      };

      // Log token generation for debugging
      console.log('🔑 Signing access token with expiry:', options.expiresIn);

      // Sign the payload with the secret key and options
      const token = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, options);
      
      // Return the generated token string
      return token;
    } catch (error) {
      // Log error for debugging
      console.error('❌ Error signing access token:', error);
      
      // Throw user-friendly error
      throw new Error('Failed to generate access token');
    }
  }

  // ============================================
  // SIGN: Create Refresh Token
  // ============================================
  
  /**
   * Generate a long-lived refresh token
   * 
   * @static
   * @method signRefreshToken
   * @description Creates a JWT refresh token with the provided payload.
   * Refresh tokens are long-lived (typically 7d-30d) and used to obtain new access tokens.
   * The token is signed using HS256 algorithm with the refresh token secret.
   * 
   * @param {IJWTPayload} payload - Data to encode in the token
   * @param {string | number} [expiresIn] - Optional custom expiry (overrides env default)
   * @returns {string} Signed JWT refresh token
   * @throws {Error} If token generation fails
   * 
   * @example
   * // Generate refresh token for user
   * const refreshToken = JWTService.signRefreshToken({
   *   userId: '123',
   *   email: 'user@example.com'
   * });
   */
  static signRefreshToken(payload: IJWTPayload, expiresIn?: string | number): string {
    try {
      // Configure token options (same structure as access token but different expiry)
      const options: SignOptions = {
        expiresIn: (expiresIn || this.REFRESH_TOKEN_EXPIRY as any), // Use custom or default expiry
        issuer: this.ISSUER, // Token issuer
        audience: this.AUDIENCE, // Token audience
        algorithm: 'HS256', // Signing algorithm
      };

      // Log token generation for debugging
      console.log('🔄 Signing refresh token with expiry:', options.expiresIn);

      // Sign the payload with the refresh token secret
      const token = jwt.sign(payload, this.REFRESH_TOKEN_SECRET, options);
      
      // Return the generated refresh token
      return token;
    } catch (error) {
      // Log error for debugging
      console.error('❌ Error signing refresh token:', error);
      
      // Throw user-friendly error
      throw new Error('Failed to generate refresh token');
    }
  }

  // ============================================
  // SIGN: Create Token Pair (Access + Refresh)
  // ============================================
  
  /**
   * Generate both access and refresh tokens in one call
   * 
   * @static
   * @method signTokenPair
   * @description Creates both access and refresh tokens with the same payload.
   * This is the recommended method for user login/registration as it provides
   * both tokens needed for a complete authentication flow.
   * 
   * @param {IJWTPayload} payload - Data to encode in both tokens
   * @returns {ITokenPair} Object containing both tokens and expiry information
   * @throws {Error} If token generation fails
   * 
   * @example
   * // Generate token pair after successful login
   * const tokens = JWTService.signTokenPair({
   *   userId: user.id,
   *   email: user.email,
   *   role: user.role
   * });
   * res.json({
   *   accessToken: tokens.accessToken,
   *   refreshToken: tokens.refreshToken,
   *   expiresIn: tokens.expiresIn
   * });
   */
  static signTokenPair(payload: IJWTPayload): ITokenPair {
    try {
      // Generate access token with the payload
      const accessToken = this.signAccessToken(payload);
      
      // Generate refresh token with the same payload
      const refreshToken = this.signRefreshToken(payload);

      // Calculate access token expiry time in seconds for client use
      const expiresIn = this.parseExpiryToSeconds(this.ACCESS_TOKEN_EXPIRY);

      // Log successful token pair creation
      console.log('✅ Token pair created successfully');
      console.log('   Access expires in:', expiresIn, 'seconds');

      // Return both tokens and expiry info
      return {
        accessToken, // Short-lived token for API calls
        refreshToken, // Long-lived token for refreshing access
        expiresIn, // When access token expires (in seconds)
      };
    } catch (error) {
      // Log error for debugging
      console.error('❌ Error signing token pair:', error);
      
      // Throw user-friendly error
      throw new Error('Failed to generate token pair');
    }
  }

  // ============================================
  // VERIFY: Verify Access Token
  // ============================================
  
  /**
   * Verify and decode an access token
   * 
   * @static
   * @method verifyAccessToken
   * @description Verifies the signature and expiry of an access token and returns decoded payload.
   * Throws specific errors for different failure types (expired, invalid, etc.).
   * Use this in authentication middleware to validate incoming requests.
   * 
   * @param {string} token - JWT access token to verify
   * @returns {IDecodedToken} Decoded payload if token is valid
   * @throws {Error} If token is invalid, expired, or not yet active
   * 
   * @example
   * // Verify token in middleware
   * try {
   *   const decoded = JWTService.verifyAccessToken(token);
   *   req.user = decoded;
   *   next();
   * } catch (error) {
   *   res.status(401).json({ error: error.message });
   * }
   */
  static verifyAccessToken(token: string): IDecodedToken {
    try {
      // Configure verification options
      const options: VerifyOptions = {
        issuer: this.ISSUER, // Verify token issuer matches
        audience: this.AUDIENCE, // Verify token audience matches
        algorithms: ['HS256'], // Only accept HS256 algorithm
      };

      // Verify token signature and decode payload
      // This will throw if token is invalid, expired, or tampered with
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET, options) as IDecodedToken;
      
      // Return decoded payload if verification succeeds
      return decoded;
    } catch (error) {
      // Handle specific JWT error types with user-friendly messages
      if (error instanceof jwt.TokenExpiredError) {
        // Token expiry error - client should refresh
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        // Invalid token error - authentication required
        throw new Error('Invalid token');
      } else if (error instanceof jwt.NotBeforeError) {
        // Token not yet valid - rare edge case
        throw new Error('Token not yet active');
      }
      // Generic error for any other failures
      throw new Error('Token verification failed');
    }
  }

  // ============================================
  // VERIFY: Verify Refresh Token
  // ============================================
  
  /**
   * Verify and decode a refresh token
   * 
   * @static
   * @method verifyRefreshToken
   * @description Verifies the signature and expiry of a refresh token and returns decoded payload.
   * Used when a client wants to obtain a new access token without re-authenticating.
   * 
   * @param {string} token - JWT refresh token to verify
   * @returns {IDecodedToken} Decoded payload if token is valid
   * @throws {Error} If token is invalid or expired
   * 
   * @example
   * // Verify refresh token in refresh endpoint
   * try {
   *   const decoded = JWTService.verifyRefreshToken(refreshToken);
   *   const newAccessToken = JWTService.signAccessToken({
   *     userId: decoded.userId,
   *     email: decoded.email
   *   });
   *   res.json({ accessToken: newAccessToken });
   * } catch (error) {
   *   res.status(401).json({ error: 'Invalid refresh token' });
   * }
   */
  static verifyRefreshToken(token: string): IDecodedToken {
    try {
      // Configure verification options (same as access token)
      const options: VerifyOptions = {
        issuer: this.ISSUER, // Verify issuer matches
        audience: this.AUDIENCE, // Verify audience matches
        algorithms: ['HS256'], // Only accept HS256
      };

      // Verify refresh token with its own secret
      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET, options) as IDecodedToken;
      
      // Return decoded payload if valid
      return decoded;
    } catch (error) {
      // Handle specific error types
      if (error instanceof jwt.TokenExpiredError) {
        // Refresh token expired - user must re-authenticate
        throw new Error('Refresh token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        // Invalid refresh token
        throw new Error('Invalid refresh token');
      }
      // Generic error for other failures
      throw new Error('Refresh token verification failed');
    }
  }

  // ============================================
  // DECODE: Decode Without Verification
  // ============================================
  
  /**
   * Decode token without verifying signature
   * 
   * @static
   * @method decode
   * @description Decodes a JWT token without verifying its signature or expiry.
   * USE WITH CAUTION - This does not validate the token!
   * Useful for checking token contents without throwing errors.
   * 
   * @param {string} token - JWT token to decode
   * @returns {IDecodedToken | null} Decoded payload or null if decode fails
   * 
   * @example
   * // Check token contents without verification
   * const decoded = JWTService.decode(token);
   * if (decoded) {
   *   console.log('Token contains:', decoded.userId);
   * }
   */
  static decode(token: string): IDecodedToken | null {
    try {
      // Decode token without verification (no signature check)
      const decoded = jwt.decode(token) as IDecodedToken;
      
      // Return decoded payload (may be null if invalid format)
      return decoded;
    } catch (error) {
      // Log error and return null instead of throwing
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // ============================================
  // DECODE: Get Token Payload (verified)
  // ============================================
  
  /**
   * Get verified token payload
   * 
   * @static
   * @method getPayload
   * @description Convenience method to verify and decode either token type.
   * Automatically selects the correct verification method based on token type.
   * 
   * @param {string} token - JWT token to verify and decode
   * @param {boolean} [isRefreshToken=false] - Whether this is a refresh token
   * @returns {IDecodedToken} Decoded and verified payload
   * @throws {Error} If token verification fails
   * 
   * @example
   * // Get access token payload
   * const payload = JWTService.getPayload(accessToken);
   * 
   * @example
   * // Get refresh token payload
   * const payload = JWTService.getPayload(refreshToken, true);
   */
  static getPayload(token: string, isRefreshToken = false): IDecodedToken {
    // Use appropriate verification method based on token type
    return isRefreshToken 
      ? this.verifyRefreshToken(token)  // Verify with refresh secret
      : this.verifyAccessToken(token);   // Verify with access secret
  }

  // ============================================
  // UTILITY: Check if Token is Expired
  // ============================================
  
  /**
   * Check if token has expired without throwing errors
   * 
   * @static
   * @method isExpired
   * @description Checks if a token is expired based on its 'exp' claim.
   * Returns true/false without throwing errors, making it safe for checks
   * where you don't want to handle exceptions.
   * 
   * @param {string} token - JWT token to check
   * @returns {boolean} True if expired or invalid, false if still valid
   * 
   * @example
   * // Check before using token
   * if (JWTService.isExpired(accessToken)) {
   *   // Get new token using refresh token
   *   accessToken = JWTService.refreshAccessToken(refreshToken);
   * }
   */
  static isExpired(token: string): boolean {
    try {
      // Decode token without verification to get expiry
      const decoded = this.decode(token);
      
      // If decode failed or no expiry claim, consider it expired
      if (!decoded || !decoded.exp) {
        return true;
      }

      // Get current time in seconds (Unix timestamp)
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Token is expired if current time >= expiry time
      return decoded.exp < currentTime;
    } catch (error) {
      // If any error occurs, consider token expired
      return true;
    }
  }

  // ============================================
  // UTILITY: Get Token Expiry Date
  // ============================================
  
  /**
   * Get the expiration date of a token
   * 
   * @static
   * @method getExpiryDate
   * @description Extracts the expiration timestamp from a token and converts it to a Date object.
   * Useful for displaying expiry information to users.
   * 
   * @param {string} token - JWT token
   * @returns {Date | null} Expiration date or null if not available
   * 
   * @example
   * // Display token expiry to user
   * const expiryDate = JWTService.getExpiryDate(token);
   * if (expiryDate) {
   *   console.log(`Token expires at: ${expiryDate.toLocaleString()}`);
   * }
   */
  static getExpiryDate(token: string): Date | null {
    try {
      // Decode token to get expiry claim
      const decoded = this.decode(token);
      
      // Return null if no decoded data or expiry claim
      if (!decoded || !decoded.exp) {
        return null;
      }

      // Convert Unix timestamp (seconds) to JavaScript Date (milliseconds)
      return new Date(decoded.exp * 1000);
    } catch (error) {
      // Return null on error
      return null;
    }
  }

  // ============================================
  // UTILITY: Get Time Until Expiry
  // ============================================
  
  /**
   * Get remaining time until token expires
   * 
   * @static
   * @method getTimeUntilExpiry
   * @description Calculates how many seconds remain before token expiration.
   * Returns 0 if token is already expired or invalid.
   * 
   * @param {string} token - JWT token
   * @returns {number} Seconds until expiry, or 0 if expired/invalid
   * 
   * @example
   * // Check time remaining
   * const timeLeft = JWTService.getTimeUntilExpiry(token);
   * if (timeLeft < 300) { // Less than 5 minutes
   *   console.log('Token expiring soon, consider refreshing');
   * }
   */
  static getTimeUntilExpiry(token: string): number {
    try {
      // Decode token to get expiry
      const decoded = this.decode(token);
      
      // Return 0 if no decoded data or expiry
      if (!decoded || !decoded.exp) {
        return 0;
      }

      // Get current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Calculate time remaining
      const timeLeft = decoded.exp - currentTime;
      
      // Return time left or 0 if expired (negative would mean expired)
      return timeLeft > 0 ? timeLeft : 0;
    } catch (error) {
      // Return 0 on error
      return 0;
    }
  }

  // ============================================
  // REFRESH: Generate New Access Token from Refresh Token
  // ============================================
  
  /**
   * Generate a new access token using a refresh token
   * 
   * @static
   * @method refreshAccessToken
   * @description Verifies a refresh token and generates a new access token with the same payload.
   * This allows users to get new access tokens without re-authenticating.
   * 
   * @param {string} refreshToken - Valid refresh token
   * @returns {string} New access token
   * @throws {Error} If refresh token is invalid or expired
   * 
   * @example
   * // Refresh access token
   * try {
   *   const newAccessToken = JWTService.refreshAccessToken(refreshToken);
   *   res.json({ accessToken: newAccessToken });
   * } catch (error) {
   *   res.status(401).json({ error: 'Please login again' });
   * }
   */
  static refreshAccessToken(refreshToken: string): string {
    try {
      // Verify the refresh token first
      const decoded = this.verifyRefreshToken(refreshToken);

      // Extract user payload, removing JWT-specific fields
      // These fields (iat, exp, aud, iss) should not be copied to new token
      const { iat, exp, aud, iss, ...payload } = decoded;

      // Log refresh operation
      console.log('🔄 Refreshing access token for user:', payload.userId);

      // Generate and return new access token with the extracted payload
      return this.signAccessToken(payload as IJWTPayload);
    } catch (error) {
      // Throw error with context about what failed
      throw new Error('Failed to refresh access token: ' + (error as Error).message);
    }
  }

  // ============================================
  // UTILITY: Extract Token from Header
  // ============================================
  
  /**
   * Extract JWT token from Authorization header
   * 
   * @static
   * @method extractFromHeader
   * @description Extracts token from Authorization header, supporting both
   * "Bearer <token>" format and plain "<token>" format.
   * 
   * @param {string} [authHeader] - Authorization header value
   * @returns {string | null} Extracted token or null if not found
   * 
   * @example
   * // In middleware
   * const authHeader = req.headers.authorization;
   * const token = JWTService.extractFromHeader(authHeader);
   * if (token) {
   *   const decoded = JWTService.verifyAccessToken(token);
   * }
   */
  static extractFromHeader(authHeader?: string): string | null {
    // Return null if no header provided
    if (!authHeader) {
      return null;
    }

    // Check if header starts with "Bearer " (standard format)
    if (authHeader.startsWith('Bearer ')) {
      // Extract token part after "Bearer " (7 characters)
      return authHeader.substring(7);
    }

    // If not Bearer format, assume the entire header is the token
    return authHeader;
  }

  // ============================================
  // UTILITY: Parse Expiry String to Seconds
  // ============================================
  
  /**
   * Parse expiry string to seconds
   * 
   * @private
   * @static
   * @method parseExpiryToSeconds
   * @description Converts human-readable expiry strings (e.g., "15m", "7d", "1y")
   * to seconds. Supports seconds (s), minutes (m), hours (h), days (d), weeks (w), and years (y).
   * 
   * @param {string | number} expiry - Expiry duration string or number
   * @returns {number} Duration in seconds
   * 
   * @example
   * // "15m" returns 900 (15 * 60)
   * // "7d" returns 604800 (7 * 24 * 60 * 60)
   * // "1y" returns 31536000 (365 * 24 * 60 * 60)
   */
  private static parseExpiryToSeconds(expiry: string | number): number {
    // If already a number, return it (assuming it's in seconds)
    if (typeof expiry === 'number') {
      return expiry;
    }

    // Define conversion factors from each unit to seconds
    const units: { [key: string]: number } = {
      s: 1,          // seconds
      m: 60,         // minutes = 60 seconds
      h: 3600,       // hours = 60 * 60 seconds
      d: 86400,      // days = 24 * 60 * 60 seconds
      w: 604800,     // weeks = 7 * 24 * 60 * 60 seconds
      y: 31536000,   // years = 365 * 24 * 60 * 60 seconds
    };

    // Parse string format like "15m", "7d", etc.
    // Regex matches: number followed by single letter unit
    const match = expiry.match(/^(\d+)([smhdwy])$/);
    
    // If format doesn't match, log warning and return default
    if (!match) {
      console.warn(`⚠️ Invalid expiry format: "${expiry}", using default 15 minutes`);
      return 900; // Default to 15 minutes (900 seconds)
    }

    // Extract number and unit from regex match
    const [, value, unit] = match;
    
    // Calculate seconds: number * conversion factor
    const seconds = parseInt(value) * (units[unit] || 1);

    return seconds;
  }

  // ============================================
  // UTILITY: Validate Token Format
  // ============================================
  
  /**
   * Check if string matches JWT format
   * 
   * @static
   * @method isValidFormat
   * @description Validates that a string has the correct JWT format (three base64url parts separated by dots).
   * Does not verify signature or content, just checks structural format.
   * 
   * @param {string} token - String to validate
   * @returns {boolean} True if format matches JWT structure
   * 
   * @example
   * // Check format before attempting to decode
   * if (JWTService.isValidFormat(token)) {
   *   const decoded = JWTService.decode(token);
   * }
   */
  static isValidFormat(token: string): boolean {
    // Regex to match JWT format: three base64url parts separated by dots
    // Format: header.payload.signature
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    
    // Test the token against the regex pattern
    return jwtRegex.test(token);
  }

  // ============================================
  // UTILITY: Get Token Type
  // ============================================
  
  /**
   * Determine if token is access or refresh token based on expiry
   * 
   * @static
   * @method getTokenType
   * @description Attempts to determine token type by examining its expiration time.
   * Tokens with shorter expiry (< 1 hour remaining) are assumed to be access tokens.
   * Tokens with longer expiry are assumed to be refresh tokens.
   * 
   * @param {string} token - JWT token to analyze
   * @returns {'access' | 'refresh' | 'unknown'} Token type classification
   * 
   * @example
   * // Determine token type
   * const type = JWTService.getTokenType(token);
   * console.log(`This is a ${type} token`);
   */
  static getTokenType(token: string): 'access' | 'refresh' | 'unknown' {
    try {
      // Decode token without verification to get expiry
      const decoded = this.decode(token);
      
      // Return unknown if decode failed or no expiry
      if (!decoded || !decoded.exp) {
        return 'unknown';
      }

      // Get current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Calculate time left until expiry
      const timeLeft = decoded.exp - currentTime;

      // Classify based on remaining time
      // Assume tokens expiring within 1 hour (3600s) are access tokens
      // Tokens with longer expiry are refresh tokens
      return timeLeft < 3600 ? 'access' : 'refresh';
    } catch (error) {
      // Return unknown on any error
      return 'unknown';
    }
  }

  // ============================================
  // DEBUG: Get Current Configuration
  // ============================================
  
  /**
   * Get current JWT configuration (for debugging)
   * 
   * @static
   * @method getConfig
   * @description Returns the current JWT configuration settings.
   * Useful for debugging and verifying environment variable loading.
   * 
   * @returns {Object} Configuration object with current settings
   * @returns {string} accessTokenExpiry - Current access token expiry setting
   * @returns {string} refreshTokenExpiry - Current refresh token expiry setting
   * @returns {string} issuer - Current issuer setting
   * @returns {string} audience - Current audience setting
   * 
   * @example
   * // Debug configuration
   * const config = JWTService.getConfig();
   * console.log('JWT Config:', config);
   */
  static getConfig(): {
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    issuer: string;
    audience: string;
  } {
    // Return current configuration values
    return {
      accessTokenExpiry: this.ACCESS_TOKEN_EXPIRY, // Access token lifetime
      refreshTokenExpiry: this.REFRESH_TOKEN_EXPIRY, // Refresh token lifetime
      issuer: this.ISSUER, // Token issuer identifier
      audience: this.AUDIENCE, // Token audience identifier
    };
  }
}

// ============================================
// Export for convenience
// ============================================

/**
 * Default export of JWTService class
 * Allows importing as: import JWTService from './jwt.service'
 */
export default JWTService;
