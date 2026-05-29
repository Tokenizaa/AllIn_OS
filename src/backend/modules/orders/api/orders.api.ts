import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { OrderService } from "../services/order.service";
import { paginationSchema, filterSchema } from "../../../shared/dto/pagination.dto";
import { createOrderSchema, updateOrderSchema } from "../dto/order.dto";

const orderService = new OrderService();

export const getOrders = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return paginationSchema.merge(filterSchema).merge(
      z.object({
        customer_id: z.string().uuid().optional(),
        status: z.string().optional(),
      })
    ).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const result = await orderService.findAll(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch orders",
      };
    }
  });

export const getOrderById = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const order = await orderService.findById(data.id);
      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }
      return {
        success: true,
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch order",
      };
    }
  });

export const getOrderSummary = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ customerId: z.string().uuid().optional() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const summary = await orderService.getOrderSummary(data.customerId);
      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch order summary",
      };
    }
  });

export const createOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return createOrderSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const order = await orderService.create(data);
      return {
        success: true,
        data: order,
        message: "Order created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order",
      };
    }
  });

export const updateOrder = createServerFn({ method: "PATCH" })
  .validator((data: unknown) => {
    return z.object({
      id: z.string().uuid(),
      data: updateOrderSchema,
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const order = await orderService.update(data.id, data.data);
      return {
        success: true,
        data: order,
        message: "Order updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update order",
      };
    }
  });

export const deleteOrder = createServerFn({ method: "DELETE" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await orderService.delete(data.id);
      return {
        success: true,
        message: "Order deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete order",
      };
    }
  });

export const getOrderItems = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ orderId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const items = await orderService.getOrderItems(data.orderId);
      return {
        success: true,
        data: items,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch order items",
      };
    }
  });

export const getOrderStats = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const stats = await orderService.getStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch order stats",
      };
    }
  });
