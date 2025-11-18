import { EncryptionService } from './encryption.service.js';
export declare class ServerAuthService {
    private static isValidated;
    private static encryptionService;
    /**
     * Validates server authorization before startup
     * @throws Error if authorization fails
     */
    static validateServerAuth(): Promise<void>;
    /**
     * Middleware to check if server is authorized
     */
    static requireServerAuth(): (req: any, res: any, next: any) => any;
    /**
     * Check if server is currently validated
     */
    static isServerValidated(): boolean;
    /**
     * Get encryption service instance
     */
    static getEncryptionService(): EncryptionService;
}
//# sourceMappingURL=server-auth.service.d.ts.map