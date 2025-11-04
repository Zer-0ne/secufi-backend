// services/jwt.service.ts

import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

/**
 * Interface for JWT payload
 */
export interface IJWTPayload {
  userId: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

/**
 * Interface for decoded token
 */
export interface IDecodedToken extends JwtPayload {
  userId: string | ObjectId;
  email?: string;
  role?: string;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Interface for token pair (access + refresh)
 */
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * JWT Utility Class
 * All methods are static for easy usage without instantiation
 * ✅ Uses getter methods for dynamic environment variable loading
 */
export class JWTService {
  // ============================================
  // Configuration (Dynamic getters for environment variables)
  // ✅ FIXED: Changed from static readonly to getter methods
  // ============================================

  /**
   * Get access token secret from environment
   */
  private static get ACCESS_TOKEN_SECRET(): string {
    return process.env.JWT_SECRET || 'your-secret-key-change-this';
  }

  /**
   * Get refresh token secret from environment
   */
  private static get REFRESH_TOKEN_SECRET(): string {
    return process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this';
  }

  /**
   * Get access token expiry from environment (e.g., "1d", "15m")
   */
  private static get ACCESS_TOKEN_EXPIRY(): string {
    return process.env.JWT_EXPIRY || '1d';
  }

  /**
   * Get refresh token expiry from environment (e.g., "7d", "30d")
   */
  private static get REFRESH_TOKEN_EXPIRY(): string {
    return process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  /**
   * Get JWT issuer from environment
   */
  private static get ISSUER(): string {
    return process.env.JWT_ISSUER || 'your-app-name';
  }

  /**
   * Get JWT audience from environment
   */
  private static get AUDIENCE(): string {
    return process.env.JWT_AUDIENCE || 'your-app-users';
  }

  // ============================================
  // SIGN: Create Access Token
  // ============================================
  /**
   * Generate access token (short-lived)
   * @param payload - Data to encode in token
   * @param expiresIn - Optional custom expiry (default: from env)
   * @returns Signed JWT token
   */
  static signAccessToken(payload: IJWTPayload, expiresIn?: string | number): string {
    try {
      const options: SignOptions = {
        expiresIn: (expiresIn || this.ACCESS_TOKEN_EXPIRY as any),
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
        algorithm: 'HS256',
      };

      console.log('🔑 Signing access token with expiry:', options.expiresIn);

      const token = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, options);
      return token;
    } catch (error) {
      console.error('❌ Error signing access token:', error);
      throw new Error('Failed to generate access token');
    }
  }

