import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { walletService } from '../backend/modules/payments/services/wallet.service';

// Validation schemas
const creditWalletSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'refund', 'bonus', 'manual']).optional(),
});

const debitWalletSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'withdrawal', 'manual']).optional(),
});

const freezeWalletSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
});

const unfreezeWalletSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
});

// Get wallet by customer
export const getWallet = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await walletService.getWalletByCustomerId(data.customerId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get wallet' };
    }
  });

// Ensure wallet exists
export const ensureWallet = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await walletService.ensureWallet(data.customerId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure wallet' };
    }
  });

// Credit wallet
export const creditWallet = createServerFn({ method: 'POST' })
  .validator((data: unknown) => creditWalletSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await walletService.creditWallet(
        data.customerId,
        data.amount,
        data.description,
        data.referenceId,
        data.referenceType
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to credit wallet' };
    }
  });

// Debit wallet
export const debitWallet = createServerFn({ method: 'POST' })
  .validator((data: unknown) => debitWalletSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await walletService.debitWallet(
        data.customerId,
        data.amount,
        data.description,
        data.referenceId,
        data.referenceType
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to debit wallet' };
    }
  });

// Freeze wallet funds
export const freezeWallet = createServerFn({ method: 'POST' })
  .validator((data: unknown) => freezeWalletSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await walletService.freezeWallet(
        data.customerId,
        data.amount,
        data.description,
        data.referenceId,
        data.referenceType
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to freeze wallet' };
    }
  });

// Unfreeze wallet funds
export const unfreezeWallet = createServerFn({ method: 'POST' })
  .validator((data: unknown) => unfreezeWalletSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await walletService.unfreezeWallet(
        data.customerId,
        data.amount,
        data.description,
        data.referenceId,
        data.referenceType
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to unfreeze wallet' };
    }
  });

// Get wallet transactions
export const getWalletTransactions = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({
    customerId: z.string().uuid(),
    page: z.number().default(1),
    limit: z.number().default(20),
    transactionType: z.enum(['credit', 'debit', 'freeze', 'unfreeze']).optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await walletService.getTransactions(
        data.customerId,
        data.page,
        data.limit,
        data.transactionType
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get transactions' };
    }
  });

// Get wallet balance
export const getWalletBalance = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const wallet = await walletService.getWalletByCustomerId(data.customerId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }
      return {
        success: true,
        data: {
          balance: wallet.balance,
          availableBalance: wallet.available_balance,
          frozenBalance: wallet.frozen_balance,
          currency: wallet.currency,
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get wallet balance' };
    }
  });
