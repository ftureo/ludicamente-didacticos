import { z } from "zod";

const couponCodeSchema = z
  .string()
  .min(3, "El código debe tener al menos 3 caracteres")
  .max(20, "El código no puede superar 20 caracteres")
  .regex(/^[A-Z0-9]+$/, "El código solo puede contener letras y números");

export const createCouponSchema = z.object({
  code: couponCodeSchema,
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.number().min(0),
  minPurchaseAmount: z.number().min(0).optional(),
  maxUses: z.number().int().min(1).optional(),
  maxUsesPerUser: z.number().int().min(1).default(1),
  expiresAt: z.string().datetime({ offset: true }).or(z.date()),
  active: z.boolean().default(true),
});

export const validateCouponSchema = z.object({
  code: couponCodeSchema,
  userId: z.string().email("userId debe ser un email válido"),
  cartTotal: z.number().min(0),
});

export const toggleCouponSchema = z.object({
  active: z.boolean(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
