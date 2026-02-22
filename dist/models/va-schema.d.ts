import mongoose, { Document } from "mongoose";
export interface IVA extends Document {
    name: string;
    email: string;
    password?: string;
    assignedAdminId: mongoose.Types.ObjectId;
    status: "active" | "inactive" | "suspended";
    trainingStatus: "not_started" | "in_progress" | "completed";
    isCertified: boolean;
    certifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IVA, {}, {}, {}, mongoose.Document<unknown, {}, IVA, {}, {}> & IVA & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=va-schema.d.ts.map