import { google, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import { EncryptionService } from './encryption.service';
import { GmailAttachmentService } from './gmail-attachment.service';

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

export class GoogleService {
    private oauth2Client: OAuth2Client;
    private prisma: PrismaClient;
    private encryptionService: EncryptionService;
    private credentials: GoogleCredentials | null = null;
    private userId: string | null = null;
    private gmail: gmail_v1.Gmail | null = null;

    constructor(
        config: GoogleAuthConfig,
        prisma: PrismaClient,
        encryptionService: EncryptionService
    ) {
        this.prisma = prisma;
        this.encryptionService = encryptionService;
        this.oauth2Client = new google.auth.OAuth2(
            config.clientId,
            config.clientSecret,
            config.redirectUrl
        );
    }

    /**
     * Set user ID for credential management
     */
    setUserId(userId: string): void {
        this.userId = userId;
    }

    /**
     * Encode state parameter with userId
     */
    private encodeState(userId: string): string {
        return Buffer.from(userId).toString('base64');
    }

    /**
     * Decode state parameter to get userId
     */
    private decodeState(state: string): string {
        try {
            return Buffer.from(state, 'base64').toString('utf-8');
        } catch (error) {
            throw new Error('Invalid state parameter');
        }
    }

    /**
     * Get authorization URL for user consent
     */
    getAuthUrl(scopes: string[] = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
    ]): string {
        if (!this.userId) {
            throw new Error('User ID must be set before generating auth URL');
        }

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
            state: this.encodeState(this.userId), // Encode userId in state
        });
    }

    /**
     * Extract userId from state parameter
     */
    extractUserIdFromState(state: string): string {
        return this.decodeState(state);
    }

    /**
     * Exchange authorization code for tokens
     */
    async exchangeCodeForTokens(
        code: string,
        userId: string
    ): Promise<GoogleCredentials> {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            this.userId = userId;
            const { tokens } = await this.oauth2Client.getToken(code);

            const credentials: GoogleCredentials = {
                accessToken: tokens.access_token || '',
                refreshToken: tokens.refresh_token || '',
                accessTokenExpiresAt: tokens.expiry_date || 0,
                refreshTokenExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
            };

            // Save to database with encryption
            await this.saveCredentialsToDatabase(userId, credentials);

            // Save to memory
            this.credentials = credentials;

            // Initialize Gmail client
            this.oauth2Client.setCredentials({
                access_token: credentials.accessToken,
                refresh_token: credentials.refreshToken,
            });
            this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

            return credentials;
        } catch (error) {
            console.error('Error exchanging code for tokens:', error);
            throw new Error('Failed to exchange authorization code');
        }
    }

    /**
     * Save encrypted credentials to database
     */
    async saveCredentialsToDatabase(
        userId: string,
        credentials: GoogleCredentials
    ): Promise<void> {
        try {
            const encryptedAccessToken = this.encryptionService.encrypt(
                credentials.accessToken
            );
            const encryptedRefreshToken = this.encryptionService.encrypt(
                credentials.refreshToken || ''
            );

            // Set expiry to 30 days from now (when refresh token expires)
            const expiresAt = new Date(credentials.refreshTokenExpiresAt);

            // Delete existing credentials if any
            await this.prisma.googleCredential.deleteMany({
                where: { user_id: userId },
            });


            // Create new credential record
            await this.prisma.googleCredential.create({
                data: {
                    user_id: userId,
                    encrypted_access_token: encryptedAccessToken.encrypted,
                    encrypted_refresh_token: encryptedRefreshToken.encrypted,
                    access_token_iv: encryptedAccessToken.iv,
                    refresh_token_iv: encryptedRefreshToken.iv,
                    access_token_expires_at: new Date(credentials.accessTokenExpiresAt),
                    refresh_token_expires_at: new Date(
                        credentials.refreshTokenExpiresAt
                    ),
                    expires_at: expiresAt,
                },
            });

            console.log(`✓ Credentials saved for user ${userId}`);
        } catch (error) {
            console.error('Error saving credentials to database:', error);
            throw new Error('Failed to save credentials');
        }
    }

    /**
     * Load credentials from database
     */
    async loadCredentialsFromDatabase(userId: string): Promise<boolean> {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            this.userId = userId;

            const record = await this.prisma.googleCredential.findUnique({
                where: { user_id: userId },
            });

            if (!record) {
                console.log(`No credentials found for user ${userId}`);
                return false;
            }

            // Check if credentials have expired
            if (record.expires_at < new Date()) {
                console.log(`Credentials expired for user ${userId}, deleting...`);
                await this.prisma.googleCredential.delete({
                    where: { id: record.id },
                });
                return false;
            }

            // Decrypt credentials
            const decryptedAccessToken = this.encryptionService.decrypt(
                record.encrypted_access_token,
                record.access_token_iv
            ).decrypted;

            const decryptedRefreshToken = this.encryptionService.decrypt(
                record.encrypted_refresh_token,
                record.refresh_token_iv
            ).decrypted;

            this.credentials = {
                accessToken: decryptedAccessToken,
                refreshToken: decryptedRefreshToken,
                accessTokenExpiresAt: record.access_token_expires_at.getTime(),
                refreshTokenExpiresAt: record.refresh_token_expires_at.getTime(),
            };

            // Initialize Gmail client
            this.oauth2Client.setCredentials({
                access_token: this.credentials.accessToken,
                refresh_token: this.credentials.refreshToken,
            });
            this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

            console.log(`✓ Credentials loaded for user ${userId}`);
            return true;
        } catch (error) {
            console.error('Error loading credentials from database:', error);
            return false;
        }
    }

    /**
     * Refresh access token if expired
     */
    async refreshAccessToken(): Promise<boolean> {
        try {
            if (!this.credentials?.refreshToken || !this.userId) {
                console.warn('No refresh token or user ID available');
                return false;
            }

            this.oauth2Client.setCredentials({
                refresh_token: this.credentials.refreshToken,
            });

            const { credentials } = await this.oauth2Client.refreshAccessToken();

            const updated: GoogleCredentials = {
                accessToken: credentials.access_token || '',
                refreshToken:
                    credentials.refresh_token || this.credentials.refreshToken,
                accessTokenExpiresAt: credentials.expiry_date || 0,
                refreshTokenExpiresAt: this.credentials.refreshTokenExpiresAt,
            };

            this.credentials = updated;

            // Update in database
            await this.saveCredentialsToDatabase(this.userId, updated);

            return true;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            return false;
        }
    }

    /**
     * List all emails
     */
    async listEmails(
        maxResults: number = 10,
        pageToken?: string
    ): Promise<{
        emails: EmailMessage[];
        nextPageToken?: string;
        totalMessages: number;
    }> {
        try {
            if (!this.gmail) {
                throw new Error('Gmail client not initialized');
            }

            if (this.isTokenExpired()) {
                await this.refreshAccessToken();
            }

            const response = await this.gmail.users.messages.list({
                userId: 'me',
                maxResults,
                pageToken,
                format: 'full',
            });

            
            const messages = response.data.messages || [];
            const totalMessages = response.data.resultSizeEstimate || 0;
            
            // console.log("response :: ",messages,totalMessages)
            // Fetch full message details
            const emailPromises = messages.map((msg) =>
                this.getEmailById(msg.id || '')
            );

            const emails = await Promise.all(emailPromises);

            return {
                emails: emails.filter((email) => email !== null) as EmailMessage[],
                nextPageToken: response.data.nextPageToken,
                totalMessages,
            };
        } catch (error) {
            console.error('Error listing emails:', error);
            throw error;
        }
    }

    /**
     * Get email by ID
     */
    /**
 * Extract body from Gmail message payload (handles all cases)
 */
