import mongoose, { Document } from "mongoose";
export interface IEODReport extends Document {
    vaId: mongoose.Types.ObjectId;
    date: Date;
    dailyNumbers: {
        newLeadsImported: number;
        friendRequestsSent: number;
        newConversationsStarted: number;
        nurtureResponsesSent: number;
        callsBooked: number;
    };
    pipelineMovement: {
        newReplies: number;
        pendingBookings: number;
        qualifiedAdded: number;
    };
    accountHealth: {
        status: "healthy" | "warning" | "blocked";
        warnings: string | null;
        actionTaken: string | null;
    };
    insights: {
        topGroup: string;
        commonObjection: string;
        winningHook: string;
        recommendations: string;
    };
    blockers: string | null;
    submittedAt: Date;
}
declare const _default: mongoose.Model<IEODReport, {}, {}, {}, mongoose.Document<unknown, {}, IEODReport, {}, {}> & IEODReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=eod-reports-schema.d.ts.map