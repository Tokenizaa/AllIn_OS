import { PlanRepository, PlanBonusRepository, CustomerPlanRepository } from "../repositories/plan.repository";
import { Plan, CreatePlanDto, UpdatePlanDto, PlanBonus, CreatePlanBonusDto, CustomerPlan, ActivateCustomerPlanDto } from "../dto/plan.dto";
import { PaginationParams, PaginatedResponse } from "../../../shared/types/common.types";

export class PlanService {
  private planRepository: PlanRepository;
  private planBonusRepository: PlanBonusRepository;
  private customerPlanRepository: CustomerPlanRepository;

  constructor() {
    this.planRepository = new PlanRepository();
    this.planBonusRepository = new PlanBonusRepository();
    this.customerPlanRepository = new CustomerPlanRepository();
  }

  async findAll(params: PaginationParams & { is_active?: boolean; is_affiliate?: boolean }): Promise<PaginatedResponse<Plan>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    let plans: Plan[];
    let total: number;

    if (params.is_active !== undefined || params.is_affiliate !== undefined) {
      if (params.is_affiliate) {
        plans = await this.planRepository.findAffiliatePlans();
        total = plans.length;
        plans = plans.slice(offset, offset + limit);
      } else if (params.is_active !== undefined) {
        plans = await this.planRepository.findActive();
        total = plans.length;
        plans = plans.slice(offset, offset + limit);
      } else {
        const result = await this.planRepository.findAll({ limit, offset });
        plans = result;
        total = await this.planRepository.count();
      }
    } else {
      plans = await this.planRepository.findAll({ limit, offset });
      total = await this.planRepository.count();
    }

    return {
      data: plans,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Plan | null> {
    return this.planRepository.findById(id);
  }

  async findBySlug(slug: string): Promise<Plan | null> {
    return this.planRepository.findBySlug(slug);
  }

  async create(dto: CreatePlanDto): Promise<Plan> {
    return this.planRepository.create({
      ...dto,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  async update(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const existing = await this.planRepository.findById(id);
    if (!existing) {
      throw new Error("Plan not found");
    }

    return this.planRepository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.planRepository.findById(id);
    if (!existing) {
      throw new Error("Plan not found");
    }

    // Delete associated bonuses first
    await this.planBonusRepository.deleteByPlanId(id);
    await this.planRepository.delete(id);
  }

  async getPlanBonuses(planId: string): Promise<PlanBonus[]> {
    return this.planBonusRepository.findByPlanId(planId);
  }

  async createPlanBonus(dto: CreatePlanBonusDto): Promise<PlanBonus> {
    return this.planBonusRepository.create({
      ...dto,
      created_at: new Date().toISOString(),
    });
  }

  async deletePlanBonus(id: string): Promise<void> {
    await this.planBonusRepository.delete(id);
  }

  async activateCustomerPlan(dto: ActivateCustomerPlanDto): Promise<CustomerPlan> {
    // Check if customer already has an active plan
    const existingActive = await this.customerPlanRepository.findActiveByCustomerId(dto.customer_id);
    if (existingActive) {
      throw new Error("Customer already has an active plan");
    }

    // Verify plan exists and is active
    const plan = await this.planRepository.findById(dto.plan_id);
    if (!plan) {
      throw new Error("Plan not found");
    }
    if (!plan.is_active) {
      throw new Error("Plan is not active");
    }

    return this.customerPlanRepository.activatePlan(dto);
  }

  async deactivateCustomerPlan(customerId: string): Promise<void> {
    await this.customerPlanRepository.deactivatePlan(customerId);
  }

  async getCustomerPlans(customerId: string): Promise<CustomerPlan[]> {
    return this.customerPlanRepository.findByCustomerId(customerId);
  }

  async getActiveCustomerPlan(customerId: string): Promise<CustomerPlan | null> {
    return this.customerPlanRepository.findActiveByCustomerId(customerId);
  }

  async getPlanStats(planId: string): Promise<{
    totalCustomers: number;
    activeCustomers: number;
  }> {
    const totalCustomers = await this.customerPlanRepository.countByPlanId(planId);
    return {
      totalCustomers,
      activeCustomers: totalCustomers, // Only count active plans
    };
  }

  async getAllPlanStats(): Promise<Array<{
    planId: string;
    planName: string;
    totalCustomers: number;
  }>> {
    const plans = await this.planRepository.findActive();
    const stats = await Promise.all(
      plans.map(async (plan) => {
        const totalCustomers = await this.customerPlanRepository.countByPlanId(plan.id);
        return {
          planId: plan.id,
          planName: plan.name,
          totalCustomers,
        };
      })
    );
    return stats;
  }
}
