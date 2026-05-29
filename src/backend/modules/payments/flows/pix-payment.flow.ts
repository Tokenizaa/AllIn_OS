import { logger } from '../../../shared/observability/logger.service';
import { PaymentService } from '../services/payment.service';
import { GatewayType } from '../adapters/gateway-adapter.factory';
import { PaymentRequest } from '../interfaces/payment-provider.interface';

export interface PixPaymentRequest {
  customerId: string;
  orderId?: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
  };
  gatewayType: GatewayType;
  description?: string;
  expirationMinutes?: number;
}

export interface PixPaymentResult {
  success: boolean;
  paymentId?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  copyPasteCode?: string;
  expirationDate?: string;
  status: string;
  error?: string;
}

export class PixPaymentFlow {
  private static instance: PixPaymentFlow;

  private constructor() {}

  static getInstance(): PixPaymentFlow {
    if (!PixPaymentFlow.instance) {
      PixPaymentFlow.instance = new PixPaymentFlow();
    }
    return PixPaymentFlow.instance;
  }

  async createPixPayment(request: PixPaymentRequest): Promise<PixPaymentResult> {
    logger.info('Creating PIX payment', 'pix-payment-flow', { customerId: request.customerId, amount: request.amount });

    try {
      const paymentService = new PaymentService();
      const paymentRequest: PaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        customerId: request.customerId,
        orderId: request.orderId,
        paymentMethod: 'pix',
        customer: request.customer,
        pix: {
          expiresInSeconds: (request.expirationMinutes || 30) * 60,
        },
        metadata: {
          payment_flow: 'pix',
        },
      };

      const paymentResponse = await paymentService.createPayment(paymentRequest, request.gatewayType);

      if (!paymentResponse.success) {
        return {
          success: false,
          status: 'failed',
          error: paymentResponse.message || 'Failed to create PIX payment',
        };
      }

      logger.info('PIX payment created successfully', 'pix-payment-flow', { paymentId: paymentResponse.paymentId });

      return {
        success: true,
        paymentId: paymentResponse.paymentId,
        qrCode: paymentResponse.qrCode,
        qrCodeBase64: paymentResponse.qrCodeBase64,
        copyPasteCode: paymentResponse.copyPasteCode,
        expirationDate: paymentResponse.expirationDate,
        status: paymentResponse.status,
      };
    } catch (error) {
      logger.error('Error creating PIX payment', 'pix-payment-flow', { error });
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkPixPaymentStatus(paymentId: string): Promise<{ status: string; paidAt?: string }> {
    logger.info('Checking PIX payment status', 'pix-payment-flow', { paymentId });

    try {
      const paymentService = new PaymentService();
      const payment = await paymentService.findById(paymentId);

      if (!payment) {
        return { status: 'not_found' };
      }

      logger.info('PIX payment status retrieved', 'pix-payment-flow', { paymentId, status: payment.status });

      return {
        status: payment.status,
        paidAt: payment.paid_at,
      };
    } catch (error) {
      logger.error('Error checking PIX payment status', 'pix-payment-flow', { error, paymentId });
      return { status: 'error' };
    }
  }

  async cancelPixPayment(paymentId: string): Promise<{ success: boolean; error?: string }> {
    logger.info('Cancelling PIX payment', 'pix-payment-flow', { paymentId });

    try {
      const paymentService = new PaymentService();
      const payment = await paymentService.findById(paymentId);

      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      if (payment.status !== 'pending') {
        return { success: false, error: 'Payment cannot be cancelled' };
      }

      await paymentService.update(paymentId, { status: 'cancelled' });

      logger.info('PIX payment cancelled successfully', 'pix-payment-flow', { paymentId });

      return { success: true };
    } catch (error) {
      logger.error('Error cancelling PIX payment', 'pix-payment-flow', { error, paymentId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const pixPaymentFlow = PixPaymentFlow.getInstance();
