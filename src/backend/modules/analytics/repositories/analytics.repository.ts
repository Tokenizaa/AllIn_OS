import { BaseRepository } from "../../../infra/database/base.repository";

export class AnalyticsRepository extends BaseRepository<any> {
  constructor() {
    super("analytics_plan_performance");
  }

  async getExecutiveAnalytics(): Promise<any> {
    const { data, error } = await this.getClient()
      .from("order_summary_view")
      .select("total_revenue, total_orders, average_order_value")
      .limit(1)
      .single();

    if (error) throw error;

    const { count: totalCustomers } = await this.getClient()
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    return {
      totalRevenue: data?.total_revenue || 0,
      totalOrders: data?.total_orders || 0,
      totalCustomers: totalCustomers || 0,
      activeCustomers: totalCustomers || 0,
      averageOrderValue: data?.average_order_value || 0,
      revenueGrowth: 0,
      orderGrowth: 0,
      customerGrowth: 0,
    };
  }

  async getSalesAnalytics(period: string = "30d"): Promise<any> {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await this.getClient()
      .from("order_summary_view")
      .select("total_revenue, total_orders, average_order_value")
      .gte("created_at", startDate.toISOString())
      .single();

    if (error) throw error;

    return {
      period,
      totalRevenue: data?.total_revenue || 0,
      totalOrders: data?.total_orders || 0,
      averageOrderValue: data?.average_order_value || 0,
      topProducts: [],
      dailySales: [],
    };
  }

  async getNetworkAnalytics(): Promise<any> {
    const { count: totalNetworkSize } = await this.getClient()
      .from("customers")
      .select("*", { count: "exact", head: true });

    const { count: activeDistributors } = await this.getClient()
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    return {
      totalNetworkSize: totalNetworkSize || 0,
      activeDistributors: activeDistributors || 0,
      averageDownlines: 0,
      topPerformers: [],
      depthDistribution: [],
    };
  }

  async getPlanAnalytics(): Promise<any[]> {
    const { data, error } = await this.getClient()
      .from("analytics_plan_performance")
      .select("*")
      .order("total_customers", { ascending: false });

    if (error) throw error;

    return data || [];
  }

  async getBonusDistribution(): Promise<any[]> {
    const { data, error } = await this.getClient()
      .from("analytics_bonus_distribution")
      .select("*")
      .order("total_bonus_pool", { ascending: false });

    if (error) throw error;

    return data || [];
  }

  async getPlanAnalyticsById(planId: string): Promise<any | null> {
    const { data, error } = await this.getClient()
      .from("analytics_plan_performance")
      .select("*")
      .eq("plan_id", planId)
      .single();

    if (error) throw error;
    return data;
  }
}
