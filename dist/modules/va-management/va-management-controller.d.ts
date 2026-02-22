import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createVa: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getVas: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getVaById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateVaStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=va-management-controller.d.ts.map