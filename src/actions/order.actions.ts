"use server";

import { revalidatePath } from "next/cache";
import { orderRepository } from "@/lib/repositories/order.repository";
import { couponRepository } from "@/lib/repositories/coupon.repository";
import { prepareOrderForCreate } from "@/lib/prepare-order-create";
import { createOrderSchema, updateOrderStatusSchema } from "@/lib/validators/order.schema";
import type { CreateOrderInput } from "@/lib/validators/order.schema";
import type { OrderStatus } from "@/models/Order";
import { connectDB } from "@/lib/db/mongodb";

export async function createOrderAction(data: CreateOrderInput) {
  const parsed = createOrderSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.message };

  try {
    await connectDB();

    const prepared = await prepareOrderForCreate(parsed.data);
    if (!prepared.ok) return { success: false, error: prepared.error };

    const { payload } = prepared;
    const order = await orderRepository.create(payload);

    if (payload.couponCode) {
      await couponRepository.createRedemption(payload.couponCode, payload.email, order._id.toString());
    }

    revalidatePath("/admin/orders");
    return { success: true, data: { id: order._id.toString() } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  const parsed = updateOrderStatusSchema.safeParse({ status });
  if (!parsed.success) return { success: false, error: parsed.error.message };
  try {
    const order = await orderRepository.updateStatus(id, status);
    if (!order) return { success: false, error: "Pedido no encontrado" };
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getOrdersAdminAction() {
  try {
    const orders = await orderRepository.findRecent(100);
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
