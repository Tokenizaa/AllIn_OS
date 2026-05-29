import { logger } from '../../../shared/observability/logger.service';
import { PaymentService } from '../services/payment.service';
import { GatewayType } from '../adapters/gateway-adapter.factory';
import { PaymentRequest } from '../interfaces/payment-provider.interface';

export interface CardPaymentRequest {
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
  card: {
    holderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    brand?: string;
    installments?: number;
  };
  description?: string;
}

export interface CardPaymentResult {
  success: boolean;
  paymentId?: string;
  status: string;
  transactionId?: string;
  authorizationCode?: string;
  cardBrand?: string;
  lastFourDigits?: string;
  installments?: number;
  error?: string;
}

export class CardPaymentFlow {
  private static instance: CardPaymentFlow;

  private constructor() {}

  static getInstance(): CardPaymentFlow {
    if (!CardPaymentFlow.instance) {
      CardPaymentFlow.instance = new CardPaymentFlow();
    }
    return CardPaymentFlow.instance;
  }

  async createCardPayment(request: CardPaymentRequest): Promise<CardPaymentResult> {
    logger.info('Creating Card payment', 'card-payment-flow', { customerId: request.customerId, amount: request.amount });

    try {
      const paymentService = new PaymentService();
      const paymentRequest: PaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        customerId: request.customerId,
        orderId: request.orderId,
        paymentMethod: 'card',
        customer: request.customer,
        card: {
          holderName: request.card.holderName,
          number: request.card.cardNumber,
          expiryMonth: request.card.expiryMonth,
          expiryYear: request.card.expiryYear,
          cvv: request.card.cvv,
          installments: request.card.installments || 1,
        },
        metadata: {
          payment_flow: 'card',
        },
      };

      const paymentResponse = await paymentService.createPayment(paymentRequest, request.gatewayType);

      if (!paymentResponse.success) {
        return {
          success: false,
          status: 'failed',
          error: paymentResponse.message || 'Failed to create card payment',
        };
      }

      logger.info('Card payment created successfully', 'card-payment-flow', { paymentId: paymentResponse.paymentId });

      return {
        success: true,
        paymentId: paymentResponse.paymentId,
        status: paymentResponse.status,
      };
    } catch (error) {
      logger.error('Error creating card payment', 'card-payment-flow', { error });
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkCardPaymentStatus(paymentId: string): Promise<{ status: string; paidAt?: string }> {
    logger.info('Checking card payment status', 'card-payment-flow', { paymentId });

    try {
      const paymentService = new PaymentService();
      const payment = await paymentService.findById(paymentId);

      if (!payment) {
        return { status: 'not_found' };
      }

      logger.info('Card payment status retrieved', 'card-payment-flow', { paymentId, status: payment.status });

      return {
        status: payment.status,
        paidAt: payment.paid_at,
      };
    } catch (error) {
      logger.error('Error checking card payment status', 'card-payment-flow', { error, paymentId });
      return { status: 'error' };
    }
  }

  async refundCardPayment(paymentId: string, amount?: number): Promise<{ success: boolean; error?: string }> {
    logger.info('Refunding card payment', 'card-payment-flow', { paymentId, amount });

    try {
      const paymentService = new PaymentService();
      const payment = await paymentService.findById(paymentId);

      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      if (payment.status !== 'approved') {
        return { success: false, error: 'Payment cannot be refunded' };
      }

      // TODO: Implement refund logic through gateway adapter
      // For now, just update the status
      await paymentService.update(paymentId, { status: 'refunded' });

      logger.info('Card payment refunded successfully', 'card-payment-flow', { paymentId });

      return { success: true };
    } catch (error) {
      logger.error('Error refunding card payment', 'card-payment-flow', { error, paymentId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const cardPaymentFlow = CardPaymentFlow.getInstance();