private extractBodyFromPayload(payload?: gmail_v1.Schema$MessagePart): string {
    try {
        if (!payload) {
            return '';
        }

        // Case 1: Direct body data (simple emails)
        if (payload.body?.data) {
            return this.decodeBase64Url(payload.body.data);
        }

        // Case 2: Multipart message - recursively check parts
        if (payload.parts && Array.isArray(payload.parts)) {
            let textPlainBody = '';
            let textHtmlBody = '';

            for (const part of payload.parts) {
                const mimeType = part.mimeType?.toLowerCase() || '';

                // Direct text/plain or text/html
                if (part.body?.data) {
                    if (mimeType === 'text/plain') {
                        textPlainBody = this.decodeBase64Url(part.body.data);
                    } else if (mimeType === 'text/html') {
                        textHtmlBody = this.decodeBase64Url(part.body.data);
                    }
                }

                // Recursively check nested parts (e.g., multipart/alternative, multipart/mixed)
                if (part.parts) {
                    const nestedBody = this.extractBodyFromPayload(part);
                    if (nestedBody) {
                        // Prefer text/plain over text/html
                        if (!textPlainBody) {
                            textPlainBody = nestedBody;
                        }
                    }
                }
            }

            // Return text/plain if available, otherwise text/html
            return textPlainBody || textHtmlBody;
        }

        return '';
    } catch (error) {
        console.error('Error extracting body:', error);
        return '';
    }
}

/**
 * Decode Gmail's base64url encoding
 */
private decodeBase64Url(data: string): string {
    try {
        // Gmail uses base64url: replace - with +, _ with /
        const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
        
        // Decode to UTF-8 string
        return Buffer.from(base64, 'base64').toString('utf-8');
    } catch (error) {
        console.error('Error decoding base64url:', error);
        return '';
    }
}

/**
 * Get email by ID with full body
 */
