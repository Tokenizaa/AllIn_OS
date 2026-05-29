import { z } from "zod";

export const orderSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  total_amount: z.number(),
  payment_method: z.string(),
  payment_status: z.enum(["pending", "paid", "failed", "refunded"]),
  shipping_address: z.record(z.any()).nullable(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Order = z.infer<typeof orderSchema>;

export const createOrderSchema = z.object({
  customer_id: z.string().uuid(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),
  payment_method: z.string(),
  shipping_address: z.record(z.any()).optional(),
  notes: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  payment_status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  shipping_address: z.record(z.any()).optional(),
  notes: z.string().optional(),
});

export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number(),
  price: z.number(),
  total_price: z.number(),
  created_at: z.string().datetime(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSummarySchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  customer_name: z.string(),
  status: z.string(),
  total_amount: z.number(),
  payment_status: z.string(),
  item_count: z.number(),
  created_at: z.string().datetime(),
});

export type OrderSummary = z.infer<typeof orderSummarySchema>;
