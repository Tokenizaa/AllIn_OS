import { BaseRepository } from "../../../infra/database/base.repository";
import { Profile, CreateProfileDto, UpdateProfileDto } from "../dto/profile.dto";

export class ProfileRepository extends BaseRepository<Profile> {
  constructor() {
    super("profiles");
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  async findByRole(role: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Profile[]> {
    let query = this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("role", role);

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

  async create(dto: CreateProfileDto): Promise<Profile> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .insert({
        ...dto,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
