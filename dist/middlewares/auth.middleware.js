// middlewares/auth.middleware.ts
import JWTService from '../services/jwt.service.js';
import { UserService } from '../services/user.service.js';
import { GoogleService } from '../services/google.service.js';
import { prisma } from '../routes/user.routes.js';
import { EncryptionService } from '../services/encryption.service.js';
const encryptionService = new EncryptionService();
const userService = new UserService(prisma);
const googleService = new GoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUrl: process.env.GOOGLE_REDIRECT_URL ||
        'http://localhost:5000/api/google/callback',
}, prisma, encryptionService);
export async function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = JWTService.extractFromHeader(authHeader);
    // console.log(req.headers,req.body)
    if (!token || !JWTService.isValidFormat(token)) {
        return res.status(401).json({ success: false, message: 'No or invalid token provided' });
    }
    try {
        const payload = JWTService.verifyAccessToken(token);
        const user = await userService.getUserByAccessToken(req, res);
        const { id } = user;
        await googleService.setUserId(id);
        const familyId = await await prisma.family.findUnique({
            where: { owner_id: id },
            select: { id: true },
        });
        req.user = payload;
        req.params.familyId = familyId?.id;
        return next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized', error: error instanceof Error ? error.message : error });
    }
}
//# sourceMappingURL=auth.middleware.js.map