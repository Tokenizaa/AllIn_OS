import { AnalyticsRepository } from "../repositories/analytics.repository";
import { ExecutiveAnalytics, SalesAnalytics, NetworkAnalytics, PlanAnalytics, BonusDistribution } from "../dto/analytics.dto";

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepository();
  }

  async getExecutiveAnalytics(): Promise<ExecutiveAnalytics> {
    return this.repository.getExecutiveAnalytics();
  }

  async getSalesAnalytics(period: string = "30d"): Promise<SalesAnalytics> {
    return this.repository.getSalesAnalytics(period);
  }

  async getNetworkAnalytics(): Promise<NetworkAnalytics> {
    return this.repository.getNetworkAnalytics();
  }

  async getPlanAnalytics(): Promise<PlanAnalytics[]> {
    const data = await this.repository.getPlanAnalytics();
    return data.map((item: any) => ({
      planId: item.plan_id,
      planName: item.plan_name,
      totalCustomers: item.total_customers,
      activeCustomers: item.active_customers,
      totalRevenue: item.total_revenue,
      averageRevenuePerCustomer: item.avg_revenue_per_customer,
      activeSubscriptions: item.active_subscriptions,
      newActivations30d: item.new_activations_30d,
    }));
  }

  async getBonusDistribution(): Promise<BonusDistribution[]> {
    const data = await this.repository.getBonusDistribution();
    return data.map((item: any) => ({
      planId: item.plan_id,
      planName: item.plan_name,
      totalBonusPool: item.total_bonus_pool,
      generationBonuses: item.generation_bonuses || [],
      directBonuses: item.direct_bonuses || [],
    }));
  }

  async getPlanAnalyticsById(planId: string): Promise<PlanAnalytics | null> {
    const data = await this.repository.getPlanAnalyticsById(planId);
    if (!data) return null;

    return {
      planId: data.plan_id,
      planName: data.plan_name,
      totalCustomers: data.total_customers,
      activeCustomers: data.active_customers,
      totalRevenue: data.total_revenue,
      averageRevenuePerCustomer: data.avg_revenue_per_customer,
      activeSubscriptions: data.active_subscriptions,
      newActivations30d: data.new_activations_30d,
    };
  }
}
