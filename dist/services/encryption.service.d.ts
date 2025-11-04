interface EncryptedData {
    encrypted: string;
    iv: string;
}
interface DecryptedData {
    decrypted: string;
}
export declare class EncryptionService {
    private encryptionKey;
    private algorithm;
    constructor(encryptionKey?: string);
    /**
     * Generate a random encryption key (for initial setup only)
     */
    private generateKey;
    /**
     * Encrypt sensitive data
     */
    encrypt(data: string): EncryptedData;
    /**
     * Decrypt sensitive data
     */
    decrypt(encryptedData: string, iv: string): DecryptedData;
    /**
     * Hash data (for verification)
     */
    hash(data: string): string;
    /**
     * Generate random string (for IV generation)
     */
    generateRandomString(length?: number): string;
}
export {};
//# sourceMappingURL=encryption.service.d.ts.map