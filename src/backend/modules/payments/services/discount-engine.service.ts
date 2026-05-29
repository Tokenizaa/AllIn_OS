import { logger } from '../../../shared/observability/logger.service';
import { getSupabaseAdminClient } from '../../../infra/supabase/client';

export interface DiscountRule {
  id: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  applicable_products?: string[];
  applicable_categories?: string[];
  start_date?: string;
  end_date?: string;
  usage_limit?: number;
  usage_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_rule_id: string;
  customer_id?: string;
  is_active: boolean;
  expires_at?: string;
  usage_limit?: number;
  usage_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DiscountCalculation {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  appliedRules: Array<{
    ruleId: string;
    ruleName: string;
    discountAmount: number;
    discountType: string;
  }>;
  appliedCoupon?: {
    couponId: string;
    code: string;
    discountAmount: number;
  };
}

export class DiscountEngineService {
  private static instance: DiscountEngineService;

  private constructor() {}

  static getInstance(): DiscountEngineService {
    if (!DiscountEngineService.instance) {
      DiscountEngineService.instance = new DiscountEngineService();
    }
    return DiscountEngineService.instance;
  }

  async calculateDiscount(
    originalAmount: number,
    customerId?: string,
    productId?: string,
    categoryId?: string,
    couponCode?: string
  ): Promise<DiscountCalculation> {
    logger.info('Calculating discount', 'discount-engine', { originalAmount, productId, couponCode });

    try {
      let totalDiscount = 0;
      const appliedRules: DiscountCalculation['appliedRules'] = [];
      let appliedCoupon: DiscountCalculation['appliedCoupon'] | undefined;

      // Get active discount rules
      const activeRules = await this.getActiveDiscountRules();

      for (const rule of activeRules) {
        const discount = await this.calculateRuleDiscount(rule, originalAmount, productId, categoryId);
        if (discount > 0) {
          totalDiscount += discount;
          appliedRules.push({
            ruleId: rule.id,
            ruleName: rule.name,
            discountAmount: discount,
            discountType: rule.discount_type,
          });
        }
      }

      // Apply coupon if provided
      if (couponCode) {
        const couponDiscount = await this.applyCoupon(couponCode, customerId, originalAmount - totalDiscount);
        if (couponDiscount) {
          totalDiscount += couponDiscount.discountAmount;
          appliedCoupon = couponDiscount;
        }
      }

      // Apply max discount limit if applicable
      const maxDiscount = activeRules.reduce((max, rule) => Math.max(max, rule.max_discount_amount || Infinity), Infinity);
      if (maxDiscount < Infinity && totalDiscount > maxDiscount) {
        totalDiscount = maxDiscount;
      }

      const finalAmount = Math.max(0, originalAmount - totalDiscount);

      logger.info('Discount calculated', 'discount-engine', { originalAmount, totalDiscount, finalAmount });

      return {
        originalAmount,
        discountAmount: totalDiscount,
        finalAmount,
        appliedRules,
        appliedCoupon,
      };
    } catch (error) {
      logger.error('Error calculating discount', 'discount-engine', { error });
      return {
        originalAmount,
        discountAmount: 0,
        finalAmount: originalAmount,
        appliedRules: [],
      };
    }
  }

