/**
 * @fileoverview Middleware for handling temporary user data in the application.
 * This module provides functionality to check for temporary users in the database
 * and manage their data during user registration or migration processes.
 */
// Import PrismaClient for database operations
import { PrismaClient } from '@prisma/client';
// Initialize Prisma client instance for database interactions
const prisma = new PrismaClient();
/**
 * Middleware function to check if an email exists in the TempUser table.
 * If a temporary user is found, their data is attached to the request object for further processing.
 * This allows the application to handle invited users who haven't completed registration yet.
 *
 * @param req - The Express request object, expected to contain an email in the body
 * @param res - The Express response object (not used in this middleware)
 * @param next - The next function to call in the middleware chain
 */
export const checkTempUser = async (req, res, next) => {
    try {
        // Extract and normalize the email from the request body
        const email = req.body.email?.toLowerCase().trim();
        // If no email is provided, skip the check and proceed to next middleware
        if (!email) {
            return next();
        }
        // Query the database to find a unique temporary user by email
        const tempUser = await prisma.tempUser.findUnique({
            where: { email },
        });
        // If a temporary user is found, log the discovery and attach data to request
        if (tempUser) {
            console.log(`✓ Found temp user for email: ${email}`);
            // Attach the temporary user data to the request object for use in subsequent handlers
            req.tempUserData = {
                name: tempUser.name,
                phone: tempUser.phone,
                invited_by_family_id: tempUser.invited_by_family_id,
                invited_role: tempUser.invited_role,
                invitation_id: tempUser.invitation_id,
            };
        }
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        // Log any errors that occur during the database check
        console.error('Error checking temp user:', error);
        // Continue to next middleware even if check fails to avoid blocking the request
        next();
    }
};
/**
 * Utility function to delete a temporary user from the database after successful migration.
 * This is typically called after a temporary user has been converted to a permanent user.
 *
 * @param email - The email address of the temporary user to delete
 * @returns Promise that resolves when the deletion is complete
 */
export const deleteTempUser = async (email) => {
    try {
        // Delete the temporary user record from the database using normalized email
        await prisma.tempUser.delete({
            where: { email: email.toLowerCase().trim() },
        });
        // Log successful deletion
        console.log(`✓ Deleted temp user: ${email}`);
    }
    catch (error) {
        // Log any errors that occur during deletion
        console.error('Error deleting temp user:', error);
        // Don't throw the error - this is cleanup, not a critical operation
    }
};
//# sourceMappingURL=temp-user.middleware.js.map