import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICouponRedemption {
  couponCode: string;
  userId: string;
  orderId?: string;
  usedAt: Date;
}

export interface ICouponRedemptionDocument extends ICouponRedemption, Document {
  _id: mongoose.Types.ObjectId;
}

const CouponRedemptionSchema = new Schema<ICouponRedemptionDocument>(
  {
    couponCode: { type: String, required: true, uppercase: true, trim: true },
    userId: { type: String, required: true, lowercase: true, trim: true },
    orderId: { type: String },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

CouponRedemptionSchema.index({ couponCode: 1, userId: 1 }, { unique: true });
CouponRedemptionSchema.index({ couponCode: 1 });

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as Record<string, unknown>)["CouponRedemption"];
}

const CouponRedemption: Model<ICouponRedemptionDocument> =
  (mongoose.models.CouponRedemption as Model<ICouponRedemptionDocument>) ||
  mongoose.model<ICouponRedemptionDocument>("CouponRedemption", CouponRedemptionSchema);

export default CouponRedemption;
