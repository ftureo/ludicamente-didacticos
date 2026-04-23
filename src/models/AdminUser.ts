import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminUser {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminUserDocument extends IAdminUser, Document {
  _id: mongoose.Types.ObjectId;
}

const AdminUserSchema = new Schema<IAdminUserDocument>(
  {
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "La contraseña es requerida"] },
    name: { type: String, required: [true, "El nombre es requerido"], trim: true },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as Record<string, unknown>)["AdminUser"];
}

const AdminUser: Model<IAdminUserDocument> =
  (mongoose.models.AdminUser as Model<IAdminUserDocument>) ||
  mongoose.model<IAdminUserDocument>("AdminUser", AdminUserSchema);

export default AdminUser;
