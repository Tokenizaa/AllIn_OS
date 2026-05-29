import { BaseRepository } from "../../../infra/database/base.repository";
import { Order, CreateOrderDto, UpdateOrderDto, OrderItem, OrderSummary } from "../dto/order.dto";

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super("orders");
  }

  async findByCustomerId(customerId: string, options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<Order[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("customer_id", customerId);

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByStatus(status: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("status", status);

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getOrderSummary(customerId?: string): Promise<OrderSummary[]> {
    let query = this.getClient()
      .from("order_summary_view")
      .select("*");

    if (customerId) {
      query = query.eq("customer_id", customerId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async countByStatus(status: string): Promise<number> {
    const { count, error } = await this.getClient()
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("status", status);

    if (error) throw error;
    return count || 0;
  }

  async countByCustomerId(customerId: string): Promise<number> {
    const { count, error } = await this.getClient()
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("customer_id", customerId);

    if (error) throw error;
    return count || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("total_amount");

    if (error) throw error;

    return data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("total_amount")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .eq("payment_status", "paid");

    if (error) throw error;

    return data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  }
}

export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor() {
    super("order_items");
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("order_id", orderId);

    if (error) throw error;
    return data || [];
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .eq("order_id", orderId);

    if (error) throw error;
  }
}
