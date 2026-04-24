import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/types/api";
import { toggleCouponSchema } from "@/lib/validators/coupon.schema";
import { couponRepository } from "@/lib/repositories/coupon.repository";
import { connectDB } from "@/lib/db/mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const coupon = await couponRepository.findById(id);
    if (!coupon) return apiError("Cupón no encontrado", 404);

    const redemptions = await couponRepository.findRedemptionsByCode(coupon.code);
    return apiOk({ coupon, redemptions });
  } catch (err) {
    console.error("[GET /api/coupons/[id]]", err);
    return apiError("Error al obtener el cupón", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json() as unknown;
    const parsed = toggleCouponSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    await connectDB();
    const coupon = await couponRepository.toggleActive(id, parsed.data.active);
    if (!coupon) return apiError("Cupón no encontrado", 404);

    return apiOk(coupon);
  } catch (err) {
    console.error("[PATCH /api/coupons/[id]]", err);
    return apiError("Error al actualizar el cupón", 500);
  }
}
