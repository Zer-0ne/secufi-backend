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
import { JwtPayload } from 'jsonwebtoken';
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
    userId: string;
    email?: string;
    role?: string;
    isAdmin?: boolean;
    [key: string]: any;
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
    userId: string;
    email?: string;
    role?: string;
    isAdmin?: boolean;
    iat?: number;
    exp?: number;
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
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
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
export declare class JWTService {
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
    private static get ACCESS_TOKEN_SECRET();
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
    private static get REFRESH_TOKEN_SECRET();
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
    private static get ACCESS_TOKEN_EXPIRY();
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
    private static get REFRESH_TOKEN_EXPIRY();
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
    private static get ISSUER();
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
    private static get AUDIENCE();
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
    static signAccessToken(payload: IJWTPayload, expiresIn?: string | number): string;
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
    static signRefreshToken(payload: IJWTPayload, expiresIn?: string | number): string;
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
    static signTokenPair(payload: IJWTPayload): ITokenPair;
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
    static verifyAccessToken(token: string): IDecodedToken;
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
    static verifyRefreshToken(token: string): IDecodedToken;
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
    static decode(token: string): IDecodedToken | null;
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
    static getPayload(token: string, isRefreshToken?: boolean): IDecodedToken;
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
    static isExpired(token: string): boolean;
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
    static getExpiryDate(token: string): Date | null;
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
    static getTimeUntilExpiry(token: string): number;
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
    static refreshAccessToken(refreshToken: string): string;
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
    static extractFromHeader(authHeader?: string): string | null;
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
    private static parseExpiryToSeconds;
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
    static isValidFormat(token: string): boolean;
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
    static getTokenType(token: string): 'access' | 'refresh' | 'unknown';
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
    };
}
/**
 * Default export of JWTService class
 * Allows importing as: import JWTService from './jwt.service.js'
 */
export default JWTService;
//# sourceMappingURL=jwt.service.d.ts.map