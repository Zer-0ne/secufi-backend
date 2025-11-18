/**
 * @fileoverview Encryption service for secure data handling
 * @description This service provides cryptographic operations for encrypting and decrypting
 * sensitive data using AES-256-GCM (Advanced Encryption Standard with Galois/Counter Mode).
 * GCM provides both confidentiality and authenticity guarantees for encrypted data.
 *
 * Key features:
 * - AES-256-GCM encryption/decryption
 * - Authenticated encryption with built-in integrity checking
 * - SHA-256 hashing for data verification
 * - Random IV (Initialization Vector) generation for each encryption
 * - Secure key management from environment variables
 *
 * @module services/encryption
 * @requires crypto - Node.js cryptography module
 *
 * @author Secufi Team
 * @version 1.0.0
 */
/**
 * Interface for encrypted data structure
 *
 * @interface EncryptedData
 * @description Represents the result of an encryption operation.
 * Contains both the encrypted data and the initialization vector needed for decryption.
 *
 * @property {string} encrypted - The encrypted data in hexadecimal format (includes auth tag)
 * @property {string} iv - Initialization Vector in hexadecimal format (required for decryption)
 */
interface EncryptedData {
    encrypted: string;
    iv: string;
}
/**
 * Interface for decrypted data structure
 *
 * @interface DecryptedData
 * @description Represents the result of a decryption operation.
 *
 * @property {string} decrypted - The original plaintext data after successful decryption
 */
interface DecryptedData {
    decrypted: string;
}
/**
 * Encryption Service Class
 *
 * @class EncryptionService
 * @description Provides cryptographic operations for securing sensitive data.
 * Uses AES-256-GCM which provides authenticated encryption, ensuring both
 * confidentiality and integrity of encrypted data.
 *
 * Security features:
 * - AES-256: Industry-standard symmetric encryption with 256-bit keys
 * - GCM mode: Provides authentication to detect tampering
 * - Random IV: Each encryption uses a unique initialization vector
 * - Auth tag: Ensures data hasn't been modified
 *
 * @example
 * // Initialize encryption service
 * const encryptionService = new EncryptionService();
 *
 * // Encrypt sensitive data
 * const encrypted = encryptionService.encrypt('sensitive data');
 *
 * // Decrypt data
 * const decrypted = encryptionService.decrypt(encrypted.encrypted, encrypted.iv);
 */
