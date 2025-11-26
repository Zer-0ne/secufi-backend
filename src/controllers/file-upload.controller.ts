/**
 * @fileoverview Controller for handling file upload and extraction operations
 * @description This controller manages file uploads, password-protected file checking,
 * and content extraction from various file formats including PDFs, Excel files, and documents.
 * It integrates with AI services for password guessing and file processing.
 * 
 * @module controllers/file-upload.controller
 * @requires express - Express Request and Response types for HTTP handling
 * @requires @/config/database - Prisma database client for data operations
 * @requires @/services/file-extraction.service - File extraction service for processing files
 * @requires @/services/ai.service - AI service for password guessing and content analysis
 * @requires @/middlewares/auth.middleware - AuthenticatedRequest type for authenticated requests
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { FileExtractionService } from '@/services/file-extraction.service';
import { AIService } from '@/services/ai.service';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

/**
 * Controller class for managing file upload and extraction functionality
 * 
 * @class FileUploadController
 * @description Handles file uploads, password protection checking, and content extraction
 * from various file formats. Provides endpoints for checking file locks and processing
 * uploaded files for financial data extraction.
 * 
 * @static
 */
export class FileUploadController {
	/**
	 * Checks if a file is locked or password-protected before processing
	 * 
	 * @method checkFileLock
	 * @async
	 * @static
	 * 
	 * @description This method performs a preliminary check on an uploaded file to determine
	 * if it is password-protected or locked. It validates the file, extracts metadata,
	 * and attempts to access the file content. If a password is provided, it tests
	 * whether the password can unlock the file.
	 * 
	 * This is useful for:
	 * - Pre-upload validation
	 * - Determining if user needs to provide a password
	 * - Avoiding unnecessary processing of inaccessible files
	 * - Providing immediate feedback about file accessibility
	 * 
	 * @param {AuthenticatedRequest} req - Express request with authenticated user
	 * @param {Express.Multer.File} req.file - Uploaded file from multer middleware (required)
	 * @param {string} [req.body.password] - Optional password to test file access
	 * @param {Response} res - Express response object
	 * 
	 * @returns {Promise<Response>} JSON response with file lock status
	 * 
	 * @throws {400} If no file is provided in the request
	 * @throws {403} If file is locked/password-protected or cannot be opened
	 * @throws {500} If an unexpected error occurs during checking
	 * 
	 * @example
	 * // Request format (multipart/form-data)
	 * POST /api/files/check-lock
	 * Authorization: Bearer <jwt_token>
	 * Content-Type: multipart/form-data
	 * 
	 * file: [binary file data]
	 * password: "optional-password-to-test" (optional)
	 * 
	 * @example
	 * // Success response (file is accessible)
	 * {
	 *   "success": true,
	 *   "isLocked": false,
	 *   "needsPassword": false,
	 *   "canOpen": true,
	 *   "message": "File is accessible without password"
	 * }
	 * 
	 * @example
	 * // Failure response (file is password-protected)
	 * {
	 *   "success": false,
	 *   "isLocked": true,
	 *   "needsPassword": true,
	 *   "canOpen": false,
	 *   "error": "Password required",
	 *   "message": "File is password protected"
	 * }
	 * 
	 * @route POST /api/files/check-lock
	 * @access Private (requires authentication)
	 */
	static checkFileLock = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
		try {
			// Extract authenticated user ID from request
			const user_id = req.user?.userId!;

			// Get file from multer middleware (attached as req.file)
			// Multer processes multipart/form-data and provides file buffer
			const file = req.file;

			// Validate that a file was provided in the request
			if (!file) {
				return res.status(400).json({
					success: false,
					error: 'File is required. Use "file" field in form-data'
				});
			}

			// Extract file metadata from multer file object
			const filename = file.originalname; // Original filename from client
			const mimeType = file.mimetype; // File MIME type (e.g., 'application/pdf')
			const buffer = file.buffer; // File contents as Buffer
			const password = req.body.password; // Optional password from form-data body

			// Log lock check initiation for debugging
			console.log(`🔐 Checking lock status for: ${filename}`);

			// Initialize file extraction service with user context
			// This service handles file parsing, password checking, and content extraction
			const extractionService = new FileExtractionService(user_id);

			// Perform lock status check using extraction service
			// This attempts to open the file and determine if it's password-protected
			const lockCheck = await extractionService.checkFileLocked({
				buffer, // File binary data
				filename, // Original filename
				mimeType, // File type
				userId: user_id, // User context for logging
				password // Optional password to test
			});

			// Log the result for debugging and monitoring
			console.log(`📊 Lock Check Result:`, lockCheck);

			// If file is locked or cannot be opened, return 403 Forbidden
			// This indicates the file requires additional credentials or is inaccessible
			if (lockCheck.isLocked || !lockCheck.canOpen) {
				return res.status(403).json({
					success: false,
					isLocked: lockCheck.isLocked, // Whether file is password-protected
					needsPassword: lockCheck.needsPassword, // Whether password is required
					canOpen: lockCheck.canOpen, // Whether file can be opened with current credentials
					error: lockCheck.error, // Error message if any
					message: lockCheck.message // Human-readable status message
				});
			}

			// File is accessible - return success response
			// This indicates the file can be processed without additional credentials
			return res.json({
				success: true,
				isLocked: lockCheck.isLocked, // Should be false
				needsPassword: lockCheck.needsPassword, // Should be false
				canOpen: lockCheck.canOpen, // Should be true
				message: lockCheck.message // Success message
			});

		} catch (error) {
			// Log error for debugging and monitoring
			console.error('❌ Check lock error:', error);
			
			// Return 500 Internal Server Error with error details
			return res.status(500).json({
				success: false,
				error: (error as Error).message
			});
		}
	};

	/**
	 * Uploads a file, extracts its content, and processes it for financial data
	 * 
	 * @method uploadAndExtract
	 * @async
	 * @static
	 * 
	 * @description This method handles the complete file upload and processing workflow.
	 * It accepts various file formats (PDF, Excel, Word, etc.), attempts to extract
	 * content, and if the file is password-protected, uses AI-powered password guessing
	 * to unlock it. The extracted content is then analyzed for financial data.
	 * 
	 * Process flow:
	 * 1. Validate uploaded file
	 * 2. Extract file metadata (name, type, size)
	 * 3. Check if file is password-protected
	 * 4. If locked, attempt AI-powered password guessing using user data
	 * 5. Extract text content from file
	 * 6. Process content for financial data extraction
	 * 7. Return extracted content and metadata
	 * 
	 * @param {AuthenticatedRequest} req - Express request with authenticated user
	 * @param {Express.Multer.File} req.file - Uploaded file from multer middleware (required)
	 * @param {string} [req.body.password] - Optional password if user knows it
	 * @param {Response} res - Express response object
	 * 
	 * @returns {Promise<Response>} JSON response with extracted content or error
	 * 
	 * @throws {400} If no file is provided in the request
	 * @throws {401} If file processing fails due to unknown error
	 * @throws {403} If file is password-protected and cannot be unlocked
	 * @throws {500} If an unexpected error occurs during processing
	 * 
	 * @example
	 * // Request format (multipart/form-data)
	 * POST /api/files/upload
	 * Authorization: Bearer <jwt_token>
	 * Content-Type: multipart/form-data
	 * 
	 * file: [binary file data]
	 * password: "optional-password" (optional)
	 * 
	 * @example
	 * // Success response
	 * {
	 *   "success": true,
	 *   "message": "File uploaded and content extracted successfully",
	 *   "data": {
	 *     "filename": "bank-statement.pdf",
	 *     "mimeType": "application/pdf",
	 *     "size": 245760,
	 *     "extractedContent": "Full text content from file...",
	 *     "contentPreview": "First 500 characters of content...",
	 *     "metadata": {
	 *       "pageCount": 5,
	 *       "author": "Bank Name",
	 *       "createdDate": "2024-01-15"
	 *     }
	 *   }
	 * }
	 * 
	 * @example
	 * // Failure response (password protected, AI failed)
	 * {
	 *   "success": false,
	 *   "error": "Access Denied",
	 *   "message": "File is password protected. AI attempted to unlock but failed. Please provide correct password manually.",
	 *   "data": {
	 *     "filename": "secured-document.pdf",
	 *     "isLocked": true,
	 *     "needsPassword": true,
	 *     "canOpen": false,
	 *     "aiAttempted": true,
	 *     "aiPasswordsTriedCount": 15,
	 *     "aiMessage": "AI password guessing unsuccessful"
	 *   }
	 * }
	 * 
	 * @route POST /api/files/upload
	 * @access Private (requires authentication)
	 */
	static uploadAndExtract = async (req: AuthenticatedRequest, res: Response):Promise<Response> => {
		try {
			// Extract authenticated user ID from JWT token
			const user_id = req.user?.userId!;

			// Get file from multer middleware
			// Multer attaches the uploaded file to req.file after parsing multipart/form-data
			const file = req.file;

			// Validate file presence
			// Return 400 Bad Request if no file was uploaded
			if (!file) {
				return res.status(400).json({
					success: false,
					error: 'File is required. Use "file" field in form-data'
				});
			}

			// Extract file metadata from multer file object
			const filename = file.originalname; // Original filename from client
			const mimeType = file.mimetype; // MIME type (e.g., 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			const buffer = file.buffer; // File binary content as Buffer (Multer provides this directly)
			const password = req.body.password; // Optional password from form-data body field

			// Log file processing initiation for monitoring and debugging
			console.log(`📤 Processing file: ${filename} for user ${user_id}`);
			console.log(`📦 File size: ${(buffer.length / 1024).toFixed(2)}KB`); // Convert bytes to KB
			console.log(`📄 MIME type: ${mimeType}`);

			// Initialize file extraction service with user context
			// This service handles file parsing, password protection, AI password guessing,
			// and content extraction for various file formats
			const extractionService = new FileExtractionService(user_id);

			// Process file: extract content and metadata
			// This method handles:
			// - Password protection detection
			// - AI-powered password guessing if needed
			// - Content extraction (text, tables, images)
			// - Metadata extraction
			console.log(user_id)
			const result = await extractionService.processFile({
				buffer, // File binary data
				filename, // Original filename
				mimeType, // File type
				userId: user_id, // User context
				password // Optional password
			});

        // Check if processing was successful
        if (result.success) {
          // Log success for monitoring
          console.log(`✅ File processed successfully: ${filename}`);

          // Determine if it's a financial asset or general document
          const isFinancialAsset = result.extractedContent?.assetData?.type !== 'Document';
          const message = isFinancialAsset 
            ? 'Financial asset uploaded and content extracted successfully'
            : 'Document uploaded and processed successfully';

          // Return success response with extracted content
          return res.json({
            success: true,
            message,
            data: {
              filename: result.filename, // Processed filename
              mimeType: result.mimeType, // File MIME type
              size: result.size, // File size in bytes
              fileId: result.fileId, // File ID for preview
              previewUrl: result.previewUrl, // Preview URL: /api/files/preview/:fileId
              extractedContent: result.extractedContent, // Full extracted text
              contentPreview: result.extractedContent, // Preview of content (same as full for now)
              metadata: result.metadata, // File metadata (pages, author, dates, etc.)
              isFinancialAsset // Indicates whether this is a financial asset or general document
            }
          });
      } else {
				// Handle locked file or access denied scenarios
				// Status code 403 indicates password protection or permission issues
				if ((result as any).statusCode === 403) {
					// Build AI attempt information if AI password guessing was used
					const aiInfo = (result as any).aiAttempted ? {
						aiAttempted: true, // Flag indicating AI was used
						aiPasswordsTriedCount: (result as any).aiResult?.attempts || 0, // Number of passwords AI tried
						aiMessage: (result as any).aiResult?.error || 'AI password guessing unsuccessful' // AI result message
					} : {};

					// Return 403 Forbidden with detailed lock information
					return res.status(403).json({
						success: false,
						error: result.error || 'Access Denied',
						// Generate appropriate message based on lock status and AI attempts
						message: (result as any).isLocked 
							? (result as any).aiAttempted 
								? 'File is password protected. AI attempted to unlock but failed. Please provide correct password manually.' 
								: 'File is password protected. Please provide correct password.'
							: 'File could not be opened. It may be corrupt or have incorrect password.',
						data: {
							filename: result.filename, // Filename for reference
							isLocked: (result as any).isLocked, // Whether file is password-protected
							needsPassword: (result as any).needsPassword, // Whether password is required
							canOpen: (result as any).canOpen, // Whether file can be opened
							...aiInfo // Include AI attempt information if applicable
						}
					});
				}

				// Handle other processing errors (401 Unauthorized)
				// This catches errors that don't fall into the locked file category
				return res.status(401).json({
					success: false,
					error: result.error || 'Failed to process file',
					data: {
						filename: result.filename, // Filename for reference
						error: result.error // Detailed error message
					}
				});
			}

		} catch (error) {
			// Log unexpected errors for debugging
			console.error('❌ Upload error:', error);
			
			// Return 500 Internal Server Error for unexpected exceptions
			return res.status(500).json({
				success: false,
				error: (error as Error).message
			});
		}
	};
}
