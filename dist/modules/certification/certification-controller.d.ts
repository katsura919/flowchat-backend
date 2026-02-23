import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const getAllCertifications: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getVaCertification: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleCertificationItem: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMyCertification: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=certification-controller.d.ts.map