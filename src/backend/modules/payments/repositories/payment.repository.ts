import { BaseRepository } from "../../../infra/database/base.repository";
import { Payment, CreatePaymentDto, UpdatePaymentDto } from "../dto/payment.dto";

export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super("payments");
  }

  async findByOrderId(orderId: string): Promise<Payment[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findByCustomerId(customerId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Payment[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("customer_id", customerId);

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
  }): Promise<Payment[]> {
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

  async findByGatewayTransactionId(transactionId: string): Promise<Payment | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("gateway_transaction_id", transactionId)
      .single();

    if (error) throw error;
    return data;
  }

  async countByStatus(status: string): Promise<number> {
    const { count, error } = await this.getClient()
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("status", status);

    if (error) throw error;
    return count || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("amount")
      .eq("status", "approved");

    if (error) throw error;

    return data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("amount")
      .gte("paid_at", startDate.toISOString())
      .lte("paid_at", endDate.toISOString())
      .eq("status", "approved");

    if (error) throw error;

    return data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  }
}
