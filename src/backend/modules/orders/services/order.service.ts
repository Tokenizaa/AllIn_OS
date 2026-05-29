import { OrderRepository, OrderItemRepository } from "../repositories/order.repository";
import { Order, CreateOrderDto, UpdateOrderDto, OrderItem, OrderSummary } from "../dto/order.dto";
import { PaginationParams, PaginatedResponse } from "../../../shared/types/common.types";

export class OrderService {
  private orderRepository: OrderRepository;
  private orderItemRepository: OrderItemRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderItemRepository = new OrderItemRepository();
  }

  async findAll(params: PaginationParams & { customer_id?: string; status?: string }): Promise<PaginatedResponse<Order>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    let orders: Order[];
    let total: number;

    if (params.customer_id) {
      orders = await this.orderRepository.findByCustomerId(params.customer_id, { limit, offset, status: params.status });
      total = await this.orderRepository.countByCustomerId(params.customer_id);
    } else if (params.status) {
      orders = await this.orderRepository.findByStatus(params.status, { limit, offset });
      total = await this.orderRepository.countByStatus(params.status);
    } else {
      orders = await this.orderRepository.findAll({ limit, offset });
      total = await this.orderRepository.count();
    }

    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async getOrderSummary(customerId?: string): Promise<OrderSummary[]> {
    return this.orderRepository.getOrderSummary(customerId);
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    // Calculate total amount
    const totalAmount = dto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = await this.orderRepository.create({
      customer_id: dto.customer_id,
      status: "pending",
      total_amount: totalAmount,
      payment_method: dto.payment_method,
      payment_status: "pending",
      shipping_address: dto.shipping_address || null,
      notes: dto.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Create order items
    for (const item of dto.items) {
      await this.orderItemRepository.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        total_price: item.price * item.quantity,
        created_at: new Date().toISOString(),
      });
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }

    return this.orderRepository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }

    // Delete order items first
    await this.orderItemRepository.deleteByOrderId(id);
    await this.orderRepository.delete(id);
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return this.orderItemRepository.findByOrderId(orderId);
  }

  async getStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  }> {
    const [totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders, totalRevenue] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.countByStatus("pending"),
      this.orderRepository.countByStatus("processing"),
      this.orderRepository.countByStatus("shipped"),
      this.orderRepository.countByStatus("delivered"),
      this.orderRepository.countByStatus("cancelled"),
      this.orderRepository.getTotalRevenue(),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    };
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    return this.orderRepository.getRevenueByPeriod(startDate, endDate);
  }
}
