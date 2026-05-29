import { PaymentRepository } from "../repositories/payment.repository";
import { Payment, CreatePaymentDto, UpdatePaymentDto, WebhookPayload } from "../dto/payment.dto";
import { PaginationParams, PaginatedResponse } from "../../../shared/types/common.types";
import { GatewayAdapterFactory, GatewayType } from "../adapters/gateway-adapter.factory";
import { PaymentRequest, PaymentResponse } from "../interfaces/payment-provider.interface";
import { logger } from "../../../shared/observability/logger.service";
import { retryQueueService } from "./retry-queue.service";
import { eventEmitter } from "../../../shared/events/event-emitter";
import { EventType } from "../../../shared/events/event.types";

export class PaymentService {
  private repository: PaymentRepository;

  constructor() {
    this.repository = new PaymentRepository();
  }

  async findAll(params: PaginationParams & { customer_id?: string; status?: string }): Promise<PaginatedResponse<Payment>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    let payments: Payment[];
    let total: number;

    if (params.customer_id) {
      payments = await this.repository.findByCustomerId(params.customer_id, { limit, offset });
      total = await this.repository.count();
    } else if (params.status) {
      payments = await this.repository.findByStatus(params.status, { limit, offset });
      total = await this.repository.countByStatus(params.status);
    } else {
      payments = await this.repository.findAll({ limit, offset });
      total = await this.repository.count();
    }

