import SubItem, { ISubItemDocument } from "@/models/SubItem";
import { BaseRepository } from "./base.repository";
import type { SubItemQueryInput } from "@/lib/validators/subitem.schema";

class SubItemRepository extends BaseRepository<ISubItemDocument> {
  constructor() {
    super(SubItem);
  }

  async findWithFilters(query: SubItemQueryInput): Promise<ISubItemDocument[]> {
    const filter: Record<string, unknown> = {};
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    if (query.status) filter.status = query.status;
    if (query.parentItem) filter.parentItem = query.parentItem;

    return this.findAll(filter, { limit: query.limit, offset: query.offset });
  }

  async findBySlug(slug: string): Promise<ISubItemDocument | null> {
    return this.findOne({ slug, isActive: true });
  }

  async findByParent(parentId: string): Promise<ISubItemDocument[]> {
    return this.findAll({ parentItem: parentId, isActive: true }, { sort: { createdAt: -1 } });
  }
}

export const subItemRepository = new SubItemRepository();
