/**
 * @fileoverview Utility functions for common operations
 * @description This module provides utility functions for date/time calculations,
 * expiry checking, and BigInt conversion. These utilities are used throughout
 * the application for handling timestamps, token expiry, and data serialization.
 *
 * @module config/utils
 *
 * @author Secufi Team
 * @version 1.0.0
 */
/**
 * Calculates a future expiry timestamp based on current date plus specified days
 *
 * @function getExpiryDate
 * @description Adds the specified number of days to the current date and returns
 * a Unix timestamp (milliseconds since epoch). Useful for setting expiry times
 * for tokens, sessions, invitations, etc.
 *
 * @param {number} days - Number of days from now until expiry
 * @returns {number} Unix timestamp in milliseconds representing the expiry date
 *
 * @example
 * // Get expiry timestamp for 7 days from now
 * const expiryTime = getExpiryDate(7);
 * console.log(expiryTime); // e.g., 1700000000000
 *
 * @example
 * // Use with database records
 * const invitation = await prisma.invitation.create({
 *   data: {
 *     email: 'user@example.com',
 *     expiresAt: getExpiryDate(7) // Expires in 7 days
 *   }
 * });
 */
export const getExpiryDate = (days) => {
    // Create a new Date object representing the current date and time
    const date = new Date();
    // Add the specified number of days to the current date
    // getDate() returns current day of month, setDate() sets new day
    date.setDate(date.getDate() + days);
    // Convert the date to Unix timestamp (milliseconds since Jan 1, 1970)
    // and return as a number for easy storage and comparison
    return date.getTime();
};
/**
 * Checks if a given timestamp has expired (is in the past)
 *
 * @function isExpired
 * @description Compares a timestamp against the current time to determine
 * if it has expired. Returns true if the timestamp is in the past or equal
 * to the current time, false if it's still in the future.
 *
 * @param {number} expiryTimestamp - Unix timestamp in milliseconds to check
 * @returns {boolean} True if expired (timestamp <= current time), false if still valid
 *
 * @example
 * // Check if a token has expired
 * const tokenExpiry = 1700000000000;
 * if (isExpired(tokenExpiry)) {
 *   console.log('Token has expired');
 * } else {
 *   console.log('Token is still valid');
 * }
 *
 * @example
 * // Check invitation expiry in middleware
 * const invitation = await prisma.invitation.findUnique({ where: { id } });
 * if (isExpired(invitation.expiresAt)) {
 *   throw new Error('Invitation has expired');
 * }
 */
export const isExpired = (expiryTimestamp) => {
    // Get the current timestamp in milliseconds
    const now = Date.now();
    // Compare current time with expiry timestamp
    // Returns true if current time >= expiry time (expired)
    // Returns false if current time < expiry time (still valid)
    return now >= expiryTimestamp;
};
/**
 * Recursively converts BigInt values to strings in objects, arrays, and primitives
 *
 * @template T - The type of the input object
 * @function convertBigIntToString
 * @description Deeply traverses an object, array, or primitive value and converts
 * any BigInt values to strings. This is necessary because JSON.stringify() cannot
 * handle BigInt values and will throw an error. Commonly used when returning
 * database results that contain BigInt fields (like auto-increment IDs) in API responses.
 *
 * @param {T} obj - The object, array, or primitive to convert
 * @returns {T} A new object/array/primitive with all BigInt values converted to strings
 *
 * @example
 * // Convert a simple BigInt
 * const id = convertBigIntToString(9007199254740991n);
 * console.log(id); // "9007199254740991" (string)
 *
 * @example
 * // Convert an object with BigInt fields
 * const user = {
 *   id: 123n,
 *   name: "John",
 *   balance: 1000000n
 * };
 * const converted = convertBigIntToString(user);
 * // Result: { id: "123", name: "John", balance: "1000000" }
 *
 * @example
 * // Convert database results before sending as JSON
 * const users = await prisma.user.findMany();
 * const safeUsers = convertBigIntToString(users);
 * res.json({ data: safeUsers }); // Safe to serialize
 */
export function convertBigIntToString(obj) {
    // Handle null and undefined cases first
    // If the input is null or undefined, return it as-is
    if (obj === null || obj === undefined) {
        return obj;
    }
    // Check if the value is a BigInt
    // BigInt values cannot be serialized to JSON, so convert to string
    if (typeof obj === 'bigint') {
        // Convert BigInt to string and cast back to type T
        // The cast is safe because we're maintaining the structure
        return String(obj);
    }
    // Handle arrays by recursively converting each element
    // Array.isArray() checks if obj is an array
    if (Array.isArray(obj)) {
        // Map over each item in the array and recursively convert
        // This handles nested arrays and objects within arrays
        return obj.map(item => convertBigIntToString(item));
    }
    // Handle objects (plain objects, not arrays, functions, etc.)
    // typeof obj === 'object' is true for objects (and null, which we handled above)
    if (typeof obj === 'object') {
        // Create a new empty object to store converted values
        const result = {};
        // Iterate over all enumerable properties of the object
        for (const key in obj) {
            // Check if the property is a direct property (not inherited)
            // This ensures we only process properties that belong to the object itself
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Recursively convert the value for this property
                // This handles nested objects, arrays, BigInts, etc.
                result[key] = convertBigIntToString(obj[key]);
            }
        }
        // Return the converted object, cast back to type T
        return result;
    }
    // If the value is a primitive (string, number, boolean, symbol)
    // Return it unchanged as it's already JSON-safe
    return obj;
}
//# sourceMappingURL=utils.js.map