import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const submitEodReport: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMyEodReports: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getLatestEodReport: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=eod-controller.d.ts.map