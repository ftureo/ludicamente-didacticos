import { z } from "zod";

export const itemFeatureSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  group: z.string().max(80).optional(),
});

export const itemPricingSchema = z.object({
  basePrice: z.number().min(0),
  currency: z.string().default("ARS"),
});

export const itemHeroSlideSchema = z.object({
  punchline: z.string().min(1).max(150),
  ctaText: z.string().min(1).max(50),
  ctaHref: z.string().min(1),
});

export const createItemSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  slogan: z.string().max(150).optional(),
  description: z.string().min(1).max(500),
  longDescription: z.string().max(2000).optional(),
  image: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  type: z.enum(["kit", "producto"]).default("producto"),
  featured: z.boolean().default(false),
  heroSlide: itemHeroSlideSchema.optional(),
  accentColor: z.enum(["primary", "secondary", "accent"]).optional(),
  features: z.array(itemFeatureSchema).default([]),
  pricing: itemPricingSchema.optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateItemSchema = createItemSchema.partial();

export const itemQuerySchema = z.object({
  isActive: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  type: z.enum(["kit", "producto"]).optional(),
  featured: z
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
  orderBy: z.enum(["order", "createdAt", "title"]).optional(),
  orderDir: z.enum(["asc", "desc"]).optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ItemQueryInput = z.infer<typeof itemQuerySchema>;