  // ============================================
  // SIGN: Create Refresh Token
  // ============================================
  /**
   * Generate refresh token (long-lived)
   * @param payload - Data to encode in token
   * @param expiresIn - Optional custom expiry (default: from env)
   * @returns Signed JWT refresh token
   */
  static signRefreshToken(payload: IJWTPayload, expiresIn?: string | number): string {
    try {
      const options: SignOptions = {
        expiresIn: (expiresIn || this.REFRESH_TOKEN_EXPIRY as any),
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
        algorithm: 'HS256',
      };

      console.log('🔄 Signing refresh token with expiry:', options.expiresIn);

      const token = jwt.sign(payload, this.REFRESH_TOKEN_SECRET, options);
      return token;
    } catch (error) {
      console.error('❌ Error signing refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  // ============================================
  // SIGN: Create Token Pair (Access + Refresh)
  // ============================================
  /**
   * Generate both access and refresh tokens
   * @param payload - Data to encode in tokens
   * @returns Token pair object with both tokens and expiry info
   */
  static signTokenPair(payload: IJWTPayload): ITokenPair {
    try {
      const accessToken = this.signAccessToken(payload);
      const refreshToken = this.signRefreshToken(payload);

      // Calculate expiry in seconds
      const expiresIn = this.parseExpiryToSeconds(this.ACCESS_TOKEN_EXPIRY);

      console.log('✅ Token pair created successfully');
      console.log('   Access expires in:', expiresIn, 'seconds');

      return {
        accessToken,
        refreshToken,
        expiresIn,
      };
    } catch (error) {
      console.error('❌ Error signing token pair:', error);
      throw new Error('Failed to generate token pair');
    }
  }

  // ============================================
  // VERIFY: Verify Access Token
  // ============================================
  /**
   * Verify and decode access token
   * @param token - JWT token to verify
   * @returns Decoded payload if valid
   * @throws Error if token is invalid or expired
   */
  static verifyAccessToken(token: string): IDecodedToken {
    try {
      const options: VerifyOptions = {
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
        algorithms: ['HS256'],
      };

      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET, options) as IDecodedToken;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else if (error instanceof jwt.NotBeforeError) {
        throw new Error('Token not yet active');
      }
      throw new Error('Token verification failed');
    }
  }

  // ============================================
  // VERIFY: Verify Refresh Token
  // ============================================
  /**
   * Verify and decode refresh token
   * @param token - JWT refresh token to verify
   * @returns Decoded payload if valid
   * @throws Error if token is invalid or expired
   */
  static verifyRefreshToken(token: string): IDecodedToken {
    try {
      const options: VerifyOptions = {
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
        algorithms: ['HS256'],
      };

      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET, options) as IDecodedToken;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw new Error('Refresh token verification failed');
    }
  }

  // ============================================
  // DECODE: Decode Without Verification
  // ============================================
  /**
   * Decode token without verifying signature (use with caution)
   * Useful for checking token expiry without throwing errors
   * @param token - JWT token to decode
   * @returns Decoded payload or null
   */
  static decode(token: string): IDecodedToken | null {
    try {
      const decoded = jwt.decode(token) as IDecodedToken;
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // ============================================
  // DECODE: Get Token Payload (verified)
  // ============================================
  /**
   * Get verified token payload
   * @param token - JWT token
   * @param isRefreshToken - Whether this is a refresh token
   * @returns Decoded payload
   */
  static getPayload(token: string, isRefreshToken = false): IDecodedToken {
    return isRefreshToken ? this.verifyRefreshToken(token) : this.verifyAccessToken(token);
  }

  // ============================================
  // UTILITY: Check if Token is Expired
  // ============================================
  /**
   * Check if token is expired (without throwing error)
   * @param token - JWT token to check
   * @returns true if expired, false otherwise
   */
  static isExpired(token: string): boolean {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // ============================================
  // UTILITY: Get Token Expiry Date
  // ============================================
  /**
   * Get token expiration date
   * @param token - JWT token
   * @returns Date object or null
   */
  static getExpiryDate(token: string): Date | null {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) {
        return null;
      }

      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  // ============================================
  // UTILITY: Get Time Until Expiry
  // ============================================
  /**
   * Get remaining time until token expires (in seconds)
   * @param token - JWT token
   * @returns Seconds until expiry, or 0 if expired
   */
  static getTimeUntilExpiry(token: string): number {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) {
        return 0;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTime;
      return timeLeft > 0 ? timeLeft : 0;
    } catch (error) {
      return 0;
    }
  }

  // ============================================
  // REFRESH: Generate New Access Token from Refresh Token
  // ============================================
  /**
   * Generate new access token using refresh token
   * @param refreshToken - Valid refresh token
   * @returns New access token
   */
  static refreshAccessToken(refreshToken: string): string {
    try {
      // Verify refresh token
      const decoded = this.verifyRefreshToken(refreshToken);

      // Create new payload (remove jwt-specific fields)
      const { iat, exp, aud, iss, ...payload } = decoded;

      console.log('🔄 Refreshing access token for user:', payload.userId);

      // Generate new access token
      return this.signAccessToken(payload as IJWTPayload);
    } catch (error) {
      throw new Error('Failed to refresh access token: ' + (error as Error).message);
    }
  }

  // ============================================
  // UTILITY: Extract Token from Header
  // ============================================
  /**
   * Extract token from Authorization header
   * Supports "Bearer <token>" and plain "<token>" formats
   * @param authHeader - Authorization header value
   * @returns Token string or null
   */
  static extractFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    // Support both "Bearer token" and "token" formats
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return authHeader;
  }

  // ============================================
  // UTILITY: Parse Expiry String to Seconds
  // ============================================
  /**
   * Parse expiry string (e.g., "15m", "7d", "1d") to seconds
   * @param expiry - Expiry string or number
   * @returns Seconds
   */
  private static parseExpiryToSeconds(expiry: string | number): number {
    if (typeof expiry === 'number') {
      return expiry;
    }

    const units: { [key: string]: number } = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
      w: 604800,
      y: 31536000,
    };

    const match = expiry.match(/^(\d+)([smhdwy])$/);
    if (!match) {
      console.warn(`⚠️ Invalid expiry format: "${expiry}", using default 15 minutes`);
      return 900; // Default 15 minutes
    }

    const [, value, unit] = match;
    const seconds = parseInt(value) * (units[unit] || 1);

    return seconds;
  }

  // ============================================
  // UTILITY: Validate Token Format
  // ============================================
  /**
   * Check if string is valid JWT format
   * @param token - String to validate
   * @returns true if valid JWT format
   */
  static isValidFormat(token: string): boolean {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    return jwtRegex.test(token);
  }

  // ============================================
  // UTILITY: Get Token Type
  // ============================================
  /**
   * Determine if token is access or refresh token based on expiry
   * @param token - JWT token
   * @returns 'access' | 'refresh' | 'unknown'
   */
  static getTokenType(token: string): 'access' | 'refresh' | 'unknown' {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) {
        return 'unknown';
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTime;

      // Assume tokens expiring within 1 hour are access tokens
      // Tokens with longer expiry are refresh tokens
      return timeLeft < 3600 ? 'access' : 'refresh';
    } catch (error) {
      return 'unknown';
    }
  }

  // ============================================
  // DEBUG: Get Current Configuration
  // ============================================
  /**
   * Get current JWT configuration (for debugging)
   * @returns Configuration object
   */
  static getConfig(): {
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    issuer: string;
    audience: string;
  } {
    return {
      accessTokenExpiry: this.ACCESS_TOKEN_EXPIRY,
      refreshTokenExpiry: this.REFRESH_TOKEN_EXPIRY,
      issuer: this.ISSUER,
      audience: this.AUDIENCE,
    };
  }
}

// ============================================
// Export for convenience
// ============================================
export default JWTService;