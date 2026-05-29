import { NetworkRepository } from "../repositories/network.repository";
import { NetworkTree, DownlineNode, UplineNode, NetworkStats } from "../dto/network.dto";
import { PaginationParams, PaginatedResponse } from "../../../shared/types/common.types";

export class NetworkService {
  private repository: NetworkRepository;

  constructor() {
    this.repository = new NetworkRepository();
  }

  async getNetworkTree(customerId: string, maxDepth: number = 5): Promise<NetworkTree | null> {
    return this.repository.getNetworkTree(customerId, maxDepth);
  }

  async getDownlines(customerId: string, params: PaginationParams & { maxDepth?: number }): Promise<PaginatedResponse<DownlineNode>> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.repository.getDownlines(customerId, { limit, offset, maxDepth: params.maxDepth }),
      this.repository.countDownlines(customerId),
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

  async getUpline(customerId: string, maxLevels: number = 10): Promise<UplineNode[]> {
    return this.repository.getUpline(customerId, maxLevels);
  }

  async getNetworkStats(customerId?: string): Promise<NetworkStats> {
    return this.repository.getNetworkStats(customerId);
  }

  async countDownlines(customerId: string): Promise<number> {
    return this.repository.countDownlines(customerId);
  }
}
