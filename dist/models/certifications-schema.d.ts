import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<ICertification, {}, {}, {}, mongoose.Document<unknown, {}, ICertification, {}, {}> & ICertification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=certifications-schema.d.ts.map