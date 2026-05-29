import { eventEmitter } from '../../../shared/events/event-emitter';
import { BaseEvent, EventHandler } from '../../../shared/events/event.types';
import { logger } from '../../../shared/observability/logger.service';
import { paymentSplitService } from '../services/payment-split.service';
import { chatwootService } from '../../../shared/chatwoot/chatwoot.service';

export class PaymentEventHandlers {
  static register(): void {
    eventEmitter.subscribe('payment.created', PaymentEventHandlers.handlePaymentCreated);
    eventEmitter.subscribe('payment.approved', PaymentEventHandlers.handlePaymentApproved);
    eventEmitter.subscribe('payment.rejected', PaymentEventHandlers.handlePaymentRejected);
    eventEmitter.subscribe('payment.refunded', PaymentEventHandlers.handlePaymentRefunded);
    eventEmitter.subscribe('payment.cancelled', PaymentEventHandlers.handlePaymentCancelled);
    eventEmitter.subscribe('wallet.credited', PaymentEventHandlers.handleWalletCredited);
    eventEmitter.subscribe('wallet.debited', PaymentEventHandlers.handleWalletDebited);
    eventEmitter.subscribe('bonus.earned', PaymentEventHandlers.handleBonusEarned);
    eventEmitter.subscribe('bonus.used', PaymentEventHandlers.handleBonusUsed);
    eventEmitter.subscribe('points.earned', PaymentEventHandlers.handlePointsEarned);
    eventEmitter.subscribe('points.redeemed', PaymentEventHandlers.handlePointsRedeemed);
  }

  static async handlePaymentCreated(event: BaseEvent): Promise<void> {
    logger.info('Payment created event', 'payment-handlers', { data: event.data });

    try {
      const { paymentId, customerId, orderId, amount, status } = event.data;

      // Add timeline note to Chatwoot
      if (customerId && orderId) {
        await chatwootService.addTimelineNote(customerId, `Payment #${paymentId} created for order #${orderId}. Amount: R$ ${amount.toFixed(2)}. Status: ${status}`);
      }

      // Additional logic can be added here:
      // - Send notification to customer
      // - Update order status
      // - Trigger analytics tracking
    } catch (error) {
      logger.error('Error handling payment created event', 'payment-handlers', { error });
    }
  }

  static async handlePaymentApproved(event: BaseEvent): Promise<void> {
    logger.info('Payment approved event', 'payment-handlers', { data: event.data });

    try {
      const { paymentId, customerId, orderId, amount } = event.data;

      // Add timeline note to Chatwoot
      if (customerId && orderId) {
        await chatwootService.addTimelineNote(customerId, `Payment #${paymentId} approved for order #${orderId}. Amount: R$ ${amount.toFixed(2)}`);
      }

      // Process payment splits if configured
      await paymentSplitService.processAllSplitsForPayment(paymentId);

      // Additional logic:
      // - Update order status to processing/shipped
      // - Send confirmation email
      // - Trigger commission calculation
      // - Generate invoice
    } catch (error) {
      logger.error('Error handling payment approved event', 'payment-handlers', { error });
    }
  }

  static async handlePaymentRejected(event: BaseEvent): Promise<void> {
    logger.info('Payment rejected event', 'payment-handlers', { data: event.data });

    try {
      const { paymentId, customerId, orderId, amount } = event.data;

      // Add timeline note to Chatwoot
      if (customerId && orderId) {
        await chatwootService.addTimelineNote(customerId, `Payment #${paymentId} rejected for order #${orderId}. Amount: R$ ${amount.toFixed(2)}`);
      }

      // Additional logic:
      // - Update order status to payment_failed
      // - Send payment failure notification
      // - Offer retry options
    } catch (error) {
      logger.error('Error handling payment rejected event', 'payment-handlers', { error });
    }
  }

  static async handlePaymentRefunded(event: BaseEvent): Promise<void> {
    logger.info('Payment refunded event', 'payment-handlers', { data: event.data });

    try {
      const { paymentId, customerId, orderId, amount } = event.data;

      // Add timeline note to Chatwoot
      if (customerId && orderId) {
        await chatwootService.addTimelineNote(customerId, `Payment #${paymentId} refunded for order #${orderId}. Amount: R$ ${amount.toFixed(2)}`);
      }

      // Additional logic:
      // - Update order status to refunded
      // - Process refund to wallet if applicable
      // - Send refund confirmation email
    } catch (error) {
      logger.error('Error handling payment refunded event', 'payment-handlers', { error });
    }
  }

