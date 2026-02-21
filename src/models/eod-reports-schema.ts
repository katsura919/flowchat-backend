import mongoose, { Schema, Document } from "mongoose";

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

const EODReportSchema: Schema = new Schema(
    {
        vaId: { type: Schema.Types.ObjectId, ref: "VA", required: true },
        date: { type: Date, required: true },

        dailyNumbers: {
            newLeadsImported: { type: Number, default: 0 },
            friendRequestsSent: { type: Number, default: 0 },
            newConversationsStarted: { type: Number, default: 0 },
            nurtureResponsesSent: { type: Number, default: 0 },
            callsBooked: { type: Number, default: 0 },
        },

        pipelineMovement: {
            newReplies: { type: Number, default: 0 },
            pendingBookings: { type: Number, default: 0 },
            qualifiedAdded: { type: Number, default: 0 },
        },

        accountHealth: {
            status: {
                type: String,
                enum: ["healthy", "warning", "blocked"],
                required: true,
            },
            warnings: { type: String, default: null },
            actionTaken: { type: String, default: null },
        },

        insights: {
            topGroup: { type: String, default: "" },
            commonObjection: { type: String, default: "" },
            winningHook: { type: String, default: "" },
            recommendations: { type: String, default: "" },
        },

        blockers: { type: String, default: null },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: false } // custom submittedAt mapped
);

// Prevent duplicate reports per VA per day
EODReportSchema.index({ vaId: 1, date: 1 }, { unique: true });

export default mongoose.model<IEODReport>("EODReport", EODReportSchema);
