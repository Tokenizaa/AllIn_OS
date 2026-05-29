-- ============================================================================
-- PAYMENT SYSTEM SCHEMA
-- Enterprise Payment Module for MLM/E-commerce Platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- PAYMENT METHODS
-- ============================================================================

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- pix, boleto, card, cash, bonus, points
  is_active BOOLEAN DEFAULT true,
  is_available_for_hybrid BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default payment methods
INSERT INTO payment_methods (name, type, is_active, is_available_for_hybrid) VALUES
  ('PIX', 'pix', true, true),
  ('Boleto', 'boleto', true, true),
  ('Cartão de Crédito', 'card', true, true),
  ('Pagamento na Entrega', 'cash', true, false),
  ('Saldo de Bônus', 'bonus', true, true),
  ('Pontos', 'points', true, true);

-- ============================================================================
-- PAYMENT GATEWAYS
-- ============================================================================

CREATE TABLE payment_gateways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE, -- belluno, pagseguro
  is_active BOOLEAN DEFAULT true,
  environment VARCHAR(20) DEFAULT 'sandbox', -- sandbox, production
  credentials JSONB NOT NULL, -- encrypted
  config JSONB DEFAULT '{}',
  webhook_url TEXT,
  webhook_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PAYMENTS (CORE)
-- ============================================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID,
  customer_id UUID NOT NULL,
  gateway_id UUID REFERENCES payment_gateways(id),
  amount DECIMAL(15, 2) NOT NULL,
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, approved, failed, cancelled, refunded, chargeback
  payment_method_id UUID REFERENCES payment_methods(id),
  payment_method_type VARCHAR(50) NOT NULL,
  gateway_transaction_id TEXT,
  gateway_response JSONB,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway ON payments(gateway_id);
CREATE INDEX idx_payments_created ON payments(created_at DESC);

-- ============================================================================
-- PAYMENT TRANSACTIONS
-- ============================================================================

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- charge, refund, chargeback, partial_refund
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) NOT NULL, -- pending, approved, failed
  gateway_transaction_id TEXT,
  gateway_response JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_transactions_payment ON payment_transactions(payment_id);
CREATE INDEX idx_payment_transactions_type ON payment_transactions(transaction_type);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);

-- ============================================================================
-- PAYMENT ATTEMPTS (RETRY LOGIC)
-- ============================================================================

CREATE TABLE payment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL, -- pending, processing, failed, success
  error_message TEXT,
  gateway_response JSONB,
  retry_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_attempts_payment ON payment_attempts(payment_id);
CREATE INDEX idx_payment_attempts_retry ON payment_attempts(retry_at) WHERE retry_at IS NOT NULL;

-- ============================================================================
-- PAYMENT SPLITS (HYBRID PAYMENTS)
-- ============================================================================

CREATE TABLE payment_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  split_type VARCHAR(50) NOT NULL, -- bonus, points, discount, cash
  amount DECIMAL(15, 2) NOT NULL,
  percentage DECIMAL(5, 2),
  source_id UUID, -- bonus_wallet_id, points_wallet_id, coupon_id
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_splits_payment ON payment_splits(payment_id);
CREATE INDEX idx_payment_splits_type ON payment_splits(split_type);

-- ============================================================================
-- WALLETS
-- ============================================================================

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE,
  balance DECIMAL(15, 2) DEFAULT 0,
  available_balance DECIMAL(15, 2) DEFAULT 0,
  frozen_balance DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) DEFAULT 'active', -- active, frozen, closed
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wallets_customer ON wallets(customer_id);
CREATE INDEX idx_wallets_status ON wallets(status);

-- ============================================================================
-- WALLET TRANSACTIONS
-- ============================================================================

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- credit, debit, freeze, unfreeze, withdrawal, deposit
  amount DECIMAL(15, 2) NOT NULL,
  balance_before DECIMAL(15, 2) NOT NULL,
  balance_after DECIMAL(15, 2) NOT NULL,
  reference_id UUID, -- payment_id, withdrawal_id, etc
  reference_type VARCHAR(50),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_wallet_transactions_created ON wallet_transactions(created_at DESC);

-- ============================================================================
-- BONUS WALLETS
-- ============================================================================

CREATE TABLE bonus_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE,
  balance DECIMAL(15, 2) DEFAULT 0,
  available_balance DECIMAL(15, 2) DEFAULT 0,
  frozen_balance DECIMAL(15, 2) DEFAULT 0,
  total_earned DECIMAL(15, 2) DEFAULT 0,
  total_used DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bonus_wallets_customer ON bonus_wallets(customer_id);
CREATE INDEX idx_bonus_wallets_status ON bonus_wallets(status);

-- ============================================================================
-- BONUS TRANSACTIONS
-- ============================================================================

