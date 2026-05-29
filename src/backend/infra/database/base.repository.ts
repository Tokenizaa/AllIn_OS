import { getSupabaseAdminClient } from "../supabase/client";

export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected getClient() {
    return getSupabaseAdminClient();
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(options?: {
    filters?: Record<string, any>;
    orderBy?: string;
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<T[]> {
    let query = this.getClient().from(this.tableName).select("*");

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.order === "asc" });
    }

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

  async create(data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.getClient()
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.getClient()
      .from(this.tableName)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let query = this.getClient().from(this.tableName).select("*", { count: "exact", head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }
}
