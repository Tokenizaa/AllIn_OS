-- ============================================================================
-- PAYMENT SYSTEM ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- ============================================================================
-- PAYMENTS RLS
-- ============================================================================

-- Customers can view their own payments
CREATE POLICY "Customers can view own payments"
  ON payments FOR SELECT
  USING (customer_id = auth.uid());

-- Service role can do everything
CREATE POLICY "Service role full access to payments"
  ON payments FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- PAYMENT TRANSACTIONS RLS
-- ============================================================================

CREATE POLICY "Service role full access to payment_transactions"
  ON payment_transactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Customers can view own payment transactions via payment"
  ON payment_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payments
      WHERE payments.id = payment_transactions.payment_id
      AND payments.customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payment_transactions"
  ON payment_transactions FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- PAYMENT ATTEMPTS RLS
-- ============================================================================

CREATE POLICY "Service role full access to payment_attempts"
  ON payment_attempts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Customers can view own payment attempts via payment"
  ON payment_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payments
      WHERE payments.id = payment_attempts.payment_id
      AND payments.customer_id = auth.uid()
    )
  );

-- ============================================================================
-- PAYMENT SPLITS RLS
-- ============================================================================

CREATE POLICY "Service role full access to payment_splits"
  ON payment_splits FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Customers can view own payment splits via payment"
  ON payment_splits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payments
      WHERE payments.id = payment_splits.payment_id
      AND payments.customer_id = auth.uid()
    )
  );

-- ============================================================================
-- WALLETS RLS
-- ============================================================================

CREATE POLICY "Customers can view own wallet"
  ON wallets FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Service role full access to wallets"
  ON wallets FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all wallets"
  ON wallets FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- WALLET TRANSACTIONS RLS
-- ============================================================================

CREATE POLICY "Service role full access to wallet_transactions"
  ON wallet_transactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Customers can view own wallet transactions"
  ON wallet_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wallets
      WHERE wallets.id = wallet_transactions.wallet_id
      AND wallets.customer_id = auth.uid()
    )
  );

-- ============================================================================
-- BONUS WALLETS RLS
-- ============================================================================

CREATE POLICY "Customers can view own bonus wallet"
  ON bonus_wallets FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Service role full access to bonus_wallets"
  ON bonus_wallets FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all bonus_wallets"
  ON bonus_wallets FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- BONUS TRANSACTIONS RLS
-- ============================================================================

CREATE POLICY "Service role full access to bonus_transactions"
  ON bonus_transactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Customers can view own bonus transactions"
  ON bonus_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bonus_wallets
      WHERE bonus_wallets.id = bonus_transactions.bonus_wallet_id
      AND bonus_wallets.customer_id = auth.uid()
    )
  );

-- ============================================================================
-- POINTS WALLETS RLS
-- ============================================================================

CREATE POLICY "Customers can view own points wallet"
  ON points_wallets FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Service role full access to points_wallets"
  ON points_wallets FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all points_wallets"
  ON points_wallets FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- POINTS TRANSACTIONS RLS
-- ============================================================================

CREATE POLICY "Service role full access to points_transactions"
  ON points_transactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Customers can view own points transactions"
  ON points_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM points_wallets
      WHERE points_wallets.id = points_transactions.points_wallet_id
      AND points_wallets.customer_id = auth.uid()
    )
  );

-- ============================================================================
-- CASHBACK TRANSACTIONS RLS
-- ============================================================================

CREATE POLICY "Customers can view own cashback transactions"
  ON cashback_transactions FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Service role full access to cashback_transactions"
  ON cashback_transactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all cashback_transactions"
  ON cashback_transactions FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- COUPONS RLS
-- ============================================================================

CREATE POLICY "Everyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to coupons"
  ON coupons FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- GATEWAY WEBHOOKS RLS
-- ============================================================================

CREATE POLICY "Service role full access to gateway_webhooks"
  ON gateway_webhooks FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- FINANCIAL AUDIT LOGS RLS
-- ============================================================================

CREATE POLICY "Service role full access to financial_audit_logs"
  ON financial_audit_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all financial_audit_logs"
  ON financial_audit_logs FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- PAYMENT METHODS (PUBLIC READ)
-- ============================================================================

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view payment methods"
  ON payment_methods FOR SELECT
  USING (true);

CREATE POLICY "Service role full access to payment_methods"
  ON payment_methods FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can manage payment_methods"
  ON payment_methods FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- PAYMENT GATEWAYS (ADMIN ONLY)
-- ============================================================================

ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to payment_gateways"
  ON payment_gateways FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can manage payment_gateways"
  ON payment_gateways FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- DISCOUNT RULES (PUBLIC READ ACTIVE)
-- ============================================================================

ALTER TABLE discount_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active discount rules"
  ON discount_rules FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to discount_rules"
  ON discount_rules FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can manage discount_rules"
  ON discount_rules FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );

-- ============================================================================
-- BONUS USAGE RULES (PUBLIC READ ACTIVE)
-- ============================================================================

ALTER TABLE bonus_usage_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active bonus usage rules"
  ON bonus_usage_rules FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to bonus_usage_rules"
  ON bonus_usage_rules FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can manage bonus_usage_rules"
  ON bonus_usage_rules FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.role = 'admin'
    )
  );