  private async getActiveDiscountRules(): Promise<DiscountRule[]> {
    try {
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('discount_rules')
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`);

      if (error) {
        logger.error('Failed to get active discount rules', 'discount-engine', { error });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting active discount rules', 'discount-engine', { error });
      return [];
    }
  }

  private async calculateRuleDiscount(
    rule: DiscountRule,
    originalAmount: number,
    productId?: string,
    categoryId?: string
  ): Promise<number> {
    // Check minimum order amount
    if (rule.min_order_amount && originalAmount < rule.min_order_amount) {
      return 0;
    }

    // Check product applicability
    if (rule.applicable_products && rule.applicable_products.length > 0) {
      if (!productId || !rule.applicable_products.includes(productId)) {
        return 0;
      }
    }

    // Check category applicability
    if (rule.applicable_categories && rule.applicable_categories.length > 0) {
      if (!categoryId || !rule.applicable_categories.includes(categoryId)) {
        return 0;
      }
    }

    // Check usage limit
    if (rule.usage_limit && rule.usage_count >= rule.usage_limit) {
      return 0;
    }

    // Calculate discount based on type
    let discount = 0;
    switch (rule.discount_type) {
      case 'percentage':
        discount = (originalAmount * rule.discount_value) / 100;
        break;
      case 'fixed_amount':
        discount = rule.discount_value;
        break;
      case 'buy_x_get_y':
        // For buy x get y, we need more context (quantity)
        // For now, return 0 as this requires order details
        discount = 0;
        break;
    }

    // Apply max discount limit for this rule
    if (rule.max_discount_amount && discount > rule.max_discount_amount) {
      discount = rule.max_discount_amount;
    }

    return discount;
  }

  private async applyCoupon(
    couponCode: string,
    customerId?: string,
    amount: number = 0
  ): Promise<{ couponId: string; code: string; discountAmount: number } | null> {
    try {
      const now = new Date().toISOString();

      // Get coupon by code
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*, discount_rules(*)')
        .eq('code', couponCode)
        .eq('is_active', true)
        .single();

      if (couponError || !coupon) {
        logger.error('Coupon not found or inactive', 'discount-engine', { couponCode });
        return null;
      }

      // Check expiration
      if (coupon.expires_at && coupon.expires_at < now) {
        logger.error('Coupon expired', 'discount-engine', { couponCode });
        return null;
      }

      // Check customer-specific coupon
      if (coupon.customer_id && coupon.customer_id !== customerId) {
        logger.error('Coupon not applicable to this customer', 'discount-engine', { couponCode });
        return null;
      }

      // Check usage limit
      if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        logger.error('Coupon usage limit reached', 'discount-engine', { couponCode });
        return null;
      }

      const rule = coupon.discount_rules;
      if (!rule) {
        logger.error('Discount rule not found for coupon', 'discount-engine', { couponId: coupon.id });
        return null;
      }

      // Calculate discount
      let discount = 0;
      switch (rule.discount_type) {
        case 'percentage':
          discount = (amount * rule.discount_value) / 100;
          break;
        case 'fixed_amount':
          discount = rule.discount_value;
          break;
        case 'buy_x_get_y':
          discount = 0;
          break;
      }

      // Apply max discount limit
      if (rule.max_discount_amount && discount > rule.max_discount_amount) {
        discount = rule.max_discount_amount;
      }

      // Increment coupon usage count
      await supabase
        .from('coupons')
        .update({ usage_count: (coupon.usage_count || 0) + 1 })
        .eq('id', coupon.id);

      // Increment rule usage count
      await supabase
        .from('discount_rules')
        .update({ usage_count: (rule.usage_count || 0) + 1 })
        .eq('id', rule.id);

      logger.info('Coupon applied successfully', 'discount-engine', { couponCode, discount });

      return {
        couponId: coupon.id,
        code: coupon.code,
        discountAmount: discount,
      };
    } catch (error) {
      logger.error('Error applying coupon', 'discount-engine', { error, couponCode });
      return null;
    }
  }

  async createCoupon(
    code: string,
    discountRuleId: string,
    customerId?: string,
    expiresAt?: Date,
    usageLimit?: number
  ): Promise<Coupon> {
    logger.info('Creating coupon', 'discount-engine', { code, discountRuleId });

    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert({
          code: code.toUpperCase(),
          discount_rule_id: discountRuleId,
          customer_id: customerId,
          is_active: true,
          expires_at: expiresAt ? expiresAt.toISOString() : null,
          usage_limit: usageLimit,
          usage_count: 0,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create coupon', 'discount-engine', { error });
        throw error;
      }

      logger.info('Coupon created successfully', 'discount-engine', { couponId: data.id });
      return data;
    } catch (error) {
      logger.error('Error creating coupon', 'discount-engine', { error });
      throw error;
    }
  }

  async createDiscountRule(rule: Omit<DiscountRule, 'id' | 'usage_count' | 'created_at' | 'updated_at'>): Promise<DiscountRule> {
    logger.info('Creating discount rule', 'discount-engine', { name: rule.name });

    try {
      const { data, error } = await supabase
        .from('discount_rules')
        .insert({
          ...rule,
          usage_count: 0,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create discount rule', 'discount-engine', { error });
        throw error;
      }

      logger.info('Discount rule created successfully', 'discount-engine', { ruleId: data.id });
      return data;
    } catch (error) {
      logger.error('Error creating discount rule', 'discount-engine', { error });
      throw error;
    }
  }

  async validateCoupon(couponCode: string, customerId?: string): Promise<{ valid: boolean; reason?: string }> {
    try {
      const now = new Date().toISOString();

      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*, discount_rules(*)')
        .eq('code', couponCode)
        .single();

      if (error || !coupon) {
        return { valid: false, reason: 'Coupon not found' };
      }

      if (!coupon.is_active) {
        return { valid: false, reason: 'Coupon is inactive' };
      }

      if (coupon.expires_at && coupon.expires_at < now) {
        return { valid: false, reason: 'Coupon has expired' };
      }

      if (coupon.customer_id && coupon.customer_id !== customerId) {
        return { valid: false, reason: 'Coupon is not applicable to this customer' };
      }

      if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        return { valid: false, reason: 'Coupon usage limit reached' };
      }

      const rule = coupon.discount_rules;
      if (!rule || !rule.is_active) {
        return { valid: false, reason: 'Associated discount rule is inactive' };
      }

      if (rule.start_date && rule.start_date > now) {
        return { valid: false, reason: 'Discount rule has not started yet' };
      }

      if (rule.end_date && rule.end_date < now) {
        return { valid: false, reason: 'Discount rule has expired' };
      }

      return { valid: true };
    } catch (error) {
      logger.error('Error validating coupon', 'discount-engine', { error, couponCode });
      return { valid: false, reason: 'Error validating coupon' };
    }
  }
}

export const discountEngineService = DiscountEngineService.getInstance();
