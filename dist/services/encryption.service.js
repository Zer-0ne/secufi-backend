import crypto from 'crypto';
export class EncryptionService {
    encryptionKey;
    algorithm = 'aes-256-gcm';
    constructor(encryptionKey) {
        this.encryptionKey =
            encryptionKey ||
                process.env.ENCRYPTION_KEY ||
                this.generateKey();
        if (this.encryptionKey.length !== 64) {
            throw new Error('Encryption key must be 64 characters (32 bytes in hex format)');
        }
    }
    /**
     * Generate a random encryption key (for initial setup only)
     */
    generateKey() {
        return crypto.randomBytes(32).toString('hex');
    }
    /**
     * Encrypt sensitive data
     */
    encrypt(data) {
        try {
            const iv = crypto.randomBytes(16);
            const key = Buffer.from(this.encryptionKey, 'hex');
            // ✅ FIX: TypeScript now recognizes this as CipherGCM
            const cipher = crypto.createCipheriv(this.algorithm, key, iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            // ✅ FIX: No need for 'as any' - getAuthTag() is now recognized
            const authTag = cipher.getAuthTag();
            const encryptedWithTag = encrypted + authTag.toString('hex');
            return {
                encrypted: encryptedWithTag,
                iv: iv.toString('hex'),
            };
        }
        catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Failed to encrypt data');
        }
    }
    /**
     * Decrypt sensitive data
     */
    decrypt(encryptedData, iv) {
        try {
            const key = Buffer.from(this.encryptionKey, 'hex');
            const ivBuffer = Buffer.from(iv, 'hex');
            // Extract auth tag (last 32 characters = 16 bytes in hex)
            const authTag = Buffer.from(encryptedData.substring(encryptedData.length - 32), 'hex');
            const encrypted = encryptedData.substring(0, encryptedData.length - 32);
            // ✅ FIX: TypeScript now recognizes this as DecipherGCM
            const decipher = crypto.createDecipheriv(this.algorithm, key, ivBuffer);
            // ✅ FIX: setAuthTag() is now recognized
            decipher.setAuthTag(authTag);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return { decrypted };
        }
        catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt data');
        }
    }
    /**
     * Hash data (for verification)
     */
    hash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
    /**
     * Generate random string (for IV generation)
     */
    generateRandomString(length = 16) {
        return crypto.randomBytes(length).toString('hex');
    }
}
//# sourceMappingURL=encryption.service.js.map