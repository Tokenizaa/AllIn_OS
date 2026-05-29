import { supabase } from '../client'

export interface OracleSnapshotPayload {
  users?: Array<Record<string, any>>
  products?: Array<Record<string, any>>
  orders?: Array<Record<string, any>>
  metadata?: Record<string, any>
}

export class OracleIngestionService {
  /**
   * Cria batch e popula staging para processamento posterior no banco.
   */
  static async ingestSnapshot(payload: OracleSnapshotPayload) {
    const { data: batch, error: batchError } = await supabase
      .from('oracle_sync_batches')
      .insert({
        source: 'allin_oracle',
        status: 'received',
        metadata: payload.metadata || {}
      })
      .select()
      .single()

    if (batchError) throw batchError

    const usersRows = (payload.users || []).map((user) => ({
      batch_id: batch.id,
      external_id: String(user.id ?? user.external_id ?? user.login ?? ''),
      login: user.login ?? null,
      full_name: user.nome ?? user.full_name ?? null,
      email: user.email ?? null,
      role: user.role ?? 'customer',
      raw_payload: user
    })).filter((row) => row.external_id)

    const productsRows = (payload.products || []).map((product) => ({
      batch_id: batch.id,
      external_id: String(product.id ?? product.external_id ?? product.nome ?? ''),
      name: product.nome ?? product.name ?? null,
      price: typeof product.valor === 'number' ? product.valor : product.price ?? null,
      stock_quantity: product.estoque ?? product.stock_quantity ?? null,
      raw_payload: product
    })).filter((row) => row.external_id)

    const ordersRows = (payload.orders || []).map((order) => ({
      batch_id: batch.id,
      external_id: String(order.numero ?? order.id ?? order.external_id ?? ''),
      user_external_id: order.usuario_id ? String(order.usuario_id) : null,
      status: order.status ?? order.situacao ?? null,
      total_amount: order.total_amount ?? null,
      raw_payload: order
    })).filter((row) => row.external_id)

    if (usersRows.length > 0) {
      const { error } = await supabase.from('oracle_users_staging').upsert(usersRows, { onConflict: 'external_id' })
      if (error) throw error
    }

    if (productsRows.length > 0) {
      const { error } = await supabase.from('oracle_products_staging').upsert(productsRows, { onConflict: 'external_id' })
      if (error) throw error
    }

    if (ordersRows.length > 0) {
      const { error } = await supabase.from('oracle_orders_staging').upsert(ordersRows, { onConflict: 'external_id' })
      if (error) throw error
    }

    const { error: finalizeError } = await supabase
      .from('oracle_sync_batches')
      .update({ status: 'staged', processed_at: new Date().toISOString() })
      .eq('id', batch.id)

    if (finalizeError) throw finalizeError

    return {
      batchId: batch.id,
      users: usersRows.length,
      products: productsRows.length,
      orders: ordersRows.length
    }
  }
}
