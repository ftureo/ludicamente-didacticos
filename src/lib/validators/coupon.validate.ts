import { couponRepository } from "@/lib/repositories/coupon.repository";
import type { ICouponDocument } from "@/models/Coupon";

export interface CouponValidationResult {
  valid: boolean;
  coupon?: ICouponDocument;
  discountAmount?: number;
  error?: string;
}

export function calculateDiscount(coupon: ICouponDocument, cartTotal: number): number {
  if (coupon.type === "percentage") {
    return Math.round((cartTotal * coupon.value) / 100);
  }
  if (coupon.type === "fixed") {
    return Math.min(coupon.value, cartTotal);
  }
  // free_shipping: no monetary discount
  return 0;
}

export async function validateCoupon(
  code: string,
  userId: string,
  cartTotal: number,
): Promise<CouponValidationResult> {
  const coupon = await couponRepository.findByCode(code);

  if (!coupon) return { valid: false, error: "El cupón no existe" };
  if (!coupon.active) return { valid: false, error: "El cupón no está activo" };
  if (new Date(coupon.expiresAt) < new Date()) return { valid: false, error: "El cupón ha expirado" };

  if (coupon.minPurchaseAmount && cartTotal < coupon.minPurchaseAmount) {
    return {
      valid: false,
      error: `El monto mínimo para este cupón es $${coupon.minPurchaseAmount.toLocaleString("es-AR")}`,
    };
  }

  if (coupon.maxUses !== undefined) {
    const totalUses = await couponRepository.countRedemptions(coupon.code);
    if (totalUses >= coupon.maxUses) {
      return { valid: false, error: "El cupón ha alcanzado el límite de usos" };
    }
  }

  const redemptions = await couponRepository.findRedemptionsByCode(coupon.code);
  const userUseCount = redemptions.filter((r) => r.userId === userId.toLowerCase()).length;
  if (userUseCount >= coupon.maxUsesPerUser) {
    return { valid: false, error: "Ya usaste este cupón" };
  }

  const discountAmount = calculateDiscount(coupon, cartTotal);
  return { valid: true, coupon, discountAmount };
}
