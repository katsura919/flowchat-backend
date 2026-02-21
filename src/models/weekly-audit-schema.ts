import mongoose, { Schema, Document } from "mongoose";

export interface IWeeklyAudit extends Document {
    vaId: mongoose.Types.ObjectId;
    weekEnding: Date;
    currentStage:
    | "Stage 1 — Build"
    | "Stage 2 — Scale"
    | "Stage 3 — Invite"
    | "Stage 4 — Optimize";
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

const WeeklyAuditSchema: Schema = new Schema(
    {
        vaId: { type: Schema.Types.ObjectId, ref: "VA", required: true },
        weekEnding: { type: Date, required: true },
        currentStage: {
            type: String,
            enum: [
                "Stage 1 — Build",
                "Stage 2 — Scale",
                "Stage 3 — Invite",
                "Stage 4 — Optimize",
            ],
            required: true,
        },

        kpis: {
            leadsImported: { type: Number, default: 0 },
            friendRequestsSent: { type: Number, default: 0 },
            messagesHit: { type: Number, default: 0 },
            manualReplies: { type: Number, default: 0 },
            bookingLinksSent: { type: Number, default: 0 },
            callsBooked: { type: Number, default: 0 },
            acceptanceRate: { type: String, default: "0%" },
            replyRate: { type: String, default: "0%" },
            noShowRate: { type: String, default: "0%" },
        },

        qualityChecklist: {
            audienceIntegrity: { type: Boolean, default: false },
            messagingSequence: { type: Boolean, default: false },
            doubleTap: { type: Boolean, default: false },
            followUps: { type: Boolean, default: false },
        },

        qualityScore: { type: Number, default: 0 },

        bottleneck: { type: String, default: "" },
        adjustmentMade: { type: String, default: "" },
        nextWeekGoal: { type: String, default: "" },
        nextWeekFocus: { type: String, default: "" },

        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: false }
);

// Pre-save hook to calculate quality score
WeeklyAuditSchema.pre<IWeeklyAudit>("save", function (next) {
    let score = 0;
    if (this.qualityChecklist.audienceIntegrity) score++;
    if (this.qualityChecklist.messagingSequence) score++;
    if (this.qualityChecklist.doubleTap) score++;
    if (this.qualityChecklist.followUps) score++;

    this.qualityScore = score;
    next();
});

export default mongoose.model<IWeeklyAudit>("WeeklyAudit", WeeklyAuditSchema);
