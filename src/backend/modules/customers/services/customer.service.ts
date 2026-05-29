import { CustomerRepository } from "../repositories/customer.repository";
import { Customer, CreateCustomerDto, UpdateCustomerDto, Customer360 } from "../dto/customer.dto";
import { PaginationParams, PaginatedResponse } from "../../../shared/types/common.types";

export class CustomerService {
  private repository: CustomerRepository;

  constructor() {
    this.repository = new CustomerRepository();
  }

  async findAll(params: PaginationParams & { status?: string }): Promise<PaginatedResponse<Customer>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const filters: Record<string, any> = {};
    if (params.status) {
      filters.status = params.status;
    }

    const [data, total] = await Promise.all([
      this.repository.findAll({ filters, limit, offset }),
      this.repository.count(filters),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findById(id);
  }

  async getCustomer360(id: string): Promise<Customer360 | null> {
    return this.repository.getCustomer360(id);
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    // Check if email already exists
    const existingByEmail = await this.repository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new Error("Email already registered");
    }

    // Check if CPF already exists
    if (dto.cpf) {
      const existingByCpf = await this.repository.findByCpf(dto.cpf);
      if (existingByCpf) {
        throw new Error("CPF already registered");
      }
    }

    return this.repository.create({
      ...dto,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Customer not found");
    }

    // Check email uniqueness if changing
    if (dto.email && dto.email !== existing.email) {
      const existingByEmail = await this.repository.findByEmail(dto.email);
      if (existingByEmail) {
        throw new Error("Email already registered");
      }
    }

    // Check CPF uniqueness if changing
    if (dto.cpf && dto.cpf !== existing.cpf) {
      const existingByCpf = await this.repository.findByCpf(dto.cpf);
      if (existingByCpf) {
        throw new Error("CPF already registered");
      }
    }

    return this.repository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Customer not found");
    }

    await this.repository.delete(id);
  }

  async getDownlines(sponsorId: string, params: PaginationParams): Promise<PaginatedResponse<Customer>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.repository.findBySponsorId(sponsorId, { limit, offset }),
      this.repository.count({ sponsor_id: sponsorId }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    suspended: number;
  }> {
    const [total, active, inactive, pending, suspended] = await Promise.all([
      this.repository.count(),
      this.repository.countByStatus("active"),
      this.repository.countByStatus("inactive"),
      this.repository.countByStatus("pending"),
      this.repository.countByStatus("suspended"),
    ]);

    return { total, active, inactive, pending, suspended };
  }
}
