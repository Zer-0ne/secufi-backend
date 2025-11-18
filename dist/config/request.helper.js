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
export function getClientOrigin(req) {
    // Priority 1: Check if CLIENT_ORIGIN is set in environment variables
    // This is the most reliable method as it's explicitly configured by the developer
    // and won't change based on request headers (which can be spoofed)
    if (process.env.CLIENT_ORIGIN) {
        return process.env.CLIENT_ORIGIN;
    }
    // Priority 2: Try to get origin from Referer or Origin HTTP headers
    // Referer header contains the full URL of the previous page
    // Origin header contains just the origin (protocol + domain + port)
    const referer = req.get('referer') || req.get('origin');
    if (referer) {
        // Remove trailing slash for consistency
        // Example: "https://example.com/" becomes "https://example.com"
        return referer.replace(/\/$/, '');
    }
    // Priority 3: Construct origin from protocol and host header
    // req.protocol is 'http' or 'https' (can be set by proxy with X-Forwarded-Proto)
    const protocol = req.protocol || 'http';
    // Host header contains domain and port (e.g., "example.com:3000")
    const host = req.get('host');
    if (host) {
        // Construct full origin URL from protocol and host
        // Example: "https" + "://" + "example.com:3000" = "https://example.com:3000"
        return `${protocol}://${host}`;
    }
    // Priority 4: Fallback to IP address (last resort)
    // This happens when no other information is available
    // req.ip contains the IP address of the client (may be proxy IP)
    // req.socket.remoteAddress is the direct connection IP
    const ip = req.ip || req.socket.remoteAddress || 'localhost:3000';
    // Construct a basic HTTP URL from the IP
    // Note: This is not ideal for production use
    return `http://${ip}`;
}
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
export function getClientIP(req) {
    // Return the first available IP address from multiple sources
    // Using short-circuit evaluation with || operator
    return (
    // Priority 1: req.ip - Express's built-in IP detection
    // This respects the 'trust proxy' setting and can handle proxied requests
    req.ip ||
        // Priority 2: X-Forwarded-For header
        // Set by proxies/load balancers, contains chain of IPs (comma-separated)
        // Example: "client-ip, proxy1-ip, proxy2-ip"
        // We cast to string because req.headers values can be string | string[] | undefined
        req.headers['x-forwarded-for'] ||
        // Priority 3: X-Real-IP header
        // Alternative header used by some proxies (e.g., Nginx)
        // Usually contains a single IP address
        req.headers['x-real-ip'] ||
        // Priority 4: Socket remote address
        // The IP address of the direct connection to the server
        // This might be a proxy IP if behind a load balancer
        req.socket.remoteAddress ||
        // Priority 5: Final fallback
        // Return 'unknown' if no IP information is available
        // This should rarely happen in practice
        'unknown');
}
//# sourceMappingURL=request.helper.js.map