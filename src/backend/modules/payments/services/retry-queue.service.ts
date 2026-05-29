import { logger } from '../../../shared/observability/logger.service';
import { supabase } from '../../../shared/infrastructure/supabase/client';

export interface RetryJob {
  id: string;
  paymentId: string;
  attemptNumber: number;
  maxAttempts: number;
  retryAt: Date;
  payload: any;
}

export class RetryQueueService {
  private static instance: RetryQueueService;
  private isProcessing: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {
    this.startProcessing();
  }

  static getInstance(): RetryQueueService {
    if (!RetryQueueService.instance) {
      RetryQueueService.instance = new RetryQueueService();
    }
    return RetryQueueService.instance;
  }

  async scheduleRetry(paymentId: string, payload: any, delaySeconds: number = 60): Promise<void> {
    logger.info('Scheduling payment retry', 'retry-queue', { paymentId, delaySeconds });

    try {
      const { error } = await supabase
        .from('payment_attempts')
        .insert({
          payment_id: paymentId,
          attempt_number: 1,
          status: 'pending',
          retry_at: new Date(Date.now() + delaySeconds * 1000).toISOString(),
        });

      if (error) {
        logger.error('Failed to schedule retry', 'retry-queue', { error, paymentId });
      }
    } catch (error) {
      logger.error('Error scheduling retry', 'retry-queue', { error });
    }
  }

  async incrementRetryAttempt(paymentId: string, delaySeconds: number = 120): Promise<void> {
    logger.info('Incrementing retry attempt', 'retry-queue', { paymentId });

    try {
      const { data: currentAttempt } = await supabase
        .from('payment_attempts')
        .select('attempt_number')
        .eq('payment_id', paymentId)
        .order('attempt_number', { ascending: false })
        .limit(1)
        .single();

      const nextAttempt = (currentAttempt?.attempt_number || 0) + 1;

      const { error } = await supabase
        .from('payment_attempts')
        .insert({
          payment_id: paymentId,
          attempt_number: nextAttempt,
          status: 'pending',
          retry_at: new Date(Date.now() + delaySeconds * 1000).toISOString(),
        });

      if (error) {
        logger.error('Failed to increment retry attempt', 'retry-queue', { error, paymentId });
      }
    } catch (error) {
      logger.error('Error incrementing retry attempt', 'retry-queue', { error });
    }
  }

  private startProcessing(): void {
    // Process retries every 30 seconds
    this.intervalId = setInterval(() => {
      this.processPendingRetries();
    }, 30000);

    logger.info('Retry queue processing started', 'retry-queue');
  }

  private async processPendingRetries(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const { data: pendingRetries, error } = await supabase
        .from('payment_attempts')
        .select('*')
        .eq('status', 'pending')
        .lte('retry_at', new Date().toISOString())
        .order('retry_at', { ascending: true })
        .limit(20);

      if (error) {
        logger.error('Failed to fetch pending retries', 'retry-queue', { error });
        return;
      }

      if (!pendingRetries || pendingRetries.length === 0) {
        return;
      }

      logger.info(`Processing ${pendingRetries.length} pending retries`, 'retry-queue');

      for (const retry of pendingRetries) {
        await this.processRetry(retry);
      }
    } catch (error) {
      logger.error('Error processing pending retries', 'retry-queue', { error });
    } finally {
      this.isProcessing = false;
    }
  }

  private async processRetry(retry: any): Promise<void> {
    logger.info('Processing retry', 'retry-queue', { paymentId: retry.payment_id, attemptNumber: retry.attempt_number });

    try {
      // Update status to processing
      await supabase
        .from('payment_attempts')
        .update({ status: 'processing' })
        .eq('id', retry.id);

      // Import payment service dynamically to avoid circular dependency
      const { paymentService } = await import('./payment.service');

      // Retry the payment
      const result = await paymentService.retryPayment(retry.payment_id);

      if (result.success) {
        await supabase
          .from('payment_attempts')
          .update({ status: 'success' })
          .eq('id', retry.id);

        logger.info('Retry successful', 'retry-queue', { paymentId: retry.payment_id });
      } else {
        await supabase
          .from('payment_attempts')
          .update({ 
            status: 'failed',
            error_message: result.error || 'Retry failed',
          })
          .eq('id', retry.id);

        // Schedule next retry if under max attempts
        if (retry.attempt_number < 3) {
          const delaySeconds = Math.pow(2, retry.attempt_number) * 60; // Exponential backoff
          await this.incrementRetryAttempt(retry.payment_id, delaySeconds);
        } else {
          logger.error('Max retry attempts reached', 'retry-queue', { paymentId: retry.payment_id });
        }
      }
    } catch (error) {
      logger.error('Error processing retry', 'retry-queue', { error, paymentId: retry.payment_id });

      await supabase
        .from('payment_attempts')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', retry.id);
    }
  }

  stopProcessing(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('Retry queue processing stopped', 'retry-queue');
    }
  }

  async getRetryStatus(paymentId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('payment_attempts')
        .select('*')
        .eq('payment_id', paymentId)
        .order('attempt_number', { ascending: false })
        .limit(10);

      if (error) {
        logger.error('Failed to get retry status', 'retry-queue', { error });
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error getting retry status', 'retry-queue', { error });
      return null;
    }
  }
}

export const retryQueueService = RetryQueueService.getInstance();
