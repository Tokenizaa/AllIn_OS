import { logger } from '../../../shared/observability/logger.service';
import { PaymentService } from '../services/payment.service';
import { PaymentRequest } from '../interfaces/payment-provider.interface';

export interface CashOnDeliveryRequest {
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
  description?: string;
}

export interface CashOnDeliveryResult {
  success: boolean;
  paymentId?: string;
  status: string;
  error?: string;
}

export class CashOnDeliveryFlow {
  private static instance: CashOnDeliveryFlow;

  private constructor() {}

  static getInstance(): CashOnDeliveryFlow {
    if (!CashOnDeliveryFlow.instance) {
      CashOnDeliveryFlow.instance = new CashOnDeliveryFlow();
    }
    return CashOnDeliveryFlow.instance;
  }

  async createCashOnDeliveryPayment(request: CashOnDeliveryRequest): Promise<CashOnDeliveryResult> {
    logger.info('Creating Cash on Delivery payment', 'cod-payment-flow', { customerId: request.customerId, amount: request.amount });

    try {
      const paymentService = new PaymentService();
      const paymentRequest: PaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        customerId: request.customerId,
        orderId: request.orderId,
        paymentMethod: 'cash',
        customer: request.customer,
        metadata: {
          payment_flow: 'cash_on_delivery',
        },
      };

      const paymentResponse = await paymentService.createPayment(paymentRequest, 'belluno');

      if (!paymentResponse.success) {
        return {
          success: false,
          status: 'failed',
          error: paymentResponse.message || 'Failed to create Cash on Delivery payment',
        };
      }

      logger.info('Cash on Delivery payment created successfully', 'cod-payment-flow', { paymentId: paymentResponse.paymentId });

      return {
        success: true,
        paymentId: paymentResponse.paymentId,
        status: paymentResponse.status,
      };
    } catch (error) {
      logger.error('Error creating Cash on Delivery payment', 'cod-payment-flow', { error });
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkCashOnDeliveryStatus(paymentId: string): Promise<{ status: string; paidAt?: string }> {
    logger.info('Checking Cash on Delivery payment status', 'cod-payment-flow', { paymentId });

    try {
      const paymentService = new PaymentService();
      const payment = await paymentService.findById(paymentId);

      if (!payment) {
        return { status: 'not_found' };
      }

      logger.info('Cash on Delivery payment status retrieved', 'cod-payment-flow', { paymentId, status: payment.status });

      return {
        status: payment.status,
        paidAt: payment.paid_at,
      };
    } catch (error) {
      logger.error('Error checking Cash on Delivery payment status', 'cod-payment-flow', { error, paymentId });
      return { status: 'error' };
    }
  }

  async confirmCashOnDeliveryPayment(paymentId: string, amountCollected: number): Promise<{ success: boolean; error?: string }> {
    logger.info('Confirming Cash on Delivery payment', 'cod-payment-flow', { paymentId, amountCollected });

    try {
      const paymentService = new PaymentService();
      const payment = await paymentService.findById(paymentId);

      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      if (payment.status !== 'pending') {
        return { success: false, error: 'Payment cannot be confirmed' };
      }

      if (amountCollected < payment.amount) {
        return { success: false, error: 'Insufficient amount collected' };
      }

      await paymentService.update(paymentId, { status: 'approved', paid_at: new Date().toISOString() });

      logger.info('Cash on Delivery payment confirmed successfully', 'cod-payment-flow', { paymentId });

      return { success: true };
    } catch (error) {
      logger.error('Error confirming Cash on Delivery payment', 'cod-payment-flow', { error, paymentId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async cancelCashOnDeliveryPayment(paymentId: string): Promise<{ success: boolean; error?: string }> {
    logger.info('Cancelling Cash on Delivery payment', 'cod-payment-flow', { paymentId });

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

      logger.info('Cash on Delivery payment cancelled successfully', 'cod-payment-flow', { paymentId });

      return { success: true };
    } catch (error) {
      logger.error('Error cancelling Cash on Delivery payment', 'cod-payment-flow', { error, paymentId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const cashOnDeliveryFlow = CashOnDeliveryFlow.getInstance();
