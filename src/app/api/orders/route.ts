import { NextRequest } from "next/server";
import { orderRepository } from "@/lib/repositories/order.repository";
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
    const order = await orderRepository.create(parsed.data);
    return apiOk(order, "Pedido creado");
  } catch {
    return apiError("Error al crear pedido", 500);
  }
}
