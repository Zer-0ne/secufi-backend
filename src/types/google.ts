/**
 * @fileoverview Google API Type Definitions
 * @description Type definitions for Google OAuth, Gmail API, and related operations
 * 
 * @module types/google
 * @author Secufi Team
 * @version 1.0.0
 */

/**
 * Interface for Google OAuth authentication response
 * 
 * @interface GoogleAuthResponse
 * @description Represents the response from Google OAuth authentication operations
 * 
 * @property {boolean} success - Whether the authentication was successful
 * @property {string} message - Human-readable message describing the result
 * @property {string} [authUrl] - OAuth authorization URL (for redirect-based flows)
 * @property {Object} [credentials] - Authentication credentials if successful
 * @property {string} credentials.accessToken - Google API access token
 * @property {string} credentials.refreshToken - Refresh token for obtaining new access tokens
 * @property {number} credentials.expiryDate - Token expiration timestamp
 * @property {string} [error] - Error message if authentication failed
 */
export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  authUrl?: string;
  credentials?: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  };
  error?: string;
}

/**
 * Interface representing an email message from Gmail API
 * 
 * @interface EmailMessage
 * @description Complete email message data structure
 * 
 * @property {string} id - Unique identifier for the email message
 * @property {string} threadId - Thread ID for grouping related emails
 * @property {string} from - Sender's email address
 * @property {string} to - Recipient's email address
 * @property {string} subject - Email subject line
 * @property {string} snippet - Short preview/snippet of email content
 * @property {string} body - Full email body content
 * @property {string} date - Human-readable date string
 * @property {string[]} labels - Gmail labels assigned to the email
 * @property {string} internalDate - Internal timestamp for email
 * @property {string} preview - Additional preview text
 */
export interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  labels: string[];
  internalDate: string;
  preview:string
}

/**
 * Interface for listing emails response
 * 
 * @interface ListEmailsResponse
 * @description Response structure for email listing operations
 * 
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - Human-readable message describing the result
 * @property {Object} [data] - Response data if successful
 * @property {EmailMessage[]} data.emails - Array of email messages
 * @property {string} [data.nextPageToken] - Token for pagination (if more emails exist)
 * @property {number} data.totalMessages - Total number of messages available
 * @property {string} [error] - Error message if operation failed
 */
export interface ListEmailsResponse {
  success: boolean;
  message: string;
  data?: {
    emails: EmailMessage[];
    nextPageToken?: string;
    totalMessages: number;
  };
  error?: string;
}

/**
 * Interface for getting a single email response
 * 
 * @interface GetEmailResponse
 * @description Response structure for retrieving a specific email
 * 
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - Human-readable message describing the result
 * @property {EmailMessage} [data] - Retrieved email message if found
 * @property {string} [error] - Error message if operation failed
 */
export interface GetEmailResponse {
  success: boolean;
  message: string;
  data?: EmailMessage;
  error?: string;
}
