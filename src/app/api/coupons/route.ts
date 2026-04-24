import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/types/api";
import { createCouponSchema } from "@/lib/validators/coupon.schema";
import { couponRepository } from "@/lib/repositories/coupon.repository";
import { connectDB } from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const coupons = await couponRepository.findAllWithUsage();
    return apiOk(coupons);
  } catch (err) {
    console.error("[GET /api/coupons]", err);
    return apiError("Error al obtener los cupones", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = createCouponSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    await connectDB();
    const coupon = await couponRepository.create({
      ...parsed.data,
      expiresAt: new Date(parsed.data.expiresAt as string),
    });
    return apiOk(coupon, "Cupón creado exitosamente");
  } catch (err: unknown) {
    console.error("[POST /api/coupons]", err);
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return apiError("Ya existe un cupón con ese código", 409);
    }
    return apiError("Error al crear el cupón", 500);
  }
}
