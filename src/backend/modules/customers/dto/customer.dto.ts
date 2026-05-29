import { z } from "zod";

export const customerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  status: z.enum(["active", "inactive", "pending", "suspended"]),
  plan_id: z.string().uuid().nullable(),
  sponsor_id: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Customer = z.infer<typeof customerSchema>;

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  sponsor_id: z.string().uuid().optional(),
  plan_id: z.string().uuid().optional(),
});

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  status: z.enum(["active", "inactive", "pending", "suspended"]).optional(),
  plan_id: z.string().uuid().nullable().optional(),
});

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;

export const customer360Schema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  cpf: z.string().nullable(),
  status: z.string(),
  plan_id: z.string().nullable(),
  plan_name: z.string().nullable(),
  plan_status: z.string().nullable(),
  sponsor_id: z.string().nullable(),
  sponsor_name: z.string().nullable(),
  total_orders: z.number(),
  total_revenue: z.number(),
  total_downlines: z.number(),
  network_level: z.number(),
  created_at: z.string(),
  activated_at: z.string().nullable(),
});

export type Customer360 = z.infer<typeof customer360Schema>;
