import { z } from "zod";

export const executiveAnalyticsSchema = z.object({
  totalRevenue: z.number(),
  totalOrders: z.number(),
  totalCustomers: z.number(),
  activeCustomers: z.number(),
  averageOrderValue: z.number(),
  revenueGrowth: z.number(),
  orderGrowth: z.number(),
  customerGrowth: z.number(),
});

export type ExecutiveAnalytics = z.infer<typeof executiveAnalyticsSchema>;

export const salesAnalyticsSchema = z.object({
  period: z.string(),
  totalRevenue: z.number(),
  totalOrders: z.number(),
  averageOrderValue: z.number(),
  topProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    totalSales: z.number(),
    revenue: z.number(),
  })),
  dailySales: z.array(z.object({
    date: z.string(),
    revenue: z.number(),
    orders: z.number(),
  })),
});

export type SalesAnalytics = z.infer<typeof salesAnalyticsSchema>;

export const networkAnalyticsSchema = z.object({
  totalNetworkSize: z.number(),
  activeDistributors: z.number(),
  averageDownlines: z.number(),
  topPerformers: z.array(z.object({
    customerId: z.string(),
    customerName: z.string(),
    totalDownlines: z.number(),
    totalRevenue: z.number(),
  })),
  depthDistribution: z.array(z.object({
    level: z.number(),
    count: z.number(),
  })),
});

export type NetworkAnalytics = z.infer<typeof networkAnalyticsSchema>;

export const planAnalyticsSchema = z.object({
  planId: z.string(),
  planName: z.string(),
  totalCustomers: z.number(),
  activeCustomers: z.number(),
  totalRevenue: z.number(),
  averageRevenuePerCustomer: z.number(),
  activeSubscriptions: z.number(),
  newActivations30d: z.number(),
});

export type PlanAnalytics = z.infer<typeof planAnalyticsSchema>;

export const bonusDistributionSchema = z.object({
  planId: z.string(),
  planName: z.string(),
  totalBonusPool: z.number(),
  generationBonuses: z.array(z.object({
    generation: z.number(),
    totalAmount: z.number(),
    count: z.number(),
  })),
  directBonuses: z.array(z.object({
    requiredDirects: z.number(),
    totalAmount: z.number(),
    count: z.number(),
  })),
});

export type BonusDistribution = z.infer<typeof bonusDistributionSchema>;
