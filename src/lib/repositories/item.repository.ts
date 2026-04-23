import Item, { IItemDocument } from "@/models/Item";
import { BaseRepository } from "./base.repository";
import type { ItemQueryInput } from "@/lib/validators/item.schema";

class ItemRepository extends BaseRepository<IItemDocument> {
  constructor() {
    super(Item);
  }

  async findWithFilters(query: ItemQueryInput): Promise<IItemDocument[]> {
    const filter: Record<string, unknown> = {};
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    if (query.type) filter.type = query.type;
    if (query.featured !== undefined) filter.featured = query.featured;

    const sortField = query.orderBy ?? "order";
    const sortDir = query.orderDir === "desc" ? -1 : 1;

    return this.findAll(filter, {
      limit: query.limit,
      offset: query.offset,
      sort: { [sortField]: sortDir },
    });
  }

  async findBySlug(slug: string): Promise<IItemDocument | null> {
    return this.findOne({ slug, isActive: true });
  }

  async findFeatured(limit = 3): Promise<IItemDocument[]> {
    return this.findAll({ featured: true, isActive: true }, { limit, sort: { order: 1 } });
  }

  async findForHero(): Promise<IItemDocument[]> {
    return this.findAll(
      { "heroSlide": { $exists: true, $ne: null }, isActive: true },
      { limit: 5, sort: { order: 1 } },
    );
  }

  async findByType(type: "kit" | "producto"): Promise<IItemDocument[]> {
    return this.findAll({ type, isActive: true }, { sort: { order: 1 } });
  }
}

export const itemRepository = new ItemRepository();
