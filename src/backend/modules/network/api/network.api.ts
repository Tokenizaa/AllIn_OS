import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NetworkService } from "../services/network.service";
import { paginationSchema } from "../../../shared/dto/pagination.dto";

const networkService = new NetworkService();

export const getNetworkTree = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({
      customerId: z.string().uuid(),
      maxDepth: z.coerce.number().min(1).max(10).default(5),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const tree = await networkService.getNetworkTree(data.customerId, data.maxDepth);
      if (!tree) {
        return {
          success: false,
          error: "Network tree not found",
        };
      }
      return {
        success: true,
        data: tree,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch network tree",
      };
    }
  });

export const getDownlines = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return paginationSchema.merge(
      z.object({
        customerId: z.string().uuid(),
        maxDepth: z.coerce.number().min(1).max(10).optional(),
      })
    ).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const result = await networkService.getDownlines(data.customerId, data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch downlines",
      };
    }
  });

export const getUpline = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({
      customerId: z.string().uuid(),
      maxLevels: z.coerce.number().min(1).max(20).default(10),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const upline = await networkService.getUpline(data.customerId, data.maxLevels);
      return {
        success: true,
        data: upline,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch upline",
      };
    }
  });

export const getNetworkStats = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({
      customerId: z.string().uuid().optional(),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const stats = await networkService.getNetworkStats(data.customerId);
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch network stats",
      };
    }
  });
