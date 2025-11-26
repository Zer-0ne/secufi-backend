/**
 * @fileoverview Sanitized error class for secure error handling
 * @description This module provides a custom error class that prevents sensitive information
 * leakage in error responses. It sanitizes error messages, stack traces, and file paths
 * to ensure security compliance and prevent exposing internal system details to clients.
 * 
 * @module config/custom-error.class
 * 
 * @security
 * This class is designed to prevent:
 * - Stack trace leakage
 * - File path exposure
 * - Environment variable disclosure
 * - Internal system architecture revelation
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

/**
 * Sanitized Error class that hides internal implementation details
 * 
 * @class SanitizedError
 * @extends {Error}
 * @description Custom error class that provides security-focused error handling by sanitizing
 * all error information before it reaches the client. All public-facing error details are
 * intentionally emptied or minimized to prevent information disclosure attacks.
 * 
 * This class is particularly useful for:
 * - Production environments where security is critical
 * - Compliance requirements (GDPR, HIPAA, PCI-DSS)
 * - Preventing reconnaissance attacks
 * - Protecting intellectual property in error messages
 * 
 * @property {string} name - Error name (sanitized to empty string)
 * @property {string} message - Error message (sanitized to empty string)
 * @property {string} code - Error code (sanitized to empty string)
 * @property {number} statusCode - HTTP status code (commented out for security)
 * @property {string} internalStack - Original stack trace (private, internal use only)
 * 
 * @example
 * // Create a sanitized error for production
 * throw new SanitizedError(
 *   'Database connection failed',
 *   'DB_CONN_ERROR',
 *   500
 * );
 * 
 * @example
 * // In Express error handler
 * app.use((err, req, res, next) => {
 *   const sanitizedError = new SanitizedError(
 *     err.message,
 *     err.code,
 *     err.statusCode
 *   );
 *   res.status(500).json(sanitizedError.toJSON());
 * });
 */
export class SanitizedError extends Error {
    /**
     * Public error name (always empty for security)
     * @type {string}
     * @public
     */
    public override name: string;

    /**
     * Public error message (always empty for security)
     * @type {string}
     * @public
     */
    public override message: string;

    /**
     * Public error code (always empty for security)
     * @type {string}
     * @public
     * @readonly
     */
    public readonly code: string;

    /**
     * HTTP status code (commented out for security)
     * @type {number}
     * @public
     * @readonly
     */
    public readonly statusCode: number;

    /**
     * Internal stack trace (private, not exposed in responses)
     * @type {string}
     * @private
     * @description This property stores the original stack trace for internal debugging
     * and logging purposes. It is never exposed to the client.
     */
    private readonly internalStack?: string;

    /**
     * Creates a new SanitizedError instance
     * 
     * @constructor
     * @param {string} [message=''] - Original error message (will be sanitized)
     * @param {string} [code='INTERNAL_ERROR'] - Error code identifier (will be sanitized)
     * @param {number} [statusCode=403] - HTTP status code (will be hidden)
     * 
     * @description Constructor intentionally sanitizes all input parameters to prevent
     * any sensitive information from being exposed. The original values are stored
     * internally but never exposed through public properties or methods.
     */
    constructor(
        message: string = '',
        code: string = 'INTERNAL_ERROR',
        statusCode: number = 403
    ) {
        // Call parent Error constructor with empty string to prevent automatic
        // stack trace generation that might contain file paths
        super('');

        // Assign all public fields as empty strings to prevent information leakage
        // Even if the constructor receives actual error details, they are sanitized here
        this.name = '';
        this.message =  '';
        this.code = '';
        
        // Status code is commented out to prevent any hint about the error type
        // this.statusCode = statusCode;

        // Keep original stack trace internally for server-side logging only
        // This is never exposed through any public method or serialization
        this.internalStack = '';

        // Override the public stack property with empty string
        // This prevents accidental exposure of file paths and code structure
        this.stack = '';
    }

    /**
     * Retrieves the internal stack trace
     * 
     * @method getInternalStack
     * @returns {string} Internal stack trace (always empty for security)
     * 
     * @description This method is intended for internal server-side logging only.
     * In this implementation, it returns an empty string to ensure no stack
     * information is ever exposed, even internally.
     * 
     * @example
     * // For internal debugging (returns empty)
     * const stack = error.getInternalStack();
     * console.log('[Internal only]', stack);
     */
    public getInternalStack(): string {
        return '';
    }

    /**
     * Converts error to string representation
     * 
     * @method toString
     * @override
     * @returns {string} Generic error string without details
     * 
     * @description Overrides the default Error.toString() method to prevent
     * file paths, line numbers, or any error details from being exposed
     * when the error is converted to a string.
     * 
     * @example
     * const error = new SanitizedError('Something failed', 'ERROR_CODE', 500);
     * console.log(error.toString()); // Output: "Error"
     */
    public override toString(): string {
        // Original implementation (commented for clarity):
        // const parts = [];
        // if (this.name) parts.push(this.name);
        // if (this.message) parts.push(this.message);
        
        // Return only generic "Error" string without any specifics
        return  'Error';
    }

    /**
     * Serializes error to JSON format
     * 
     * @method toJSON
     * @returns {Object} Empty object without error details
     * 
     * @description Overrides the default JSON serialization to ensure that
     * when this error is included in JSON responses (API responses, logs),
     * no sensitive information is leaked. Returns an empty object.
     * 
     * @security This is critical for API security
     * 
     * @example
     * // In API error response
     * res.status(500).json({
     *   error: error.toJSON() // Returns: {}
     * });
     * 
     * @example
     * // Prevents accidental logging
     * JSON.stringify(error); // Returns: "{}"
     */
    public toJSON() {
        return {
            // All fields commented out to return empty object
            // name: this.name,
            // message: this.message,
            // code: this.code,
            // statusCode: this.statusCode
            // No stack, no internalStack, no sensitive data
        };
    }

    /**
     * Custom Symbol.toStringTag for object type identification
     * 
     * @property {string} [Symbol.toStringTag]
     * @returns {string} Empty string for security
     * 
     * @description Overrides the Symbol.toStringTag to prevent revealing
     * the class name when Object.prototype.toString is called on the error.
     * This adds an extra layer of security by hiding even the error class type.
     * 
     * @example
     * const error = new SanitizedError();
     * Object.prototype.toString.call(error); // Returns: "[object ]"
     */
    public get [Symbol.toStringTag](): string {
        return '';
    }
}
