import { logger } from '../../../shared/observability/logger.service';

export interface CashbackRule {
  id: string;
  name: string;
  percentage: number;
  fixedAmount?: number;
  maxCashback?: number;
  minPurchaseAmount?: number;
  customerTier?: string[];
  productCategories?: string[];
  paymentMethods?: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface CashbackCalculation {
  cashbackAmount: number;
  percentage: number;
  ruleId: string;
  ruleName: string;
}

export interface CashbackTransaction {
  id: string;
  paymentId: string;
  customerId: string;
  amount: number;
  cashbackAmount: number;
  percentage: number;
  ruleId: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  processedAt?: string;
}

export class CashbackService {
  private static instance: CashbackService;
  private rules: Map<string, CashbackRule> = new Map();

  private constructor() {
    this.initializeDefaultRules();
  }

  static getInstance(): CashbackService {
    if (!CashbackService.instance) {
      CashbackService.instance = new CashbackService();
    }
    return CashbackService.instance;
  }

  private initializeDefaultRules(): void {
    // Default cashback rules
    this.rules.set('default', {
      id: 'default',
      name: 'Default Cashback',
      percentage: 1,
      minPurchaseAmount: 100,
      maxCashback: 50,
      isActive: true,
    });

    this.rules.set('vip', {
      id: 'vip',
      name: 'VIP Cashback',
      percentage: 2,
      minPurchaseAmount: 100,
      maxCashback: 100,
      customerTier: ['vip', 'premium'],
      isActive: true,
    });

    this.rules.set('card_bonus', {
      id: 'card_bonus',
      name: 'Card Payment Bonus',
      percentage: 1.5,
      minPurchaseAmount: 50,
      maxCashback: 75,
      paymentMethods: ['card'],
      isActive: true,
    });
  }

  async calculateCashback(
    paymentId: string,
    customerId: string,
    amount: number,
    paymentMethod: string,
    customerTier: string = 'standard',
    productCategory?: string
  ): Promise<CashbackCalculation> {
    logger.info('Calculating cashback', 'cashback-service', {
      paymentId,
      customerId,
      amount,
      paymentMethod,
    });

    const applicableRule = this.findApplicableRule(
      amount,
      paymentMethod,
      customerTier,
      productCategory
    );

    if (!applicableRule) {
      logger.info('No applicable cashback rule found', 'cashback-service', { paymentId });
      return {
        cashbackAmount: 0,
        percentage: 0,
        ruleId: '',
        ruleName: 'No applicable rule',
      };
    }

    let cashbackAmount = 0;

    if (applicableRule.fixedAmount) {
      cashbackAmount = applicableRule.fixedAmount;
    } else {
      cashbackAmount = amount * (applicableRule.percentage / 100);
    }

    // Apply max cashback limit
    if (applicableRule.maxCashback && cashbackAmount > applicableRule.maxCashback) {
      cashbackAmount = applicableRule.maxCashback;
    }

    logger.info('Cashback calculated', 'cashback-service', {
      paymentId,
      cashbackAmount,
      ruleId: applicableRule.id,
    });

    return {
      cashbackAmount,
      percentage: applicableRule.percentage,
      ruleId: applicableRule.id,
      ruleName: applicableRule.name,
    };
  }

  private findApplicableRule(
    amount: number,
    paymentMethod: string,
    customerTier: string,
    productCategory?: string
  ): CashbackRule | null {
    const now = new Date();

    for (const rule of this.rules.values()) {
      if (!rule.isActive) continue;

      // Check date range
      if (rule.startDate && new Date(rule.startDate) > now) continue;
      if (rule.endDate && new Date(rule.endDate) < now) continue;

      // Check minimum purchase amount
      if (rule.minPurchaseAmount && amount < rule.minPurchaseAmount) continue;

      // Check customer tier
      if (rule.customerTier && rule.customerTier.length > 0) {
        if (!rule.customerTier.includes(customerTier)) continue;
      }

      // Check payment method
      if (rule.paymentMethods && rule.paymentMethods.length > 0) {
        if (!rule.paymentMethods.includes(paymentMethod)) continue;
      }

      // Check product category
      if (rule.productCategories && rule.productCategories.length > 0) {
        if (!productCategory || !rule.productCategories.includes(productCategory)) continue;
      }

      return rule;
    }

    return null;
  }

  async createCashbackTransaction(
    paymentId: string,
    customerId: string,
    amount: number,
    cashbackAmount: number,
    percentage: number,
    ruleId: string
  ): Promise<CashbackTransaction> {
    logger.info('Creating cashback transaction', 'cashback-service', {
      paymentId,
      customerId,
      cashbackAmount,
    });

    const transaction: CashbackTransaction = {
      id: this.generateTransactionId(),
      paymentId,
      customerId,
      amount,
      cashbackAmount,
      percentage,
      ruleId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // TODO: Save to database
    logger.info('Cashback transaction created', 'cashback-service', { transactionId: transaction.id });

    return transaction;
  }

  async approveCashback(transactionId: string): Promise<void> {
    logger.info('Approving cashback transaction', 'cashback-service', { transactionId });
    // TODO: Update transaction status in database
    // TODO: Credit cashback to customer wallet
  }

  async rejectCashback(transactionId: string, reason: string): Promise<void> {
    logger.warn('Rejecting cashback transaction', 'cashback-service', { transactionId, reason });
    // TODO: Update transaction status in database
  }

  async processPendingCashbacks(): Promise<void> {
    logger.info('Processing pending cashbacks', 'cashback-service');
    // TODO: Query pending cashback transactions
    // TODO: Process each one based on payment status
  }

  addRule(rule: CashbackRule): void {
    this.rules.set(rule.id, rule);
    logger.info('Added cashback rule', 'cashback-service', { ruleId: rule.id, ruleName: rule.name });
  }

  updateRule(ruleId: string, updates: Partial<CashbackRule>): void {
    const existing = this.rules.get(ruleId);
    if (existing) {
      const updated = { ...existing, ...updates };
      this.rules.set(ruleId, updated);
      logger.info('Updated cashback rule', 'cashback-service', { ruleId });
    }
  }

  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
    logger.info('Removed cashback rule', 'cashback-service', { ruleId });
  }

  getRule(ruleId: string): CashbackRule | undefined {
    return this.rules.get(ruleId);
  }

  getAllRules(): CashbackRule[] {
    return Array.from(this.rules.values());
  }

  getActiveRules(): CashbackRule[] {
    return Array.from(this.rules.values()).filter((rule) => rule.isActive);
  }

  private generateTransactionId(): string {
    return `cb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getCashbackHistory(customerId: string): Promise<CashbackTransaction[]> {
    // TODO: Query cashback transactions from database
    return [];
  }

  async getCashbackStats(customerId: string): Promise<{
    totalEarned: number;
    totalPending: number;
    totalPaid: number;
    transactionCount: number;
  }> {
    // TODO: Calculate stats from database
    return {
      totalEarned: 0,
      totalPending: 0,
      totalPaid: 0,
      transactionCount: 0,
    };
  }
}

export const cashbackService = CashbackService.getInstance();