  static async handlePaymentCancelled(event: BaseEvent): Promise<void> {
    logger.info('Payment cancelled event', 'payment-handlers', { data: event.data });

    try {
      const { paymentId, customerId, orderId } = event.data;

      // Add timeline note to Chatwoot
      if (customerId && orderId) {
        await chatwootService.addTimelineNote(customerId, `Payment #${paymentId} cancelled for order #${orderId}`);
      }

      // Additional logic:
      // - Update order status
      // - Release frozen balances
    } catch (error) {
      logger.error('Error handling payment cancelled event', 'payment-handlers', { error });
    }
  }

  static async handleWalletCredited(event: BaseEvent): Promise<void> {
    logger.info('Wallet credited event', 'payment-handlers', { data: event.data });

    try {
      const { walletId, customerId, amount, transactionId } = event.data;

      // Add timeline note to Chatwoot
      if (customerId) {
        await chatwootService.addTimelineNote(customerId, `Wallet credited with R$ ${amount.toFixed(2)}. Transaction: #${transactionId}`);
      }

      // Additional logic:
      // - Send wallet balance notification
      // - Trigger loyalty program updates
    } catch (error) {
      logger.error('Error handling wallet credited event', 'payment-handlers', { error });
    }
  }

  static async handleWalletDebited(event: BaseEvent): Promise<void> {
    logger.info('Wallet debited event', 'payment-handlers', { data: event.data });

    try {
      const { walletId, customerId, amount, transactionId } = event.data;

      // Add timeline note to Chatwoot
      if (customerId) {
        await chatwootService.addTimelineNote(customerId, `Wallet debited R$ ${amount.toFixed(2)}. Transaction: #${transactionId}`);
      }

      // Additional logic:
      // - Send low balance warning if applicable
    } catch (error) {
      logger.error('Error handling wallet debited event', 'payment-handlers', { error });
    }
  }

  static async handleBonusEarned(event: BaseEvent): Promise<void> {
    logger.info('Bonus earned event', 'payment-handlers', { data: event.data });

    try {
      const { walletId, customerId, amount, sourceType, transactionId } = event.data;

      // Add timeline note to Chatwoot
      if (customerId) {
        await chatwootService.addTimelineNote(customerId, `Bonus earned: R$ ${amount.toFixed(2)} from ${sourceType}. Transaction: #${transactionId}`);
      }

      // Additional logic:
      // - Send bonus notification
      // - Update gamification status
    } catch (error) {
      logger.error('Error handling bonus earned event', 'payment-handlers', { error });
    }
  }

  static async handleBonusUsed(event: BaseEvent): Promise<void> {
    logger.info('Bonus used event', 'payment-handlers', { data: event.data });

    try {
      const { walletId, customerId, amount, referenceId, transactionId } = event.data;

      // Add timeline note to Chatwoot
      if (customerId) {
        await chatwootService.addTimelineNote(customerId, `Bonus used: R$ ${amount.toFixed(2)} for payment #${referenceId}. Transaction: #${transactionId}`);
      }

      // Additional logic:
      // - Update bonus usage statistics
    } catch (error) {
      logger.error('Error handling bonus used event', 'payment-handlers', { error });
    }
  }

  static async handlePointsEarned(event: BaseEvent): Promise<void> {
    logger.info('Points earned event', 'payment-handlers', { data: event.data });

    try {
      const { walletId, customerId, amount, sourceType, transactionId } = event.data;

      // Add timeline note to Chatwoot
      if (customerId) {
        await chatwootService.addTimelineNote(customerId, `Points earned: ${amount} from ${sourceType}. Transaction: #${transactionId}`);
      }

      // Additional logic:
      // - Send points notification
      // - Update tier status if applicable
    } catch (error) {
      logger.error('Error handling points earned event', 'payment-handlers', { error });
    }
  }

  static async handlePointsRedeemed(event: BaseEvent): Promise<void> {
    logger.info('Points redeemed event', 'payment-handlers', { data: event.data });

    try {
      const { walletId, customerId, amount, referenceId, transactionId } = event.data;

      // Add timeline note to Chatwoot
      if (customerId) {
        await chatwootService.addTimelineNote(customerId, `Points redeemed: ${amount} for payment #${referenceId}. Transaction: #${transactionId}`);
      }

      // Additional logic:
      // - Update points usage statistics
    } catch (error) {
      logger.error('Error handling points redeemed event', 'payment-handlers', { error });
    }
  }
}

// Register handlers on module load
PaymentEventHandlers.register();
