import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PaymentService } from "../services/payment.service";
import { paginationSchema, filterSchema } from "../../../shared/dto/pagination.dto";
import { createPaymentSchema, updatePaymentSchema, webhookPayloadSchema } from "../dto/payment.dto";

const paymentService = new PaymentService();

export const getPayments = createServerFn({ method: "GET" })
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
      const result = await paymentService.findAll(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch payments",
      };
    }
  });

export const getPaymentById = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const payment = await paymentService.findById(data.id);
      if (!payment) {
        return {
          success: false,
          error: "Payment not found",
        };
      }
      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch payment",
      };
    }
  });

export const createPayment = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return createPaymentSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const payment = await paymentService.create(data);
      return {
        success: true,
        data: payment,
        message: "Payment created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create payment",
      };
    }
  });

export const updatePayment = createServerFn({ method: "PATCH" })
  .validator((data: unknown) => {
    return z.object({
      id: z.string().uuid(),
      data: updatePaymentSchema,
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const payment = await paymentService.update(data.id, data.data);
      return {
        success: true,
        data: payment,
        message: "Payment updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update payment",
      };
    }
  });

export const deletePayment = createServerFn({ method: "DELETE" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await paymentService.delete(data.id);
      return {
        success: true,
        message: "Payment deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete payment",
      };
    }
  });

export const processPaymentWebhook = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return webhookPayloadSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const payment = await paymentService.processWebhook(data);
      return {
        success: true,
        data: payment,
        message: "Webhook processed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process webhook",
      };
    }
  });

export const getPaymentStats = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const stats = await paymentService.getStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch payment stats",
      };
    }
  });
