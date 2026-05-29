import { BaseRepository } from "../../../infra/database/base.repository";
import { Plan, CreatePlanDto, UpdatePlanDto, PlanBonus, CreatePlanBonusDto, CustomerPlan, ActivateCustomerPlanDto } from "../dto/plan.dto";

export class PlanRepository extends BaseRepository<Plan> {
  constructor() {
    super("plans");
  }

  async findBySlug(slug: string): Promise<Plan | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async findActive(): Promise<Plan[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findAffiliatePlans(): Promise<Plan[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("is_affiliate", true)
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

export class PlanBonusRepository extends BaseRepository<PlanBonus> {
  constructor() {
    super("plan_bonuses");
  }

  async findByPlanId(planId: string): Promise<PlanBonus[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("plan_id", planId)
      .order("generation", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findByPlanIdAndType(planId: string, bonusType: "generation" | "direct_bonus"): Promise<PlanBonus[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("plan_id", planId)
      .eq("bonus_type", bonusType)
      .order("generation", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async deleteByPlanId(planId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .eq("plan_id", planId);

    if (error) throw error;
  }
}

export class CustomerPlanRepository extends BaseRepository<CustomerPlan> {
  constructor() {
    super("customer_plans");
  }

  async findByCustomerId(customerId: string): Promise<CustomerPlan[]> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findActiveByCustomerId(customerId: string): Promise<CustomerPlan | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("customer_id", customerId)
      .eq("status", "active")
      .single();

    if (error) throw error;
    return data;
  }

  async findByPlanId(planId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<CustomerPlan[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("plan_id", planId);

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async activatePlan(dto: ActivateCustomerPlanDto): Promise<CustomerPlan> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .insert({
        customer_id: dto.customer_id,
        plan_id: dto.plan_id,
        status: "active",
        activated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deactivatePlan(customerId: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .update({ status: "inactive" })
      .eq("customer_id", customerId)
      .eq("status", "active");

    if (error) throw error;
  }

  async countByPlanId(planId: string): Promise<number> {
    const { count, error } = await this.getClient()
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("plan_id", planId)
      .eq("status", "active");

    if (error) throw error;
    return count || 0;
  }
}
