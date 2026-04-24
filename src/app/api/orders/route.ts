import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { orderRepository } from "@/lib/repositories/order.repository";
import { prepareOrderForCreate } from "@/lib/prepare-order-create";
import { couponRepository } from "@/lib/repositories/coupon.repository";
import { createOrderSchema } from "@/lib/validators/order.schema";
import { apiError, apiOk } from "@/types/api";

export async function GET() {
  try {
    const orders = await orderRepository.findRecent(50);
    return apiOk(orders);
  } catch {
    return apiError("Error al obtener pedidos", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);

    await connectDB();
    const prepared = await prepareOrderForCreate(parsed.data);
    if (!prepared.ok) return apiError(prepared.error, 422);

    const order = await orderRepository.create(prepared.payload);
    if (prepared.payload.couponCode) {
      await couponRepository.createRedemption(
        prepared.payload.couponCode,
        prepared.payload.email,
        order._id.toString(),
      );
    }
    return apiOk(order, "Pedido creado");
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return apiError("Error al crear pedido", 500);
  }
}
