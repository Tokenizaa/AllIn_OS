import { PaymentProvider, PaymentRequest, PaymentResponse, RefundRequest, RefundResponse, WebhookEvent, GatewayConfig } from '../interfaces/payment-provider.interface';
import { logger } from '../../../shared/observability/logger.service';
import crypto from 'crypto';

export class BellunoAdapter extends PaymentProvider {
  private baseUrl: string;

  constructor(config: GatewayConfig) {
    super(config);
    this.baseUrl = config.environment === 'production'
      ? 'https://api.belluno.com.br/v1'
      : 'https://sandbox.belluno.com.br/v1';
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    this.log('Creating payment with Belluno', { amount: request.amount, method: request.paymentMethod });

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
          message: data.message || 'Payment creation failed',
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
      const response = await fetch(`${this.baseUrl}/payments/${gatewayTransactionId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logError('Get payment status failed', data);
        return {
          success: false,
          status: 'failed',
          message: data.message || 'Failed to get payment status',
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
      const payload: any = {
        payment_id: request.paymentId,
      };

      if (request.amount) {
        payload.amount = request.amount;
      }

      if (request.reason) {
        payload.reason = request.reason;
      }

      const response = await fetch(`${this.baseUrl}/refunds`, {
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
          message: data.message || 'Refund failed',
        };
      }

      return {
        success: true,
        refundId: data.id,
        gatewayTransactionId: data.payment_id,
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
      const response = await fetch(`${this.baseUrl}/payments/${gatewayTransactionId}/cancel`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logError('Cancel payment failed', data);
        return {
          success: false,
          status: 'failed',
          message: data.message || 'Cancel payment failed',
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
        case 'payment.approved':
        case 'payment.paid':
          return {
            success: true,
            gatewayTransactionId: payload.payment_id,
            status: 'approved',
            metadata: payload,
          };
        case 'payment.failed':
        case 'payment.declined':
          return {
            success: true,
            gatewayTransactionId: payload.payment_id,
            status: 'failed',
            metadata: payload,
          };
        case 'payment.cancelled':
          return {
            success: true,
            gatewayTransactionId: payload.payment_id,
            status: 'cancelled',
            metadata: payload,
          };
        case 'refund.approved':
          return {
            success: true,
            gatewayTransactionId: payload.payment_id,
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
      pix: '/pix/payments',
      boleto: '/boleto/payments',
      card: '/card/payments',
      cash: '/cash/payments',
    };
    return endpoints[method] || '/payments';
  }

  private buildPaymentPayload(request: PaymentRequest): any {
    const basePayload = {
      amount: request.amount,
      currency: request.currency,
      customer: request.customer,
      metadata: request.metadata,
    };

    switch (request.paymentMethod) {
      case 'pix':
        return {
          ...basePayload,
          expires_in: request.pix?.expiresInSeconds || 3600,
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
          pixCode: data.pix_code,
          pixQrCode: data.qr_code,
        };
      case 'boleto':
        return {
          boletoUrl: data.url,
          boletoBarcode: data.barcode,
          boletoDueDate: data.due_date,
        };
      case 'card':
        return {
          cardToken: data.card_token,
        };
      default:
        return {};
    }
  }

  private mapStatus(status: string): 'pending' | 'processing' | 'approved' | 'failed' | 'cancelled' {
    const statusMap: Record<string, 'pending' | 'processing' | 'approved' | 'failed' | 'cancelled'> = {
      pending: 'pending',
      processing: 'processing',
      approved: 'approved',
      paid: 'approved',
      failed: 'failed',
      declined: 'failed',
      cancelled: 'cancelled',
      refunded: 'approved',
    };
    return statusMap[status] || 'pending';
  }

  private mapRefundStatus(status: string): 'pending' | 'approved' | 'failed' {
    const statusMap: Record<string, 'pending' | 'approved' | 'failed'> = {
      pending: 'pending',
      processing: 'pending',
      approved: 'approved',
      completed: 'approved',
      failed: 'failed',
      declined: 'failed',
    };
    return statusMap[status] || 'pending';
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Api-Secret': this.config.apiSecret,
    };
  }

  protected log(message: string, context?: Record<string, any>): void {
    logger.info(`[Belluno] ${message}`, 'belluno-adapter', context);
  }

  protected logError(message: string, error?: any, context?: Record<string, any>): void {
    logger.error(`[Belluno] ${message}`, 'belluno-adapter', { error, ...context });
  }
}
