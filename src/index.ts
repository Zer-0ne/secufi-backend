/**
 * @fileoverview Main application entry point for the Secufi Backend API
 * @description This file initializes the Express server, configures middleware,
 * sets up routes, handles database connections, and manages server lifecycle.
 * It serves as the central hub for all API endpoints and application configuration.
 * 
 * @module index
 * @requires express - Web framework for Node.js
 * @requires cors - Cross-Origin Resource Sharing middleware
 * @requires dotenv - Environment variable loader
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

// Import reflection metadata for TypeScript decorators (currently commented out)
// import 'reflect-metadata';

// Import Express framework and its types for building the API server
import express, { Request, Response, NextFunction } from 'express';

// Import CORS middleware to handle cross-origin requests from frontend
import cors from 'cors';

// Import dotenv to load environment variables from .env file
import { config } from 'dotenv';

// Import database connection utilities and Prisma client instance
import { connectDatabase, disconnectDatabase, checkDatabaseHealth, prisma } from './config/database';

// Import server authentication service
// import { ServerAuthService } from './services/server-auth.service';

// Import all route handlers for different API endpoints
import googleRouter from '@routes/google.routes'; // Google OAuth and Gmail API routes
import userRouter from './routes/user.routes'; // User management routes
import emailProcessingRouter from './routes/email-processing.routes'; // Email parsing and processing routes
import smsRouter from './routes/sms.route'; // SMS sending and management routes
import vaultRoutes from './routes/vault.routes'; // Secure vault for storing assets routes
import familyRoutes from './routes/family.routes'; // Family member management routes
import assetSharingRouter from './routes/asset-sharing.routes'; // Asset sharing between users routes
import deviceInfoRouter from './routes/get-device-info.route'; // Device information retrieval routes
import { ServerAuthService } from './services/server-auth.service';

// ============================================
// Environment Configuration
// ============================================

/**
 * Load environment variables from .env file
 * This must be called before accessing any process.env variables
 */
config();

// Log Google Client ID for debugging purposes (should be removed in production)
console.log(process.env.GOOGLE_CLIENT_ID);

/**
 * Create Express application instance
 * This is the main application object that will handle all HTTP requests
 */
const app = express();

// ============================================
// Middleware Configuration
// ============================================

/**
 * CORS (Cross-Origin Resource Sharing) middleware
 * Allows frontend applications from different origins to make requests to this API
 * 
 * Configuration:
 * - origin: '*' - Allows requests from any origin (should be restricted in production)
 * - credentials: true - Allows cookies and authentication headers to be sent
 */
app.use(cors({
  origin: '*', // Allow all origins (SECURITY NOTE: Restrict in production)
  credentials: true // Allow credentials like cookies and authorization headers
}));

/**
 * JSON body parser middleware
 * Parses incoming JSON payloads and makes them available in req.body
 * 
 * @param limit - Maximum size of JSON payload (10MB)
 */
app.use(express.json({ limit: '10mb' }));