CREATE TABLE bonus_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bonus_wallet_id UUID NOT NULL REFERENCES bonus_wallets(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- earned, used, expired, forfeited, transferred
  amount DECIMAL(15, 2) NOT NULL,
  balance_before DECIMAL(15, 2) NOT NULL,
  balance_after DECIMAL(15, 2) NOT NULL,
  source_type VARCHAR(50), -- commission, referral, reward, manual
  source_id UUID,
  reference_id UUID,
  reference_type VARCHAR(50),
  description TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bonus_transactions_wallet ON bonus_transactions(bonus_wallet_id);
CREATE INDEX idx_bonus_transactions_type ON bonus_transactions(transaction_type);
CREATE INDEX idx_bonus_transactions_created ON bonus_transactions(created_at DESC);
CREATE INDEX idx_bonus_transactions_expires ON bonus_transactions(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================================================
-- POINTS WALLETS
-- ============================================================================

CREATE TABLE points_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0,
  available_balance INTEGER DEFAULT 0,
  frozen_balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_points_wallets_customer ON points_wallets(customer_id);
CREATE INDEX idx_points_wallets_status ON points_wallets(status);

-- ============================================================================
-- POINTS TRANSACTIONS
-- ============================================================================

CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  points_wallet_id UUID NOT NULL REFERENCES points_wallets(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- earned, used, expired, forfeited, converted
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  source_type VARCHAR(50), -- purchase, referral, goal, reward, manual
  source_id UUID,
  reference_id UUID,
  reference_type VARCHAR(50),
  description TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_points_transactions_wallet ON points_transactions(points_wallet_id);
CREATE INDEX idx_points_transactions_type ON points_transactions(transaction_type);
CREATE INDEX idx_points_transactions_created ON points_transactions(created_at DESC);
CREATE INDEX idx_points_transactions_expires ON points_transactions(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================================================
-- DISCOUNT RULES
-- ============================================================================

CREATE TABLE discount_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- coupon, automatic, cashback, progressive, plan, network, campaign
  discount_type VARCHAR(50) NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(15, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_cumulative BOOLEAN DEFAULT false,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  min_order_value DECIMAL(15, 2),
  max_discount_value DECIMAL(15, 2),
  applicable_products JSONB DEFAULT '[]', -- array of product IDs
  excluded_products JSONB DEFAULT '[]',
  applicable_plans JSONB DEFAULT '[]', -- array of plan IDs
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_discount_rules_type ON discount_rules(type);
CREATE INDEX idx_discount_rules_active ON discount_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_discount_rules_valid ON discount_rules(valid_from, valid_until);

-- ============================================================================
-- COUPONS
-- ============================================================================

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_rule_id UUID NOT NULL REFERENCES discount_rules(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  max_uses_per_customer INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active) WHERE is_active = true;

-- ============================================================================
-- CASHBACK TRANSACTIONS
-- ============================================================================

CREATE TABLE cashback_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  payment_id UUID REFERENCES payments(id),
  order_id UUID,
  cashback_percentage DECIMAL(5, 2) NOT NULL,
  cashback_amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, credited, expired
  credited_to_bonus_wallet BOOLEAN DEFAULT false,
  credited_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cashback_transactions_customer ON cashback_transactions(customer_id);
CREATE INDEX idx_cashback_transactions_payment ON cashback_transactions(payment_id);
CREATE INDEX idx_cashback_transactions_status ON cashback_transactions(status);

-- ============================================================================
-- GATEWAY WEBHOOKS
-- ============================================================================

CREATE TABLE gateway_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gateway_id UUID NOT NULL REFERENCES payment_gateways(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  signature TEXT,
  processed BOOLEAN DEFAULT false,
  processing_attempts INTEGER DEFAULT 0,
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gateway_webhooks_gateway ON gateway_webhooks(gateway_id);
CREATE INDEX idx_gateway_webhooks_processed ON gateway_webhooks(processed) WHERE processed = false;
CREATE INDEX idx_gateway_webhooks_created ON gateway_webhooks(created_at DESC);

-- ============================================================================
-- FINANCIAL AUDIT LOGS
-- ============================================================================

CREATE TABLE financial_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL, -- payment, wallet, bonus, points, discount
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- create, update, delete, approve, reject, refund
  actor_id UUID,
  actor_type VARCHAR(50), -- user, system, webhook
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_financial_audit_logs_entity ON financial_audit_logs(entity_type, entity_id);
CREATE INDEX idx_financial_audit_logs_action ON financial_audit_logs(action);
CREATE INDEX idx_financial_audit_logs_actor ON financial_audit_logs(actor_id);
CREATE INDEX idx_financial_audit_logs_created ON financial_audit_logs(created_at DESC);

-- ============================================================================
-- BONUS USAGE RULES
-- ============================================================================

CREATE TABLE bonus_usage_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scope VARCHAR(50) NOT NULL, -- global, product, category, plan
  scope_id UUID, -- product_id, category_id, plan_id
  max_usage_percentage DECIMAL(5, 2) NOT NULL, -- 50, 100, 0 (blocked)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bonus_usage_rules_scope ON bonus_usage_rules(scope, scope_id);
CREATE INDEX idx_bonus_usage_rules_active ON bonus_usage_rules(is_active) WHERE is_active = true;

-- Insert default global bonus usage rule (50% allowed)
INSERT INTO bonus_usage_rules (scope, max_usage_percentage, is_active) VALUES
  ('global', 50, true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_gateways_updated_at BEFORE UPDATE ON payment_gateways
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bonus_wallets_updated_at BEFORE UPDATE ON bonus_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_points_wallets_updated_at BEFORE UPDATE ON points_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_rules_updated_at BEFORE UPDATE ON discount_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cashback_transactions_updated_at BEFORE UPDATE ON cashback_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bonus_usage_rules_updated_at BEFORE UPDATE ON bonus_usage_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashback_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE gateway_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies will be implemented in a separate migration file
