import mongoose, { Document } from "mongoose";
export interface IAdmin extends Document {
    name: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin, {}, {}> & IAdmin & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=admin-schema.d.ts.map