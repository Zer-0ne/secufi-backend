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
}
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
export interface GetEmailResponse {
    success: boolean;
    message: string;
    data?: EmailMessage;
    error?: string;
}
//# sourceMappingURL=google.d.ts.map