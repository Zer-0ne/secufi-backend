/**
 * @fileoverview Middleware for handling temporary user data in the application.
 * This module provides functionality to check for temporary users in the database
 * and manage their data during user registration or migration processes.
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Interface defining the structure of temporary user data.
 * This represents the data that can be attached to a request when a temporary user is found.
 */
export interface TempUserData {
    /** Optional name of the temporary user */
    name?: string;
    /** Optional phone number of the temporary user */
    phone?: string;
    /** Optional family ID that invited this user */
    invited_by_family_id?: string;
    /** Optional role assigned during invitation */
    invited_role?: string;
    /** Optional unique identifier for the invitation */
    invitation_id?: string;
}
/**
 * Middleware function to check if an email exists in the TempUser table.
 * If a temporary user is found, their data is attached to the request object for further processing.
 * This allows the application to handle invited users who haven't completed registration yet.
 *
 * @param req - The Express request object, expected to contain an email in the body
 * @param res - The Express response object (not used in this middleware)
 * @param next - The next function to call in the middleware chain
 */
export declare const checkTempUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Utility function to delete a temporary user from the database after successful migration.
 * This is typically called after a temporary user has been converted to a permanent user.
 *
 * @param email - The email address of the temporary user to delete
 * @returns Promise that resolves when the deletion is complete
 */
export declare const deleteTempUser: (email: string) => Promise<void>;
//# sourceMappingURL=temp-user.middleware.d.ts.map