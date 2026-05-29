import { logger } from '../../../shared/observability/logger.service';
import { supabase } from '../../../shared/infrastructure/supabase/client';

export interface PaymentSplitConfig {
  recipientId: string;
  recipientType: 'distributor' | 'company' | 'affiliate';
  recipientName: string;
  percentage: number;
  fixedAmount?: number;
  priority: number;
}

export interface PaymentSplitResult {
  paymentId: string;
  totalAmount: number;
  splits: Array<{
    splitId: string;
    recipientId: string;
    recipientType: string;
    recipientName: string;
    amount: number;
    percentage: number;
    status: string;
  }>;
  totalSplit: number;
  remainingAmount: number;
}

export class PaymentSplitService {
  private static instance: PaymentSplitService;

  private constructor() {}

  static getInstance(): PaymentSplitService {
    if (!PaymentSplitService.instance) {
      PaymentSplitService.instance = new PaymentSplitService();
    }
    return PaymentSplitService.instance;
  }

  async createPaymentSplit(
    paymentId: string,
    totalAmount: number,
    splitConfigs: PaymentSplitConfig[]
  ): Promise<PaymentSplitResult> {
    logger.info('Creating payment split', 'payment-split', { paymentId, totalAmount, splitCount: splitConfigs.length });

    try {
      const splits: PaymentSplitResult['splits'] = [];
      let totalSplit = 0;
      let remainingAmount = totalAmount;

      // Sort by priority (higher priority first)
      const sortedConfigs = [...splitConfigs].sort((a, b) => b.priority - a.priority);

      for (const config of sortedConfigs) {
        let splitAmount = 0;

        if (config.fixedAmount) {
          // Use fixed amount if specified
          splitAmount = Math.min(config.fixedAmount, remainingAmount);
        } else if (config.percentage) {
          // Use percentage
          splitAmount = (totalAmount * config.percentage) / 100;
          splitAmount = Math.min(splitAmount, remainingAmount);
        }

        if (splitAmount <= 0) continue;

        // Create split record
        const { data: split, error } = await supabase
          .from('payment_splits')
          .insert({
            payment_id: paymentId,
            recipient_id: config.recipientId,
            recipient_type: config.recipientType,
            recipient_name: config.recipientName,
            amount: splitAmount,
            percentage: config.percentage,
            status: 'pending',
          })
          .select()
          .single();

        if (error) {
          logger.error('Failed to create payment split', 'payment-split', { error });
          continue;
        }

        splits.push({
          splitId: split.id,
          recipientId: split.recipient_id,
          recipientType: split.recipient_type,
          recipientName: split.recipient_name,
          amount: split.amount,
          percentage: split.percentage || 0,
          status: split.status,
        });

        totalSplit += splitAmount;
        remainingAmount -= splitAmount;
      }

      logger.info('Payment split created successfully', 'payment-split', { paymentId, totalSplit, remainingAmount });

      return {
        paymentId,
        totalAmount,
        splits,
        totalSplit,
        remainingAmount,
      };
    } catch (error) {
      logger.error('Error creating payment split', 'payment-split', { error, paymentId });
      throw error;
    }
  }

