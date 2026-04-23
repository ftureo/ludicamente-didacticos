import type { IItemDocument } from "@/models/Item";
import type { ISubItemDocument } from "@/models/SubItem";
import type { ItemDTO, SubItemDTO } from "@/types/item";

function toISOString(value: Date | string | undefined): string {
  if (!value) return new Date(0).toISOString();
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export function toItemDTO(doc: IItemDocument): ItemDTO {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    slogan: doc.slogan,
    description: doc.description,
    longDescription: doc.longDescription,
    image: doc.image,
    gallery: doc.gallery,
    type: doc.type,
    featured: doc.featured,
    heroSlide: doc.heroSlide
      ? {
          punchline: doc.heroSlide.punchline,
          ctaText: doc.heroSlide.ctaText,
          ctaHref: doc.heroSlide.ctaHref,
        }
      : undefined,
    accentColor: doc.accentColor,
    features: doc.features.map((f) => ({
      title: f.title,
      description: f.description,
      group: f.group,
    })),
    pricing: doc.pricing
      ? { basePrice: doc.pricing.basePrice, currency: doc.pricing.currency }
      : undefined,
    order: doc.order,
    isActive: doc.isActive,
    createdAt: toISOString(doc.createdAt),
    updatedAt: toISOString(doc.updatedAt),
  };
}

export function toSubItemDTO(doc: ISubItemDocument): SubItemDTO {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    slogan: doc.slogan,
    description: doc.description,
    image: doc.image,
    gallery: doc.gallery,
    status: doc.status,
    parentItem: doc.parentItem?.toString() ?? "",
    tags: doc.tags,
    featured: doc.featured,
    isActive: doc.isActive,
    createdAt: toISOString(doc.createdAt),
    updatedAt: toISOString(doc.updatedAt),
  };
}
