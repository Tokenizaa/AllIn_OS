import { z } from "zod";

export const planSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  activation_fee: z.number(),
  plan_type: z.enum(["standard", "premium", "enterprise"]),
  is_affiliate: z.boolean(),
  is_active: z.boolean(),
  max_generations: z.number(),
  direct_bonus_percentage: z.number(),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Plan = z.infer<typeof planSchema>;

export const createPlanSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  activation_fee: z.number().min(0),
  plan_type: z.enum(["standard", "premium", "enterprise"]),
  is_affiliate: z.boolean(),
  is_active: z.boolean(),
  max_generations: z.number().min(0),
  direct_bonus_percentage: z.number().min(0).max(100),
  metadata: z.record(z.any()).optional(),
});

export type CreatePlanDto = z.infer<typeof createPlanSchema>;

export const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  activation_fee: z.number().min(0).optional(),
  plan_type: z.enum(["standard", "premium", "enterprise"]).optional(),
  is_affiliate: z.boolean().optional(),
  is_active: z.boolean().optional(),
  max_generations: z.number().min(0).optional(),
  direct_bonus_percentage: z.number().min(0).max(100).optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdatePlanDto = z.infer<typeof updatePlanSchema>;

export const planBonusSchema = z.object({
  id: z.string().uuid(),
  plan_id: z.string().uuid(),
  generation: z.number(),
  bonus_percentage: z.number(),
  required_directs: z.number(),
  bonus_type: z.enum(["generation", "direct_bonus"]),
  created_at: z.string().datetime(),
});

export type PlanBonus = z.infer<typeof planBonusSchema>;

export const createPlanBonusSchema = z.object({
  plan_id: z.string().uuid(),
  generation: z.number().min(0),
  bonus_percentage: z.number().min(0).max(100),
  required_directs: z.number().min(0),
  bonus_type: z.enum(["generation", "direct_bonus"]),
});

export type CreatePlanBonusDto = z.infer<typeof createPlanBonusSchema>;

export const customerPlanSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  status: z.enum(["active", "inactive", "pending", "expired"]),
  activated_at: z.string().datetime().nullable(),
  expires_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export type CustomerPlan = z.infer<typeof customerPlanSchema>;

export const activateCustomerPlanSchema = z.object({
  customer_id: z.string().uuid(),
  plan_id: z.string().uuid(),
});

export type ActivateCustomerPlanDto = z.infer<typeof activateCustomerPlanSchema>;
