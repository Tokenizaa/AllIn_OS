import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  amount: z.number(),
  status: z.enum(["pending", "processing", "approved", "rejected", "refunded"]),
  payment_method: z.string(),
  payment_gateway: z.string(),
  gateway_transaction_id: z.string().nullable(),
  gateway_response: z.record(z.any()).nullable(),
  paid_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Payment = z.infer<typeof paymentSchema>;

export const createPaymentSchema = z.object({
  order_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  amount: z.number().min(0),
  payment_method: z.string(),
  payment_gateway: z.string(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;

export const updatePaymentSchema = z.object({
  status: z.enum(["pending", "processing", "approved", "rejected", "refunded"]).optional(),
  gateway_transaction_id: z.string().optional(),
  gateway_response: z.record(z.any()).optional(),
  paid_at: z.string().datetime().optional(),
});

export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema>;

export const webhookPayloadSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
  timestamp: z.string(),
});

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
