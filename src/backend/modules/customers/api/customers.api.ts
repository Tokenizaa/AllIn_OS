import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CustomerService } from "../services/customer.service";
import { paginationSchema, filterSchema } from "../../../shared/dto/pagination.dto";
import { createCustomerSchema, updateCustomerSchema } from "../dto/customer.dto";

const customerService = new CustomerService();

export const getCustomers = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return paginationSchema.merge(filterSchema).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const result = await customerService.findAll(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch customers",
      };
    }
  });

export const getCustomerById = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const customer = await customerService.findById(data.id);
      if (!customer) {
        return {
          success: false,
          error: "Customer not found",
        };
      }
      return {
        success: true,
        data: customer,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch customer",
      };
    }
  });

export const getCustomer360 = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const customer = await customerService.getCustomer360(data.id);
      if (!customer) {
        return {
          success: false,
          error: "Customer not found",
        };
      }
      return {
        success: true,
        data: customer,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch customer 360",
      };
    }
  });

export const createCustomer = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return createCustomerSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const customer = await customerService.create(data);
      return {
        success: true,
        data: customer,
        message: "Customer created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create customer",
      };
    }
  });

export const updateCustomer = createServerFn({ method: "PATCH" })
  .validator((data: unknown) => {
    return z.object({
      id: z.string().uuid(),
      data: updateCustomerSchema,
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const customer = await customerService.update(data.id, data.data);
      return {
        success: true,
        data: customer,
        message: "Customer updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update customer",
      };
    }
  });

export const deleteCustomer = createServerFn({ method: "DELETE" })
  .validator((data: unknown) => {
    return z.object({ id: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await customerService.delete(data.id);
      return {
        success: true,
        message: "Customer deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete customer",
      };
    }
  });

export const getCustomerStats = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const stats = await customerService.getStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch customer stats",
      };
    }
  });

export const getCustomerDownlines = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    return z.object({
      sponsorId: z.string().uuid(),
      ...paginationSchema.shape,
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const result = await customerService.getDownlines(data.sponsorId, data);
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
