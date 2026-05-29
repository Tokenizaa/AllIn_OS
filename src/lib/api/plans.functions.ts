import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getPlans as getPlansApi,
  getPlanBySlug as getPlanBySlugApi,
  getPlanBonuses as getPlanBonusesApi,
  createPlan as createPlanApi,
  updatePlan as updatePlanApi,
  createPlanBonus as createPlanBonusApi,
  deletePlanBonus as deletePlanBonusApi,
  activateCustomerPlan as activateCustomerPlanApi,
  deactivateCustomerPlan as deactivateCustomerPlanApi,
  getCustomerPlans as getCustomerPlansApi,
  getPlanAnalytics as getPlanAnalyticsApi,
  getBonusDistribution as getBonusDistributionApi,
  getPlanStats as getPlanStatsApi,
} from "../../backend/api";

// ============================================================================
// PLAN SERVICE
// ============================================================================

// Get all plans
export const getAllPlans = createServerFn({ method: "GET" })
  .handler(async () => {
    const result = await getPlansApi();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch plans");
    }
    return result.data.data;
  });

// Get plan by slug
export const getPlanBySlug = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const result = await getPlanBySlugApi({ slug: data.slug });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch plan");
    }
    return result.data;
  });

// Get plan bonuses
export const getPlanBonuses = createServerFn({ method: "POST" })
  .inputValidator(z.object({ planId: z.string() }))
  .handler(async ({ data }) => {
    const result = await getPlanBonusesApi({ planId: data.planId });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch plan bonuses");
    }
    return result.data;
  });

// Create plan
export const createPlan = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    price: z.number().min(0),
    activation_fee: z.number().min(0).default(0),
    plan_type: z.string().optional(),
    is_affiliate: z.boolean().default(false),
    is_active: z.boolean().default(true),
    max_generations: z.number().min(1).default(1),
    direct_bonus_percentage: z.number().min(0).max(100).default(0),
    metadata: z.record(z.any()).optional(),
  }))
  .handler(async ({ data }) => {
    const result = await createPlanApi(data);
    if (!result.success) {
      throw new Error(result.error || "Failed to create plan");
    }
    return result.data;
  });

// Update plan
export const updatePlan = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    activation_fee: z.number().min(0).optional(),
    plan_type: z.string().optional(),
    is_affiliate: z.boolean().optional(),
    is_active: z.boolean().optional(),
    max_generations: z.number().min(1).optional(),
    direct_bonus_percentage: z.number().min(0).max(100).optional(),
    metadata: z.record(z.any()).optional(),
  }))
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const result = await updatePlanApi({ id, data: updateData });
    if (!result.success) {
      throw new Error(result.error || "Failed to update plan");
    }
    return result.data;
  });

// Create plan bonus
export const createPlanBonus = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    plan_id: z.string().uuid(),
    generation: z.number().min(0),
    bonus_percentage: z.number().min(0).max(100),
    required_directs: z.number().min(0).default(0),
    bonus_type: z.string().default("generation"),
  }))
  .handler(async ({ data }) => {
    const result = await createPlanBonusApi(data);
    if (!result.success) {
      throw new Error(result.error || "Failed to create plan bonus");
    }
    return result.data;
  });

// Delete plan bonus
export const deletePlanBonus = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const result = await deletePlanBonusApi({ id: data.id });
    if (!result.success) {
      throw new Error(result.error || "Failed to delete plan bonus");
    }
    return result;
  });

// Activate customer plan
export const activateCustomerPlan = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    customer_id: z.string().uuid(),
    plan_id: z.string().uuid(),
    expires_at: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const result = await activateCustomerPlanApi(data);
    if (!result.success) {
      throw new Error(result.error || "Failed to activate customer plan");
    }
    return result.data;
  });

// Deactivate customer plan
export const deactivateCustomerPlan = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    customer_id: z.string().uuid(),
  }))
  .handler(async ({ data }) => {
    const result = await deactivateCustomerPlanApi({ customerId: data.customer_id });
    if (!result.success) {
      throw new Error(result.error || "Failed to deactivate customer plan");
    }
    return result;
  });

// Get customer plan history
export const getCustomerPlanHistory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ customerId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const result = await getCustomerPlansApi({ customerId: data.customerId });
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch customer plan history");
    }
    return result.data.data;
  });

// Get analytics plan performance
export const getPlanAnalytics = createServerFn({ method: "GET" })
  .handler(async () => {
    const result = await getPlanAnalyticsApi();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch plan analytics");
    }
    return result.data;
  });

// Get analytics bonus distribution
export const getBonusDistribution = createServerFn({ method: "GET" })
  .handler(async () => {
    const result = await getBonusDistributionApi();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch bonus distribution");
    }
    return result.data;
  });

// Get plan stats
export const getPlanStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const result = await getPlanStatsApi();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch plan stats");
    }
    return result.data;
  });
