import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { pointsWalletService } from '../backend/modules/payments/services/points-wallet.service';

// Validation schemas
const earnPointsSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  sourceType: z.enum(['purchase', 'referral', 'promotion', 'manual', 'rollback']),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'customer', 'manual']).optional(),
  description: z.string().optional(),
});

const redeemPointsSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  referenceId: z.string().optional(),
  referenceType: z.enum(['order', 'manual']).optional(),
  description: z.string().optional(),
});

const convertCurrencyToPointsSchema = z.object({
  amount: z.number().positive(),
});

const convertPointsToCurrencySchema = z.object({
  points: z.number().positive(),
});

// Get points wallet by customer
export const getPointsWallet = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.getPointsWalletByCustomerId(data.customerId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get points wallet' };
    }
  });

// Ensure points wallet exists
export const ensurePointsWallet = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.ensurePointsWallet(data.customerId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to ensure points wallet' };
    }
  });

// Earn points
export const earnPoints = createServerFn({ method: 'POST' })
  .validator((data: unknown) => earnPointsSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.earnPoints(
        data.customerId,
        data.amount,
        data.sourceType,
        data.referenceId,
        data.referenceType,
        data.description
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to earn points' };
    }
  });

// Redeem points
export const redeemPoints = createServerFn({ method: 'POST' })
  .validator((data: unknown) => redeemPointsSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.redeemPoints(
        data.customerId,
        data.amount,
        data.referenceId,
        data.referenceType,
        data.description
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to redeem points' };
    }
  });

// Get available points for payment
export const getAvailablePointsForPayment = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({
    customerId: z.string().uuid(),
    productId: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.getAvailablePointsForPayment(
        data.customerId,
        data.productId
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get available points' };
    }
  });

// Get points wallet transactions
export const getPointsTransactions = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({
    customerId: z.string().uuid(),
    page: z.number().default(1),
    limit: z.number().default(20),
    transactionType: z.enum(['earned', 'redeemed']).optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.getTransactions(
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

// Get points wallet balance
export const getPointsWalletBalance = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ customerId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const wallet = await pointsWalletService.getPointsWalletByCustomerId(data.customerId);
      if (!wallet) {
        return { success: false, error: 'Points wallet not found' };
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
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get points balance' };
    }
  });

// Convert currency to points
export const convertCurrencyToPoints = createServerFn({ method: 'POST' })
  .validator((data: unknown) => convertCurrencyToPointsSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.convertCurrencyToPoints(data.amount);
      return { success: true, data: { points: result } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to convert currency to points' };
    }
  });

// Convert points to currency
export const convertPointsToCurrency = createServerFn({ method: 'POST' })
  .validator((data: unknown) => convertPointsToCurrencySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.convertPointsToCurrency(data.points);
      return { success: true, data: { amount: result } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to convert points to currency' };
    }
  });

// Expire old points (admin function)
export const expireOldPoints = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ daysThreshold: z.number().default(365) }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await pointsWalletService.expireOldPoints(data.daysThreshold);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to expire old points' };
    }
  });
