import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/types/api";
import { validateCouponSchema } from "@/lib/validators/coupon.schema";
import { validateCoupon } from "@/lib/validators/coupon.validate";
import { connectDB } from "@/lib/db/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = validateCouponSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const { code, userId, cartTotal } = parsed.data;

    await connectDB();
    const result = await validateCoupon(code, userId, cartTotal);

    if (!result.valid) {
      return apiError(result.error ?? "Cupón inválido", 422);
    }

    return apiOk({
      valid: true,
      discountAmount: result.discountAmount,
      type: result.coupon!.type,
      value: result.coupon!.value,
    });
  } catch (err) {
    console.error("[POST /api/coupons/validate]", err);
    return apiError("Error al validar el cupón", 500);
  }
}
