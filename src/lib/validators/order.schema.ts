import { z } from "zod";

export const orderItemSchema = z.object({
  itemId: z.string().min(1),
  title: z.string().min(1),
  image: z.string(),
  qty: z.number().int().min(1).max(10),
  price: z.number().min(0),
});

export const createOrderSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
  apellido: z.string().min(1, "El apellido es requerido").max(100),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(8, "WhatsApp inválido").max(20),
  comentario: z.string().max(1000).optional(),
  comprobanteUrl: z.string().url().optional(),
  items: z.array(orderItemSchema).min(1, "El carrito está vacío"),
  total: z.number().min(0),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["nuevo", "en-proceso", "finalizado", "entregado"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
