import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "admin" | "va";
    };
}
export declare const verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireVA: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth-middleware.d.ts.map