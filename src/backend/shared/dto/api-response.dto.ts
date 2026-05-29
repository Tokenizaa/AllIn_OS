import { z } from "zod";

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ApiResponseDto = z.infer<typeof apiResponseSchema>;

export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type PaginatedResponseDto = z.infer<typeof paginatedResponseSchema>;
