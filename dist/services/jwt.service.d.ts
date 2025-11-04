import { JwtPayload } from 'jsonwebtoken';
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
export declare class JWTService {
    /**
     * Get access token secret from environment
     */
    private static get ACCESS_TOKEN_SECRET();
    /**
     * Get refresh token secret from environment
     */
    private static get REFRESH_TOKEN_SECRET();
    /**
     * Get access token expiry from environment (e.g., "1d", "15m")
     */
    private static get ACCESS_TOKEN_EXPIRY();
    /**
     * Get refresh token expiry from environment (e.g., "7d", "30d")
     */
    private static get REFRESH_TOKEN_EXPIRY();
    /**
     * Get JWT issuer from environment
     */
    private static get ISSUER();
    /**
     * Get JWT audience from environment
     */
    private static get AUDIENCE();
    /**
     * Generate access token (short-lived)
     * @param payload - Data to encode in token
     * @param expiresIn - Optional custom expiry (default: from env)
     * @returns Signed JWT token
     */
    static signAccessToken(payload: IJWTPayload, expiresIn?: string | number): string;
    /**
     * Generate refresh token (long-lived)
     * @param payload - Data to encode in token
     * @param expiresIn - Optional custom expiry (default: from env)
     * @returns Signed JWT refresh token
     */
    static signRefreshToken(payload: IJWTPayload, expiresIn?: string | number): string;
    /**
     * Generate both access and refresh tokens
     * @param payload - Data to encode in tokens
     * @returns Token pair object with both tokens and expiry info
     */
    static signTokenPair(payload: IJWTPayload): ITokenPair;
    /**
     * Verify and decode access token
     * @param token - JWT token to verify
     * @returns Decoded payload if valid
     * @throws Error if token is invalid or expired
     */
    static verifyAccessToken(token: string): IDecodedToken;
    /**
     * Verify and decode refresh token
     * @param token - JWT refresh token to verify
     * @returns Decoded payload if valid
     * @throws Error if token is invalid or expired
     */
    static verifyRefreshToken(token: string): IDecodedToken;
    /**
     * Decode token without verifying signature (use with caution)
     * Useful for checking token expiry without throwing errors
     * @param token - JWT token to decode
     * @returns Decoded payload or null
     */
    static decode(token: string): IDecodedToken | null;
    /**
     * Get verified token payload
     * @param token - JWT token
     * @param isRefreshToken - Whether this is a refresh token
     * @returns Decoded payload
     */
    static getPayload(token: string, isRefreshToken?: boolean): IDecodedToken;
    /**
     * Check if token is expired (without throwing error)
     * @param token - JWT token to check
     * @returns true if expired, false otherwise
     */
    static isExpired(token: string): boolean;
    /**
     * Get token expiration date
     * @param token - JWT token
     * @returns Date object or null
     */
    static getExpiryDate(token: string): Date | null;
    /**
     * Get remaining time until token expires (in seconds)
     * @param token - JWT token
     * @returns Seconds until expiry, or 0 if expired
     */
    static getTimeUntilExpiry(token: string): number;
    /**
     * Generate new access token using refresh token
     * @param refreshToken - Valid refresh token
     * @returns New access token
     */
    static refreshAccessToken(refreshToken: string): string;
    /**
     * Extract token from Authorization header
     * Supports "Bearer <token>" and plain "<token>" formats
     * @param authHeader - Authorization header value
     * @returns Token string or null
     */
    static extractFromHeader(authHeader?: string): string | null;
    /**
     * Parse expiry string (e.g., "15m", "7d", "1d") to seconds
     * @param expiry - Expiry string or number
     * @returns Seconds
     */
    private static parseExpiryToSeconds;
    /**
     * Check if string is valid JWT format
     * @param token - String to validate
     * @returns true if valid JWT format
     */
    static isValidFormat(token: string): boolean;
    /**
     * Determine if token is access or refresh token based on expiry
     * @param token - JWT token
     * @returns 'access' | 'refresh' | 'unknown'
     */
    static getTokenType(token: string): 'access' | 'refresh' | 'unknown';
    /**
     * Get current JWT configuration (for debugging)
     * @returns Configuration object
     */
    static getConfig(): {
        accessTokenExpiry: string;
        refreshTokenExpiry: string;
        issuer: string;
        audience: string;
    };
}
export default JWTService;
//# sourceMappingURL=jwt.service.d.ts.map