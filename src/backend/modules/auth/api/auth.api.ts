import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { loginSchema, registerSchema, refreshTokenSchema, changePasswordSchema } from "../dto/auth.dto";

const authService = new AuthService();

export const login = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return loginSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const result = await authService.login(data);
      return {
        success: true,
        data: result,
        message: "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  });

export const register = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return registerSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const result = await authService.register(data);
      return {
        success: true,
        data: result,
        message: "Registration successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  });

export const refreshToken = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return refreshTokenSchema.parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const result = await authService.refreshToken(data);
      return {
        success: true,
        data: result,
        message: "Token refreshed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Token refresh failed",
      };
    }
  });

export const changePassword = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({
      userId: z.string().uuid(),
      data: changePasswordSchema,
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await authService.changePassword(data.userId, data.data);
      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Password change failed",
      };
    }
  });

export const logout = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({ userId: z.string().uuid() }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      await authService.logout(data.userId);
      return {
        success: true,
        message: "Logout successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  });
