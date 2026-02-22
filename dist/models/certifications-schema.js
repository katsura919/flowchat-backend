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
const ItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    checked: { type: Boolean, default: false },
    checkedAt: { type: Date, default: null },
});
const CertificationSchema = new mongoose_1.Schema({
    vaId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "VA",
        required: true,
        unique: true,
    },
    phase1: {
        items: [ItemSchema],
        completedCount: { type: Number, default: 0 },
        totalCount: { type: Number, default: 5 },
        isPassed: { type: Boolean, default: null },
    },
    phase2: {
        items: [ItemSchema],
        completedCount: { type: Number, default: 0 },
        totalCount: { type: Number, default: 4 },
        isPassed: { type: Boolean, default: false },
    },
    phase3: {
        items: [ItemSchema],
        completedCount: { type: Number, default: 0 },
        totalCount: { type: Number, default: 5 },
        isPassed: { type: Boolean, default: false },
    },
    isCertified: { type: Boolean, default: false },
    certifiedAt: { type: Date, default: null },
    reviewedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", default: null },
}, { timestamps: { createdAt: false, updatedAt: true } });
CertificationSchema.pre("save", function (next) {
    this.phase1.completedCount = this.phase1.items.filter((i) => i.checked).length;
    this.phase2.completedCount = this.phase2.items.filter((i) => i.checked).length;
    this.phase2.isPassed = this.phase2.completedCount === this.phase2.totalCount;
    this.phase3.completedCount = this.phase3.items.filter((i) => i.checked).length;
    this.phase3.isPassed = this.phase3.completedCount >= 4;
    const wasCertified = this.isCertified;
    this.isCertified = Boolean(this.phase2.isPassed && this.phase3.isPassed);
    if (!wasCertified && this.isCertified) {
        this.certifiedAt = new Date();
    }
    next();
});
exports.default = mongoose_1.default.model("Certification", CertificationSchema);
//# sourceMappingURL=certifications-schema.js.map