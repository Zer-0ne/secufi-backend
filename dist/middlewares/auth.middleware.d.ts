import { Request, Response, NextFunction } from 'express';
import { IDecodedToken } from '../services/jwt.service.js';
export interface AuthenticatedRequest extends Request {
    user?: IDecodedToken;
}
export declare function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.middleware.d.ts.map