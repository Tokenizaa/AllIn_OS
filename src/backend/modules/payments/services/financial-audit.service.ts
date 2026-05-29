import { logger } from '../../../shared/observability/logger.service';
import { supabase } from '../../../shared/infrastructure/supabase/client';

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_value?: any;
  new_value?: any;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export class FinancialAuditService {
  private static instance: FinancialAuditService;

  private constructor() {}

  static getInstance(): FinancialAuditService {
    if (!FinancialAuditService.instance) {
      FinancialAuditService.instance = new FinancialAuditService();
    }
    return FinancialAuditService.instance;
  }

  async logChange(
    entityType: string,
    entityId: string,
    action: string,
    oldValue?: any,
    newValue?: any,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('financial_audit_logs')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          action: action,
          old_value: oldValue,
          new_value: newValue,
          user_id: userId,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: metadata,
        });

      logger.info('Financial audit log created', 'financial-audit', { entityType, entityId, action });
    } catch (error) {
      logger.error('Failed to create financial audit log', 'financial-audit', { error, entityType, entityId });
    }
  }

  async getAuditLogs(
    entityType?: string,
    entityId?: string,
    userId?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<AuditLog[]> {
    try {
      let query = supabase
        .from('financial_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (entityType) {
        query = query.eq('entity_type', entityType);
      }

      if (entityId) {
        query = query.eq('entity_id', entityId);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to get audit logs', 'financial-audit', { error });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting audit logs', 'financial-audit', { error });
      return [];
    }
  }

  async getPaymentAuditTrail(paymentId: string): Promise<AuditLog[]> {
    return this.getAuditLogs('payment', paymentId);
  }

  async getWalletAuditTrail(walletId: string): Promise<AuditLog[]> {
    return this.getAuditLogs('wallet', walletId);
  }

  async getBonusWalletAuditTrail(walletId: string): Promise<AuditLog[]> {
    return this.getAuditLogs('bonus_wallet', walletId);
  }

  async getPointsWalletAuditTrail(walletId: string): Promise<AuditLog[]> {
    return this.getAuditLogs('points_wallet', walletId);
  }

  async getFinancialSummary(startDate: Date, endDate: Date): Promise<{
    totalRevenue: number;
    totalRefunds: number;
    totalBonusesIssued: number;
    totalPointsIssued: number;
    transactionCount: number;
    uniqueCustomers: number;
  }> {
    try {
      const start = startDate.toISOString();
      const end = endDate.toISOString();

      // Get total revenue
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'approved')
        .gte('created_at', start)
        .lte('created_at', end);

      const totalRevenue = (payments || []).reduce((sum, p) => sum + p.amount, 0);

      // Get total refunds
      const { data: refunds } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'refunded')
        .gte('created_at', start)
        .lte('created_at', end);

      const totalRefunds = (refunds || []).reduce((sum, p) => sum + p.amount, 0);

      // Get total bonuses issued
      const { data: bonuses } = await supabase
        .from('bonus_transactions')
        .select('amount')
        .eq('transaction_type', 'earned')
        .gte('created_at', start)
        .lte('created_at', end);

      const totalBonusesIssued = (bonuses || []).reduce((sum, b) => sum + b.amount, 0);

      // Get total points issued
      const { data: points } = await supabase
        .from('points_transactions')
        .select('amount')
        .eq('transaction_type', 'earned')
        .gte('created_at', start)
        .lte('created_at', end);

      const totalPointsIssued = (points || []).reduce((sum, p) => sum + p.amount, 0);

      // Get transaction count
      const { count: transactionCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', start)
        .lte('created_at', end);

      // Get unique customers
      const { data: customers } = await supabase
        .from('payments')
        .select('customer_id')
        .gte('created_at', start)
        .lte('created_at', end);

      const uniqueCustomers = new Set((customers || []).map(c => c.customer_id)).size;

      return {
        totalRevenue,
        totalRefunds,
        totalBonusesIssued,
        totalPointsIssued,
        transactionCount: transactionCount || 0,
        uniqueCustomers,
      };
    } catch (error) {
      logger.error('Error getting financial summary', 'financial-audit', { error });
      return {
        totalRevenue: 0,
        totalRefunds: 0,
        totalBonusesIssued: 0,
        totalPointsIssued: 0,
        transactionCount: 0,
        uniqueCustomers: 0,
      };
    }
  }

  async detectAnomalies(threshold: number = 10000): Promise<{
    largeTransactions: AuditLog[];
    rapidRefunds: AuditLog[];
    suspiciousActivity: AuditLog[];
  }> {
    try {
      const largeTransactions = await supabase
        .from('financial_audit_logs')
        .select('*')
        .eq('entity_type', 'payment')
        .gt('new_value->>amount', threshold)
        .order('created_at', { ascending: false })
        .limit(50);

      const rapidRefunds = await supabase
        .from('financial_audit_logs')
        .select('*')
        .eq('action', 'refund')
        .order('created_at', { ascending: false })
        .limit(50);

      const suspiciousActivity = await supabase
        .from('financial_audit_logs')
        .select('*')
        .eq('action', 'failed_payment')
        .order('created_at', { ascending: false })
        .limit(50);

      return {
        largeTransactions: largeTransactions.data || [],
        rapidRefunds: rapidRefunds.data || [],
        suspiciousActivity: suspiciousActivity.data || [],
      };
    } catch (error) {
      logger.error('Error detecting anomalies', 'financial-audit', { error });
      return {
        largeTransactions: [],
        rapidRefunds: [],
        suspiciousActivity: [],
      };
    }
  }

  async exportAuditReport(startDate: Date, endDate: Date): Promise<Blob> {
    const logs = await this.getAuditLogs();
    
    const report = {
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      summary: await this.getFinancialSummary(startDate, endDate),
      anomalies: await this.detectAnomalies(),
      logs: logs.filter(log => {
        const logDate = new Date(log.created_at);
        return logDate >= startDate && logDate <= endDate;
      }),
    };

    return new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  }
}

export const financialAuditService = FinancialAuditService.getInstance();
