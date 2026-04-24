import type { IOrderItem } from "@/models/Order";

export function computeSubtotalFromItems(items: Pick<IOrderItem, "price" | "qty">[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

/** Desglose para UI admin: soporta pedidos viejos sin `subtotal`. */
export function getOrderMonetaryBreakdown(order: {
  subtotal?: number;
  total: number;
  discountAmount?: number;
  couponCode?: string;
}): { subtotal: number; discount: number; finalTotal: number } {
  if (typeof order.subtotal === "number") {
    return {
      subtotal: order.subtotal,
      discount: order.discountAmount ?? 0,
      finalTotal: order.total,
    };
  }
  const discount = order.discountAmount ?? 0;
  if (order.couponCode && discount > 0) {
    return {
      subtotal: order.total + discount,
      discount,
      finalTotal: order.total,
    };
  }
  return { subtotal: order.total, discount: 0, finalTotal: order.total };
}
