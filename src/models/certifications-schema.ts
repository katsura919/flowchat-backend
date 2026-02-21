import mongoose, { Schema, Document } from "mongoose";

export interface ICertificationItem {
    id: string;
    text: string;
    checked: boolean;
    checkedAt: Date | null;
}

export interface ICertificationPhase {
    items: ICertificationItem[];
    completedCount: number;
    totalCount: number;
    isPassed: boolean | null;
}

export interface ICertification extends Document {
    vaId: mongoose.Types.ObjectId;
    phase1: ICertificationPhase;
    phase2: ICertificationPhase;
    phase3: ICertificationPhase;
    isCertified: boolean;
    certifiedAt: Date | null;
    reviewedBy: mongoose.Types.ObjectId | null;
    updatedAt: Date;
}

const ItemSchema = new Schema<ICertificationItem>({
    id: { type: String, required: true },
    text: { type: String, required: true },
    checked: { type: Boolean, default: false },
    checkedAt: { type: Date, default: null },
});

const CertificationSchema: Schema = new Schema(
    {
        vaId: {
            type: Schema.Types.ObjectId,
            ref: "VA",
            required: true,
            unique: true,
        },

        phase1: {
            items: [ItemSchema],
            completedCount: { type: Number, default: 0 },
            totalCount: { type: Number, default: 5 },
            isPassed: { type: Boolean, default: null }, // always null for phase1
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
        reviewedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    },
    { timestamps: { createdAt: false, updatedAt: true } }
);

// Pre-save hook for certification business logic
CertificationSchema.pre<ICertification>("save", function (next) {
    // calculate phase 1
    this.phase1.completedCount = this.phase1.items.filter((i) => i.checked).length;
    // phase1.isPassed remains null

    // calculate phase 2
    this.phase2.completedCount = this.phase2.items.filter((i) => i.checked).length;
    this.phase2.isPassed = this.phase2.completedCount === this.phase2.totalCount;

    // calculate phase 3
    this.phase3.completedCount = this.phase3.items.filter((i) => i.checked).length;
    this.phase3.isPassed = this.phase3.completedCount >= 4;

    // update overall certification status
    const wasCertified = this.isCertified;
    this.isCertified = Boolean(this.phase2.isPassed && this.phase3.isPassed);

    if (!wasCertified && this.isCertified) {
        this.certifiedAt = new Date();
    }

    next();
});

export default mongoose.model<ICertification>(
    "Certification",
    CertificationSchema
);
