import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const getAllEodReports: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEodSummary: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=eod-management-controller.d.ts.map