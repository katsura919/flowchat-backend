import mongoose, { Document } from "mongoose";
export interface IWeeklyAudit extends Document {
    vaId: mongoose.Types.ObjectId;
    weekEnding: Date;
    currentStage: "Stage 1 — Build" | "Stage 2 — Scale" | "Stage 3 — Invite" | "Stage 4 — Optimize";
    kpis: {
        leadsImported: number;
        friendRequestsSent: number;
        messagesHit: number;
        manualReplies: number;
        bookingLinksSent: number;
        callsBooked: number;
        acceptanceRate: string;
        replyRate: string;
        noShowRate: string;
    };
    qualityChecklist: {
        audienceIntegrity: boolean;
        messagingSequence: boolean;
        doubleTap: boolean;
        followUps: boolean;
    };
    qualityScore: number;
    bottleneck: string;
    adjustmentMade: string;
    nextWeekGoal: string;
    nextWeekFocus: string;
    submittedAt: Date;
}
declare const _default: mongoose.Model<IWeeklyAudit, {}, {}, {}, mongoose.Document<unknown, {}, IWeeklyAudit, {}, {}> & IWeeklyAudit & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=weekly-audit-schema.d.ts.map