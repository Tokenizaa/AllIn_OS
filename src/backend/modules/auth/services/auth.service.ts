import { jwtSign, jwtVerify } from "jsonwebtoken";
import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto, AuthResponse } from "../dto/auth.dto";
import { CustomerRepository } from "../../customers/repositories/customer.repository";
import { ProfileRepository } from "../../profiles/repositories/profile.repository";
import { UserRole } from "../../../shared/types/common.types";

// In production, these should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret";
const JWT_EXPIRES_IN = "1h";
const JWT_REFRESH_EXPIRES_IN = "7d";

export class AuthService {
  private customerRepository: CustomerRepository;
  private profileRepository: ProfileRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
    this.profileRepository = new ProfileRepository();
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find customer by email
    const customer = await this.customerRepository.findByEmail(dto.email);
    if (!customer) {
      throw new Error("Invalid credentials");
    }

    // In production, verify password hash
    // For now, we'll skip password verification
    // const isPasswordValid = await bcrypt.compare(dto.password, customer.password_hash);
    // if (!isPasswordValid) {
    //   throw new Error("Invalid credentials");
    // }

    // Get user role from profiles table (NOT from customers)
    const profile = await this.profileRepository.findByUserId(customer.id);
    const role = profile?.role || UserRole.CLIENTE_FINAL;

    // Generate tokens with role from profiles
    const accessToken = this.generateAccessToken(customer.id, customer.email, role);
    const refreshToken = this.generateRefreshToken(customer.id);

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: role, // Role from profiles table
      },
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if email already exists
    const existingCustomer = await this.customerRepository.findByEmail(dto.email);
    if (existingCustomer) {
      throw new Error("Email already registered");
    }

    // Check if CPF already exists
    if (dto.cpf) {
      const existingByCpf = await this.customerRepository.findByCpf(dto.cpf);
      if (existingByCpf) {
        throw new Error("CPF already registered");
      }
    }

    // In production, hash the password
    // const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create customer
    const customer = await this.customerRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      cpf: dto.cpf,
      sponsor_id: dto.sponsor_id,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Create profile with default role (cliente_final)
    // This can be overridden based on business logic later
    await this.profileRepository.create({
      user_id: customer.id,
      name: customer.name,
      email: customer.email,
      role: UserRole.CLIENTE_FINAL,
      status: "active",
    });

    // Get user role from profiles table
    const profile = await this.profileRepository.findByUserId(customer.id);
    const role = profile?.role || UserRole.CLIENTE_FINAL;

    // Generate tokens with role from profiles
    const accessToken = this.generateAccessToken(customer.id, customer.email, role);
    const refreshToken = this.generateRefreshToken(customer.id);

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: role, // Role from profiles table
      },
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  async refreshToken(dto: RefreshTokenDto): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const decoded = jwtVerify(dto.refreshToken, JWT_REFRESH_SECRET) as { userId: string };

      // Get customer
      const customer = await this.customerRepository.findById(decoded.userId);
      if (!customer) {
        throw new Error("Invalid refresh token");
      }

      // Get user role from profiles table (NOT from customers)
      const profile = await this.profileRepository.findByUserId(customer.id);
      const role = profile?.role || UserRole.CLIENTE_FINAL;

      // Generate new tokens with role from profiles
      const accessToken = this.generateAccessToken(customer.id, customer.email, role);
      const refreshToken = this.generateRefreshToken(customer.id);

      return {
        user: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          role: role, // Role from profiles table
        },
        accessToken,
        refreshToken,
        expiresIn: 3600,
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const customer = await this.customerRepository.findById(userId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // In production, verify current password
    // const isPasswordValid = await bcrypt.compare(dto.currentPassword, customer.password_hash);
    // if (!isPasswordValid) {
    //   throw new Error("Invalid current password");
    // }

    // In production, hash new password
    // const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    // Update customer with new password hash
    // await this.customerRepository.update(userId, { password_hash: newPasswordHash });

    // For now, just acknowledge the change
  }

  async logout(userId: string): Promise<void> {
    // In production, add refresh token to blacklist
    // For now, just acknowledge the logout
  }

  private generateAccessToken(userId: string, email: string, role: string): string {
    return jwtSign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  private generateRefreshToken(userId: string): string {
    return jwtSign(
      { userId },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  }

  verifyAccessToken(token: string): { userId: string; email: string; role: string } {
    try {
      const decoded = jwtVerify(token, JWT_SECRET) as { userId: string; email: string; role: string };
      return decoded;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }
}
