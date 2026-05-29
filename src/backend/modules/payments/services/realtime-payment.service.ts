import { logger } from '../../../shared/observability/logger.service';
import { eventEmitter } from '../../../shared/events/event-emitter';

export interface PaymentStatusUpdate {
  paymentId: string;
  status: string;
  customerId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export class RealtimePaymentService {
  private static instance: RealtimePaymentService;
  private activeSubscriptions: Map<string, Set<(update: PaymentStatusUpdate) => void>> = new Map();

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): RealtimePaymentService {
    if (!RealtimePaymentService.instance) {
      RealtimePaymentService.instance = new RealtimePaymentService();
    }
    return RealtimePaymentService.instance;
  }

  private setupEventListeners(): void {
    // Subscribe to payment events to broadcast updates
    eventEmitter.subscribe('payment.approved', async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'approved',
        customerId: event.data.customerId,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });

    eventEmitter.subscribe('payment.rejected', async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'rejected',
        customerId: event.data.customerId,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });

    eventEmitter.subscribe('payment.refunded', async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'refunded',
        customerId: event.data.customerId,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });

    eventEmitter.subscribe('payment.cancelled', async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'cancelled',
        customerId: event.data.customerId,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });

    eventEmitter.subscribe('payment.pending', async (event) => {
      await this.broadcastStatusUpdate({
        paymentId: event.data.paymentId,
        status: 'pending',
        customerId: event.data.customerId,
        timestamp: new Date().toISOString(),
        metadata: event.data,
      });
    });
  }

  subscribeToPaymentUpdates(
    customerId: string,
    callback: (update: PaymentStatusUpdate) => void
  ): () => void {
    logger.info('Subscribing to payment updates', 'realtime-payment-service', { customerId });

    if (!this.activeSubscriptions.has(customerId)) {
      this.activeSubscriptions.set(customerId, new Set());
    }

    this.activeSubscriptions.get(customerId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscriptions = this.activeSubscriptions.get(customerId);
      if (subscriptions) {
        subscriptions.delete(callback);
        if (subscriptions.size === 0) {
          this.activeSubscriptions.delete(customerId);
        }
      }
      logger.info('Unsubscribed from payment updates', 'realtime-payment-service', { customerId });
    };
  }

  subscribeToPayment(
    paymentId: string,
    customerId: string,
    callback: (update: PaymentStatusUpdate) => void
  ): () => void {
    logger.info('Subscribing to specific payment updates', 'realtime-payment-service', { paymentId, customerId });

    const wrappedCallback = (update: PaymentStatusUpdate) => {
      if (update.paymentId === paymentId) {
        callback(update);
      }
    };

    return this.subscribeToPaymentUpdates(customerId, wrappedCallback);
  }

  private async broadcastStatusUpdate(update: PaymentStatusUpdate): Promise<void> {
    logger.info('Broadcasting payment status update', 'realtime-payment-service', { 
      paymentId: update.paymentId, 
      status: update.status,
      customerId: update.customerId 
    });

    const subscriptions = this.activeSubscriptions.get(update.customerId);
    if (subscriptions) {
      const promises = Array.from(subscriptions).map(async (callback) => {
        try {
          await callback(update);
        } catch (error) {
          logger.error('Error in payment status callback', 'realtime-payment-service', { error });
        }
      });
      await Promise.all(promises);
    }

    // TODO: Integrate with Supabase Realtime for actual WebSocket broadcasting
    // This would involve publishing to a Supabase channel
    // await supabase.channel(`payment:${update.paymentId}`).send({
    //   type: 'broadcast',
    //   event: 'status_update',
    //   payload: update,
    // });
  }

  async notifyPaymentCreated(paymentId: string, customerId: string): Promise<void> {
    await this.broadcastStatusUpdate({
      paymentId,
      status: 'pending',
      customerId,
      timestamp: new Date().toISOString(),
    });
  }

  getActiveSubscriptionCount(customerId: string): number {
    return this.activeSubscriptions.get(customerId)?.size || 0;
  }

  getTotalActiveSubscriptions(): number {
    let total = 0;
    for (const subscriptions of this.activeSubscriptions.values()) {
      total += subscriptions.size;
    }
    return total;
  }
}

export const realtimePaymentService = RealtimePaymentService.getInstance();
