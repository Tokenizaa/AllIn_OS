import { WebhookEvent } from '../interfaces/payment-provider.interface';
import { GatewayAdapterFactory, GatewayType } from '../adapters/gateway-adapter.factory';
import { logger } from '../../../shared/observability/logger.service';
import { getSupabaseAdminClient } from '../../../infra/supabase/client';

export class WebhookProcessorService {
  private static instance: WebhookProcessorService;

  private constructor() {}

  static getInstance(): WebhookProcessorService {
    if (!WebhookProcessorService.instance) {
      WebhookProcessorService.instance = new WebhookProcessorService();
    }
    return WebhookProcessorService.instance;
  }

  async processWebhook(gatewayType: GatewayType, event: WebhookEvent): Promise<{ success: boolean; message?: string }> {
    logger.info(`Processing webhook from ${gatewayType}`, 'webhook-processor', { eventType: event.eventType });

    try {
      // Log webhook to database
      await this.logWebhook(gatewayType, event);

      // Get the appropriate adapter
      const adapter = GatewayAdapterFactory.getAdapter(gatewayType);
      if (!adapter) {
        throw new Error(`No adapter found for gateway: ${gatewayType}`);
      }

      // Verify webhook signature
      const isValid = await adapter.verifyWebhook(event);
      if (!isValid) {
        logger.error('Webhook signature verification failed', 'webhook-processor', { gatewayType });
        await this.markWebhookAsProcessed(event, false, 'Signature verification failed');
        return { success: false, message: 'Invalid webhook signature' };
      }

      // Process the webhook
      const response = await adapter.processWebhook(event);

      // Update payment status in database
      if (response.success && response.gatewayTransactionId) {
        await this.updatePaymentStatus(response.gatewayTransactionId, response.status);
      }

      // Mark webhook as processed
      await this.markWebhookAsProcessed(event, true);

      logger.info(`Webhook processed successfully from ${gatewayType}`, 'webhook-processor', { eventType: event.eventType });

      return { success: true };
    } catch (error) {
      logger.error('Webhook processing error', 'webhook-processor', { error, gatewayType });
      await this.markWebhookAsProcessed(event, false, error instanceof Error ? error.message : 'Unknown error');
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async logWebhook(gatewayType: GatewayType, event: WebhookEvent): Promise<void> {
    const supabase = getSupabaseAdminClient();
    try {
      const { data, error } = await supabase
        .from('gateway_webhooks')
        .insert({
          gateway_id: gatewayType,
          event_type: event.eventType,
          payload: event.payload,
          signature: event.signature,
          processed: false,
          processing_attempts: 0,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to log webhook', 'webhook-processor', { error });
      }
    } catch (error) {
      logger.error('Error logging webhook', 'webhook-processor', { error });
    }
  }

  private async markWebhookAsProcessed(event: WebhookEvent, success: boolean, errorMessage?: string): Promise<void> {
    const supabase = getSupabaseAdminClient();
    try {
      const { error } = await supabase
        .from('gateway_webhooks')
        .update({
          processed: true,
          processing_attempts: supabase.rpc('increment', { table_name: 'gateway_webhooks', column_name: 'processing_attempts' }),
          error_message: errorMessage,
          processed_at: new Date().toISOString(),
        })
        .eq('payload', event.payload)
        .eq('processed', false);

      if (error) {
        logger.error('Failed to mark webhook as processed', 'webhook-processor', { error });
      }
    } catch (error) {
      logger.error('Error marking webhook as processed', 'webhook-processor', { error });
    }
  }

  private async updatePaymentStatus(gatewayTransactionId: string, status: string): Promise<void> {
    const supabase = getSupabaseAdminClient();
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: status,
          updated_at: new Date().toISOString(),
          ...(status === 'approved' && { approved_at: new Date().toISOString() }),
          ...(status === 'cancelled' && { cancelled_at: new Date().toISOString() }),
          ...(status === 'refunded' && { refunded_at: new Date().toISOString() }),
        })
        .eq('gateway_transaction_id', gatewayTransactionId);

      if (error) {
        logger.error('Failed to update payment status', 'webhook-processor', { error, gatewayTransactionId });
      } else {
        logger.info(`Payment status updated to ${status}`, 'webhook-processor', { gatewayTransactionId });
      }
    } catch (error) {
      logger.error('Error updating payment status', 'webhook-processor', { error });
    }
  }

  async retryFailedWebhooks(): Promise<void> {
    logger.info('Retrying failed webhooks', 'webhook-processor');

    const supabase = getSupabaseAdminClient();
    try {
      const { data: failedWebhooks, error } = await supabase
        .from('gateway_webhooks')
        .select('*')
        .eq('processed', false)
        .lt('processing_attempts', 3)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        logger.error('Failed to fetch failed webhooks', 'webhook-processor', { error });
        return;
      }

      for (const webhook of failedWebhooks || []) {
        const gatewayType = this.extractGatewayType(webhook.gateway_id);
        if (!gatewayType) continue;

        const event: WebhookEvent = {
          eventType: webhook.event_type,
          payload: webhook.payload,
          signature: webhook.signature,
        };

        await this.processWebhook(gatewayType, event);
      }
    } catch (error) {
      logger.error('Error retrying failed webhooks', 'webhook-processor', { error });
    }
  }

  private extractGatewayType(gatewayId: string): GatewayType | null {
    if (gatewayId.includes('belluno')) return 'belluno';
    if (gatewayId.includes('pagseguro')) return 'pagseguro';
    return null;
  }
}

export const webhookProcessorService = WebhookProcessorService.getInstance();