/**
 * URL-encoded body parser middleware
 * Parses URL-encoded form data (e.g., from HTML forms)
 * 
 * @param extended - Uses qs library for parsing (allows nested objects)
 * @param limit - Maximum size of form data (10MB)
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request logging middleware
 * Logs basic information about each incoming request
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function in the chain
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  // Log timestamp, HTTP method, and request path
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Pass control to the next middleware
  next();
});

/**
 * Response timing and logging middleware
 * Measures and logs the response time and status code for each request
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function in the chain
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  // Record the start time of the request
  const startTime = Date.now();
  
  // Store the original send function to call it later
  const originalSend = res.send;
  
  /**
   * Override the send function to log response details
   * This wraps the original send to intercept and log before sending
   * 
   * @param body - Response body to send to client
   * @returns Response object for chaining
   */
  res.send = function(body?: any): Response {
    // Calculate request processing duration in milliseconds
    const duration = Date.now() - startTime;
    
    // Get the HTTP status code of the response
    const statusCode = res.statusCode;
    
    // Log detailed request completion information
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - Status: ${statusCode} - ${duration}ms`
    );
    
    // Call the original send function with the response body
    return originalSend.call(this, body);
  };
  
  // Pass control to the next middleware
  next();
});

// ============================================
// Routes Configuration
// ============================================

/**
 * Health check endpoint
 * Returns server status and database health information
 * 
 * @route GET /health
 * @returns {Object} JSON response with server and database status
 * @returns {string} status - Server status ('OK' if running)
 * @returns {string} message - Human-readable status message
 * @returns {string} timestamp - Current server timestamp
 * @returns {Object} database - Database connection health information
 */
app.get('/health', async (req: Request, res: Response) => {
  // Check database connection health
  const dbHealth = await checkDatabaseHealth();
  
  // Send health status response
  res.json({
    status: 'OK', // Server is running
    message: 'Server is running', // Status message
    timestamp: new Date().toISOString(), // Current timestamp
    database: dbHealth // Database health details
  });
});

/**
 * Database connection test endpoint
 * Executes a test query to verify database connectivity
 * 
 * @route GET /api/db-test
 * @returns {Object} JSON response with database connection result
 * @returns {boolean} success - Whether the database query was successful
 * @returns {string} message - Success or error message
 * @returns {Object} [data] - Query result if successful
 * @returns {string} [error] - Error message if failed
 */
app.get('/api/db-test', async (req: Request, res: Response) => {
  try {
    // Execute raw SQL query to get database information
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    
    // Send success response with query results
    res.json({
      success: true, // Query executed successfully
      message: 'Database connection successful', // Success message
      data: result // Query results (database name, user, version)
    });
  } catch (error: any) {
    // Send error response if database query fails
    res.status(500).json({
      success: false, // Query failed
      message: 'Database connection failed', // Error message
      error: error.message // Detailed error message
    });
  }
});

// ============================================
// API Routes Registration
// ============================================

/**
 * Device information routes
 * Handles requests for device and browser information
 * @route /* - All device info related endpoints
 */
app.use('/', deviceInfoRouter);

/**
 * Google OAuth and Gmail routes
 * Handles Google authentication and Gmail API operations
 * @route /api/google/* - All Google-related endpoints
 */
app.use('/api/google', googleRouter);

/**
 * User management routes
 * Handles user registration, login, profile management
 * @route /api/users/* - All user-related endpoints
 */
app.use('/api/users', userRouter);

/**
 * SMS service routes
 * Handles sending and managing SMS messages
 * @route /api/sms/* - All SMS-related endpoints
 */
app.use('/api/sms', smsRouter);

/**
 * Email processing routes
 * Handles email parsing, extraction, and analysis
 * @route /api/email-processing/* - All email processing endpoints
 */
app.use('/api/email-processing', emailProcessingRouter);

/**
 * Family management routes
 * Handles family member management and relationships
 * @route /api/family/* - All family-related endpoints
 */
app.use('/api/family', familyRoutes);

/**
 * Vault routes
 * Handles secure storage and retrieval of sensitive assets
 * @route /api/vault/* - All vault-related endpoints
 */
app.use('/api/vault', vaultRoutes);

/**
 * Asset sharing routes
 * Handles sharing assets between users and family members
 * @route /api/asset-sharing/* - All asset sharing endpoints
 */
app.use('/api/asset-sharing', assetSharingRouter);

// ============================================
// Error Handling Middleware
// ============================================

/**
 * 404 Not Found handler
 * Catches all requests to undefined routes
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns {Object} JSON error response
 */
app.use((req: Request, res: Response) => {
  // Send 404 error response for undefined routes
  res.status(404).json({
    success: false, // Request failed
    message: 'Route not found', // Error message
    path: req.path // The path that was not found
  });
});

/**
 * Global error handler middleware
 * Catches all errors thrown in the application
 * 
 * @param err - Error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function (required for error handlers)
 * @returns {Object} JSON error response
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error details to console for debugging
  console.error('Error:', err);
  
  // Send error response to client
  res.status(err.statusCode || 500).json({
    success: false, // Request failed
    message: err.message || 'Internal Server Error', // Error message
    // Include stack trace only in development environment
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// Server Startup and Lifecycle Management
// ============================================

/**
 * Port number for the server to listen on
 * Uses PORT from environment variables, defaults to 5000
 * @constant {number}
 */
const PORT = process.env.PORT || 5000;

/**
 * Starts the Express server and establishes database connection
 * 
 * @async
 * @function startServer
 * @returns {Promise<void>}
 * @throws {Error} If database connection or server startup fails
 */
const startServer = async () => {
  try {
    // Validate server authorization before starting
    await ServerAuthService.validateServerAuth();
    
    // Establish connection to the database
    await connectDatabase();
    
    // Start the Express server and listen for incoming requests
    app.listen(PORT, () => {
      // Print formatted server startup message
      console.log('\n' + '='.repeat(50));
      console.log('🚀 Server Started Successfully');
      console.log('='.repeat(50));
      console.log(`   Port: ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   Health Check: http://localhost:${PORT}/health`);
      console.log(`   DB Test: http://localhost:${PORT}/api/db-test`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    // Log error and exit process if server startup fails
    console.error('❌ Server startup failed:', error);
    process.exit(1); // Exit with error code 1
  }
};

/**
 * SIGTERM signal handler
 * Gracefully shuts down the server when SIGTERM is received
 * (e.g., from deployment systems or process managers)
 * 
 * @event SIGTERM
 */
process.on('SIGTERM', async () => {
  // Log shutdown initiation
  console.log('SIGTERM received. Closing server...');
  
  // Disconnect from database before exiting
  await disconnectDatabase();
  
  // Exit process successfully
  process.exit(0);
});

/**
 * SIGINT signal handler
 * Gracefully shuts down the server when SIGINT is received
 * (e.g., Ctrl+C in terminal)
 * 
 * @event SIGINT
 */
process.on('SIGINT', async () => {
  // Log shutdown initiation
  console.log('\nSIGINT received. Closing server...');
  
  // Disconnect from database before exiting
  await disconnectDatabase();
  
  // Exit process successfully
  process.exit(0);
});

// ============================================
// Application Bootstrap
// ============================================

/**
 * Initialize and start the server
 * This is the entry point of the application
 */
startServer();
