/**
 * @fileoverview HTTP request helper utilities
 * @description This module provides utility functions for extracting client information
 * from Express HTTP requests, such as client origin URL and IP address. These helpers
 * are useful for security, logging, CORS configuration, and tracking user connections.
 *
 * @module config/request.helper
 * @requires express - Express Request type for type safety
 *
 * @author Secufi Team
 * @version 1.0.0
 */
import { Request } from 'express';
/**
 * Extracts the client's origin URL from an HTTP request
 *
 * @function getClientOrigin
 * @description Determines the origin (base URL) of the client making the request.
 * This is useful for CORS configuration, redirect URLs, OAuth callbacks, and
 * generating absolute URLs in responses. The function follows a priority order
 * to ensure the most reliable origin is returned.
 *
 * Priority order:
 * 1. Environment variable CLIENT_ORIGIN (most reliable, manually configured)
 * 2. Referer or Origin HTTP headers (from the request)
 * 3. Protocol + Host header (constructed from request metadata)
 * 4. IP address fallback (last resort)
 *
 * @param {Request} req - Express request object containing headers and metadata
 * @returns {string} The client's origin URL (e.g., "https://example.com")
 *
 * @example
 * // In a route handler
 * app.get('/auth/callback', (req, res) => {
 *   const origin = getClientOrigin(req);
 *   // Redirect back to client after authentication
 *   res.redirect(`${origin}/dashboard`);
 * });
 *
 * @example
 * // For OAuth redirect URIs
 * const redirectUri = `${getClientOrigin(req)}/auth/google/callback`;
 *
 * @example
 * // For CORS dynamic origin
 * const allowedOrigin = getClientOrigin(req);
 * res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
 */
export declare function getClientOrigin(req: Request): string;
/**
 * Extracts the client's IP address from an HTTP request
 *
 * @function getClientIP
 * @description Determines the real IP address of the client making the request.
 * This is important for security logging, rate limiting, geolocation, and
 * fraud detection. The function checks multiple sources to find the real client IP,
 * especially when requests pass through proxies or load balancers.
 *
 * Priority order:
 * 1. req.ip (Express's built-in IP, considers trust proxy setting)
 * 2. X-Forwarded-For header (standard proxy header, may contain multiple IPs)
 * 3. X-Real-IP header (alternative proxy header, usually single IP)
 * 4. Socket remote address (direct connection IP)
 * 5. 'unknown' as final fallback
 *
 * @param {Request} req - Express request object containing IP information
 * @returns {string} The client's IP address (e.g., "192.168.1.1") or 'unknown'
 *
 * @example
 * // Log client IP for security audit
 * app.use((req, res, next) => {
 *   const clientIP = getClientIP(req);
 *   console.log(`Request from IP: ${clientIP}`);
 *   next();
 * });
 *
 * @example
 * // Rate limiting by IP
 * const clientIP = getClientIP(req);
 * const requestCount = await redis.incr(`rate:${clientIP}`);
 * if (requestCount > 100) {
 *   throw new Error('Rate limit exceeded');
 * }
 *
 * @example
 * // Store IP for security logs
 * await prisma.loginAttempt.create({
 *   data: {
 *     userId: user.id,
 *     ipAddress: getClientIP(req),
 *     timestamp: new Date()
 *   }
 * });
 */
export declare function getClientIP(req: Request): string;
//# sourceMappingURL=request.helper.d.ts.map