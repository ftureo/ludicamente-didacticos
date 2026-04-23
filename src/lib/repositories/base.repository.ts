import { connectDB } from "@/lib/db/mongodb";
import type { Model, Document } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  protected async ensureConnection() {
    await connectDB();
  }

  async findAll(
    filter: Record<string, unknown> = {},
    options?: { limit?: number; offset?: number; sort?: Record<string, 1 | -1> },
  ): Promise<T[]> {
    await this.ensureConnection();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = this.model.find(filter as any);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.offset) query = query.skip(options.offset);
    if (options?.limit) query = query.limit(options.limit);
    return query.lean() as unknown as T[];
  }

  async findById(id: string): Promise<T | null> {
    await this.ensureConnection();
    return this.model.findById(id).lean() as unknown as T | null;
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    await this.ensureConnection();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.model.findOne(filter as any).lean() as unknown as T | null;
  }

  async create(data: Partial<T>): Promise<T> {
    await this.ensureConnection();
    const doc = new this.model(data);
    return (await doc.save()).toObject() as T;
  }

  async updateById(id: string, data: Record<string, unknown>): Promise<T | null> {
    await this.ensureConnection();
    return this.model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .lean() as unknown as T | null;
  }

  async deleteById(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    await this.ensureConnection();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.model.countDocuments(filter as any);
  }
}
