import { NextRequest } from "next/server";
import { orderRepository } from "@/lib/repositories/order.repository";
import { updateOrderStatusSchema } from "@/lib/validators/order.schema";
import { apiError, apiOk } from "@/types/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await orderRepository.findById(id);
    if (!order) return apiError("Pedido no encontrado", 404);
    return apiOk(order);
  } catch {
    return apiError("Error al obtener pedido", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    const order = await orderRepository.updateStatus(id, parsed.data.status);
    if (!order) return apiError("Pedido no encontrado", 404);
    return apiOk(order, "Estado actualizado");
  } catch {
    return apiError("Error al actualizar pedido", 500);
  }
}
