import { z } from "zod";

export const networkTreeNodeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
  level: z.number(),
  sponsor_id: z.string().uuid().nullable(),
  sponsor_name: z.string().nullable(),
  total_downlines: z.number(),
  active_downlines: z.number(),
  total_revenue: z.number(),
  plan_name: z.string().nullable(),
});

export type NetworkTreeNode = z.infer<typeof networkTreeNodeSchema>;

export const networkTreeSchema = z.object({
  root: networkTreeNodeSchema,
  children: z.array(z.lazy(() => networkTreeSchema)),
});

export type NetworkTree = z.infer<typeof networkTreeSchema>;

export const downlineNodeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
  level: z.number(),
  sponsor_id: z.string().uuid(),
  total_downlines: z.number(),
  active_downlines: z.number(),
  total_revenue: z.number(),
  plan_name: z.string().nullable(),
  created_at: z.string().datetime(),
});

export type DownlineNode = z.infer<typeof downlineNodeSchema>;

export const uplineNodeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
  level: z.number(),
  sponsor_id: z.string().uuid().nullable(),
  total_downlines: z.number(),
  total_revenue: z.number(),
  plan_name: z.string().nullable(),
});

export type UplineNode = z.infer<typeof uplineNodeSchema>;

export const networkStatsSchema = z.object({
  totalNetworkSize: z.number(),
  activeDistributors: z.number(),
  totalLevels: z.number(),
  averageDownlines: z.number(),
  totalRevenue: z.number(),
});

export type NetworkStats = z.infer<typeof networkStatsSchema>;
