import { Request, Response, NextFunction } from "express";
export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map