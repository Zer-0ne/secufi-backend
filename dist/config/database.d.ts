/**
 * @fileoverview Database configuration and connection management
 * @description This module handles Prisma Client initialization, database connection,
 * disconnection, and health checks. It provides utilities for managing the database
 * lifecycle throughout the application.
 *
 * @module config/database
 * @requires @prisma/client - Prisma ORM client for database operations
 *
 * @author Secufi Team
 * @version 1.0.0
 */
import { PrismaClient } from '@prisma/client';
/**
 * Prisma Client instance for database operations
 *
 * @description Creates and exports a singleton instance of PrismaClient with logging configuration.
 * The logging level depends on the environment:
 * - Development: Logs queries, errors, and warnings for debugging
 * - Production: Only logs errors to reduce noise
 *
 * @constant {PrismaClient}
 * @exports prisma
 *
 * @example
 * // Import and use in other files
 * import { prisma } from './config/database';
 * const users = await prisma.user.findMany();
 */
export declare const prisma: PrismaClient<{
    log: ("query" | "warn" | "error")[];
}, "query" | "warn" | "error", import("@prisma/client/runtime/library").DefaultArgs>;
/**
 * Establishes connection to the PostgreSQL database
 *
 * @async
 * @function connectDatabase
 * @description Connects to the database using Prisma Client and logs connection details.
 * This function should be called during application startup.
 *
 * @returns {Promise<void>} Resolves when connection is successful
 * @throws {Error} Throws error if connection fails
 *
 * @example
 * // Connect to database during server startup
 * await connectDatabase();
 * console.log('Database ready');
 */
export declare const connectDatabase: () => Promise<void>;
/**
 * Gracefully disconnects from the database
 *
 * @async
 * @function disconnectDatabase
 * @description Closes all database connections managed by Prisma Client.
 * This function should be called during application shutdown to ensure
 * all database connections are properly closed.
 *
 * @returns {Promise<void>} Resolves when disconnection is complete
 *
 * @example
 * // Disconnect during graceful shutdown
 * process.on('SIGINT', async () => {
 *   await disconnectDatabase();
 *   process.exit(0);
 * });
 */
export declare const disconnectDatabase: () => Promise<void>;
/**
 * Checks the health status of the database connection
 *
 * @async
 * @function checkDatabaseHealth
 * @description Performs a simple query to verify database connectivity.
 * This is useful for health check endpoints and monitoring.
 *
 * @returns {Promise<Object>} Health check result object
 * @returns {string} status - 'healthy' or 'unhealthy'
 * @returns {boolean} connected - Whether database is connected
 * @returns {Error} [error] - Error object if connection failed
 *
 * @example
 * // Use in health check endpoint
 * const health = await checkDatabaseHealth();
 * if (health.connected) {
 *   res.json({ database: 'OK' });
 * }
 */
export declare const checkDatabaseHealth: () => Promise<{
    status: string;
    connected: boolean;
    error?: never;
} | {
    status: string;
    connected: boolean;
    error: unknown;
}>;
//# sourceMappingURL=database.d.ts.map