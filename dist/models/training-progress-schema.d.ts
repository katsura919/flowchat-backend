import mongoose, { Document } from "mongoose";
export interface IModule {
    slug: string;
    label: string;
    group: string;
    order: number;
    completed: boolean;
    completedAt: Date | null;
}
export interface ITrainingProgress extends Document {
    vaId: mongoose.Types.ObjectId;
    modules: mongoose.Types.DocumentArray<IModule & Document>;
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITrainingProgress, {}, {}, {}, mongoose.Document<unknown, {}, ITrainingProgress, {}, {}> & ITrainingProgress & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=training-progress-schema.d.ts.map