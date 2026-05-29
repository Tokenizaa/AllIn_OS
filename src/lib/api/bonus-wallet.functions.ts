import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { bonusWalletService } from '../backend/modules/payments/services/bonus-wallet.service';

// Validation schemas
const earnBonusSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  sourceType: z.enum(['purchase', 'referral', 'promotion', 'manual', 'rollback']),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'customer', 'manual']).optional(),
  description: z.string().optional(),
});

const useBonusSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
  description: z.string().optional(),
});

// Get bonus wallet by customer
export const getBonusWallet = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await bonusWalletService.getBonusWalletByCustomerId(data.customerId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get bonus wallet' };
    }
  });

// Ensure bonus wallet exists
export const ensureBonusWallet = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await bonusWalletService.ensureBonusWallet(data.customerId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure bonus wallet' };
    }
  });

// Earn bonus
export const earnBonus = createServerFn({ method: 'POST' })
  .validator((data: unknown) => earnBonusSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await bonusWalletService.earnBonus(
        data.customerId,
        data.amount,
        data.sourceType,
        data.referenceId,
        data.referenceType,
        data.description
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to earn bonus' };
    }
  });

// Use bonus
export const useBonus = createServerFn({ method: 'POST' })
  .validator((data: unknown) => useBonusSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await bonusWalletService.useBonus(
        data.customerId,
        data.amount,
        data.referenceId,
        data.referenceType,
        data.description
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to use bonus' };
    }
  });

// Get available bonus for payment
export const getAvailableBonusForPayment = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({
    customerId: z.string().uuid(),
    productId: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await bonusWalletService.getAvailableBonusForPayment(
        data.customerId,
        data.productId
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get available bonus' };
    }
  });

// Get bonus wallet transactions
export const getBonusTransactions = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({
    customerId: z.string().uuid(),
    page: z.number().default(1),
    limit: z.number().default(20),
    transactionType: z.enum(['earned', 'used']).optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await bonusWalletService.getTransactions(
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

// Get bonus wallet balance
export const getBonusWalletBalance = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const wallet = await bonusWalletService.getBonusWalletByCustomerId(data.customerId);
      if (!wallet) {
        return { success: false, error: 'Bonus wallet not found' };
      }
      return {
        success: true,
        data: {
          balance: wallet.balance,
          availableBalance: wallet.available_balance,
          currency: wallet.currency,
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get bonus balance' };
    }
  });

// Expire old bonuses (admin function)
export const expireOldBonuses = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ daysThreshold: z.number().default(90) }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await bonusWalletService.expireOldBonuses(data.daysThreshold);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to expire old bonuses' };
    }
  });
