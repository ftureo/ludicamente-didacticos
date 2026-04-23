import { z } from "zod";

export const createSubItemSchema = z.object({
  title: z.string().min(1).max(150),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  slogan: z.string().max(150).optional(),
  description: z.string().min(1).max(1000),
  image: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  parentItem: z.string().min(1),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateSubItemSchema = createSubItemSchema.partial();

export const subItemQuerySchema = z.object({
  parentItem: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  isActive: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  limit: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1).max(100))
    .optional(),
  offset: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(0))
    .optional(),
});

export type CreateSubItemInput = z.infer<typeof createSubItemSchema>;
export type UpdateSubItemInput = z.infer<typeof updateSubItemSchema>;
export type SubItemQueryInput = z.infer<typeof subItemQuerySchema>;