export declare class EncryptionService {
    /**
     * Encryption key used for AES-256 operations
     * @private
     * @type {string}
     * @description 64-character hexadecimal string (32 bytes)
     */
    private encryptionKey;
    /**
     * Encryption algorithm specification
     * @private
     * @type {crypto.CipherGCMTypes}
     * @description AES-256-GCM (Galois/Counter Mode) for authenticated encryption
     */
    private algorithm;
    /**
     * Creates an instance of EncryptionService
     *
     * @constructor
     * @param {string} [encryptionKey] - Optional encryption key (64 hex characters)
     * @throws {Error} If encryption key is not exactly 64 characters
     *
     * @description Initializes the encryption service with a key from:
     * 1. Provided parameter (highest priority)
     * 2. ENCRYPTION_KEY environment variable
     * 3. Auto-generated key (for development only - not recommended for production)
     *
     * @example
     * // With custom key
     * const service = new EncryptionService('your-64-char-hex-key...');
     *
     * @example
     * // From environment variable
     * const service = new EncryptionService();
     */
    constructor(encryptionKey?: string);
    /**
     * Generate a random encryption key
     *
     * @private
     * @method generateKey
     * @returns {string} 64-character hexadecimal string (32 bytes)
     *
     * @description Generates a cryptographically secure random key for AES-256.
     * This should ONLY be used for initial setup or development.
     * In production, use a pre-generated key stored securely in environment variables.
     *
     * IMPORTANT: If this method is used, the generated key should be saved
     * to your environment variables for consistent encryption/decryption.
     *
     * @example
     * // Generate and save a key (do this once, manually)
     * const service = new EncryptionService();
     * console.log('Save this key to .env:', service.generateKey());
     */
    private generateKey;
    /**
     * Encrypt sensitive data using AES-256-GCM
     *
     * @public
     * @method encrypt
     * @param {string} data - Plaintext data to encrypt
     * @returns {EncryptedData} Object containing encrypted data and IV
     * @throws {Error} If encryption fails
     *
     * @description Encrypts data using AES-256-GCM authenticated encryption.
     * The process:
     * 1. Generates a random IV (Initialization Vector)
     * 2. Creates a cipher with the key and IV
     * 3. Encrypts the data
     * 4. Appends authentication tag for integrity verification
     * 5. Returns encrypted data and IV (both needed for decryption)
     *
     * Security notes:
     * - Each encryption uses a new random IV (never reuse IVs!)
     * - The auth tag ensures data integrity and authenticity
     * - Both encrypted data and IV must be stored for decryption
     *
     * @example
     * // Encrypt user's sensitive data
     * const encryptionService = new EncryptionService();
     * const result = encryptionService.encrypt('user password');
     *
     * // Store both values in database
     * await db.save({
     *   encryptedData: result.encrypted,
     *   iv: result.iv
     * });
     */
    encrypt(data: string): EncryptedData;
    /**
     * Decrypt data encrypted with AES-256-GCM
     *
     * @public
     * @method decrypt
     * @param {string} encryptedData - Encrypted data with authentication tag (hex format)
     * @param {string} iv - Initialization vector used during encryption (hex format)
     * @returns {DecryptedData} Object containing decrypted plaintext
     * @throws {Error} If decryption fails or data has been tampered with
     *
     * @description Decrypts data encrypted by the encrypt() method.
     * The process:
     * 1. Extracts the authentication tag from encrypted data
     * 2. Creates a decipher with the key and IV
     * 3. Sets the authentication tag for verification
     * 4. Decrypts the data
     * 5. Returns plaintext if auth tag verification succeeds
     *
     * Security notes:
     * - If the auth tag doesn't match, an error is thrown (data was tampered with)
     * - The same IV used for encryption must be used for decryption
     * - If decryption fails, the original data cannot be recovered
     *
     * @example
     * // Decrypt data retrieved from database
     * const encryptionService = new EncryptionService();
     * const record = await db.findOne({ userId });
     *
     * try {
     *   const result = encryptionService.decrypt(
     *     record.encryptedData,
     *     record.iv
     *   );
     *   console.log('Decrypted:', result.decrypted);
     * } catch (error) {
     *   console.error('Data may be corrupted or tampered with');
     * }
     */
    decrypt(encryptedData: string, iv: string): DecryptedData;
    /**
     * Hash data using SHA-256
     *
     * @public
     * @method hash
     * @param {string} data - Data to hash
     * @returns {string} Hexadecimal hash string (64 characters)
     *
     * @description Creates a SHA-256 hash of the input data.
     * Hashing is one-way (cannot be reversed) and deterministic
     * (same input always produces same output).
     *
     * Use cases:
     * - Password verification (compare hash, not plaintext)
     * - Data integrity checking (verify data hasn't changed)
     * - Creating unique identifiers from data
     * - Checksums for files or messages
     *
     * Note: For password hashing, consider using bcrypt or argon2
     * which are specifically designed for password security and include
     * salting and adjustable computational cost.
     *
     * @example
     * // Hash password for comparison
     * const encryptionService = new EncryptionService();
     * const hashedPassword = encryptionService.hash('user-password');
     *
     * // Later, verify password
     * if (encryptionService.hash(inputPassword) === storedHash) {
     *   console.log('Password matches');
     * }
     *
     * @example
     * // Create checksum for data integrity
     * const dataChecksum = encryptionService.hash(JSON.stringify(data));
     * // Store checksum with data to verify it hasn't been modified
     */
    hash(data: string): string;
    /**
     * Generate cryptographically secure random string
     *
     * @public
     * @method generateRandomString
     * @param {number} [length=16] - Length of random bytes to generate (default: 16)
     * @returns {string} Hexadecimal random string (length * 2 characters)
     *
     * @description Generates a cryptographically secure random string.
     * Uses Node.js crypto.randomBytes() which relies on the operating system's
     * secure random number generator.
     *
     * Use cases:
     * - Generating tokens for password reset
     * - Creating session IDs
     * - Generating API keys
     * - Creating nonces for cryptographic operations
     * - Generating random salts
     *
     * Note: The returned string length will be double the byte length
     * because each byte is represented by 2 hexadecimal characters.
     * For example, 16 bytes = 32 hex characters.
     *
     * @example
     * // Generate 16-byte (32-character) random string
     * const encryptionService = new EncryptionService();
     * const token = encryptionService.generateRandomString();
     * console.log(token); // e.g., "a3f5b2c9d7e4f1a8b6c3d9e7f2a5b8c4"
     *
     * @example
     * // Generate 32-byte (64-character) random string for API key
     * const apiKey = encryptionService.generateRandomString(32);
     * console.log(apiKey.length); // 64 characters
     *
     * @example
     * // Generate password reset token
     * const resetToken = encryptionService.generateRandomString(20);
     * await db.saveResetToken(userId, resetToken);
     */
    generateRandomString(length?: number): string;
}
export {};
//# sourceMappingURL=encryption.service.d.ts.map