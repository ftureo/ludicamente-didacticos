import mongoose, { Schema, Document, Model } from "mongoose";

export type CouponType = "percentage" | "fixed" | "free_shipping";

export interface ICoupon {
  code: string;
  type: CouponType;
  value: number;
  minPurchaseAmount?: number;
  maxUses?: number;
  maxUsesPerUser: number;
  expiresAt: Date;
  active: boolean;
  createdAt: Date;
}

export interface ICouponDocument extends ICoupon, Document {
  _id: mongoose.Types.ObjectId;
}

/** Cupón en forma plana (p. ej. `.lean()`) + conteo de usos para listados admin. */
export type CouponWithUsageCount = ICoupon & {
  _id: mongoose.Types.ObjectId;
  usageCount: number;
};

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: {
      type: String,
      required: [true, "El código es requerido"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9]+$/, "El código solo puede contener letras y números"],
    },
    type: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping"],
      required: [true, "El tipo es requerido"],
    },
    value: {
      type: Number,
      required: [true, "El valor es requerido"],
      min: 0,
    },
    minPurchaseAmount: { type: Number, min: 0 },
    maxUses: { type: Number, min: 1 },
    maxUsesPerUser: { type: Number, min: 1, default: 1 },
    expiresAt: { type: Date, required: [true, "La fecha de expiración es requerida"] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ active: 1, expiresAt: 1 });

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as Record<string, unknown>)["Coupon"];
}

const Coupon: Model<ICouponDocument> =
  (mongoose.models.Coupon as Model<ICouponDocument>) ||
  mongoose.model<ICouponDocument>("Coupon", CouponSchema);

export default Coupon;
