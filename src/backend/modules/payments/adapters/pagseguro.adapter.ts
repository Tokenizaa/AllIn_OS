import { PaymentProvider, PaymentRequest, PaymentResponse, RefundRequest, RefundResponse, WebhookEvent, GatewayConfig } from '../interfaces/payment-provider.interface';
import { logger } from '../../../shared/observability/logger.service';
import crypto from 'crypto';

export class PagSeguroAdapter extends PaymentProvider {
  private baseUrl: string;

  constructor(config: GatewayConfig) {
    super(config);
    this.baseUrl = config.environment === 'production'
      ? 'https://api.pagseguro.com.br/v1'
      : 'https://sandbox.api.pagseguro.com.br/v1';
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    this.log('Creating payment with PagSeguro', { amount: request.amount, method: request.paymentMethod });

    try {
      const endpoint = this.getPaymentEndpoint(request.paymentMethod);
      const payload = this.buildPaymentPayload(request);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logError('Payment creation failed', data);
        return {
          success: false,
          status: 'failed',
          message: data.error?.message || data.message || 'Payment creation failed',
        };
      }

      const paymentData = this.extractPaymentData(request.paymentMethod, data);

      this.log('Payment created successfully', { gatewayTransactionId: data.id });

      return {
        success: true,
        paymentId: data.id,
        gatewayTransactionId: data.id,
        status: this.mapStatus(data.status),
        paymentData,
        metadata: data,
      };
    } catch (error) {
      this.logError('Payment creation error', error);
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentStatus(gatewayTransactionId: string): Promise<PaymentResponse> {
    this.log('Getting payment status', { gatewayTransactionId });

    try {
      const response = await fetch(`${this.baseUrl}/charges/${gatewayTransactionId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logError('Get payment status failed', data);
        return {
          success: false,
          status: 'failed',
          message: data.error?.message || data.message || 'Failed to get payment status',
        };
      }

      return {
        success: true,
        gatewayTransactionId: data.id,
        status: this.mapStatus(data.status),
        metadata: data,
      };
    } catch (error) {
      this.logError('Get payment status error', error);
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    this.log('Processing refund', { paymentId: request.paymentId, amount: request.amount });

    try {
      const payload: any = {};

      if (request.amount) {
        payload.amount = request.amount;
      }

      if (request.reason) {
        payload.description = request.reason;
      }

      const response = await fetch(`${this.baseUrl}/charges/${request.paymentId}/refund`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logError('Refund failed', data);
        return {
          success: false,
          status: 'failed',
          message: data.error?.message || data.message || 'Refund failed',
        };
      }

      return {
        success: true,
        refundId: data.id,
        gatewayTransactionId: request.paymentId,
        status: this.mapRefundStatus(data.status),
      };
    } catch (error) {
      this.logError('Refund error', error);
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async cancelPayment(gatewayTransactionId: string): Promise<PaymentResponse> {
    this.log('Cancelling payment', { gatewayTransactionId });

    try {
      const response = await fetch(`${this.baseUrl}/charges/${gatewayTransactionId}/cancel`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logError('Cancel payment failed', data);
        return {
          success: false,
          status: 'failed',
          message: data.error?.message || data.message || 'Cancel payment failed',
        };
      }

      return {
        success: true,
        gatewayTransactionId: data.id,
        status: this.mapStatus(data.status),
        metadata: data,
      };
    } catch (error) {
      this.logError('Cancel payment error', error);
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyWebhook(event: WebhookEvent): Promise<boolean> {
    if (!event.signature || !this.config.webhookSecret) {
      this.logError('Webhook verification failed: missing signature or secret');
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(JSON.stringify(event.payload))
        .digest('hex');

      const isValid = crypto.timingSafeEqual(
        Buffer.from(event.signature),
        Buffer.from(expectedSignature)
      );

      if (!isValid) {
        this.logError('Webhook signature verification failed');
      }

      return isValid;
    } catch (error) {
      this.logError('Webhook verification error', error);
      return false;
    }
  }

  async processWebhook(event: WebhookEvent): Promise<PaymentResponse> {
    this.log('Processing webhook', { eventType: event.eventType });

    try {
      const eventType = event.eventType;
      const payload = event.payload;

      switch (eventType) {
        case 'PAYMENT_APPROVED':
        case 'PAYMENT_PAID':
          return {
            success: true,
            gatewayTransactionId: payload.charge_id,
            status: 'approved',
            metadata: payload,
          };
        case 'PAYMENT_FAILED':
        case 'PAYMENT_DECLINED':
          return {
            success: true,
            gatewayTransactionId: payload.charge_id,
            status: 'failed',
            metadata: payload,
          };
        case 'PAYMENT_CANCELLED':
          return {
            success: true,
            gatewayTransactionId: payload.charge_id,
            status: 'cancelled',
            metadata: payload,
          };
        case 'REFUND_APPROVED':
          return {
            success: true,
            gatewayTransactionId: payload.charge_id,
            status: 'refunded',
            metadata: payload,
          };
        default:
          this.log('Unknown webhook event type', { eventType });
          return {
            success: false,
            status: 'failed',
            message: 'Unknown event type',
          };
      }
    } catch (error) {
      this.logError('Webhook processing error', error);
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getPaymentEndpoint(method: string): string {
    const endpoints: Record<string, string> = {
      pix: '/pix/charges',
      boleto: '/boleto/charges',
      card: '/card/charges',
      cash: '/cash/charges',
    };
    return endpoints[method] || '/charges';
  }

  private buildPaymentPayload(request: PaymentRequest): any {
    const basePayload = {
      amount: request.amount,
      currency: request.currency,
      reference_id: request.orderId,
      customer: request.customer,
      metadata: request.metadata,
    };

    switch (request.paymentMethod) {
      case 'pix':
        return {
          ...basePayload,
          qr_codes: [{
            amount: request.amount,
            expiration_date: new Date(Date.now() + (request.pix?.expiresInSeconds || 3600) * 1000).toISOString(),
          }],
        };
      case 'boleto':
        return {
          ...basePayload,
          due_date: request.boleto?.dueDate,
        };
      case 'card':
        return {
          ...basePayload,
          card: request.card,
        };
      case 'cash':
        return {
          ...basePayload,
        };
      default:
        return basePayload;
    }
  }

  private extractPaymentData(method: string, data: any): any {
    switch (method) {
      case 'pix':
        return {
          pixCode: data.qr_codes?.[0]?.emv,
          pixQrCode: data.qr_codes?.[0]?.qr_code_url,
        };
      case 'boleto':
        return {
          boletoUrl: data.links?.[0]?.href,
          boletoBarcode: data.barcode,
          boletoDueDate: data.due_date,
        };
      case 'card':
        return {
          cardToken: data.card?.token,
        };
      default:
        return {};
    }
  }

  private mapStatus(status: string): 'pending' | 'processing' | 'approved' | 'failed' | 'cancelled' {
    const statusMap: Record<string, 'pending' | 'processing' | 'approved' | 'failed' | 'cancelled'> = {
      PENDING: 'pending',
      PROCESSING: 'processing',
      APPROVED: 'approved',
      PAID: 'approved',
      FAILED: 'failed',
      DECLINED: 'failed',
      CANCELLED: 'cancelled',
      REFUNDED: 'approved',
    };
    return statusMap[status] || 'pending';
  }

  private mapRefundStatus(status: string): 'pending' | 'approved' | 'failed' {
    const statusMap: Record<string, 'pending' | 'approved' | 'failed'> = {
      PENDING: 'pending',
      PROCESSING: 'pending',
      APPROVED: 'approved',
      COMPLETED: 'approved',
      FAILED: 'failed',
      DECLINED: 'failed',
    };
    return statusMap[status] || 'pending';
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };
  }

  protected log(message: string, context?: Record<string, any>): void {
    logger.info(`[PagSeguro] ${message}`, 'pagseguro-adapter', context);
  }

  protected logError(message: string, error?: any, context?: Record<string, any>): void {
    logger.error(`[PagSeguro] ${message}`, 'pagseguro-adapter', { error, ...context });
  }
}
