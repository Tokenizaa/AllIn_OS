import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AnalyticsService } from "../services/analytics.service";

const analyticsService = new AnalyticsService();

export const getExecutiveAnalytics = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const analytics = await analyticsService.getExecutiveAnalytics();
      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch executive analytics",
      };
    }
  });

export const getSalesAnalytics = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({
      period: z.enum(["7d", "30d", "90d"]).default("30d"),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const analytics = await analyticsService.getSalesAnalytics(data.period);
      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch sales analytics",
      };
    }
  });

export const getNetworkAnalytics = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const analytics = await analyticsService.getNetworkAnalytics();
      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch network analytics",
      };
    }
  });

export const getPlanAnalytics = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const analytics = await analyticsService.getPlanAnalytics();
      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plan analytics",
      };
    }
  });

export const getPlanAnalyticsById = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ planId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const analytics = await analyticsService.getPlanAnalyticsById(data.planId);
      if (!analytics) {
        return {
          success: false,
          error: "Plan analytics not found",
        };
      }
      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plan analytics",
      };
    }
  });

export const getBonusDistribution = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const analytics = await analyticsService.getBonusDistribution();
      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch bonus distribution",
      };
    }
  });