async getEmailById(emailId: string): Promise<EmailMessage | null> {
    try {
        if (!this.gmail) {
            throw new Error('Gmail client not initialized');
        }

        if (this.isTokenExpired()) {
            await this.refreshAccessToken();
        }

        const response = await this.gmail.users.messages.get({
            userId: 'me',
            id: emailId,
            format: 'full', // Must be 'full' to get body
        });

        const message = response.data;
        const headers = message.payload?.headers || [];

        // Extract common headers
        const getHeader = (name: string) =>
            headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

        // Extract body
        const body = this.extractBodyFromPayload(message.payload);

        console.log('Email body length:', body.length);
        console.log('Email body preview:', body.substring(0, 200));

        const email: EmailMessage = {
            id: message.id || '',
            threadId: message.threadId || '',
            from: getHeader('From'),
            to: getHeader('To'),
            subject: getHeader('Subject'),
            snippet: message.snippet || '',
            body: body,
            date: getHeader('Date'),
            labels: message.labelIds || [],
            internalDate: message.internalDate || '',
        };

        return email;
    } catch (error) {
        console.error(`Error getting email ${emailId}:`, error);
        return null;
    }
}


    /**
     * Search emails
     */
    async searchEmails(
        query: string,
        maxResults: number = 10
    ): Promise<EmailMessage[]> {
        try {
            if (!this.gmail) {
                throw new Error('Gmail client not initialized');
            }

            if (this.isTokenExpired()) {
                await this.refreshAccessToken();
            }

            const response = await this.gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults,
            });

            const messages = response.data.messages || [];
            const emailPromises = messages.map((msg) =>
                this.getEmailById(msg.id || '')
            );

            const emails = await Promise.all(emailPromises);
            return emails.filter((email) => email !== null) as EmailMessage[];
        } catch (error) {
            console.error('Error searching emails:', error);
            throw error;
        }
    }

    /**
     * Get credentials
     */
    getCredentials(): GoogleCredentials | null {
        return this.credentials;
    }

    /**
     * Clear credentials from database
     */
    async clearCredentials(): Promise<boolean> {
        try {
            if (!this.userId) {
                throw new Error('User ID not set');
            }

            this.credentials = null;
            this.gmail = null;
            this.oauth2Client.revokeAllCredentials();

            await this.prisma.googleCredential.deleteMany({
                where: { user_id: this.userId },
            });

            console.log(`✓ Credentials cleared for user ${this.userId}`);
            return true;
        } catch (error) {
            console.error('Error clearing credentials:', error);
            return false;
        }
    }

    /**
     * Check if token is expired
     */
    private isTokenExpired(): boolean {
        if (!this.credentials?.accessTokenExpiresAt) return true;
        return (
            Date.now() >= this.credentials.accessTokenExpiresAt - 5 * 60 * 1000
        ); // 5 min buffer
    }


    /**
     * Check if credentials are available
     */
    hasValidCredentials(): boolean {
        return !!this.credentials && !this.isTokenExpired();
    }

    /**
   * Get email with attachments
   */
    /**
     * Get email with attachments (stream-based)
     */
    async getEmailWithAttachments(
        emailId: string,
        attachmentService: GmailAttachmentService,
        password?:string
    ): Promise<{
        email: EmailMessage;
        attachments: Array<{
            filename: string;
            mimeType: string;
            size: number;
            content: string;
            metadata: Record<string, any>;
        }>;
    }> {
        try {
            if (!this.gmail) {
                throw new Error(
                    'Gmail client not initialized'
                );
            }

            // Get full email
            const response =
                await this.gmail.users.messages.get({
                    userId: 'me',
                    id: emailId,
                    format: 'full',
                });

            const message = response.data;
            const headers = message.payload?.headers || [];

            const getHeader = (name: string) =>
                headers.find((h) => h.name === name)
                    ?.value || '';

            const email: EmailMessage = {
                id: message.id || '',
                threadId: message.threadId || '',
                from: getHeader('From'),
                to: getHeader('To'),
                subject: getHeader('Subject'),
                snippet: message.snippet || '',
                body:
                    this.extractBodyFromPayload(
                        message.payload
                    ) || '',
                date: getHeader('Date'),
                labels: message.labelIds || [],
                internalDate: message.internalDate || '',
            };

            // Extract attachments metadata
            const attachmentMetadata =
                await attachmentService.extractAttachmentMetadata(
                    message
                );

            const attachments = [];

            // Download and process each attachment
            for (const attachment of attachmentMetadata) {
                try {
                    const processed =
                        await attachmentService.downloadAndProcessAttachment(
                            this.gmail,
                            emailId,
                            attachment,
                            (this.userId || 'unknown'),
                            password
                        );

                    // console.log("processed data from attachments :: ", processed) // this is working fine
                    attachments.push(processed);

                    console.log(
                        `✓ Attachment processed: ${processed.filename}`
                    );
                } catch (error) {
                    console.error(
                        `Error processing attachment ${attachment.filename}:`,
                        error
                    );
                    // Continue with other attachments
                }
            }

            // console.log("attachments data :: ", attachments) // this is working fine

            return { email, attachments };
        } catch (error) {
            console.error(
                'Error getting email with attachments:',
                error
            );
            throw error;
        }
    }


}