    return {
      data: payments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Payment | null> {
    return this.repository.findById(id);
  }

  async create(dto: CreatePaymentDto): Promise<Payment> {
    return this.repository.create({
      ...dto,
      status: "pending",
      gateway_transaction_id: null,
      gateway_response: null,
      paid_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  async createPayment(request: PaymentRequest, gatewayType: GatewayType): Promise<PaymentResponse> {
    logger.info('Creating payment', 'payment-service', { amount: request.amount, method: request.paymentMethod, gateway: gatewayType });

    try {
      // Get gateway adapter
      const adapter = GatewayAdapterFactory.getAdapter(gatewayType);
      if (!adapter) {
        throw new Error(`Gateway adapter not found: ${gatewayType}`);
      }

      // Create payment record
      const payment = await this.repository.create({
        customer_id: request.customerId,
        order_id: request.orderId,
        amount: request.amount,
        amount_paid: 0,
        currency: request.currency,
        status: 'pending',
        payment_method_type: request.paymentMethod,
        gateway_transaction_id: null,
        gateway_response: null,
        metadata: request.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Process payment through gateway
      const gatewayResponse = await adapter.createPayment(request);

      if (gatewayResponse.success) {
        // Update payment with gateway response
        await this.repository.update(payment.id, {
          gateway_transaction_id: gatewayResponse.gatewayTransactionId,
          gateway_response: gatewayResponse.metadata,
          status: gatewayResponse.status,
          updated_at: new Date().toISOString(),
          ...(gatewayResponse.status === 'approved' && { approved_at: new Date().toISOString() }),
        });

        // Emit payment event
        eventEmitter.emit({
          type: EventType.PAYMENT_CREATED,
          timestamp: new Date().toISOString(),
          data: {
            paymentId: payment.id,
            customerId: request.customerId,
            orderId: request.orderId,
            amount: request.amount,
            status: gatewayResponse.status,
          },
        });

        logger.info('Payment created successfully', 'payment-service', { paymentId: payment.id, status: gatewayResponse.status });

        return {
          ...gatewayResponse,
          paymentId: payment.id,
        };
      } else {
        // Payment failed, schedule retry
        await retryQueueService.scheduleRetry(payment.id, request);
        
        // Update payment status
        await this.repository.update(payment.id, {
          status: 'failed',
          gateway_response: gatewayResponse.metadata,
          updated_at: new Date().toISOString(),
        });

        logger.error('Payment creation failed', 'payment-service', { paymentId: payment.id, error: gatewayResponse.message });

        return gatewayResponse;
      }
    } catch (error) {
      logger.error('Payment creation error', 'payment-service', { error });
      throw error;
    }
  }

  async retryPayment(paymentId: string): Promise<{ success: boolean; error?: string }> {
    logger.info('Retrying payment', 'payment-service', { paymentId });

    try {
      const payment = await this.repository.findById(paymentId);
      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      // Get gateway type from payment metadata or default
      const gatewayType = (payment.metadata?.gatewayType as GatewayType) || 'belluno';
      const adapter = GatewayAdapterFactory.getAdapter(gatewayType);
      if (!adapter) {
        return { success: false, error: 'Gateway adapter not found' };
      }

      // Reconstruct payment request
      const request: PaymentRequest = {
        amount: payment.amount,
        currency: payment.currency,
        customerId: payment.customer_id,
        orderId: payment.order_id,
        paymentMethod: payment.payment_method_type as any,
        metadata: payment.metadata,
      };

      // Retry payment
      const gatewayResponse = await adapter.createPayment(request);

      if (gatewayResponse.success) {
        await this.repository.update(paymentId, {
          gateway_transaction_id: gatewayResponse.gatewayTransactionId,
          gateway_response: gatewayResponse.metadata,
          status: gatewayResponse.status,
          updated_at: new Date().toISOString(),
          ...(gatewayResponse.status === 'approved' && { approved_at: new Date().toISOString() }),
        });

        logger.info('Payment retry successful', 'payment-service', { paymentId });
        return { success: true };
      } else {
        await this.repository.update(paymentId, {
          status: 'failed',
          gateway_response: gatewayResponse.metadata,
          updated_at: new Date().toISOString(),
        });

        return { success: false, error: gatewayResponse.message };
      }
    } catch (error) {
      logger.error('Payment retry error', 'payment-service', { error, paymentId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Payment not found");
    }

    return this.repository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Payment not found");
    }

    await this.repository.delete(id);
  }

  async processWebhook(payload: WebhookPayload): Promise<Payment | null> {
    logger.info('Processing webhook', 'payment-service', { event: payload.event });

    const { event, data } = payload;

    try {
      if (event === "payment.approved") {
        const payment = await this.repository.findByGatewayTransactionId(data.transaction_id);
        if (payment) {
          const updated = await this.repository.update(payment.id, {
            status: "approved",
            amount_paid: payment.amount,
            paid_at: new Date().toISOString(),
            gateway_response: data,
            updated_at: new Date().toISOString(),
          });

          // Emit payment approved event
          eventEmitter.emit({
            type: EventType.PAYMENT_APPROVED,
            timestamp: new Date().toISOString(),
            data: {
              paymentId: payment.id,
              customerId: payment.customer_id,
              orderId: payment.order_id,
              amount: payment.amount,
            },
          });

          return updated;
        }
      } else if (event === "payment.rejected" || event === "payment.failed") {
        const payment = await this.repository.findByGatewayTransactionId(data.transaction_id);
        if (payment) {
          const updated = await this.repository.update(payment.id, {
            status: "failed",
            gateway_response: data,
            updated_at: new Date().toISOString(),
          });

          // Emit payment rejected event
          eventEmitter.emit({
            type: EventType.PAYMENT_REJECTED,
            timestamp: new Date().toISOString(),
            data: {
              paymentId: payment.id,
              customerId: payment.customer_id,
              orderId: payment.order_id,
              amount: payment.amount,
            },
          });

          return updated;
        }
      } else if (event === "payment.refunded") {
        const payment = await this.repository.findByGatewayTransactionId(data.transaction_id);
        if (payment) {
          const updated = await this.repository.update(payment.id, {
            status: "refunded",
            gateway_response: data,
            refunded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          // Emit payment refunded event
          eventEmitter.emit({
            type: EventType.PAYMENT_REFUNDED,
            timestamp: new Date().toISOString(),
            data: {
              paymentId: payment.id,
              customerId: payment.customer_id,
              orderId: payment.order_id,
              amount: payment.amount,
            },
          });

          return updated;
        }
      } else if (event === "payment.cancelled") {
        const payment = await this.repository.findByGatewayTransactionId(data.transaction_id);
        if (payment) {
          return this.repository.update(payment.id, {
            status: "cancelled",
            gateway_response: data,
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }

      return null;
    } catch (error) {
      logger.error('Webhook processing error', 'payment-service', { error });
      return null;
    }
  }

  async getStats(): Promise<{
    totalPayments: number;
    pendingPayments: number;
    approvedPayments: number;
    rejectedPayments: number,
    refundedPayments: number,
    totalRevenue: number;
  }> {
    const [totalPayments, pendingPayments, approvedPayments, rejectedPayments, refundedPayments, totalRevenue] = await Promise.all([
      this.repository.count(),
      this.repository.countByStatus("pending"),
      this.repository.countByStatus("approved"),
      this.repository.countByStatus("rejected"),
      this.repository.countByStatus("refunded"),
      this.repository.getTotalRevenue(),
    ]);

    return {
      totalPayments,
      pendingPayments,
      approvedPayments,
      rejectedPayments,
      refundedPayments,
      totalRevenue,
    };
  }

  async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    return this.repository.getRevenueByPeriod(startDate, endDate);
  }
}
