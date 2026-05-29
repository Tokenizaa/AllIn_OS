import { jwtSign, jwtVerify } from "jsonwebtoken";
import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto, AuthResponse } from "../dto/auth.dto";
import { CustomerRepository } from "../../customers/repositories/customer.repository";
import { UserRole } from "../../../shared/types/common.types";

// JWT configuration - these MUST be set in environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = "1h";
const JWT_REFRESH_EXPIRES_IN = "7d";

// Validate required environment variables
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables");
}

export class AuthService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
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

    const role = this.resolveRole(customer);
    const accessToken = this.generateAccessToken(customer.id, customer.email, role);
    const refreshToken = this.generateRefreshToken(customer.id);

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role,
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

    const role = this.resolveRole(customer);
    const accessToken = this.generateAccessToken(customer.id, customer.email, role);
    const refreshToken = this.generateRefreshToken(customer.id);

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role,
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

      const role = this.resolveRole(customer);
      const accessToken = this.generateAccessToken(customer.id, customer.email, role);
      const refreshToken = this.generateRefreshToken(customer.id);

      return {
        user: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          role,
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

  private resolveRole(customer: { role?: string; customer_type?: string; plan_id?: string }): UserRole {
    const candidate = (customer.role || customer.customer_type || "").toLowerCase();

    if (candidate === "admin" || candidate === "operator" || candidate === "distributor" || candidate === "customer") {
      return candidate as UserRole;
    }

    if (candidate === "final" || candidate === "cliente" || candidate === "customer_final") {
      return UserRole.CUSTOMER;
    }

    return customer.plan_id ? UserRole.DISTRIBUTOR : UserRole.CUSTOMER;
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
