"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const WeeklyAuditSchema = new mongoose_1.Schema({
    vaId: { type: mongoose_1.Schema.Types.ObjectId, ref: "VA", required: true },
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
}, { timestamps: false });
WeeklyAuditSchema.pre("save", function (next) {
    let score = 0;
    if (this.qualityChecklist.audienceIntegrity)
        score++;
    if (this.qualityChecklist.messagingSequence)
        score++;
    if (this.qualityChecklist.doubleTap)
        score++;
    if (this.qualityChecklist.followUps)
        score++;
    this.qualityScore = score;
    next();
});
exports.default = mongoose_1.default.model("WeeklyAudit", WeeklyAuditSchema);
//# sourceMappingURL=weekly-audit-schema.js.map