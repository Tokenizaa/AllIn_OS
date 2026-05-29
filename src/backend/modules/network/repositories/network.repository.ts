import { BaseRepository } from "../../../infra/database/base.repository";
import { NetworkTreeNode, NetworkTree, DownlineNode, UplineNode, NetworkStats } from "../dto/network.dto";

export class NetworkRepository extends BaseRepository<any> {
  constructor() {
    super("network_tree_view");
  }

  async getNetworkTree(customerId: string, maxDepth: number = 5): Promise<NetworkTree | null> {
    const { data, error } = await this.getClient()
      .from("network_tree_view")
      .select("*")
      .eq("id", customerId)
      .single();

    if (error) throw error;

    if (!data) return null;

    const root: NetworkTreeNode = {
      id: data.id,
      name: data.name,
      email: data.email,
      status: data.status,
      level: data.level || 0,
      sponsor_id: data.sponsor_id,
      sponsor_name: data.sponsor_name,
      total_downlines: data.total_downlines || 0,
      active_downlines: data.active_downlines || 0,
      total_revenue: data.total_revenue || 0,
      plan_name: data.plan_name,
    };

    const children = await this.getDownlinesRecursive(customerId, 1, maxDepth);

    return {
      root,
      children,
    };
  }

  private async getDownlinesRecursive(sponsorId: string, currentDepth: number, maxDepth: number): Promise<NetworkTree[]> {
    if (currentDepth > maxDepth) return [];

    const { data, error } = await this.getClient()
      .from("network_tree_view")
      .select("*")
      .eq("sponsor_id", sponsorId);

    if (error) throw error;

    if (!data || data.length === 0) return [];

    const trees: NetworkTree[] = [];

    for (const node of data) {
      const treeNode: NetworkTreeNode = {
        id: node.id,
        name: node.name,
        email: node.email,
        status: node.status,
        level: node.level || currentDepth,
        sponsor_id: node.sponsor_id,
        sponsor_name: node.sponsor_name,
        total_downlines: node.total_downlines || 0,
        active_downlines: node.active_downlines || 0,
        total_revenue: node.total_revenue || 0,
        plan_name: node.plan_name,
      };

      const children = await this.getDownlinesRecursive(node.id, currentDepth + 1, maxDepth);

      trees.push({
        root: treeNode,
        children,
      });
    }

    return trees;
  }

  async getDownlines(customerId: string, options?: {
    limit?: number;
    offset?: number;
    maxDepth?: number;
  }): Promise<DownlineNode[]> {
    let query = this.getClient()
      .from("network_tree_view")
      .select("*")
      .eq("sponsor_id", customerId);

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((node: any) => ({
      id: node.id,
      name: node.name,
      email: node.email,
      status: node.status,
      level: node.level || 0,
      sponsor_id: node.sponsor_id,
      total_downlines: node.total_downlines || 0,
      active_downlines: node.active_downlines || 0,
      total_revenue: node.total_revenue || 0,
      plan_name: node.plan_name,
      created_at: node.created_at,
    }));
  }

  async getUpline(customerId: string, maxLevels: number = 10): Promise<UplineNode[]> {
    const upline: UplineNode[] = [];
    let currentId = customerId;
    let level = 0;

    while (currentId && level < maxLevels) {
      const { data, error } = await this.getClient()
        .from("network_tree_view")
        .select("*")
        .eq("id", currentId)
        .single();

      if (error || !data) break;

      if (data.sponsor_id) {
        const { data: sponsorData, error: sponsorError } = await this.getClient()
          .from("network_tree_view")
          .select("*")
          .eq("id", data.sponsor_id)
          .single();

        if (sponsorError || !sponsorData) break;

        upline.push({
          id: sponsorData.id,
          name: sponsorData.name,
          email: sponsorData.email,
          status: sponsorData.status,
          level: level + 1,
          sponsor_id: sponsorData.sponsor_id,
          total_downlines: sponsorData.total_downlines || 0,
          total_revenue: sponsorData.total_revenue || 0,
          plan_name: sponsorData.plan_name,
        });

        currentId = sponsorData.id;
        level++;
      } else {
        break;
      }
    }

    return upline;
  }

  async getNetworkStats(customerId?: string): Promise<NetworkStats> {
    let totalNetworkSize = 0;
    let activeDistributors = 0;
    let totalRevenue = 0;

    if (customerId) {
      const { data, error } = await this.getClient()
        .from("network_tree_view")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) throw error;

      totalNetworkSize = data?.total_downlines || 0;
      activeDistributors = data?.active_downlines || 0;
      totalRevenue = data?.total_revenue || 0;
    } else {
      const { count: total } = await this.getClient()
        .from("customers")
        .select("*", { count: "exact", head: true });

      const { count: active } = await this.getClient()
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      totalNetworkSize = total || 0;
      activeDistributors = active || 0;
    }

    return {
      totalNetworkSize,
      activeDistributors,
      totalLevels: 0, // Would need recursive calculation
      averageDownlines: totalNetworkSize > 0 ? totalNetworkSize / (activeDistributors || 1) : 0,
      totalRevenue,
    };
  }

  async countDownlines(customerId: string): Promise<number> {
    const { count, error } = await this.getClient()
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("sponsor_id", customerId);

    if (error) throw error;
    return count || 0;
  }
}
