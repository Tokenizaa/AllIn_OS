import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { discountEngineService } from '../backend/modules/payments/services/discount-engine.service';

// Validation schemas
const calculateDiscountSchema = z.object({
  originalAmount: z.number().positive(),
  customerId: z.string().uuid().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
  couponCode: z.string().optional(),
});

const createCouponSchema = z.object({
  code: z.string().min(3),
  discountRuleId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().optional(),
});

const createDiscountRuleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed_amount', 'buy_x_get_y']),
  discount_value: z.number().positive(),
  min_order_amount: z.number().optional(),
  max_discount_amount: z.number().optional(),
  applicable_products: z.array(z.string()).optional(),
  applicable_categories: z.array(z.string()).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  usage_limit: z.number().optional(),
  is_active: z.boolean().default(true),
});

const validateCouponSchema = z.object({
  couponCode: z.string().min(3),
  customerId: z.string().uuid().optional(),
});

// Calculate discount
export const calculateDiscount = createServerFn({ method: 'POST' })
  .validator((data: unknown) => calculateDiscountSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await discountEngineService.calculateDiscount(
        data.originalAmount,
        data.customerId,
        data.productId,
        data.categoryId,
        data.couponCode
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to calculate discount' };
    }
  });

// Create coupon
export const createCoupon = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createCouponSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await discountEngineService.createCoupon(
        data.code,
        data.discountRuleId,
        data.customerId,
        data.expiresAt ? new Date(data.expiresAt) : undefined,
        data.usageLimit
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create coupon' };
    }
  });

// Create discount rule
export const createDiscountRule = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createDiscountRuleSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await discountEngineService.createDiscountRule({
        name: data.name,
        description: data.description,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        min_order_amount: data.min_order_amount,
        max_discount_amount: data.max_discount_amount,
        applicable_products: data.applicable_products,
        applicable_categories: data.applicable_categories,
        start_date: data.start_date,
        end_date: data.end_date,
        usage_limit: data.usage_limit,
        is_active: data.is_active,
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create discount rule' };
    }
  });

// Validate coupon
export const validateCoupon = createServerFn({ method: 'POST' })
  .validator((data: unknown) => validateCouponSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await discountEngineService.validateCoupon(data.couponCode, data.customerId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to validate coupon' };
    }
  });
