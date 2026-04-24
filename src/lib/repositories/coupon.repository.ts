import Coupon, { type CouponWithUsageCount, type ICouponDocument } from "@/models/Coupon";
import CouponRedemption, { ICouponRedemptionDocument } from "@/models/CouponRedemption";
import { BaseRepository } from "./base.repository";
import { connectDB } from "@/lib/db/mongodb";

class CouponRepository extends BaseRepository<ICouponDocument> {
  constructor() {
    super(Coupon);
  }

  async findByCode(code: string): Promise<ICouponDocument | null> {
    return this.findOne({ code: code.toUpperCase() });
  }

  async findAllWithUsage(): Promise<CouponWithUsageCount[]> {
    await this.ensureConnection();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    const codes = coupons.map((c) => c.code);
    const redemptionCounts = await CouponRedemption.aggregate([
      { $match: { couponCode: { $in: codes } } },
      { $group: { _id: "$couponCode", count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    for (const r of redemptionCounts) {
      countMap[r._id] = r.count;
    }
    return coupons.map((c) => ({
      ...c,
      usageCount: countMap[c.code] ?? 0,
    })) as CouponWithUsageCount[];
  }

  async countRedemptions(couponCode: string): Promise<number> {
    await connectDB();
    return CouponRedemption.countDocuments({ couponCode: couponCode.toUpperCase() });
  }

  async findRedemptionsByCode(couponCode: string): Promise<ICouponRedemptionDocument[]> {
    await connectDB();
    return CouponRedemption.find({ couponCode: couponCode.toUpperCase() })
      .sort({ usedAt: -1 })
      .lean() as unknown as ICouponRedemptionDocument[];
  }

  async hasUserRedeemed(couponCode: string, userId: string): Promise<boolean> {
    await connectDB();
    const count = await CouponRedemption.countDocuments({
      couponCode: couponCode.toUpperCase(),
      userId: userId.toLowerCase(),
    });
    return count > 0;
  }

  async createRedemption(
    couponCode: string,
    userId: string,
    orderId?: string,
  ): Promise<ICouponRedemptionDocument> {
    await connectDB();
    const doc = new CouponRedemption({
      couponCode: couponCode.toUpperCase(),
      userId: userId.toLowerCase(),
      orderId,
      usedAt: new Date(),
    });
    return (await doc.save()).toObject() as ICouponRedemptionDocument;
  }

  async toggleActive(id: string, active: boolean): Promise<ICouponDocument | null> {
    return this.updateById(id, { active });
  }
}

export const couponRepository = new CouponRepository();
