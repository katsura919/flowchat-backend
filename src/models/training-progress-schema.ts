import mongoose, { Schema, Document } from "mongoose";

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

const ModuleSchema = new Schema<IModule>({
    slug: { type: String, required: true },
    label: { type: String, required: true },
    group: { type: String, required: true },
    order: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
});

const TrainingProgressSchema: Schema = new Schema(
    {
        vaId: {
            type: Schema.Types.ObjectId,
            ref: "VA",
            required: true,
            unique: true,
        },
        modules: [ModuleSchema],
        completedCount: { type: Number, default: 0 },
        totalCount: { type: Number, default: 17 },
        progressPercent: { type: Number, default: 0 },
    },
    { timestamps: { createdAt: false, updatedAt: true } }
);

// Pre-save hook to calculate required fields
TrainingProgressSchema.pre("save", function (this: ITrainingProgress, next) {
    const completedModules = this.modules.filter((m) => m.completed).length;
    this.completedCount = completedModules;
    this.totalCount = this.modules.length || 17;
    this.progressPercent = this.totalCount > 0
        ? Math.round((completedModules / this.totalCount) * 100)
        : 0;
    next();
});

export default mongoose.model<ITrainingProgress>(
    "TrainingProgress",
    TrainingProgressSchema
);