  async processSplitPayment(splitId: string): Promise<boolean> {
    logger.info('Processing split payment', 'payment-split', { splitId });

    try {
      const { data: split, error } = await supabase
        .from('payment_splits')
        .select('*')
        .eq('id', splitId)
        .single();

      if (error || !split) {
        logger.error('Split not found', 'payment-split', { error, splitId });
        return false;
      }

      if (split.status !== 'pending') {
        logger.error('Split already processed', 'payment-split', { splitId, status: split.status });
        return false;
      }

      // Get recipient wallet or create one
      const recipientWallet = await this.getOrCreateRecipientWallet(split.recipient_id, split.recipient_type);

      if (!recipientWallet) {
        logger.error('Failed to get or create recipient wallet', 'payment-split', { splitId });
        return false;
      }

      // Credit the recipient wallet
      await supabase
        .from('wallets')
        .update({
          balance: recipientWallet.balance + split.amount,
          available_balance: recipientWallet.available_balance + split.amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recipientWallet.id);

      // Create wallet transaction
      await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: recipientWallet.id,
          transaction_type: 'credit',
          amount: split.amount,
          balance_before: recipientWallet.balance,
          balance_after: recipientWallet.balance + split.amount,
          reference_id: split.payment_id,
          reference_type: 'payment_split',
          description: `Payment split from ${split.recipient_type}`,
        });

      // Update split status
      await supabase
        .from('payment_splits')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .eq('id', splitId);

      logger.info('Split payment processed successfully', 'payment-split', { splitId, amount: split.amount });

      return true;
    } catch (error) {
      logger.error('Error processing split payment', 'payment-split', { error, splitId });
      return false;
    }
  }

  async processAllSplitsForPayment(paymentId: string): Promise<{ success: number; failed: number }> {
    logger.info('Processing all splits for payment', 'payment-split', { paymentId });

    try {
      const { data: splits, error } = await supabase
        .from('payment_splits')
        .select('*')
        .eq('payment_id', paymentId)
        .eq('status', 'pending');

      if (error) {
        logger.error('Failed to get splits', 'payment-split', { error, paymentId });
        return { success: 0, failed: 0 };
      }

      let success = 0;
      let failed = 0;

      for (const split of splits || []) {
        const result = await this.processSplitPayment(split.id);
        if (result) {
          success++;
        } else {
          failed++;
        }
      }

      logger.info('All splits processed', 'payment-split', { paymentId, success, failed });

      return { success, failed };
    } catch (error) {
      logger.error('Error processing all splits', 'payment-split', { error, paymentId });
      return { success: 0, failed: 0 };
    }
  }

  private async getOrCreateRecipientWallet(recipientId: string, recipientType: string): Promise<any> {
    try {
      // Try to get existing wallet
      const { data: existingWallet, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('customer_id', recipientId)
        .single();

      if (existingWallet) {
        return existingWallet;
      }

      // Create new wallet
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({
          customer_id: recipientId,
          balance: 0,
          available_balance: 0,
          frozen_balance: 0,
          currency: 'BRL',
          status: 'active',
        })
        .select()
        .single();

      if (createError) {
        logger.error('Failed to create recipient wallet', 'payment-split', { createError, recipientId });
        return null;
      }

      return newWallet;
    } catch (error) {
      logger.error('Error getting or creating recipient wallet', 'payment-split', { error, recipientId });
      return null;
    }
  }

  async getPaymentSplits(paymentId: string): Promise<PaymentSplitResult['splits']> {
    try {
      const { data, error } = await supabase
        .from('payment_splits')
        .select('*')
        .eq('payment_id', paymentId);

      if (error) {
        logger.error('Failed to get payment splits', 'payment-split', { error, paymentId });
        return [];
      }

      return (data || []).map(split => ({
        splitId: split.id,
        recipientId: split.recipient_id,
        recipientType: split.recipient_type,
        recipientName: split.recipient_name,
        amount: split.amount,
        percentage: split.percentage || 0,
        status: split.status,
      }));
    } catch (error) {
      logger.error('Error getting payment splits', 'payment-split', { error, paymentId });
      return [];
    }
  }

  async calculateSplitPreview(totalAmount: number, splitConfigs: PaymentSplitConfig[]): Promise<{
    totalAmount: number;
    splits: Array<{
      recipientId: string;
      recipientName: string;
      amount: number;
      percentage: number;
    }>;
    totalSplit: number;
    remainingAmount: number;
  }> {
    const splits: any[] = [];
    let totalSplit = 0;
    let remainingAmount = totalAmount;

    const sortedConfigs = [...splitConfigs].sort((a, b) => b.priority - a.priority);

    for (const config of sortedConfigs) {
      let splitAmount = 0;

      if (config.fixedAmount) {
        splitAmount = Math.min(config.fixedAmount, remainingAmount);
      } else if (config.percentage) {
        splitAmount = (totalAmount * config.percentage) / 100;
        splitAmount = Math.min(splitAmount, remainingAmount);
      }

      if (splitAmount <= 0) continue;

      splits.push({
        recipientId: config.recipientId,
        recipientName: config.recipientName,
        amount: splitAmount,
        percentage: config.percentage || 0,
      });

      totalSplit += splitAmount;
      remainingAmount -= splitAmount;
    }

    return {
      totalAmount,
      splits,
      totalSplit,
      remainingAmount,
    };
  }
}

export const paymentSplitService = PaymentSplitService.getInstance();
