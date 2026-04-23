import Order, { IOrderDocument, OrderStatus } from "@/models/Order";
import { BaseRepository } from "./base.repository";

class OrderRepository extends BaseRepository<IOrderDocument> {
  constructor() {
    super(Order);
  }

  async findByStatus(status: OrderStatus): Promise<IOrderDocument[]> {
    return this.findAll({ status }, { sort: { createdAt: -1 } });
  }

  async findRecent(limit = 20): Promise<IOrderDocument[]> {
    return this.findAll({}, { limit, sort: { createdAt: -1 } });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<IOrderDocument | null> {
    return this.updateById(id, { status });
  }

  async countByStatus(): Promise<Record<OrderStatus, number>> {
    await this.ensureConnection();
    const result = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const counts: Record<string, number> = {
      nuevo: 0,
      "en-proceso": 0,
      finalizado: 0,
      entregado: 0,
    };
    for (const r of result) {
      counts[r._id] = r.count;
    }
    return counts as Record<OrderStatus, number>;
  }
}

export const orderRepository = new OrderRepository();
