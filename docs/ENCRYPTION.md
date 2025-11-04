# Encryption Service API Reference

This document provides comprehensive documentation for the Encryption Service, which implements secure encryption and decryption functionality using AES-256-GCM (Galois/Counter Mode) for protecting sensitive data.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Key Management](#key-management)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Security Considerations](#security-considerations)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview
The Encryption Service provides robust cryptographic functionality for:
- Encrypting and decrypting sensitive data at rest and in transit
- Securing API keys, tokens, and credentials
- Protecting personally identifiable information (PII)
- Implementing secure data sharing

### Features
- AES-256-GCM authenticated encryption
- Secure key generation and management
- Data integrity verification
- Protection against common cryptographic attacks
- Support for both string and buffer data types

## Getting Started

### Prerequisites
- Node.js 14.0.0 or later
- A secure environment for key storage
- Required environment variables set in your `.env` file

### Installation
```bash
# Install required dependencies
npm install crypto-js
```

### Configuration
Add the following to your `.env` file:
```env
# Encryption
ENCRYPTION_KEY=your_64_character_hex_key_here_or_leave_blank_for_auto_generation
ENCRYPTION_ALGORITHM=aes-256-gcm
ENCRYPTION_IV_LENGTH=12  # 12 bytes is recommended for GCM
ENCRYPTION_AUTH_TAG_LENGTH=16  # 16 bytes for GCM
```

## Key Management

### Key Generation
```typescript
import { randomBytes } from 'crypto';

// Generate a secure 32-byte (256-bit) key and convert to hex
const key = randomBytes(32).toString('hex');
console.log('Encryption Key:', key);
```

### Key Storage Best Practices
1. **Production Environment**:
   - Use environment variables or a secure key management system (KMS)
   - Never hardcode encryption keys in source code
   - Rotate keys periodically (every 90 days recommended)

2. **Development/Testing**:
   - Use a test key in `.env.test`
   - Never use production keys in development

## API Reference

### EncryptionService Class

#### Constructor
```typescript
new EncryptionService(encryptionKey?: string, options?: EncryptionOptions)
```

**Parameters:**
- `encryptionKey`: `string` (optional) - 64-character hex string (32 bytes). 
  - If not provided, uses `process.env.ENCRYPTION_KEY` or generates a random key.
  - If the key is not 64 characters long, an error will be thrown.

**Options:**
```typescript
interface EncryptionOptions {
  algorithm?: string;           // Default: 'aes-256-gcm'
  ivLength?: number;            // Default: 12 (bytes)
  authTagLength?: number;       // Default: 16 (bytes)
  saltRounds?: number;          // Default: 10 (for key derivation)
  encoding?: BufferEncoding;    // Default: 'utf8'
  debug?: boolean;              // Default: false
}
```

**Throws:** 
- `Error` if key length is invalid
- `Error` if required environment variables are missing

### Methods

#### encrypt(data: string | Buffer): EncryptedData
Encrypts sensitive data using AES-256-GCM with a unique initialization vector (IV) for each encryption operation.

**Parameters:**
- `data`: `string | Buffer` - The plaintext data to encrypt. Can be a string or Buffer.

**Returns:** `EncryptedData` object with the following properties:
  - `encryptedData`: `string` - Base64-encoded encrypted data
  - `iv`: `string` - Base64-encoded initialization vector
  - `authTag`: `string` - Base64-encoded authentication tag
  - `keyId`: `string` - Identifier for the encryption key used (if key rotation is enabled)
  - `timestamp`: `number` - Unix timestamp of when the encryption was performed

**Example:**
```typescript
const encryptionService = new EncryptionService();

// Encrypt a string
const encryptedData = encryptionService.encrypt('Sensitive data to encrypt');
console.log('Encrypted:', encryptedData.encryptedData);

// Encrypt a buffer
const bufferData = Buffer.from('Data in buffer format');
const encryptedBuffer = encryptionService.encrypt(bufferData);
```

**Error Handling:**
- Throws `EncryptionError` if:
  - Input data is empty or invalid
  - Encryption key is not available
  - Encryption process fails

**Security Notes:**
- Uses cryptographically secure random IV for each encryption
- Includes authentication tag to verify data integrity
- Protects against chosen plaintext attacks (IND-CPA)
- Protects against chosen ciphertext attacks (IND-CCA2)

#### decrypt(encryptedData: string, iv: string): DecryptedData
Decrypts data encrypted with the encrypt method.

**Parameters:**
- `encryptedData`: `string` - Base64-encoded encrypted data
- `iv`: `string` - Base64-encoded initialization vector
- `iv`: string (initialization vector from encrypt method)

**Returns:** DecryptedData object
```typescript
{
  decrypted: string // Original decrypted data
}
```

**Throws:** Error if decryption fails (wrong key, corrupted data, etc.)

### hash(data: string): string
Creates SHA-256 hash of data for verification purposes.

**Parameters:**
- `data`: string (data to hash)

**Returns:** string (64-character hex hash)

### generateRandomString(length: number = 16): string
Generates a random hex string.

**Parameters:**
- `length`: number (optional, default 16, length in bytes)

**Returns:** string (hex string of specified length)

## Usage Examples

### Basic Encryption/Decryption
```typescript
const encryptionService = new EncryptionService();

const sensitiveData = "my-secret-token";

// Encrypt
const encrypted = encryptionService.encrypt(sensitiveData);
console.log(encrypted);
// { encrypted: "a1b2c3...", iv: "d4e5f6..." }

// Decrypt
const decrypted = encryptionService.decrypt(encrypted.encrypted, encrypted.iv);
console.log(decrypted.decrypted); // "my-secret-token"
```

### Storing Encrypted Data
```typescript
// Encrypt before storing in database
const token = "user-access-token";
const encrypted = encryptionService.encrypt(token);

// Store encrypted.encrypted and encrypted.iv in database
await prisma.userCredentials.create({
  data: {
    encryptedToken: encrypted.encrypted,
    iv: encrypted.iv,
    userId: userId
  }
});
```

### Retrieving Encrypted Data
```typescript
// Retrieve from database
const credentials = await prisma.userCredentials.findUnique({
  where: { userId: userId }
});

// Decrypt
const decrypted = encryptionService.decrypt(credentials.encryptedToken, credentials.iv);
const token = decrypted.decrypted;
```

## Security Features

### AES-256-GCM Encryption
- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Size**: 256 bits (32 bytes)
- **Authentication**: Built-in authentication tag prevents tampering
- **IV Generation**: Random 16-byte IV for each encryption

### Key Management
- Keys must be 64 hex characters (32 bytes)
- Supports environment variable configuration
- Can generate random keys for development

### Error Handling
- Encryption failures throw descriptive errors
- Decryption validates authentication tags
- Corrupted data cannot be decrypted

## Dependencies
- Node.js `crypto` module (built-in)

## Best Practices
1. **Key Security**: Store encryption keys securely (environment variables, key management services)
2. **IV Storage**: Always store the IV alongside encrypted data
3. **Error Handling**: Implement proper error handling for encryption/decryption operations
4. **Key Rotation**: Plan for key rotation in production environments
5. **Backup**: Ensure encrypted data can be recovered if keys are lost

## Limitations
- Data must be strings (convert objects to JSON first)
- Keys cannot be changed without re-encrypting all data
- Not suitable for password hashing (use bcrypt/argon2 instead)
