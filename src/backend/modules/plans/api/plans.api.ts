import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PlanService } from "../services/plan.service";
import { paginationSchema, filterSchema } from "../../../shared/dto/pagination.dto";
import { createPlanSchema, updatePlanSchema, createPlanBonusSchema, activateCustomerPlanSchema } from "../dto/plan.dto";

const planService = new PlanService();

export const getPlans = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return paginationSchema.merge(filterSchema).merge(
      z.object({
        is_active: z.coerce.boolean().optional(),
        is_affiliate: z.coerce.boolean().optional(),
      })
    ).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const result = await planService.findAll(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plans",
      };
    }
  });

export const getPlanById = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const plan = await planService.findById(data.id);
      if (!plan) {
        return {
          success: false,
          error: "Plan not found",
        };
      }
      return {
        success: true,
        data: plan,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plan",
      };
    }
  });

export const getPlanBySlug = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ slug: z.string() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const plan = await planService.findBySlug(data.slug);
      if (!plan) {
        return {
          success: false,
          error: "Plan not found",
        };
      }
      return {
        success: true,
        data: plan,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plan",
      };
    }
  });

export const createPlan = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return createPlanSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const plan = await planService.create(data);
      return {
        success: true,
        data: plan,
        message: "Plan created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create plan",
      };
    }
  });

export const updatePlan = createServerFn({ method: "PATCH" })
  .validator((data: unknown) => {
    return z.object({
      id: z.string().uuid(),
      data: updatePlanSchema,
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const plan = await planService.update(data.id, data.data);
      return {
        success: true,
        data: plan,
        message: "Plan updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update plan",
      };
    }
  });

export const deletePlan = createServerFn({ method: "DELETE" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await planService.delete(data.id);
      return {
        success: true,
        message: "Plan deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete plan",
      };
    }
  });

export const getPlanBonuses = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ planId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const bonuses = await planService.getPlanBonuses(data.planId);
      return {
        success: true,
        data: bonuses,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plan bonuses",
      };
    }
  });

export const createPlanBonus = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return createPlanBonusSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const bonus = await planService.createPlanBonus(data);
      return {
        success: true,
        data: bonus,
        message: "Plan bonus created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create plan bonus",
      };
    }
  });

export const deletePlanBonus = createServerFn({ method: "DELETE" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await planService.deletePlanBonus(data.id);
      return {
        success: true,
        message: "Plan bonus deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete plan bonus",
      };
    }
  });

export const activateCustomerPlan = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return activateCustomerPlanSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const customerPlan = await planService.activateCustomerPlan(data);
      return {
        success: true,
        data: customerPlan,
        message: "Customer plan activated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to activate customer plan",
      };
    }
  });

export const deactivateCustomerPlan = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({ customerId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await planService.deactivateCustomerPlan(data.customerId);
      return {
        success: true,
        message: "Customer plan deactivated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to deactivate customer plan",
      };
    }
  });

export const getCustomerPlans = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ customerId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const plans = await planService.getCustomerPlans(data.customerId);
      return {
        success: true,
        data: plans,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch customer plans",
      };
    }
  });

export const getActiveCustomerPlan = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ customerId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const plan = await planService.getActiveCustomerPlan(data.customerId);
      return {
        success: true,
        data: plan,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch active customer plan",
      };
    }
  });

export const getPlanStats = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ planId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const stats = await planService.getPlanStats(data.planId);
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plan stats",
      };
    }
  });

export const getAllPlanStats = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const stats = await planService.getAllPlanStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plan stats",
      };
    }
  });
