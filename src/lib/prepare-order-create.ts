import { computeSubtotalFromItems } from "@/lib/order-totals";
import { validateCoupon } from "@/lib/validators/coupon.validate";
import type { CreateOrderInput } from "@/lib/validators/order.schema";

const TOTAL_TOLERANCE = 0.01;

/** Campos del pedido que no se copian del cliente: total y descuento se recalculan; cupón se valida aparte. */
type OrderCreateBase = Omit<CreateOrderInput, "couponCode" | "discountAmount" | "total">;

export type PreparedOrderCreate = Omit<CreateOrderInput, "total" | "couponCode" | "discountAmount"> & {
  subtotal: number;
  total: number;
  couponCode?: string;
  discountAmount?: number;
};

export async function prepareOrderForCreate(
  data: CreateOrderInput,
): Promise<{ ok: true; payload: PreparedOrderCreate } | { ok: false; error: string }> {
  const subtotal = computeSubtotalFromItems(data.items);
  if (Math.abs(data.total - subtotal) > TOTAL_TOLERANCE) {
    return {
      ok: false,
      error: "El total del carrito no coincide con los productos. Actualizá la página e intentá de nuevo.",
    };
  }

  const couponCode = data.couponCode;
  const base = { ...data } as CreateOrderInput & Record<string, unknown>;
  Reflect.deleteProperty(base, "couponCode");
  Reflect.deleteProperty(base, "discountAmount");
  Reflect.deleteProperty(base, "total");
  const orderBase = base as OrderCreateBase;

  if (couponCode) {
    const validation = await validateCoupon(couponCode, data.email, subtotal);
    if (!validation.valid) {
      return { ok: false, error: validation.error ?? "Cupón inválido" };
    }
    const discountAmount = validation.discountAmount ?? 0;
    const total = Math.max(0, subtotal - discountAmount);
    return {
      ok: true,
      payload: {
        ...orderBase,
        subtotal,
        total,
        couponCode,
        discountAmount,
      },
    };
  }

  return {
    ok: true,
    payload: {
      ...orderBase,
      subtotal,
      total: subtotal,
    },
  };
}
