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
export declare const getExpiryDate: (days: number) => number;
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
export declare const isExpired: (expiryTimestamp: number) => boolean;
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
export declare function convertBigIntToString<T = any>(obj: T): T;
//# sourceMappingURL=utils.d.ts.map