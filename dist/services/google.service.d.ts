import { PrismaClient } from '@prisma/client';
import { EncryptionService } from './encryption.service.js';
import { GmailAttachmentService } from './gmail-attachment.service.js';
interface GoogleCredentials {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
}
interface GoogleAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
}
interface EmailMessage {
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
}
export declare class GoogleService {
    private oauth2Client;
    private prisma;
    private encryptionService;
    private credentials;
    private userId;
    private gmail;
    constructor(config: GoogleAuthConfig, prisma: PrismaClient, encryptionService: EncryptionService);
    /**
     * Set user ID for credential management
     */
    setUserId(userId: string): void;
    /**
     * Encode state parameter with userId
     */
    private encodeState;
    /**
     * Decode state parameter to get userId
     */
    private decodeState;
    /**
     * Get authorization URL for user consent
     */
    getAuthUrl(scopes?: string[]): string;
    /**
     * Extract userId from state parameter
     */
    extractUserIdFromState(state: string): string;
    /**
     * Exchange authorization code for tokens
     */
    exchangeCodeForTokens(code: string, userId: string): Promise<GoogleCredentials>;
    /**
     * Save encrypted credentials to database
     */
    saveCredentialsToDatabase(userId: string, credentials: GoogleCredentials): Promise<void>;
    /**
     * Load credentials from database
     */
    loadCredentialsFromDatabase(userId: string): Promise<boolean>;
    /**
     * Refresh access token if expired
     */
    refreshAccessToken(): Promise<boolean>;
    /**
     * List all emails
     */
    listEmails(maxResults?: number, pageToken?: string): Promise<{
        emails: EmailMessage[];
        nextPageToken?: string;
        totalMessages: number;
    }>;
    /**
     * Get email by ID
     */
    /**
 * Extract body from Gmail message payload (handles all cases)
 */
    private extractBodyFromPayload;
    /**
     * Decode Gmail's base64url encoding
     */
    private decodeBase64Url;
    /**
     * Get email by ID with full body
     */
    getEmailById(emailId: string): Promise<EmailMessage | null>;
    /**
     * Search emails
     */
    searchEmails(query: string, maxResults?: number): Promise<EmailMessage[]>;
    /**
     * Get credentials
     */
    getCredentials(): GoogleCredentials | null;
    /**
     * Clear credentials from database
     */
    clearCredentials(): Promise<boolean>;
    /**
     * Check if token is expired
     */
    private isTokenExpired;
    /**
     * Check if credentials are available
     */
    hasValidCredentials(): boolean;
    /**
   * Get email with attachments
   */
    /**
     * Get email with attachments (stream-based)
     */
    getEmailWithAttachments(emailId: string, attachmentService: GmailAttachmentService, password?: string): Promise<{
        email: EmailMessage;
        attachments: Array<{
            filename: string;
            mimeType: string;
            size: number;
            content: string;
            metadata: Record<string, any>;
        }>;
    }>;
}
export {};
//# sourceMappingURL=google.service.d.ts.map