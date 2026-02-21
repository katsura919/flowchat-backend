import mongoose, { Schema, Document } from "mongoose";

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

const VASchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        assignedAdminId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
        trainingStatus: {
            type: String,
            enum: ["not_started", "in_progress", "completed"],
            default: "not_started",
        },

        isCertified: { type: Boolean, default: false },
        certifiedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.model<IVA>("VA", VASchema);
