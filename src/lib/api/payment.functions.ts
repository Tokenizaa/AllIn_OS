import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { paymentService } from '../backend/modules/payments/services/payment.service';
import { hybridPaymentService } from '../backend/modules/payments/services/hybrid-payment.service';
import { paymentSplitService } from '../backend/modules/payments/services/payment-split.service';
import { financialAuditService } from '../backend/modules/payments/services/financial-audit.service';

// Validation schemas
const createPaymentSchema = z.object({
  customerId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.string().default('BRL'),
  paymentMethod: z.enum(['pix', 'boleto', 'card', 'cash']),
  gatewayType: z.enum(['belluno', 'pagseguro']),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
  }).optional(),
  card: z.any().optional(),
  boleto: z.any().optional(),
  pix: z.any().optional(),
});

const hybridPaymentSchema = z.object({
  customerId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  originalAmount: z.number().positive(),
  currency: z.string().default('BRL'),
  paymentMethod: z.enum(['pix', 'boleto', 'card', 'cash']),
  gatewayType: z.enum(['belluno', 'pagseguro']),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
  }).optional(),
  card: z.any().optional(),
  boleto: z.any().optional(),
  pix: z.any().optional(),
  useWallet: z.boolean().default(false),
  useBonus: z.boolean().default(false),
  usePoints: z.boolean().default(false),
  couponCode: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
});

const paymentSplitSchema = z.object({
  paymentId: z.string().uuid(),
  totalAmount: z.number().positive(),
  splits: z.array(z.object({
    recipientId: z.string().uuid(),
    recipientType: z.enum(['distributor', 'company', 'affiliate']),
    recipientName: z.string(),
    percentage: z.number().min(0).max(100),
    fixedAmount: z.number().optional(),
    priority: z.number().default(0),
  })),
});

// Create payment
export const createPayment = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createPaymentSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await paymentService.createPayment(data, data.gatewayType);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create payment' };
    }
  });

// Create hybrid payment
export const createHybridPayment = createServerFn({ method: 'POST' })
  .validator((data: unknown) => hybridPaymentSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await hybridPaymentService.processHybridPayment(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to process hybrid payment' };
    }
  });

// Get hybrid payment preview
export const getHybridPaymentPreview = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({
    customerId: z.string().uuid(),
    originalAmount: z.number().positive(),
    useWallet: z.boolean().default(false),
    useBonus: z.boolean().default(false),
    usePoints: z.boolean().default(false),
    couponCode: z.string().optional(),
    productId: z.string().optional(),
    categoryId: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await hybridPaymentService.calculateHybridPaymentPreview(
        data.customerId,
        data.originalAmount,
        data.useWallet,
        data.useBonus,
        data.usePoints,
        data.couponCode,
        data.productId,
        data.categoryId
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to calculate preview' };
    }
  });

// Get payment by ID
export const getPayment = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await paymentService.findById(data.id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get payment' };
    }
  });

// Get payments by customer
export const getCustomerPayments = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({
    customerId: z.string().uuid(),
    page: z.number().default(1),
    limit: z.number().default(20),
    status: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await paymentService.findAll({
        customer_id: data.customerId,
        status: data.status,
        page: data.page,
        limit: data.limit,
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get payments' };
    }
  });

// Get payment statistics
export const getPaymentStats = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const result = await paymentService.getStats();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get statistics' };
    }
  });

// Create payment split
export const createPaymentSplit = createServerFn({ method: 'POST' })
  .validator((data: unknown) => paymentSplitSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await paymentSplitService.createPaymentSplit(
        data.paymentId,
        data.totalAmount,
        data.splits
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create payment split' };
    }
  });

// Process payment split
export const processPaymentSplit = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ splitId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await paymentSplitService.processSplitPayment(data.splitId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to process payment split' };
    }
  });

// Get payment splits
export const getPaymentSplits = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({ paymentId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await paymentSplitService.getPaymentSplits(data.paymentId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get payment splits' };
    }
  });

// Get financial summary
export const getFinancialSummary = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await financialAuditService.getFinancialSummary(
        new Date(data.startDate),
        new Date(data.endDate)
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get financial summary' };
    }
  });

// Get audit logs
export const getAuditLogs = createServerFn({ method: 'GET' })
  .validator((data: unknown) => z.object({
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    userId: z.string().optional(),
    limit: z.number().default(100),
    offset: z.number().default(0),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await financialAuditService.getAuditLogs(
        data.entityType,
        data.entityId,
        data.userId,
        data.limit,
        data.offset
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get audit logs' };
    }
  });

// Retry payment
export const retryPayment = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ paymentId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await paymentService.retryPayment(data.paymentId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to retry payment' };
    }
  });
