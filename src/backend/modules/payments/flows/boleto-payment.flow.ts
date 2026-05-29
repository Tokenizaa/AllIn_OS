import { logger } from '../../../shared/observability/logger.service';
import { PaymentService } from '../services/payment.service';
import { GatewayType } from '../adapters/gateway-adapter.factory';
import { PaymentRequest } from '../interfaces/payment-provider.interface';

export interface BoletoPaymentRequest {
  customerId: string;
  orderId?: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    address?: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  gatewayType: GatewayType;
  dueDate?: Date;
  description?: string;
}

export interface BoletoPaymentResult {
  success: boolean;
  paymentId?: string;
  boletoNumber?: string;
  barcode?: string;
  pdfUrl?: string;
  dueDate?: string;
  status: string;
  error?: string;
}

export class BoletoPaymentFlow {
  private static instance: BoletoPaymentFlow;

  private constructor() {}

  static getInstance(): BoletoPaymentFlow {
    if (!BoletoPaymentFlow.instance) {
      BoletoPaymentFlow.instance = new BoletoPaymentFlow();
    }
    return BoletoPaymentFlow.instance;
  }

  async createBoletoPayment(request: BoletoPaymentRequest): Promise<BoletoPaymentResult> {
    logger.info('Creating Boleto payment', 'boleto-payment-flow', { customerId: request.customerId, amount: request.amount });

    try {
      const paymentService = new PaymentService();
      const paymentRequest: PaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        customerId: request.customerId,
        orderId: request.orderId,
        paymentMethod: 'boleto',
        customer: request.customer,
        boleto: {
          dueDate: request.dueDate ? request.dueDate.toISOString() : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        },
        metadata: {
          payment_flow: 'boleto',
        },
      };

      const paymentResponse = await paymentService.createPayment(paymentRequest, request.gatewayType);

      if (!paymentResponse.success) {
        return {
          success: false,
          status: 'failed',
          error: paymentResponse.message || 'Failed to create Boleto payment',
        };
      }

      logger.info('Boleto payment created successfully', 'boleto-payment-flow', { paymentId: paymentResponse.paymentId });

      return {
        success: true,
        paymentId: paymentResponse.paymentId,
        boletoNumber: paymentResponse.boletoNumber,
        barcode: paymentResponse.barcode,
        pdfUrl: paymentResponse.pdfUrl,
        dueDate: paymentResponse.dueDate,
        status: paymentResponse.status,
      };
    } catch (error) {
      logger.error('Error creating Boleto payment', 'boleto-payment-flow', { error });
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkBoletoPaymentStatus(paymentId: string): Promise<{ status: string; paidAt?: string }> {
    logger.info('Checking Boleto payment status', 'boleto-payment-flow', { paymentId });

    try {
      const paymentService = new PaymentService();
      const payment = await paymentService.findById(paymentId);

      if (!payment) {
        return { status: 'not_found' };
      }

      logger.info('Boleto payment status retrieved', 'boleto-payment-flow', { paymentId, status: payment.status });

      return {
        status: payment.status,
        paidAt: payment.paid_at,
      };
    } catch (error) {
      logger.error('Error checking Boleto payment status', 'boleto-payment-flow', { error, paymentId });
      return { status: 'error' };
    }
  }

  async cancelBoletoPayment(paymentId: string): Promise<{ success: boolean; error?: string }> {
    logger.info('Cancelling Boleto payment', 'boleto-payment-flow', { paymentId });

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

      logger.info('Boleto payment cancelled successfully', 'boleto-payment-flow', { paymentId });

      return { success: true };
    } catch (error) {
      logger.error('Error cancelling Boleto payment', 'boleto-payment-flow', { error, paymentId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const boletoPaymentFlow = BoletoPaymentFlow.getInstance();
